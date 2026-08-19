window.DEARLOG_NOTICE={enabled:true,version:"v101",title:"Dearlog 업데이트",html:`<p>Dearlog가 업데이트되었습니다.</p>`};

(()=>{
  const notice=window.DEARLOG_NOTICE;
  if(!notice?.enabled)return;

  const version=notice.version||'current';
  const confirmedKey='dearlog-confirmed-notice-version';
  const legacySeenKey='dearlog-last-notice-version';
  const sessionKey=`dearlogNoticeHidden-${version}`;

  let confirmed='';
  try{confirmed=localStorage.getItem(confirmedKey)||''}catch{}

  if(confirmed===version){
    try{
      localStorage.setItem(legacySeenKey,version);
      sessionStorage.setItem(sessionKey,'1');
    }catch{}
  }else{
    // Older Dearlog code wrote this key before the user actually confirmed the notice.
    // Clear that premature record so an unconfirmed notice can still appear once.
    try{
      if(localStorage.getItem(legacySeenKey)===version)localStorage.removeItem(legacySeenKey);
      sessionStorage.removeItem(sessionKey);
    }catch{}
  }

  const check=document.getElementById('noticeSessionCheck');
  if(check){
    check.checked=true;
    const label=check.closest('label');
    if(label)label.style.display='none';
  }

  document.getElementById('noticeCloseBtn')?.addEventListener('click',()=>{
    try{
      localStorage.setItem(confirmedKey,version);
      localStorage.setItem(legacySeenKey,version);
      sessionStorage.setItem(sessionKey,'1');
    }catch{}
  },true);
})();
