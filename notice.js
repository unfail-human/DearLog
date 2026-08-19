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

// X-only layout refinement: reduce excess top gap and reaction-row whitespace.
(()=>{
  const style=document.createElement('style');
  style.id='dearlog-x-layout-refine';
  style.textContent=`
    .stage:has(.capture[data-template="x"]){
      padding-top:16px !important;
    }
    .stage:has(.capture[data-template="x"]) .capture-shell{
      top:0 !important;
      margin-top:0 !important;
    }
    .capture[data-template="x"] .x-post{
      padding-bottom:10px !important;
    }
    .capture[data-template="x"] .x-media{
      margin-bottom:7px !important;
    }
    .capture[data-template="x"] .x-actions{
      margin-top:0 !important;
      padding:4px 2px 1px 8px !important;
      min-height:28px !important;
      align-items:center !important;
    }
    .capture[data-template="x"] .x-action-btn{
      min-height:24px !important;
      height:24px !important;
      padding:0 !important;
      line-height:1 !important;
    }
    .capture[data-template="x"] .x-action-btn.share{
      height:24px !important;
      min-height:24px !important;
    }
    .clean-output[data-template="x"] .x-post,
    #previewCapture[data-template="x"] .x-post{
      padding-bottom:10px !important;
    }
    .clean-output[data-template="x"] .x-media,
    #previewCapture[data-template="x"] .x-media{
      margin-bottom:7px !important;
    }
    .clean-output[data-template="x"] .x-actions,
    #previewCapture[data-template="x"] .x-actions{
      margin-top:0 !important;
      padding:4px 2px 1px 8px !important;
      min-height:28px !important;
    }
  `;
  document.head.appendChild(style);
})();
