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
  name:'Dearlog',handle:'dearlog',chatBio:'집에 가고 싶다...',
  avatar:DEFAULT_AVATAR(),
  theirName:'상대방',myName:'나',
  theirAvatar:DEFAULT_AVATAR('#7896c6','#edf3fc'),
  myAvatar:DEFAULT_AVATAR('#667085','#eef1f5'),
  profiles:{
    x:{name:'Dearlog',handle:'dearlog',avatar:DEFAULT_AVATAR()},
    instagram:{name:'Dearlog',handle:'dearlog',avatar:DEFAULT_AVATAR()},
    dm:{name:'상대방',myName:'나',bio:'집에 가고 싶다...',theirAvatar:DEFAULT_AVATAR('#7896c6','#edf3fc'),myAvatar:DEFAULT_AVATAR('#667085','#eef1f5')},
    kakao:{name:'상대방',myName:'나',bio:'집에 가고 싶다...',theirAvatar:DEFAULT_AVATAR('#7896c6','#edf3fc'),myAvatar:DEFAULT_AVATAR('#667085','#eef1f5')}
  },
  backgrounds:{
    x:{color:'#ffffff',image:'',scale:100},
    instagram:{color:'#ffffff',image:'',scale:100},
    dm:{color:'#ffffff',image:'',scale:100},
    kakao:{color:'#ffffff',image:'',scale:100}
  },
  main:'#7896c6',bg:'#f5f7fb',card:'#ffffff',accent:'#7896c6',autoPalette:true,dark:false,
  chatBg:'#dfe8ef',chatBgImage:'',
  xPosts:[
    {body:'오늘의 작은 이야기를 이곳에 적어보세요. ✦',time:'2m',likes:'128',replies:'024',reposts:'016',shares:'3',image:'',video:false,mediaEnabled:true,mediaScale:1,quote:false,quoteName:'Original',quoteHandle:'original',quoteBody:'인용할 원문 내용을 입력하세요.'},
    {body:'무언가를 기록한다는 건, 사라지기 전에 한 번 더 바라보는 일 같아.',time:'1h',likes:'086',replies:'011',reposts:'007',shares:'2',image:'',video:false,mediaEnabled:false,mediaScale:1,quote:false,quoteName:'Original',quoteHandle:'original',quoteBody:'인용할 원문 내용을 입력하세요.'}
  ],
  igTiles:Array(9).fill(''),
  igVideos:Array(9).fill(false),
  dm:[
    {side:'theirs',type:'text',text:'오늘 기록은 다 했어?',time:'11:42',image:'',read:true},
    {side:'mine',type:'text',text:'응. 마지막 한 줄만 남았어.',time:'11:43',image:'',read:true},
    {side:'theirs',type:'text',text:'그럼 다 쓰고 보여줘 ☺',time:'11:43',image:'',read:true}
  ],
  kakao:[
    {side:'theirs',type:'text',text:'오늘은 뭐 하고 있었어?',time:'오전 11:42',image:'',read:true},
    {side:'mine',type:'text',text:'기록 정리하고 있었어.',time:'오전 11:43',image:'',read:true},
    {side:'theirs',type:'text',text:'완성하면 보여줘!',time:'오전 11:43',image:'',read:false}
  ]
};

const capture=$('#captureArea');

function loadTemplateProfile(){
  const p=state.profiles[state.template];
  if(state.template==='x'||state.template==='instagram'){
    state.name=p.name;state.handle=p.handle;state.avatar=p.avatar;
    $('#nameInput').value=p.name;$('#handleInput').value=p.handle;
  }else{
    state.theirName=p.name;state.myName=p.myName;state.chatBio=p.bio;
    state.theirAvatar=p.theirAvatar;state.myAvatar=p.myAvatar;
    $('#theirNameInput').value=p.name;$('#myNameInput').value=p.myName;$('#chatBioInput').value=p.bio;
  }
}
function saveCurrentProfile(){
  const p=state.profiles[state.template];
  if(state.template==='x'||state.template==='instagram'){
    p.name=state.name;p.handle=state.handle;p.avatar=state.avatar;
  }else{
    p.name=state.theirName;p.myName=state.myName;p.bio=state.chatBio;
    p.theirAvatar=state.theirAvatar;p.myAvatar=state.myAvatar;
  }
}
function syncTemplateBackgroundControls(){
  const b=state.backgrounds[state.template];
  $('#templateBgColor').value=b.color;
  $('#bgScaleValue').textContent=`${b.scale}%`;
}


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
  const tb=state.backgrounds[state.template];
  capture.style.setProperty('--template-bg-color',tb.color);
  capture.style.setProperty('--template-bg-image',tb.image?`url("${tb.image}")`:'none');
  capture.style.setProperty('--template-bg-size',`${tb.scale}%`);
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
  $('#handleField').hidden=chat;
  $('#chatBioField').hidden=!chat;
}
function sharedTop(title='Dearlog'){
  return `<div class="preview-top"><div class="preview-brand"><i>✦</i><span>${title}</span></div><button class="preview-icon-btn" type="button">•••</button></div>`;
}

function xPost(post,i){
  return `<article class="x-post" data-index="${i}">
    <div class="x-post-header"><div class="x-user"><img class="avatar sync-avatar" src="${state.avatar}" alt="" decoding="async"><div>
    <div class="x-user-name editable sync-name" contenteditable="true">${esc(state.name)}</div>
    <div class="x-meta">@<span class="editable sync-handle" contenteditable="true">${esc(state.handle)}</span> · <span class="editable x-time" contenteditable="true">${esc(post.time)}</span></div>
    </div></div>
    <div class="x-more-wrap"><button class="x-more-btn" type="button">•••</button>
      <div class="x-more-menu" hidden>
        <button class="x-quote-toggle" type="button">${post.quote?'일반 트윗으로 변경':'인용 트윗으로 변경'}</button>
        <div class="menu-sep"></div>
        <button class="x-media-enable" type="button">${post.mediaEnabled?'사진 첨부 끄기':'사진 첨부하기'}</button>
      </div>
    </div></div>
    <div class="x-body editable x-body-edit" contenteditable="true">${esc(post.body)}</div>
    ${post.quote?`<div class="quote-card">
      <div class="quote-user">
        <img class="avatar" src="${state.avatar}" alt="">
        <div class="quote-user-main">
          <span class="quote-name editable quote-name-edit" contenteditable="true">${esc(post.quoteName||'Original')}</span>
          <span class="quote-meta">@<span class="editable quote-handle-edit" contenteditable="true">${esc(post.quoteHandle||'original')}</span></span>
        </div>
      </div>
      <div class="quote-body editable quote-body-edit" contenteditable="true">${esc(post.quoteBody||'인용할 원문 내용을 입력하세요.')}</div>
    </div>`:''}
    ${post.mediaEnabled?`<label class="x-media image-picker ${post.image?'has-image':''}" style="--media-scale:${post.mediaScale||1}"><input type="file" accept="image/*" class="x-image-input">
    ${post.image?`<img src="${post.image}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
    ${post.video?`<div class="video-play-overlay"><span>▶</span></div>`:''}
    ${post.image?`<div class="x-media-scale-hint">휠로 사진 크기 조절</div>`:''}
    <button class="media-play-toggle x-video-toggle" type="button">${post.video?'동영상 표시 ON':'동영상 표시'}</button>
    </label>`:''}
    <div class="x-actions">
      <span>◌ <b class="editable x-replies" contenteditable="true">${esc(post.replies)}</b></span>
      <span>↻ <b class="editable x-reposts" contenteditable="true">${esc(post.reposts ?? '0')}</b></span>
      <span>♡ <b class="editable x-likes" contenteditable="true">${esc(post.likes)}</b></span>
      <span>↗</span>
    </div>
  </article>`;
}
function renderX(){
  $('#stageTitle').textContent='X 템플릿';$('#stageDesc').textContent='게시물과 답글 느낌의 화면을 만들어보세요.';
  capture.innerHTML=`<div class="x-page">${sharedTop('Dearlog')}
    <section class="x-compose"><img class="avatar sync-avatar" src="${state.avatar}" alt=""><div class="x-compose-main">
    <div class="x-compose-text editable" contenteditable="true">무슨 일이 일어나고 있나요?</div>
    <div class="x-compose-bottom"><span class="x-compose-tools">⊞ ◇ ♡</span><button class="x-post-btn">게시</button></div></div></section>
    <div id="xFeed">${state.xPosts.map(xPost).join('')}</div></div>`;
}
function renderInstagram(){
  $('#stageTitle').textContent='Instagram 템플릿';$('#stageDesc').textContent='9칸 프로필 피드와 사진을 만들어보세요.';
  capture.innerHTML=`<div class="ig-page">${sharedTop('Dearlog')}
    <section class="ig-profile"><label class="image-picker"><input type="file" accept="image/*" class="avatar-local-input">
    <img class="avatar sync-avatar" src="${state.avatar}" alt=""></label><div>
    <div class="ig-name-row"><span class="ig-handle editable sync-handle" contenteditable="true">${esc(state.handle)}</span><button class="ig-follow editable" contenteditable="true">팔로우</button></div>
    <div class="ig-counts"><span>게시물 <b class="editable" contenteditable="true">${state.igTiles.length}</b></span><span>팔로워 <b class="editable" contenteditable="true">1.2K</b></span><span>팔로잉 <b class="editable" contenteditable="true">87</b></span></div>
    <div class="ig-bio"><b class="editable sync-name" contenteditable="true">${esc(state.name)}</b><br><span class="editable" contenteditable="true">좋아하는 순간들을 작은 기록으로 남겨요.</span></div>
    </div></section><div class="ig-tabs"><span>▦</span><span>▣</span><span>♙</span></div>
    <div class="ig-grid">${state.igTiles.map((src,i)=>`<label class="ig-tile image-picker ${src?'has-image':''}" data-index="${i}">
    <input type="file" accept="image/*" class="ig-image-input">${src?`<img src="${src}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
    ${state.igVideos?.[i]?`<div class="video-play-overlay"><span>▶</span></div>`:''}
    <button class="media-play-toggle ig-video-toggle" type="button">${state.igVideos?.[i]?'ON':'▶'}</button>
    </label>`).join('')}</div></div>`;
}
function chatMedia(m, cls){
  if(m.type!=='photo') return `<div class="bubble editable chat-text" contenteditable="true">${esc(m.text)}</div>`;
  return `<label class="${cls} chat-photo image-picker ${m.image?'has-image':''}"><input type="file" accept="image/*" class="chat-photo-input">
    ${m.image?`<img src="${m.image}" alt="메시지 사진">`:`<div class="image-placeholder"><b>＋</b><span>사진 메시지</span></div>`}
    ${m.video?`<div class="video-play-overlay"><span>▶</span></div>`:''}
    <button class="media-play-toggle chat-video-toggle" type="button">${m.video?'동영상 ON':'▶'}</button>
  </label>`;
}
function dmBubble(m,i){
  if(m.type==='typing') return dmTyping(m,i);
  const avatar=m.side==='theirs'?state.theirAvatar:state.myAvatar;
  const sender=m.side==='theirs'?state.theirName:state.myName;
  const readClass=m.read?'':' off';
  return `<div class="bubble-row ${m.side}" data-index="${i}">
    <img class="avatar chat-side-avatar" src="${avatar}" alt="">
    <div class="chat-message-stack">
      <div>
        <div class="dm-sender-name">${esc(sender)}</div>
        <div class="chat-click-target">${chatMedia(m,'dm-photo')}</div>
      </div>
      <div class="dm-time editable chat-time" contenteditable="true">${esc(m.time)}</div>
      <div class="dm-read${readClass}" title="클릭해서 읽음 표시 전환">${m.read?'읽음':'안 읽음'}</div>
    </div>
  </div>`;
}
function dmTyping(m,i){
  const avatar=m.side==='theirs'?state.theirAvatar:state.myAvatar;
  const sender=m.side==='theirs'?state.theirName:state.myName;
  return `<div class="typing-row ${m.side}" data-index="${i}">
    <img class="avatar chat-side-avatar" src="${avatar}" alt="">
    <div class="typing-wrap">
      <div class="typing-name">${esc(sender)}</div>
      <div class="typing-bubble"><i class="typing-dot"></i><i class="typing-dot"></i><i class="typing-dot"></i></div>
    </div>
  </div>`;
}
function renderDM(){
  $('#stageTitle').textContent='DM 템플릿';$('#stageDesc').textContent='양쪽 프로필과 사진 메시지까지 포함한 DM을 만들어보세요.';
  capture.innerHTML=`<div class="dm-page"><header class="dm-head"><div class="dm-user">
    <img class="avatar" src="${state.theirAvatar}" alt=""><div><div class="dm-name editable their-name" contenteditable="true">${esc(state.theirName)}</div>
    <div class="chat-bio-preview editable chat-bio-edit" contenteditable="true">${esc(state.chatBio)}</div></div></div><span>☎　ⓘ</span></header>
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
function kakaoTyping(m,i){
  const mine=m.side==='mine', avatar=mine?state.myAvatar:state.theirAvatar;
  const sender=mine?state.myName:state.theirName;
  return `<div class="typing-row ${m.side}" data-index="${i}">
    <img class="avatar kakao-avatar" src="${avatar}" alt="">
    <div class="typing-wrap">
      <div class="typing-name">${esc(sender)}</div>
      <div class="typing-bubble"><i class="typing-dot"></i><i class="typing-dot"></i><i class="typing-dot"></i></div>
    </div>
  </div>`;
}

function renderKakao(){
  $('#stageTitle').textContent='카카오톡 템플릿';$('#stageDesc').textContent='상대와 내 프로필, 텍스트·사진 메시지를 함께 만들 수 있어요.';
  capture.innerHTML=`<div class="kakao-page">
    <header class="kakao-head"><button>‹</button><div><b class="editable their-name" contenteditable="true">${esc(state.theirName)}</b><small class="editable chat-bio-edit" contenteditable="true">${esc(state.chatBio)}</small></div><span>⌕　☰</span></header>
    <div class="kakao-room"><div class="kakao-date editable" contenteditable="true">2026년 8월 19일 수요일</div>
    ${state.kakao.map((m,i)=>m.type==='typing'?kakaoTyping(m,i):kakaoBubble(m,i)).join('')}</div>
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
    state.name=el.textContent.trim()||'Dearlog';$('#nameInput').value=state.name;saveCurrentProfile();
    $$('.sync-name',capture).forEach(o=>{if(o!==el)o.textContent=state.name});
  }));
  $$('.sync-handle',capture).forEach(el=>el.addEventListener('input',()=>{
    state.handle=safeHandle(el.textContent);$('#handleInput').value=state.handle;saveCurrentProfile();
    $$('.sync-handle',capture).forEach(o=>{if(o!==el)o.textContent=state.handle});
  }));
  $$('.their-name',capture).forEach(el=>el.addEventListener('input',()=>{
    state.theirName=el.textContent.trim()||'상대방';$('#theirNameInput').value=state.theirName;saveCurrentProfile();
    $$('.their-name',capture).forEach(o=>{if(o!==el)o.textContent=state.theirName});
  }));
  $$('.my-name',capture).forEach(el=>el.addEventListener('input',()=>{
    state.myName=el.textContent.trim()||'나';$('#myNameInput').value=state.myName;saveCurrentProfile();
    $$('.my-name',capture).forEach(o=>{if(o!==el)o.textContent=state.myName});
  }));
  $$('.chat-bio-edit',capture).forEach(el=>el.addEventListener('input',()=>{
    state.chatBio=el.textContent.trim();$('#chatBioInput').value=state.chatBio;saveCurrentProfile();
    $$('.chat-bio-edit',capture).forEach(o=>{if(o!==el)o.textContent=state.chatBio});
  }));
}
function bindChat(listName){
  const arr=state[listName];
  $$(`[data-index]`,capture).forEach(row=>{
    if(!row.matches('.bubble-row,.kakao-message,.typing-row'))return;
    if(m.type==='typing')return;
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
  $$('.avatar-local-input',capture).forEach(inp=>inp.addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.avatar=src;saveCurrentProfile();render()})));
  if(state.template==='x'){
    $$('.x-post',capture).forEach(card=>{
      const i=+card.dataset.index,p=state.xPosts[i];
      $('.x-body-edit',card).addEventListener('input',e=>p.body=e.target.textContent);
      $('.x-time',card).addEventListener('input',e=>p.time=e.target.textContent);
      $('.x-likes',card).addEventListener('input',e=>p.likes=e.target.textContent.slice(0,3));
      $('.x-replies',card).addEventListener('input',e=>p.replies=e.target.textContent.slice(0,3));
      $('.x-reposts',card).addEventListener('input',e=>p.reposts=e.target.textContent.slice(0,3));
      const moreBtn=$('.x-more-btn',card), moreMenu=$('.x-more-menu',card);
      moreBtn?.addEventListener('click',e=>{e.stopPropagation();moreMenu.hidden=!moreMenu.hidden});
      $('.x-quote-toggle',card)?.addEventListener('click',e=>{
        e.stopPropagation();p.quote=!p.quote;render();
      });
      $('.quote-name-edit',card)?.addEventListener('input',e=>p.quoteName=e.target.textContent);
      $('.quote-handle-edit',card)?.addEventListener('input',e=>p.quoteHandle=e.target.textContent);
      $('.quote-body-edit',card)?.addEventListener('input',e=>p.quoteBody=e.target.textContent);
      $('.x-media-enable',card)?.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        p.mediaEnabled=!p.mediaEnabled;
        render();
      });
      $('.x-image-input',card)?.addEventListener('change',e=>fileToData(e.target.files[0],src=>{p.image=src;render()}));
      $('.x-video-toggle',card)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();p.video=!p.video;render()});
      $('.x-media',card)?.addEventListener('wheel',e=>{
        if(!p.image)return;
        e.preventDefault();
        e.stopPropagation();
        p.mediaScale=Math.max(1,Math.min(3,(p.mediaScale||1)+(e.deltaY<0?.08:-.08)));
        card.querySelector('.x-media')?.style.setProperty('--media-scale',p.mediaScale);
      },{passive:false});
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

document.addEventListener('click',e=>{
  if(e.target.closest('.x-more-wrap'))return;
  $$('.x-more-menu',capture).forEach(m=>m.hidden=true);
});
$$('.template-card').forEach(btn=>btn.addEventListener('click',()=>{
  saveCurrentProfile();
  state.template=btn.dataset.template;
  loadTemplateProfile();
  syncTemplateBackgroundControls();
  $$('.template-card').forEach(b=>b.classList.toggle('active',b===btn));
  render();
}));
$('#nameInput').addEventListener('input',e=>{state.name=e.target.value||'Dearlog';saveCurrentProfile();render()});
$('#handleInput').addEventListener('input',e=>{state.handle=safeHandle(e.target.value);saveCurrentProfile();render()});
$('#chatBioInput').addEventListener('input',e=>{state.chatBio=e.target.value;saveCurrentProfile();render()});
$('#avatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.avatar=src;saveCurrentProfile();render()}));
$('#theirNameInput').addEventListener('input',e=>{state.theirName=e.target.value||'상대방';saveCurrentProfile();render()});
$('#myNameInput').addEventListener('input',e=>{state.myName=e.target.value||'나';saveCurrentProfile();render()});
$('#theirAvatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.theirAvatar=src;saveCurrentProfile();render()}));
$('#myAvatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.myAvatar=src;saveCurrentProfile();render()}));

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
$('#addTypingBtn').addEventListener('click',()=>{
  const arr=state.template==='kakao'?state.kakao:state.dm;
  arr.push({side:nextSide(arr),type:'typing',text:'',time:'',image:'',read:true,video:false});
  render();
});

$('#addItemBtn').addEventListener('click',()=>{
  if(state.template==='x')state.xPosts.push({body:'새 게시물 내용을 입력하세요.',time:'now',likes:'000',replies:'000',reposts:'000',shares:'0',image:'',video:false,mediaEnabled:false,mediaScale:1,quote:false,quoteName:'Original',quoteHandle:'original',quoteBody:'인용할 원문 내용을 입력하세요.'});
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


$('#templateBgColor').addEventListener('input',e=>{
  state.backgrounds[state.template].color=e.target.value;
  syncVars();
});
$('#templateBgImageInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{
  state.backgrounds[state.template].image=src;
  syncVars();
}));
$('#clearTemplateBgBtn').addEventListener('click',()=>{
  state.backgrounds[state.template].image='';
  $('#templateBgImageInput').value='';
  syncVars();
});
capture.addEventListener('wheel',e=>{
  const b=state.backgrounds[state.template];
  if(!b.image)return;
  e.preventDefault();
  b.scale=Math.max(40,Math.min(300,b.scale+(e.deltaY<0?5:-5)));
  $('#bgScaleValue').textContent=`${b.scale}%`;
  syncVars();
},{passive:false});

$('#chatBgColor').addEventListener('input',e=>{state.chatBg=e.target.value;syncVars()});
$('#chatBgImageInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.chatBgImage=src;syncVars()}));
$('#clearChatBgBtn').addEventListener('click',()=>{state.chatBgImage='';$('#chatBgImageInput').value='';syncVars()});

$('#resetBtn').addEventListener('click',()=>{if(confirm('편집 내용을 모두 초기화할까요?'))location.reload()});
async function saveCleanCapture(sourceNode=null){
  let tempWrap=null;
  try{
    tempWrap=document.createElement('div');
    tempWrap.style.position='fixed';
    tempWrap.style.left='-99999px';
    tempWrap.style.top='0';
    tempWrap.style.zIndex='-1';
    let clean;
    if(sourceNode){
      clean=sourceNode.cloneNode(true);
      clean.classList.add('clean-output');
      clean.querySelectorAll('[contenteditable="true"]').forEach(el=>el.removeAttribute('contenteditable'));
      clean.querySelectorAll('input').forEach(el=>el.remove());
    }else{
      clean=createCleanPreviewClone();
    }
    tempWrap.appendChild(clean);
    document.body.appendChild(tempWrap);

    const canvas=await html2canvas(clean,{
      scale:4,
      backgroundColor:null,
      useCORS:true,
      logging:false,
      imageTimeout:0
    });
    const a=document.createElement('a'),d=new Date(),
      stamp=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    a.download=`dearlog-${state.template}-${stamp}.png`;
    a.href=canvas.toDataURL('image/png',1.0);
    a.click();
  }finally{
    tempWrap?.remove();
  }
}

$('#exportBtn').addEventListener('click',async()=>{
  const btn=$('#exportBtn'),old=btn.textContent;
  btn.disabled=true;btn.textContent='고화질 저장 중…';
  $$('[contenteditable=true]',capture).forEach(e=>e.blur());
  try{
    await saveCleanCapture();
  }catch(err){
    console.error(err);
    alert('PNG 저장에 실패했어요.');
  }finally{
    btn.disabled=false;btn.textContent=old;
  }
});



function createCleanPreviewClone(){
  const clone=capture.cloneNode(true);
  clone.id='previewCapture';
  clone.classList.add('clean-output');
  clone.querySelectorAll('[contenteditable="true"]').forEach(el=>{
    el.removeAttribute('contenteditable');
  });
  clone.querySelectorAll('input').forEach(el=>el.remove());
  return clone;
}
function openPreview(){
  const mount=$('#previewMount');
  mount.innerHTML='';
  mount.appendChild(createCleanPreviewClone());
  $('#previewBackdrop').hidden=false;
}
function closePreview(){
  $('#previewBackdrop').hidden=true;
  $('#previewMount').innerHTML='';
}
$('#previewBtn').addEventListener('click',openPreview);
$('#previewCloseBtn').addEventListener('click',closePreview);
$('#previewSaveBtn').addEventListener('click',async()=>{
  const btn=$('#previewSaveBtn'),old=btn.textContent;
  btn.disabled=true;btn.textContent='저장 중…';
  try{
    const node=$('#previewMount .capture');
    if(node)await saveCleanCapture(node);
  }catch(err){
    console.error(err);
    alert('PNG 저장에 실패했어요.');
  }finally{
    btn.disabled=false;btn.textContent=old;
  }
});
$('#previewBackdrop').addEventListener('click',e=>{
  if(e.target===$('#previewBackdrop'))closePreview();
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
$('#noticeBtn')?.addEventListener('click',openNotice);
$('#noticeCloseBtn').addEventListener('click',closeNotice);
$('#noticeBackdrop').addEventListener('click',e=>{if(e.target===$('#noticeBackdrop'))closeNotice()});
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(!$('#noticeBackdrop').hidden)closeNotice();
  if(!$('#previewBackdrop').hidden)closePreview();
});

applyRecommendedPalette();
loadTemplateProfile();
syncTemplateBackgroundControls();
render();
if(window.DEARLOG_NOTICE?.enabled && !sessionStorage.getItem('dearlogNoticeHidden')) openNotice();
