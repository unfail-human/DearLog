const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const DEFAULT_AVATAR=(fill='#7896c6',bg='#edf3fc')=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
<rect width="300" height="300" rx="150" fill="${bg}"/>
<circle cx="150" cy="119" r="58" fill="${fill}"/>
<path d="M52 290c10-72 47-108 98-108s88 36 98 108" fill="${fill}"/>
<circle cx="128" cy="115" r="5" fill="white"/><circle cx="172" cy="115" r="5" fill="white"/>
<path d="M134 145c10 7 22 7 32 0" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>`)}`
const state={
  template:'x',
  name:'Dearlog',handle:'dearlog',
  avatar:DEFAULT_AVATAR(),
  theirName:'상대방',myName:'나',
  theirAvatar:DEFAULT_AVATAR('#7896c6','#edf3fc'),
  myAvatar:DEFAULT_AVATAR('#667085','#eef1f5'),
  main:'#7896c6',bg:'#f5f7fb',card:'#ffffff',accent:'#7896c6',autoPalette:true,dark:false,
  chatBg:'#dfe8ef',chatBgImage:'',
  xPosts:[
    {body:'오늘의 작은 이야기를 이곳에 적어보세요. ✦',time:'2m',likes:'128',replies:'24',reposts:'16',shares:'3',image:'',video:false},
    {body:'무언가를 기록한다는 건, 사라지기 전에 한 번 더 바라보는 일 같아.',time:'1h',likes:'86',replies:'11',reposts:'7',shares:'2',image:'',video:false}
  ],
  igTiles:Array(9).fill(''),
  igVideos:Array(9).fill(false),
  dm:[
    {side:'theirs',type:'text',text:'오늘 기록은 다 했어?',time:'11:42',image:'',read:true},
    {side:'mine',type:'text',text:'응. 마지막 한 줄만 남았어.',time:'11:43',image:'',read:true},
    {side:'theirs',type:'text',text:'그럼 다 쓰고 보여줘 ☺',time:'11:43',image:'',read:true}
  ],
  kakao:[
    {side:'theirs',type:'text',text:'오늘은 뭐 하고 있었어?',time:'오전 11:42',image:'',read:false},
    {side:'mine',type:'text',text:'기록 정리하고 있었어.',time:'오전 11:43',image:'',read:false},
    {side:'theirs',type:'text',text:'완성하면 보여줘!',time:'오전 11:43',image:'',read:false}
  ]
};

const capture=$('#captureArea');

function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function safeHandle(s=''){return String(s).replace(/^@+/,'').trim()||'dearlog'}
function fileToData(file,cb){if(!file)return;const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(file)}

function hexToRgb(hex){
  const h=hex.replace('#','');
  if(h.length!==6)return {r:120,g:150,b:198};
  return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}
}
function rgbToHex(r,g,b){
  const f=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
  return '#'+f(r)+f(g)+f(b)
}
function mix(hex1,hex2,amount){
  const a=hexToRgb(hex1),b=hexToRgb(hex2),t=Math.max(0,Math.min(1,amount));
  return rgbToHex(a.r+(b.r-a.r)*t,a.g+(b.g-a.g)*t,a.b+(b.b-a.b)*t)
}
function luminance(hex){
  const {r,g,b}=hexToRgb(hex);
  const v=[r,g,b].map(x=>{x/=255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4});
  return .2126*v[0]+.7152*v[1]+.0722*v[2]
}
function recommendPalette(main){
  const lum=luminance(main);
  const bg=mix(main,'#ffffff',lum<.3?.93:.955);
  const card=mix(main,'#ffffff',.985);
  const accent=lum>.72?mix(main,'#364152',.28):mix(main,'#ffffff',.04);
  return {bg,card,accent};
}
function applyRecommendedPalette(){
  const p=recommendPalette(state.main);
  state.bg=p.bg;state.card=p.card;state.accent=p.accent;
  $('#bgColor').value=p.bg;$('#cardColor').value=p.card;$('#accentColor').value=p.accent;
  updatePalettePreview();
}
function updatePalettePreview(){
  const map={bg:state.bg,card:state.card,accent:state.accent};
  Object.entries(map).forEach(([k,v])=>{const sw=$(`[data-swatch="${k}"]`);if(sw)sw.style.background=v});
}
function syncVars(){
  capture.style.setProperty('--preview-bg',state.bg);
  capture.style.setProperty('--preview-card',state.card);
  capture.style.setProperty('--preview-accent',state.accent);
  capture.classList.toggle('dark',state.dark);
  capture.style.setProperty('--chat-bg',state.chatBg);
  capture.style.setProperty('--chat-bg-image',state.chatBgImage ? `url("${state.chatBgImage}")` : 'none');
  updatePalettePreview();
}
function setChatControls(){
  const chat=['dm','kakao'].includes(state.template);
  $('#chatProfileSection').hidden=!chat;
  $('#chatBackgroundSection').hidden=!chat;
  $('#chatAddRow').hidden=!chat;
  $('#addItemBtn').hidden=chat;
}
function sharedTop(title='Dearlog'){
  return `<div class="preview-top"><div class="preview-brand"><i>✦</i><span>${title}</span></div><button class="preview-icon-btn" type="button">•••</button></div>`;
}

function xPost(post,i){
  return `<article class="x-post" data-index="${i}">
    <div class="x-post-header"><div class="x-user"><img class="avatar sync-avatar" src="${state.avatar}" alt=""><div>
    <div class="x-user-name editable sync-name" contenteditable="true">${esc(state.name)}</div>
    <div class="x-meta">@<span class="editable sync-handle" contenteditable="true">${esc(state.handle)}</span> · <span class="editable x-time" contenteditable="true">${esc(post.time)}</span></div>
    </div></div><span class="x-meta">•••</span></div>
    <div class="x-body editable x-body-edit" contenteditable="true">${esc(post.body)}</div>
    <label class="x-media image-picker"><input type="file" accept="image/*" class="x-image-input">
    ${post.image?`<img src="${post.image}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
    ${post.video?`<div class="video-play-overlay"><span>▶</span></div>`:''}
    <button class="media-play-toggle x-video-toggle" type="button">${post.video?'동영상 표시 ON':'동영상 표시'}</button>
    </label>
    <div class="x-actions">
      <span>◌ <b class="editable x-replies" contenteditable="true">${esc(post.replies)}</b></span>
      <span>↻ <b class="editable x-reposts" contenteditable="true">${esc(post.reposts ?? '0')}</b></span>
      <span>♡ <b class="editable x-likes" contenteditable="true">${esc(post.likes)}</b></span>
      <span>↗ <b class="editable x-shares" contenteditable="true">${esc(post.shares ?? '0')}</b></span>
    </div>
  </article>`;
}
function renderX(){
  $('#stageTitle').textContent='X형 템플릿';$('#stageDesc').textContent='게시물과 답글 느낌의 화면을 만들어보세요.';
  capture.innerHTML=`<div class="x-page">${sharedTop('Dearlog')}
    <section class="x-compose"><img class="avatar sync-avatar" src="${state.avatar}" alt=""><div class="x-compose-main">
    <div class="x-compose-text editable" contenteditable="true">무슨 일이 일어나고 있나요?</div>
    <div class="x-compose-bottom"><span class="x-compose-tools">⊞ ◇ ♡</span><button class="x-post-btn">게시</button></div></div></section>
    <div id="xFeed">${state.xPosts.map(xPost).join('')}</div></div>`;
}
function renderInstagram(){
  $('#stageTitle').textContent='Instagram형 템플릿';$('#stageDesc').textContent='9칸 프로필 피드와 사진을 만들어보세요.';
  capture.innerHTML=`<div class="ig-page">${sharedTop('Dearlog')}
    <section class="ig-profile"><label class="image-picker"><input type="file" accept="image/*" class="avatar-local-input">
    <img class="avatar sync-avatar" src="${state.avatar}" alt=""></label><div>
    <div class="ig-name-row"><span class="ig-handle editable sync-handle" contenteditable="true">${esc(state.handle)}</span><button class="ig-follow editable" contenteditable="true">팔로우</button></div>
    <div class="ig-counts"><span>게시물 <b class="editable" contenteditable="true">${state.igTiles.length}</b></span><span>팔로워 <b class="editable" contenteditable="true">1.2K</b></span><span>팔로잉 <b class="editable" contenteditable="true">87</b></span></div>
    <div class="ig-bio"><b class="editable sync-name" contenteditable="true">${esc(state.name)}</b><br><span class="editable" contenteditable="true">좋아하는 순간들을 작은 기록으로 남겨요.</span></div>
    </div></section><div class="ig-tabs"><span>▦</span><span>▣</span><span>♙</span></div>
    <div class="ig-grid">${state.igTiles.map((src,i)=>`<label class="ig-tile image-picker" data-index="${i}">
    <input type="file" accept="image/*" class="ig-image-input">${src?`<img src="${src}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
    ${state.igVideos?.[i]?`<div class="video-play-overlay"><span>▶</span></div>`:''}
    <button class="media-play-toggle ig-video-toggle" type="button">${state.igVideos?.[i]?'ON':'▶'}</button>
    </label>`).join('')}</div></div>`;
}
function chatMedia(m, cls){
  if(m.type!=='photo') return `<div class="bubble editable chat-text" contenteditable="true">${esc(m.text)}</div>`;
  return `<label class="${cls} chat-photo image-picker"><input type="file" accept="image/*" class="chat-photo-input">
    ${m.image?`<img src="${m.image}" alt="메시지 사진">`:`<div class="image-placeholder"><b>＋</b><span>사진 메시지</span></div>`}
    ${m.video?`<div class="video-play-overlay"><span>▶</span></div>`:''}
    <button class="media-play-toggle chat-video-toggle" type="button">${m.video?'동영상 ON':'▶'}</button>
  </label>`;
}
function dmBubble(m,i){
  const avatar=m.side==='theirs'?state.theirAvatar:state.myAvatar;
  const readClass=m.read?'':' off';
  return `<div class="bubble-row ${m.side}" data-index="${i}">
    <img class="avatar chat-side-avatar" src="${avatar}" alt="">
    <div class="chat-message-stack">
      <div class="chat-click-target">${chatMedia(m,'dm-photo')}</div>
      <div class="dm-time editable chat-time" contenteditable="true">${esc(m.time)}</div>
      <div class="dm-read${readClass}" title="클릭해서 읽음 표시 전환">${m.read?'읽음':'읽음'}</div>
    </div>
  </div>`;
}
function renderDM(){
  $('#stageTitle').textContent='DM형 템플릿';$('#stageDesc').textContent='양쪽 프로필과 사진 메시지까지 포함한 DM을 만들어보세요.';
  capture.innerHTML=`<div class="dm-page"><header class="dm-head"><div class="dm-user">
    <img class="avatar" src="${state.theirAvatar}" alt=""><div><div class="dm-name editable their-name" contenteditable="true">${esc(state.theirName)}</div>
    <div class="dm-status">@<span class="editable sync-handle" contenteditable="true">${esc(state.handle)}</span> · 온라인</div></div></div><span>☎　ⓘ</span></header>
    <main class="dm-body chat-wallpaper"><div class="dm-day editable" contenteditable="true">오늘</div>${state.dm.map(dmBubble).join('')}</main>
    <footer class="dm-compose"><span>＋</span><div class="dm-input editable" contenteditable="true">메시지 입력...</div><button class="dm-send">보내기</button></footer></div>`;
}
function kakaoBubble(m,i){
  const mine=m.side==='mine', avatar=mine?state.myAvatar:state.theirAvatar;
  const readClass=m.read?' off':'';
  return `<div class="kakao-message ${m.side}" data-index="${i}">
    <img class="avatar kakao-avatar" src="${avatar}" alt="">
    <div class="kakao-message-main">
      <div class="kakao-sender editable ${mine?'my-name':'their-name'}" contenteditable="true">${esc(mine?state.myName:state.theirName)}</div>
      <div class="kakao-content-row">
        <div class="chat-click-target">${chatMedia(m,'kakao-photo')}</div>
        <span class="kakao-read-one${readClass}" title="클릭해서 숫자 1 표시 전환">1</span>
        <span class="kakao-time editable chat-time" contenteditable="true">${esc(m.time)}</span>
      </div>
    </div>
  </div>`;
}
function renderKakao(){
  $('#stageTitle').textContent='카카오톡형 템플릿';$('#stageDesc').textContent='상대와 내 프로필, 텍스트·사진 메시지를 함께 만들 수 있어요.';
  capture.innerHTML=`<div class="kakao-page">
    <header class="kakao-head"><button>‹</button><div><b class="editable their-name" contenteditable="true">${esc(state.theirName)}</b><small class="editable" contenteditable="true">1:1 채팅</small></div><span>⌕　☰</span></header>
    <div class="kakao-room"><div class="kakao-date editable" contenteditable="true">2026년 8월 19일 수요일</div>
    ${state.kakao.map(kakaoBubble).join('')}</div>
    <footer class="kakao-compose"><span>＋</span><div class="kakao-input editable" contenteditable="true">메시지 입력</div><span>☺　♯</span></footer>
  </div>`;
}
function render(){
  if(state.template==='x')renderX();
  else if(state.template==='instagram')renderInstagram();
  else if(state.template==='dm')renderDM();
  else renderKakao();
  syncVars();setChatControls();bindPreview();
}
function bindNames(){
  $$('.sync-name',capture).forEach(el=>el.addEventListener('input',()=>{
    state.name=el.textContent.trim()||'Dearlog';$('#nameInput').value=state.name;
    $$('.sync-name',capture).forEach(o=>{if(o!==el)o.textContent=state.name});
  }));
  $$('.sync-handle',capture).forEach(el=>el.addEventListener('input',()=>{
    state.handle=safeHandle(el.textContent);$('#handleInput').value=state.handle;
    $$('.sync-handle',capture).forEach(o=>{if(o!==el)o.textContent=state.handle});
  }));
  $$('.their-name',capture).forEach(el=>el.addEventListener('input',()=>{
    state.theirName=el.textContent.trim()||'상대방';$('#theirNameInput').value=state.theirName;
    $$('.their-name',capture).forEach(o=>{if(o!==el)o.textContent=state.theirName});
  }));
  $$('.my-name',capture).forEach(el=>el.addEventListener('input',()=>{
    state.myName=el.textContent.trim()||'나';$('#myNameInput').value=state.myName;
    $$('.my-name',capture).forEach(o=>{if(o!==el)o.textContent=state.myName});
  }));
}
function bindChat(listName){
  const arr=state[listName];
  $$(`[data-index]`,capture).forEach(row=>{
    if(!row.matches('.bubble-row,.kakao-message'))return;
    const i=+row.dataset.index,m=arr[i];
    $('.chat-text',row)?.addEventListener('input',e=>m.text=e.target.textContent);
    $('.chat-time',row)?.addEventListener('input',e=>m.time=e.target.textContent);
    $('.chat-photo-input',row)?.addEventListener('change',e=>fileToData(e.target.files[0],src=>{m.image=src;render()}));
    $('.chat-video-toggle',row)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();m.video=!m.video;render()});
    const toggle=()=>{
      m.read=!m.read;
      render();
    };
    $('.chat-click-target',row)?.addEventListener('click',e=>{
      if(e.target.closest('input')||e.target.closest('.media-play-toggle'))return;
      if(m.type==='photo' && !m.image)return;
      toggle();
    });
    $('.dm-read',row)?.addEventListener('click',toggle);
    $('.kakao-read-one',row)?.addEventListener('click',toggle);
  });
}
function bindPreview(){
  bindNames();
  $$('.avatar-local-input',capture).forEach(inp=>inp.addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.avatar=src;render()})));
  if(state.template==='x'){
    $$('.x-post',capture).forEach(card=>{
      const i=+card.dataset.index,p=state.xPosts[i];
      $('.x-body-edit',card).addEventListener('input',e=>p.body=e.target.textContent);
      $('.x-time',card).addEventListener('input',e=>p.time=e.target.textContent);
      $('.x-likes',card).addEventListener('input',e=>p.likes=e.target.textContent);
      $('.x-replies',card).addEventListener('input',e=>p.replies=e.target.textContent);
      $('.x-reposts',card).addEventListener('input',e=>p.reposts=e.target.textContent);
      $('.x-shares',card).addEventListener('input',e=>p.shares=e.target.textContent);
      $('.x-image-input',card).addEventListener('change',e=>fileToData(e.target.files[0],src=>{p.image=src;render()}));
      $('.x-video-toggle',card)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();p.video=!p.video;render()});
    });
  }else if(state.template==='instagram'){
    $$('.ig-tile',capture).forEach(tile=>{
      const i=+tile.dataset.index;
      $('.ig-image-input',tile).addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.igTiles[i]=src;render()}));
      $('.ig-video-toggle',tile)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.igVideos[i]=!state.igVideos[i];render()});
    });
  }else if(state.template==='dm') bindChat('dm');
  else bindChat('kakao');
}

$$('.template-card').forEach(btn=>btn.addEventListener('click',()=>{
  state.template=btn.dataset.template;$$('.template-card').forEach(b=>b.classList.toggle('active',b===btn));render();
}));
$('#nameInput').addEventListener('input',e=>{state.name=e.target.value||'Dearlog';render()});
$('#handleInput').addEventListener('input',e=>{state.handle=safeHandle(e.target.value);render()});
$('#avatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.avatar=src;render()}));
$('#theirNameInput').addEventListener('input',e=>{state.theirName=e.target.value||'상대방';render()});
$('#myNameInput').addEventListener('input',e=>{state.myName=e.target.value||'나';render()});
$('#theirAvatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.theirAvatar=src;render()}));
$('#myAvatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.myAvatar=src;render()}));

$('#mainColor').addEventListener('input',e=>{
  state.main=e.target.value;
  if(state.autoPalette)applyRecommendedPalette();
  else{state.accent=state.main;$('#accentColor').value=state.accent}
  syncVars();
});
$('#autoPaletteToggle').addEventListener('change',e=>{
  state.autoPalette=e.target.checked;
  if(state.autoPalette)applyRecommendedPalette();
  syncVars();
});
$('#bgColor').addEventListener('input',e=>{state.bg=e.target.value;syncVars()});
$('#cardColor').addEventListener('input',e=>{state.card=e.target.value;syncVars()});
$('#accentColor').addEventListener('input',e=>{state.accent=e.target.value;syncVars()});
$('#darkToggle').addEventListener('change',e=>{state.dark=e.target.checked;syncVars()});

function nextSide(arr){return arr.length&&arr[arr.length-1].side==='mine'?'theirs':'mine'}
function addChatMessage(type){
  const arr=state.template==='kakao'?state.kakao:state.dm;
  arr.push({side:nextSide(arr),type,text:type==='text'?'새 메시지를 입력하세요.':'',time:'now',image:'',read:false,video:false});
  render();
}
$('#addTextMessageBtn').addEventListener('click',()=>addChatMessage('text'));
$('#addPhotoMessageBtn').addEventListener('click',()=>addChatMessage('photo'));

$('#addItemBtn').addEventListener('click',()=>{
  if(state.template==='x')state.xPosts.push({body:'새 게시물 내용을 입력하세요.',time:'now',likes:'0',replies:'0',reposts:'0',shares:'0',image:'',video:false});
  else if(state.template==='instagram'){state.igTiles.push('');state.igVideos.push(false);}
  render();
});
$('#removeItemBtn').addEventListener('click',()=>{
  const target=state.template==='x'?state.xPosts:state.template==='instagram'?state.igTiles:state.template==='dm'?state.dm:state.kakao;
  if(target.length<=1)return alert('항목은 최소 1개가 필요해요.');
  target.pop();
  if(state.template==='instagram')state.igVideos.pop();
  render();
});

$('#chatBgColor').addEventListener('input',e=>{state.chatBg=e.target.value;syncVars()});
$('#chatBgImageInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.chatBgImage=src;syncVars()}));
$('#clearChatBgBtn').addEventListener('click',()=>{state.chatBgImage='';$('#chatBgImageInput').value='';syncVars()});

$('#resetBtn').addEventListener('click',()=>{if(confirm('편집 내용을 모두 초기화할까요?'))location.reload()});
$('#exportBtn').addEventListener('click',async()=>{
  const btn=$('#exportBtn'),old=btn.textContent;btn.disabled=true;btn.textContent='저장 중…';
  $$('[contenteditable=true]',capture).forEach(e=>e.blur());
  try{
    const canvas=await html2canvas(capture,{scale:Math.min(3,window.devicePixelRatio||2),backgroundColor:null,useCORS:true,logging:false});
    const a=document.createElement('a'),d=new Date(),stamp=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    a.download=`dearlog-${state.template}-${stamp}.png`;a.href=canvas.toDataURL('image/png');a.click();
  }catch(err){console.error(err);alert('PNG 저장에 실패했어요. 직접 업로드한 이미지를 사용했는지 확인해 주세요.')}
  finally{btn.disabled=false;btn.textContent=old}
});


function openNotice(){
  const cfg=window.DEARLOG_NOTICE;
  if(!cfg?.enabled)return;
  $('#noticeTitle').textContent=cfg.title||'Dearlog 안내';
  $('#noticeContent').innerHTML=cfg.html||'';
  $('#noticeBackdrop').hidden=false;
}
function closeNotice(){
  if($('#noticeSessionCheck').checked)sessionStorage.setItem('dearlogNoticeHidden','1');
  $('#noticeBackdrop').hidden=true;
}
$('#noticeBtn').addEventListener('click',openNotice);
$('#noticeCloseBtn').addEventListener('click',closeNotice);
$('#noticeBackdrop').addEventListener('click',e=>{if(e.target===$('#noticeBackdrop'))closeNotice()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#noticeBackdrop').hidden)closeNotice()});

applyRecommendedPalette();
render();
if(window.DEARLOG_NOTICE?.enabled && !sessionStorage.getItem('dearlogNoticeHidden')) openNotice();
