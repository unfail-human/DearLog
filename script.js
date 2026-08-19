
window.addEventListener('error',e=>{
  const area=document.getElementById('captureArea');
  if(area && !area.children.length){
    area.innerHTML='<div style="padding:28px;font:13px/1.6 sans-serif;color:#6b665f">Dearlog을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.</div>';
  }
});

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const DEFAULT_AVATAR=(fill='#8f8a81',bg='#ece9e3')=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${bg}"/><circle cx="32" cy="22" r="10.5" fill="${fill}"/><path d="M7 64C8.6 45.5 18.2 34 32 34s23.4 11.5 25 30H7Z" fill="${fill}"/></svg>`);

const state={
  template:'x',brandSymbol:'✦',selected:null,
  name:'Dearlog',handle:'dearlog',chatBio:'너와의 추억을 기록하는 중',
  avatar:DEFAULT_AVATAR(),
  commonProfile:{
    name:'Dearlog',
    handle:'dearlog',
    avatar:DEFAULT_AVATAR()
  },
  theirName:'상대방',myName:'나',
  theirAvatar:DEFAULT_AVATAR('#8f8a81','#ece9e3'),
  myAvatar:DEFAULT_AVATAR('#746f67','#e5e1da'),
  profiles:{
    x:{name:'Dearlog',handle:'dearlog',avatar:DEFAULT_AVATAR()},
    instagram:{name:'Dearlog',handle:'dearlog',avatar:DEFAULT_AVATAR()},
    dm:{name:'상대방',myName:'나',bio:'너와의 추억을 기록하는 중',theirAvatar:DEFAULT_AVATAR('#8f8a81','#ece9e3'),myAvatar:DEFAULT_AVATAR('#746f67','#e5e1da')},
    kakao:{name:'상대방',myName:'나',bio:'너와의 추억을 기록하는 중',theirAvatar:DEFAULT_AVATAR('#8f8a81','#ece9e3'),myAvatar:DEFAULT_AVATAR('#746f67','#e5e1da')}
  },
  backgrounds:{
    x:{color:'#f5f4f1',image:'',scale:100},
    instagram:{color:'#f5f4f1',image:'',scale:100},
    dm:{color:'#f5f4f1',image:'',scale:100},
    kakao:{color:'#f5f4f1',image:'',scale:100}
  },
  main:'#5d5a55',bg:'#f5f4f1',card:'#ffffff',accent:'#5d5a55',autoPalette:true,dark:false,
  chatBg:'#dfe8ef',chatBgImage:'',
  xPosts:[
    {body:'오늘의 작은 이야기를 이곳에 적어보세요. ✦',time:'2m',likes:'128',replies:'024',reposts:'016',shares:'3',image:'',video:false,mediaEnabled:true,mediaScale:1,quote:false,quoteName:'Original',quoteHandle:'original',quoteBody:'인용할 원문 내용을 입력하세요.',authorName:'Dearlog',authorHandle:'dearlog',authorAvatar:DEFAULT_AVATAR(),imageBg:'#f5f4f1',mediaX:0,mediaY:0,liked:false,reposted:false,replied:false},
    {body:'무언가를 기록한다는 건, 사라지기 전에 한 번 더 바라보는 일 같아.',time:'1h',likes:'086',replies:'011',reposts:'007',shares:'2',image:'',video:false,mediaEnabled:false,mediaScale:1,quote:false,quoteName:'Original',quoteHandle:'original',quoteBody:'인용할 원문 내용을 입력하세요.',authorName:'Dearlog',authorHandle:'dearlog',authorAvatar:DEFAULT_AVATAR(),imageBg:'#f5f4f1',mediaX:0,mediaY:0,liked:false,reposted:false,replied:false}
  ],
  igTiles:Array(9).fill(''),
  igVideos:Array(9).fill(false),
  igScales:Array(9).fill(1),
  igXs:Array(9).fill(0),
  igYs:Array(9).fill(0),
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


function syncCommonProfileToState(){
  const p=state.commonProfile||{
    name:state.name||'Dearlog',
    handle:state.handle||'dearlog',
    avatar:state.avatar||DEFAULT_AVATAR()
  };
  state.commonProfile=p;

  // X / Instagram use the same basic profile.
  state.name=p.name;
  state.handle=p.handle;
  state.avatar=p.avatar;

  if(state.profiles?.x){
    state.profiles.x.name=p.name;
    state.profiles.x.handle=p.handle;
    state.profiles.x.avatar=p.avatar;
  }
  if(state.profiles?.instagram){
    state.profiles.instagram.name=p.name;
    state.profiles.instagram.handle=p.handle;
    state.profiles.instagram.avatar=p.avatar;
  }

  // DM / Kakao: only "나" profile is unified.
  if(state.profiles?.dm){
    state.profiles.dm.myName=p.name;
    state.profiles.dm.myAvatar=p.avatar;
  }
  if(state.profiles?.kakao){
    state.profiles.kakao.myName=p.name;
    state.profiles.kakao.myAvatar=p.avatar;
  }

  state.myName=p.name;
  state.myAvatar=p.avatar;
}

function updateCommonProfile(part,value){
  state.commonProfile=state.commonProfile||{
    name:state.name||'Dearlog',
    handle:state.handle||'dearlog',
    avatar:state.avatar||DEFAULT_AVATAR()
  };
  state.commonProfile[part]=value;
  syncCommonProfileToState();
}

function loadTemplateProfile(){
  syncCommonProfileToState();
  const p=state.profiles[state.template];

  if(state.template==='x'||state.template==='instagram'){
    state.name=state.commonProfile.name;
    state.handle=state.commonProfile.handle;
    state.avatar=state.commonProfile.avatar;
    $('#nameInput').value=state.name;
    $('#handleInput').value=state.handle;
    $('#sidebarAvatarPreview').src=state.avatar;
  }else{
    state.theirName=p.name;
    state.chatBio=p.bio;
    state.theirAvatar=p.theirAvatar;

    state.myName=state.commonProfile.name;
    state.myAvatar=state.commonProfile.avatar;

    $('#theirNameInput').value=state.theirName;
    $('#myNameInput').value=state.myName;
    $('#chatBioInput').value=state.chatBio;
    $('#sidebarAvatarPreview').src=state.myAvatar;
  }
}
function saveCurrentProfile(){
  state.commonProfile=state.commonProfile||{
    name:state.name||'Dearlog',
    handle:state.handle||'dearlog',
    avatar:state.avatar||DEFAULT_AVATAR()
  };

  if(state.template==='x'||state.template==='instagram'){
    state.commonProfile.name=state.name;
    state.commonProfile.handle=state.handle;
    state.commonProfile.avatar=state.avatar;
  }else{
    const p=state.profiles[state.template];
    p.name=state.theirName;
    p.bio=state.chatBio;
    p.theirAvatar=state.theirAvatar;

    state.commonProfile.name=state.myName;
    state.commonProfile.avatar=state.myAvatar;
  }

  syncCommonProfileToState();
}
function syncTemplateBackgroundControls(){
  const b=state.backgrounds[state.template];
  $('#templateBgColor').value=b.color;
  $('#bgScaleValue').textContent=`${b.scale}%`;
  const meter=$('#bgScaleMeterFill');if(meter)meter.style.width=`${Math.max(0,Math.min(100,(b.scale-40)/2.6))}%`;
}


function symbolHtml(s=''){return s?`<span class="name-symbol">${esc(s)}</span>`:''}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function safeHandle(s=''){return String(s).replace(/^@+/,'').trim()||'dearlog'}
function fileToData(file,cb){if(!file)return;const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(file)}


function getFrameSpec(el,fallbackAspect=1,outputLong=1600){
  if(!el)return {
    aspect:fallbackAspect,
    outputW:outputLong,
    outputH:Math.max(1,Math.round(outputLong/fallbackAspect))
  };

  const rect=el.getBoundingClientRect();
  const w=Math.max(1,rect.width||el.clientWidth||1);
  const h=Math.max(1,rect.height||el.clientHeight||1);
  const aspect=w/h;

  let outputW,outputH;
  if(aspect>=1){
    outputW=outputLong;
    outputH=Math.max(1,Math.round(outputLong/aspect));
  }else{
    outputH=outputLong;
    outputW=Math.max(1,Math.round(outputLong*aspect));
  }
  return {aspect,outputW,outputH};
}

const profileEditor={
  img:null,
  zoom:1,
  offsetX:0,
  offsetY:0,
  callback:null,
  dragging:false,
  startX:0,
  startY:0,
  baseX:0,
  baseY:0,
  aspect:1,
  outputW:1024,
  outputH:1024,
  profileMode:false,
  bg:'#ffffff'
};

function configureEditorCanvas(){
  const canvas=$('#profileEditorCanvas');
  const preview=$('#profileEditorPreview');
  const wrap=document.querySelector('.profile-editor-canvas-wrap');
  const previewRow=document.querySelector('.profile-editor-preview-row');
  if(!canvas||!preview||!wrap)return;

  const base=480;
  const aspect=Math.max(.25,Math.min(4,profileEditor.aspect||1));

  if(aspect>=1){
    canvas.width=base;
    canvas.height=Math.max(120,Math.round(base/aspect));
  }else{
    canvas.height=base;
    canvas.width=Math.max(120,Math.round(base*aspect));
  }

  const ratio=`${canvas.width} / ${canvas.height}`;
  wrap.style.setProperty('--editor-aspect',ratio);
  wrap.classList.toggle('is-profile-mode',profileEditor.profileMode);
  previewRow?.classList.toggle('is-profile-mode',profileEditor.profileMode);

  preview.width=profileEditor.profileMode?112:Math.max(112,Math.round(112*Math.min(1.65,aspect)));
  preview.height=profileEditor.profileMode?112:Math.max(80,Math.round(preview.width/aspect));
}

function drawProfileEditor(){
  const canvas=$('#profileEditorCanvas');
  const preview=$('#profileEditorPreview');
  if(!canvas||!preview||!profileEditor.img)return;

  const ctx=canvas.getContext('2d');
  const pctx=preview.getContext('2d');
  const img=profileEditor.img;
  const w=canvas.width,h=canvas.height;

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=profileEditor.bg||'#ffffff';
  ctx.fillRect(0,0,w,h);

  // Always preserve the source aspect ratio. "cover" establishes the initial crop;
  // zoom only scales uniformly, never stretches the photo.
  const base=Math.max(w/img.naturalWidth,h/img.naturalHeight);
  const scale=base*profileEditor.zoom;
  const dw=img.naturalWidth*scale;
  const dh=img.naturalHeight*scale;
  const dx=(w-dw)/2+profileEditor.offsetX;
  const dy=(h-dh)/2+profileEditor.offsetY;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0,0,w,h);
  ctx.clip();
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,dx,dy,dw,dh);
  ctx.restore();

  $('#profileEditorZoomValue').textContent=`${Math.round(profileEditor.zoom*100)}%`;
}

function openPhotoEditor(file,options={},callback){
  if(!file)return;

  const reader=new FileReader();
  reader.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      let aspect=options.aspect;
      if(aspect==='source'||!aspect)aspect=img.naturalWidth/img.naturalHeight;

      profileEditor.img=img;
      profileEditor.zoom=1;
      profileEditor.offsetX=0;
      profileEditor.offsetY=0;
      profileEditor.callback=callback;
      profileEditor.aspect=aspect;
      profileEditor.profileMode=!!options.profile;
      profileEditor.bg=options.bg||'#ffffff';

      const defaultOutputW=options.profile?1024:1600;
      profileEditor.outputW=options.outputW||defaultOutputW;
      profileEditor.outputH=options.outputH||Math.max(1,Math.round(profileEditor.outputW/aspect));

      configureEditorCanvas();
      $('#profileEditorZoom').min='1';
      $('#profileEditorZoom').max='4';
      $('#profileEditorZoom').value='1';
      $('#profileEditorTitle').textContent='사진 편집';
      $('#profileEditorBackdrop').hidden=false;
      drawProfileEditor();
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
}

/* Compatibility wrapper: all profile uploads now use the same photo editor. */
function openProfileEditor(file,callback){
  openPhotoEditor(file,{aspect:1,profile:true,outputW:1024,outputH:1024,bg:'#ece9e3'},callback);
}

function closeProfileEditor(){
  $('#profileEditorBackdrop').hidden=true;
  profileEditor.img=null;
  profileEditor.callback=null;
}

function exportEditedProfile(){
  if(!profileEditor.img)return null;

  const output=document.createElement('canvas');
  output.width=profileEditor.outputW;
  output.height=profileEditor.outputH;

  const ctx=output.getContext('2d');
  const img=profileEditor.img;
  const editor=$('#profileEditorCanvas');
  const editorW=editor.width,editorH=editor.height;
  const ratioX=output.width/editorW;
  const ratioY=output.height/editorH;

  const base=Math.max(editorW/img.naturalWidth,editorH/img.naturalHeight);
  const editorScale=base*profileEditor.zoom;
  const dw=img.naturalWidth*editorScale*ratioX;
  const dh=img.naturalHeight*editorScale*ratioY;
  const dx=((editorW-img.naturalWidth*editorScale)/2+profileEditor.offsetX)*ratioX;
  const dy=((editorH-img.naturalHeight*editorScale)/2+profileEditor.offsetY)*ratioY;

  ctx.fillStyle=profileEditor.bg||'#ffffff';
  ctx.fillRect(0,0,output.width,output.height);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,dx,dy,dw,dh);

  return output.toDataURL('image/png',1);
}

$('#profileEditorZoom').addEventListener('input',e=>{
  profileEditor.zoom=Number(e.target.value)||1;
  drawProfileEditor();
});

$('#profileEditorReset').addEventListener('click',()=>{
  profileEditor.zoom=1;
  profileEditor.offsetX=0;
  profileEditor.offsetY=0;
  $('#profileEditorZoom').value='1';
  drawProfileEditor();
});

$('#profileEditorApply').addEventListener('click',()=>{
  const result=exportEditedProfile();
  const cb=profileEditor.callback;
  closeProfileEditor();
  if(result&&cb)cb(result);
});

$('#profileEditorCancel').addEventListener('click',closeProfileEditor);
$('#profileEditorClose').addEventListener('click',closeProfileEditor);
$('#profileEditorBackdrop').addEventListener('click',e=>{
  if(e.target===$('#profileEditorBackdrop'))closeProfileEditor();
});

const profileCanvasWrap=document.querySelector('.profile-editor-canvas-wrap');
profileCanvasWrap?.addEventListener('pointerdown',e=>{
  if(!profileEditor.img||e.button!==0)return;
  profileEditor.dragging=true;
  profileEditor.startX=e.clientX;
  profileEditor.startY=e.clientY;
  profileEditor.baseX=profileEditor.offsetX;
  profileEditor.baseY=profileEditor.offsetY;
  profileCanvasWrap.classList.add('is-dragging');
  profileCanvasWrap.setPointerCapture(e.pointerId);
});
profileCanvasWrap?.addEventListener('pointermove',e=>{
  if(!profileEditor.dragging)return;
  const rect=profileCanvasWrap.getBoundingClientRect();
  const canvas=$('#profileEditorCanvas');
  const scaleX=canvas.width/rect.width;
  const scaleY=canvas.height/rect.height;
  profileEditor.offsetX=profileEditor.baseX+(e.clientX-profileEditor.startX)*scaleX;
  profileEditor.offsetY=profileEditor.baseY+(e.clientY-profileEditor.startY)*scaleY;
  drawProfileEditor();
});
function endProfileDrag(e){
  if(!profileEditor.dragging)return;
  profileEditor.dragging=false;
  profileCanvasWrap?.classList.remove('is-dragging');
  try{profileCanvasWrap?.releasePointerCapture(e.pointerId)}catch{}
}
profileCanvasWrap?.addEventListener('pointerup',endProfileDrag);
profileCanvasWrap?.addEventListener('pointercancel',endProfileDrag);


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
  if(main.toLowerCase()==='#5d5a55') return {bg:'#f5f4f1',card:'#ffffff',accent:'#5d5a55'};
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
  $('#profileSectionTitle').textContent=state.template==='x'?'내 프로필':'프로필';
  const hint=$('#contentToolHint');if(hint)hint.textContent=state.template==='x'?'X':state.template==='instagram'?'Instagram':state.template==='dm'?'DM':'카카오톡';
}
function sharedTop(title='Dearlog'){
  return `<div class="preview-top"><div class="preview-brand">${state.brandSymbol?`<i>${esc(state.brandSymbol)}</i>`:''}<span>${title}</span></div><button class="preview-icon-btn" type="button">•••</button></div>`;
}

function xPost(post,i){
  const authorName=post.authorName??state.name;
  const authorHandle=post.authorHandle??state.handle;
  const fmt=v=>String(Math.max(0,Number(String(v).replace(/\D/g,''))||0)).padStart(3,'0').slice(-3);
  return `<article class="x-post" data-index="${i}">
    <div class="x-post-header"><div class="x-user"><img class="x-post-avatar" src="${post.authorAvatar||state.avatar}" alt="" decoding="async"><div>
    <div class="x-user-name"><span class="editable x-author-name" contenteditable="true">${esc(authorName)}</span></div>
    <div class="x-meta">@<span class="editable x-author-handle" contenteditable="true">${esc(authorHandle)}</span> · <span class="editable x-time" contenteditable="true">${esc(post.time)}</span></div>
    </div></div>
    <div class="x-more-wrap"><button class="x-more-btn" type="button">•••</button>
      <div class="x-more-menu" hidden>
        <button class="x-quote-toggle" type="button">${post.quote?'일반 트윗으로 변경':'인용 트윗으로 변경'}</button>
        <div class="menu-sep"></div>
        <button class="x-media-enable" type="button">${post.mediaEnabled?'사진 첨부 끄기':'사진 첨부하기'}</button>
        <div class="menu-sep"></div>
        <div class="x-author-editor" hidden>
          <label>이름<input class="x-author-menu-name" type="text" value="${esc(authorName)}"></label>
          <label>아이디<input class="x-author-menu-handle" type="text" value="${esc(authorHandle)}"></label>
        </div>
        <div class="x-author-photo-editor" hidden>
          <div class="x-author-photo-row">
            <img class="x-author-photo-preview" src="${post.authorAvatar||state.avatar}" alt="">
            <label class="x-author-photo-upload">사진 선택<input class="x-author-photo-input" type="file" accept="image/*"></label>
          </div>
          <button class="x-use-my-avatar" type="button">내 프로필 사진 사용</button>
        </div>
      </div>
    </div></div>
    <div class="x-body editable x-body-edit" contenteditable="true">${esc(post.body)}</div>
    ${post.quote?`<div class="quote-card">
      <div class="quote-user"><img class="avatar" src="${state.avatar}" alt=""><div class="quote-user-main">
      <span class="quote-name editable quote-name-edit" contenteditable="true">${esc(post.quoteName||'Original')}</span>
      <span class="quote-meta">@<span class="editable quote-handle-edit" contenteditable="true">${esc(post.quoteHandle||'original')}</span></span></div></div>
      <div class="quote-body editable quote-body-edit" contenteditable="true">${esc(post.quoteBody||'인용할 원문 내용을 입력하세요.')}</div>
    </div>`:''}
    ${post.mediaEnabled?`<label class="x-media image-picker ${post.image?'has-image':''}" style="--media-bg:${post.imageBg||'#f5f4f1'}"><input type="file" accept="image/*" class="x-image-input">
      ${post.image?`<img src="${post.image}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
      ${post.video?`<div class="video-play-overlay"><span>▶</span></div>`:''}
      ${post.image?`<div class="photo-edit-badge">사진 편집</div>`:''}
      <button class="media-play-toggle x-video-toggle" type="button">${post.video?'동영상 표시 ON':'동영상 표시'}</button>
    </label>`:''}
    <div class="x-actions">
      <button class="x-action-btn x-reply-btn ${post.replied?'is-active':''}" type="button"><span>◌</span><b>${fmt(post.replies)}</b></button>
      <button class="x-action-btn x-repost-btn ${post.reposted?'is-active':''}" type="button"><span>↻</span><b>${fmt(post.reposts)}</b></button>
      <button class="x-action-btn x-like-btn ${post.liked?'is-active':''}" type="button"><span>♡</span><b>${fmt(post.likes)}</b></button>
      <button class="x-action-btn share" type="button">↗</button>
    </div>
  </article>`;
}
function renderX(){
  $('#stageTitle').textContent='X 템플릿';$('#stageDesc').textContent='게시물과 답글 느낌의 화면을 만들어보세요.';
  capture.innerHTML=`<div class="x-page">${sharedTop('Dearlog')}
    <section class="x-compose"><img class="avatar sync-avatar" src="${state.avatar}" alt=""><div class="x-compose-main">
    <div class="x-compose-text editable" contenteditable="true">무슨 일이 일어나고 있나요?</div><div class="x-post-author-note">내 프로필로 작성</div>
    <div class="x-compose-bottom"><span class="x-compose-tools" aria-hidden="true">
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m5 17 4-4 3 3 2-2 5 5"/></svg></i>
  <i class="x-tool-icon x-tool-gif">GIF</i>
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M4 20 20 4"/></svg></i>
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><circle cx="6" cy="7" r="2"/><path d="M11 7h8"/><circle cx="6" cy="17" r="2"/><path d="M11 17h8"/></svg></i>
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 14c1 2 2.5 3 4 3s3-1 4-3"/><path d="M9 9h.01M15 9h.01"/></svg></i>
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/><circle cx="16" cy="16" r="3"/></svg></i>
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></svg></i>
  <i class="x-tool-icon"><svg viewBox="0 0 24 24"><path d="M5 21V4"/><path d="M5 5h12l-2 4 2 4H5"/></svg></i>
</span><button class="x-post-btn">게시</button></div></div></section>
    <div id="xFeed">${state.xPosts.map(xPost).join('')}</div></div>`;
}
function renderInstagram(){
  $('#stageTitle').textContent='Instagram 템플릿';$('#stageDesc').textContent='9칸 프로필 피드와 사진을 만들어보세요.';
  capture.innerHTML=`<div class="ig-page">${sharedTop('Dearlog')}
    <section class="ig-profile">
      <label class="ig-avatar-picker"><input type="file" accept="image/*" class="avatar-local-input" hidden><img class="avatar sync-avatar" src="${state.avatar}" alt="" decoding="async"></label>
      <div class="ig-profile-info">
        <div class="ig-name-row"><span class="ig-handle editable sync-handle" contenteditable="true">${esc(state.handle)}</span><button class="ig-follow editable" contenteditable="true">팔로우</button></div>
        <div class="ig-counts"><span>게시물 <b class="editable" contenteditable="true">${state.igTiles.length}</b></span><span>팔로워 <b class="editable" contenteditable="true">1.2K</b></span><span>팔로잉 <b class="editable" contenteditable="true">87</b></span></div>
        <div class="ig-bio"><b><span class="editable sync-name" contenteditable="true">${esc(state.name)}</span></b><br><span class="editable" contenteditable="true">너와의 추억을 기록하는 중</span></div>
      </div>
    </section>
    <div class="ig-tabs"><span>▦</span><span>▣</span><span>♙</span></div>
    <div class="ig-grid">${state.igTiles.map((src,i)=>`<label class="ig-tile image-picker ${src?'has-image':''}" data-index="${i}" >
      <input type="file" accept="image/*" class="ig-image-input">${src?`<img src="${src}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
      ${state.igVideos?.[i]?`<div class="video-play-overlay"><span>▶</span></div>`:''}
      ${src?`<div class="photo-edit-badge">사진 편집</div>`:''}
      <button class="media-play-toggle ig-video-toggle" type="button">${state.igVideos?.[i]?'ON':'▶'}</button>
    </label>`).join('')}</div></div>`;
}
function chatMedia(m, cls){
  if(m.type!=='photo') return `<div class="bubble editable chat-text" contenteditable="true">${esc(m.text)}</div>`;
  return `<label class="${cls} chat-photo image-picker ${m.image?'has-image':''}"><input type="file" accept="image/*" class="chat-photo-input">
    ${m.image?`<img src="${m.image}" alt="메시지 사진"><div class="photo-edit-badge">사진 편집</div>`:`<div class="image-placeholder"><b>＋</b><span>사진 메시지</span></div>`}
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
    <img class="avatar" src="${state.theirAvatar}" alt=""><div><div class="dm-name"><span class="editable their-name" contenteditable="true">${esc(state.theirName)}</span></div>
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
      <div class="kakao-sender"><span class="editable ${mine?'my-name':'their-name'}" contenteditable="true">${esc(mine?state.myName:state.theirName)}</span></div>
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
    <header class="kakao-head"><button>‹</button><div><b><span class="editable their-name" contenteditable="true">${esc(state.theirName)}</span></b><small class="editable chat-bio-edit" contenteditable="true">${esc(state.chatBio)}</small></div><span>⌕　☰</span></header>
    <div class="kakao-room"><div class="kakao-date editable" contenteditable="true">2026년 8월 19일 수요일</div>
    ${state.kakao.map((m,i)=>m.type==='typing'?kakaoTyping(m,i):kakaoBubble(m,i)).join('')}</div>
    <footer class="kakao-compose"><span>＋</span><div class="kakao-input editable" contenteditable="true">메시지 입력</div><span>☺　♯</span></footer>
  </div>`;
}

function selectItem(kind,index){
  if(state.selected && state.selected.kind===kind && state.selected.index===index){
    state.selected=null;
    document.querySelectorAll('.is-selected-item').forEach(el=>el.classList.remove('is-selected-item'));
    updateInspector();
    return;
  }
  state.selected={kind,index};
  updateInspector();
  document.querySelectorAll('.is-selected-item').forEach(el=>el.classList.remove('is-selected-item'));
  const sel=kind==='x'?`.x-post[data-index="${index}"]`:
            kind==='dm'?`.dm-page [data-index="${index}"]`:
            kind==='kakao'?`.kakao-page [data-index="${index}"]`:null;
  if(sel)document.querySelector(sel)?.classList.add('is-selected-item');
}

function ensureSelectedItem(kind,index){
  if(state.selected && state.selected.kind===kind && state.selected.index===index){
    updateInspector();
    document.querySelectorAll('.is-selected-item').forEach(el=>el.classList.remove('is-selected-item'));
    const sel=kind==='x'?`.x-post[data-index="${index}"]`:
              kind==='dm'?`.dm-page [data-index="${index}"]`:
              kind==='kakao'?`.kakao-page [data-index="${index}"]`:null;
    if(sel)document.querySelector(sel)?.classList.add('is-selected-item');
    return;
  }
  state.selected={kind,index};
  updateInspector();
  document.querySelectorAll('.is-selected-item').forEach(el=>el.classList.remove('is-selected-item'));
  const sel=kind==='x'?`.x-post[data-index="${index}"]`:
            kind==='dm'?`.dm-page [data-index="${index}"]`:
            kind==='kakao'?`.kakao-page [data-index="${index}"]`:null;
  if(sel)document.querySelector(sel)?.classList.add('is-selected-item');
}


function clearSelection(){
  state.selected=null;
  document.querySelectorAll('.is-selected-item').forEach(el=>el.classList.remove('is-selected-item'));
  updateInspector();
}
document.querySelector('.stage')?.addEventListener('click',e=>{
  if(e.target.closest('.x-post,.bubble-row,.kakao-message,.typing-row,.capture button,.capture input,.capture [contenteditable="true"]'))return;
  clearSelection();
});

function selectedData(){
  if(!state.selected)return null;
  const {kind,index}=state.selected;
  const arr=kind==='x'?state.xPosts:kind==='dm'?state.dm:kind==='kakao'?state.kakao:null;
  return arr?.[index]?{kind,index,item:arr[index],arr}:null;
}
function updateInspector(){
  const d=selectedData(), empty=$('#inspectorEmpty'), fields=$('#inspectorFields');
  if(!d){
    empty.hidden=false;fields.hidden=true;$('#inspectorType').textContent='선택 없음';return;
  }
  empty.hidden=true;fields.hidden=false;
  const isX=d.kind==='x', isTyping=d.item.type==='typing';
  $('#inspectorType').textContent=isX?'X 게시물':isTyping?'입력중 표시':'메시지';
  $('#inspectNameField').hidden=!isX;
  $('#inspectHandleField').hidden=!isX;
  $('#inspectPostAvatarField').hidden=!isX;
  $('#inspectBodyField').hidden=isTyping;
  $('#inspectSideField').hidden=isX;
  $('#inspectTimeField').hidden=isX||isTyping;
  $('#inspectImageBgField').hidden=!(isX&&d.item.mediaEnabled);
  $('#duplicateSelectedBtn').hidden=isX;
  if(isX){
    $('#inspectName').value=d.item.authorName??state.name;
    $('#inspectHandle').value=d.item.authorHandle??state.handle;
    $('#inspectPostAvatarPreview').src=d.item.authorAvatar||state.avatar;
    $('#inspectBody').value=d.item.body||'';
    $('#inspectImageBg').value=d.item.imageBg||'#f5f4f1';
  }else{
    $('#inspectSide').value=d.item.side;
    if(!isTyping){
      $('#inspectBody').value=d.item.text||'';
      $('#inspectTime').value=d.item.time||'';
    }
  }
}
function refreshSelected(){
  const s=state.selected;
  render();
  if(s)requestAnimationFrame(()=>selectItem(s.kind,s.index));
}


function fitCaptureToStage(){
  const shell=document.querySelector('.capture-shell');
  if(!shell||!capture.offsetWidth||!capture.offsetHeight)return;

  const naturalW=capture.offsetWidth;
  const naturalH=capture.offsetHeight;

  if(window.innerWidth<=900){
    const availableW=Math.max(280,shell.clientWidth-4);
    const scale=Math.min(1,availableW/naturalW);
    capture.style.transform=`scale(${scale})`;
    shell.style.minHeight=`${naturalH*scale}px`;
    return;
  }

  shell.style.minHeight='';
  const availableW=Math.max(100,shell.clientWidth);
  const availableH=Math.max(100,shell.clientHeight);
  const scale=Math.min(1,availableW/naturalW,availableH/naturalH);
  capture.style.transform=`scale(${scale})`;
}

function render(){
  requestAnimationFrame(()=>requestAnimationFrame(fitCaptureToStage));
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
    const i=+row.dataset.index,m=arr[i];
    if(!m)return;
    row.addEventListener('click',e=>{
      if(!e.target.closest('input,button,[contenteditable="true"]'))selectItem(state.template==='kakao'?'kakao':'dm',i);
    });
    row.querySelector('[contenteditable="true"]')?.addEventListener('focus',()=>ensureSelectedItem(state.template==='kakao'?'kakao':'dm',i));
    if(m.type==='typing')return;
    $('.chat-text',row)?.addEventListener('input',e=>m.text=e.target.textContent);
    $('.chat-time',row)?.addEventListener('input',e=>m.time=e.target.textContent);
    $('.chat-photo-input',row)?.addEventListener('change',e=>{
      const input=e.target;
      const frame=input.closest('.chat-photo,.kakao-photo') || row;
      const spec=getFrameSpec(frame,4/3,1400);
      openPhotoEditor(input.files[0],{
        aspect:spec.aspect,
        outputW:spec.outputW,
        outputH:spec.outputH,
        bg:'#ffffff'
      },src=>{
        m.image=src;
        render();
        if(typeof queueAutosave==='function')queueAutosave(250);
      });
      input.value='';
    });
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
  $$('.avatar-local-input',capture).forEach(inp=>inp.addEventListener('change',e=>{
    openProfileEditor(e.target.files[0],src=>{
      updateCommonProfile('avatar',src);
      $('#sidebarAvatarPreview').src=src;
      render();
      queueAutosave?.(250);
    });
    e.target.value='';
  }));
  if(state.template==='x'){
    $$('.x-post',capture).forEach(card=>{
      const i=+card.dataset.index,p=state.xPosts[i];
      card.addEventListener('click',e=>{
        if(!e.target.closest('button,input,label,[contenteditable="true"]'))selectItem('x',i);
      });
      $('.x-body-edit',card).addEventListener('focus',()=>ensureSelectedItem('x',i));
      $('.x-body-edit',card).addEventListener('input',e=>{p.body=e.target.textContent;updateInspector()});
      $('.x-author-edit-toggle',card)?.addEventListener('click',e=>{
        e.stopPropagation();
        const editor=$('.x-author-editor',card);
        editor.hidden=!editor.hidden;
      });
      $('.x-author-menu-name',card)?.addEventListener('input',e=>{
        p.authorName=e.target.value;
        $('.x-author-name',card).textContent=e.target.value;
        updateInspector();
      });
      $('.x-author-menu-handle',card)?.addEventListener('input',e=>{
        p.authorHandle=safeHandle(e.target.value);
        $('.x-author-handle',card).textContent=p.authorHandle;
        updateInspector();
      });
      $('.x-author-photo-toggle',card)?.addEventListener('click',e=>{
        e.stopPropagation();
        const editor=$('.x-author-photo-editor',card);
        editor.hidden=!editor.hidden;
      });
      $('.x-author-photo-input',card)?.addEventListener('change',e=>{
        openProfileEditor(e.target.files[0],src=>{
          p.authorAvatar=src;
          render();
          requestAnimationFrame(()=>selectItem('x',i));
        });
        e.target.value='';
      });
      $('.x-use-my-avatar',card)?.addEventListener('click',e=>{
        e.stopPropagation();
        p.authorAvatar=state.avatar;
        render();
        requestAnimationFrame(()=>selectItem('x',i));
      });
      $('.x-time',card).addEventListener('input',e=>p.time=e.target.textContent);
      $('.x-author-name',card)?.addEventListener('focus',()=>ensureSelectedItem('x',i));
      $('.x-author-name',card)?.addEventListener('input',e=>{p.authorName=e.target.textContent.trim();updateInspector()});
      $('.x-author-handle',card)?.addEventListener('input',e=>{p.authorHandle=safeHandle(e.target.textContent);updateInspector()});
      const bump=(key,flag)=>{
        const current=Math.max(0,Number(String(p[key]).replace(/\D/g,''))||0);
        p[flag]=!p[flag];
        p[key]=String(Math.max(0,current+(p[flag]?1:-1))).padStart(3,'0').slice(-3);
        render();
      };
      $('.x-reply-btn',card)?.addEventListener('click',()=>bump('replies','replied'));
      $('.x-repost-btn',card)?.addEventListener('click',()=>bump('reposts','reposted'));
      $('.x-like-btn',card)?.addEventListener('click',()=>bump('likes','liked'));
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
      $('.x-image-input',card)?.addEventListener('change',e=>{
        const input=e.target;
        const frame=card.querySelector('.x-media') || card;
        const spec=getFrameSpec(frame,390/240,1600);
        openPhotoEditor(input.files[0],{
          aspect:spec.aspect,
          outputW:spec.outputW,
          outputH:spec.outputH,
          bg:p.imageBg||'#f5f4f1'
        },src=>{
          p.image=src;
          p.mediaScale=1;p.mediaX=0;p.mediaY=0;
          render();
          if(typeof queueAutosave==='function')queueAutosave(250);
        });
        input.value='';
      });
      $('.x-video-toggle',card)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();p.video=!p.video;render()});
    });
  }else if(state.template==='instagram'){
    $$('.ig-tile',capture).forEach(tile=>{
      const i=+tile.dataset.index;
      $('.ig-image-input',tile).addEventListener('change',e=>{
        const input=e.target;
        const spec=getFrameSpec(tile,4/5,1500);
        openPhotoEditor(input.files[0],{
          aspect:spec.aspect,
          outputW:spec.outputW,
          outputH:spec.outputH,
          bg:'#ffffff'
        },src=>{
          state.igTiles[i]=src;
          state.igScales[i]=1;state.igXs[i]=0;state.igYs[i]=0;
          render();
          if(typeof queueAutosave==='function')queueAutosave(250);
        });
        input.value='';
      });
      $('.ig-video-toggle',tile)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.igVideos[i]=!state.igVideos[i];render()});
    });
  }else if(state.template==='dm') bindChat('dm');
  else bindChat('kakao');
}


capture.addEventListener('pointerdown',e=>{
  const editable=e.target.closest('[contenteditable="true"]');
  if(!editable)return;
  e.stopPropagation();
},true);


capture.addEventListener('focusin',e=>{
  const editable=e.target.closest('[contenteditable="true"]');
  if(!editable)return;
  const post=editable.closest('.x-post');
  if(post){
    ensureSelectedItem('x',Number(post.dataset.index));
    return;
  }
  const chat=editable.closest('.bubble-row,.kakao-message,.typing-row');
  if(chat){
    ensureSelectedItem(state.template==='kakao'?'kakao':'dm',Number(chat.dataset.index));
  }
});

document.addEventListener('click',e=>{
  if(e.target.closest('.x-more-wrap'))return;
  $$('.x-more-menu',capture).forEach(m=>m.hidden=true);
});
$$('.template-card').forEach(btn=>btn.addEventListener('click',()=>{
  saveCurrentProfile();
  state.selected=null;
  state.template=btn.dataset.template;
  loadTemplateProfile();
  syncTemplateBackgroundControls();
  $$('.template-card').forEach(b=>b.classList.toggle('active',b===btn));
  render();
}));


$('#brandSymbolSelect').addEventListener('change',e=>{state.brandSymbol=e.target.value;render()});
$('#nameInput').addEventListener('input',e=>{updateCommonProfile('name',e.target.value||'Dearlog');render()});
$('#handleInput').addEventListener('input',e=>{updateCommonProfile('handle',safeHandle(e.target.value));render()});
$('#chatBioInput').addEventListener('input',e=>{state.chatBio=e.target.value;saveCurrentProfile();render()});
$('#avatarInput').addEventListener('change',e=>{
  openProfileEditor(e.target.files[0],src=>{
    updateCommonProfile('avatar',src);
    $('#sidebarAvatarPreview').src=src;
    render();
    queueAutosave?.(250);
  });
  e.target.value='';
});
$('#theirNameInput').addEventListener('input',e=>{state.theirName=e.target.value||'상대방';saveCurrentProfile();render()});
$('#myNameInput').addEventListener('input',e=>{updateCommonProfile('name',e.target.value||'나');$('#nameInput').value=state.commonProfile.name;render()});
$('#theirAvatarInput').addEventListener('change',e=>{
  openProfileEditor(e.target.files[0],src=>{
    state.theirAvatar=src;
    saveCurrentProfile();
    render();
    queueAutosave?.(250);
  });
  e.target.value='';
});
$('#myAvatarInput').addEventListener('change',e=>{
  openProfileEditor(e.target.files[0],src=>{
    updateCommonProfile('avatar',src);
    $('#sidebarAvatarPreview').src=src;
    render();
    queueAutosave?.(250);
  });
  e.target.value='';
});

$('#mainColor').addEventListener('input',e=>{
  state.main=e.target.value;
  if(state.autoPalette)
applyRecommendedPalette();
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
  const kind=state.template==='kakao'?'kakao':'dm';
  const arr=kind==='kakao'?state.kakao:state.dm;
  arr.push({side:nextSide(arr),type:'typing',text:'',time:'',image:'',read:true,video:false});
  state.selected={kind,index:arr.length-1};
  render();
  requestAnimationFrame(()=>selectItem(kind,arr.length-1));
});

$('#addItemBtn').addEventListener('click',()=>{
  if(state.template==='x')state.xPosts.push({body:'새 게시물 내용을 입력하세요.',time:'now',likes:'000',replies:'000',reposts:'000',shares:'0',image:'',video:false,mediaEnabled:false,mediaScale:1,quote:false,quoteName:'Original',quoteHandle:'original',quoteBody:'인용할 원문 내용을 입력하세요.',authorName:state.commonProfile.name,authorHandle:state.commonProfile.handle,authorAvatar:state.commonProfile.avatar,imageBg:'#f5f4f1',mediaX:0,mediaY:0,liked:false,reposted:false,replied:false});
  else if(state.template==='instagram'){state.igTiles.push('');state.igVideos.push(false);state.igScales.push(1);state.igXs.push(0);state.igYs.push(0);}
  render();
});
$('#removeItemBtn').addEventListener('click',()=>{
  const target=state.template==='x'?state.xPosts:state.template==='instagram'?state.igTiles:state.template==='dm'?state.dm:state.kakao;
  if(target.length<=1)return alert('항목은 최소 1개가 필요해요.');
  target.pop();
  if(state.template==='instagram'){state.igVideos.pop();state.igScales.pop();state.igXs.pop();state.igYs.pop();}
  render();
});


$('#templateBgColor').addEventListener('input',e=>{
  state.backgrounds[state.template].color=e.target.value;
  syncVars();
});
$('#templateBgImageInput').addEventListener('change',e=>{
  const input=e.target;
  const spec=getFrameSpec(capture,390/844,1800);
  openPhotoEditor(input.files[0],{
    aspect:spec.aspect,
    outputW:spec.outputW,
    outputH:spec.outputH,
    bg:state.backgrounds[state.template].color||'#f5f4f1'
  },src=>{
    state.backgrounds[state.template].image=src;
    state.backgrounds[state.template].scale=100;
    syncTemplateBackgroundControls();
    syncVars();
    if(typeof queueAutosave==='function')queueAutosave(250);
  });
  input.value='';
});
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
  const meter=$('#bgScaleMeterFill');if(meter)meter.style.width=`${Math.max(0,Math.min(100,(b.scale-40)/2.6))}%`;
  syncVars();
},{passive:false});

$('#chatBgColor').addEventListener('input',e=>{state.chatBg=e.target.value;syncVars()});
$('#chatBgImageInput').addEventListener('change',e=>{
  const input=e.target;
  const room=capture.querySelector('.dm-body,.kakao-room') || capture;
  const spec=getFrameSpec(room,390/700,1800);
  openPhotoEditor(input.files[0],{
    aspect:spec.aspect,
    outputW:spec.outputW,
    outputH:spec.outputH,
    bg:state.chatBg||'#dfe8ef'
  },src=>{
    state.chatBgImage=src;
    syncVars();
    if(typeof queueAutosave==='function')queueAutosave(250);
  });
  input.value='';
});
$('#clearChatBgBtn').addEventListener('click',()=>{state.chatBgImage='';$('#chatBgImageInput').value='';syncVars()});

$('#resetBtn').addEventListener('click',()=>{if(confirm('편집 내용을 모두 초기화할까요?'))location.reload()});
async function saveCleanCapture(format='png',sourceNode=null){
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
      flattenXMediaForOutput(sourceNode,clean);
      flattenInstagramForOutput(sourceNode,clean);
    }else{
      clean=createCleanPreviewClone();
    }

    tempWrap.appendChild(clean);
    document.body.appendChild(tempWrap);

    const bgColor=state.backgrounds?.[state.template]?.color || state.bg || '#f5f4f1';

    const canvas=await html2canvas(clean,{
      scale:4,
      backgroundColor:format==='png'?null:bgColor,
      useCORS:true,
      logging:false,
      imageTimeout:0
    });

    const d=new Date();
    const stamp=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    const base=`dearlog-${state.template}-${stamp}`;

    if(format==='pdf'){
      if(!window.jspdf?.jsPDF)throw new Error('PDF library unavailable');

      const flat=document.createElement('canvas');
      flat.width=canvas.width;
      flat.height=canvas.height;
      const fctx=flat.getContext('2d');
      fctx.fillStyle=bgColor;
      fctx.fillRect(0,0,flat.width,flat.height);
      fctx.drawImage(canvas,0,0);

      const {jsPDF}=window.jspdf;
      const pxToMm=0.264583;
      const w=flat.width*pxToMm/4;
      const h=flat.height*pxToMm/4;
      const pdf=new jsPDF({orientation:w>h?'landscape':'portrait',unit:'mm',format:[w,h]});
      pdf.addImage(flat.toDataURL('image/png'),'PNG',0,0,w,h,undefined,'FAST');
      pdf.save(`${base}.pdf`);
      return;
    }

    const a=document.createElement('a');

    if(format==='jpg'){
      const flat=document.createElement('canvas');
      flat.width=canvas.width;
      flat.height=canvas.height;
      const fctx=flat.getContext('2d');
      fctx.fillStyle=bgColor;
      fctx.fillRect(0,0,flat.width,flat.height);
      fctx.drawImage(canvas,0,0);

      a.download=`${base}.jpg`;
      a.href=flat.toDataURL('image/jpeg',0.96);
    }else{
      a.download=`${base}.png`;
      a.href=canvas.toDataURL('image/png',1.0);
    }

    a.click();
  }finally{
    tempWrap?.remove();
  }
}






function flattenXMediaForOutput(sourceRoot,cloneRoot){
  const sourceMedia=[...sourceRoot.querySelectorAll('.x-media.has-image')];
  const cloneMedia=[...cloneRoot.querySelectorAll('.x-media.has-image')];

  sourceMedia.forEach((media,idx)=>{
    const target=cloneMedia[idx];
    const img=media.querySelector('img');
    if(!target||!img||!img.complete||!img.naturalWidth||!img.naturalHeight)return;

    const w=Math.max(1,Math.round(media.clientWidth));
    const h=Math.max(1,Math.round(media.clientHeight));
    const styles=getComputedStyle(media);

    const scale=parseFloat(styles.getPropertyValue('--media-scale'))||1;
    const moveX=parseFloat(styles.getPropertyValue('--media-x'))||0;
    const moveY=parseFloat(styles.getPropertyValue('--media-y'))||0;
    const bg=(styles.getPropertyValue('--media-bg')||'#f5f4f1').trim();

    const fit=Math.min(w/img.naturalWidth,h/img.naturalHeight);
    const drawW=img.naturalWidth*fit*scale;
    const drawH=img.naturalHeight*fit*scale;
    const drawX=(w-drawW)/2+moveX;
    const drawY=(h-drawH)/2+moveY;

    const canvas=document.createElement('canvas');
    const outputScale=4;
    canvas.width=w*outputScale;
    canvas.height=h*outputScale;
    const ctx=canvas.getContext('2d');
    ctx.scale(outputScale,outputScale);
    ctx.fillStyle=bg;
    ctx.fillRect(0,0,w,h);
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(img,drawX,drawY,drawW,drawH);

    const flat=document.createElement('img');
    flat.src=canvas.toDataURL('image/png',1);
    flat.alt='';
    flat.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;transform:none!important;max-width:none!important;max-height:none!important;';
    target.replaceChildren(flat);

    // The frame stays identical; only editing UI disappears.
    target.classList.add('is-flattened-output');
    target.style.setProperty('--media-scale','1');
    target.style.setProperty('--media-x','0px');
    target.style.setProperty('--media-y','0px');
  });
}


function flattenInstagramForOutput(sourceRoot,cloneRoot){
  const sourceTiles=[...sourceRoot.querySelectorAll('.ig-tile.has-image')];
  const cloneTiles=[...cloneRoot.querySelectorAll('.ig-tile.has-image')];

  sourceTiles.forEach((tile,idx)=>{
    const target=cloneTiles[idx];
    const img=tile.querySelector('img');
    if(!target||!img||!img.complete||!img.naturalWidth||!img.naturalHeight)return;

    const w=Math.max(1,Math.round(tile.clientWidth));
    const h=Math.max(1,Math.round(tile.clientHeight));
    const styles=getComputedStyle(tile);
    const scale=parseFloat(styles.getPropertyValue('--ig-scale'))||1;
    const moveX=parseFloat(styles.getPropertyValue('--ig-x'))||0;
    const moveY=parseFloat(styles.getPropertyValue('--ig-y'))||0;
    const bg=(getComputedStyle(tile).backgroundColor||'#ffffff');

    // "contain" at scale 1: never distort source ratio
    const fit=Math.min(w/img.naturalWidth,h/img.naturalHeight);
    const drawW=img.naturalWidth*fit*scale;
    const drawH=img.naturalHeight*fit*scale;
    const drawX=(w-drawW)/2+moveX;
    const drawY=(h-drawH)/2+moveY;

    const canvas=document.createElement('canvas');
    const outputScale=4;
    canvas.width=w*outputScale;
    canvas.height=h*outputScale;
    const ctx=canvas.getContext('2d');
    ctx.scale(outputScale,outputScale);
    ctx.fillStyle=bg;
    ctx.fillRect(0,0,w,h);
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(img,drawX,drawY,drawW,drawH);

    const flat=document.createElement('img');
    flat.src=canvas.toDataURL('image/png',1);
    flat.alt='';
    flat.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;transform:none!important;max-width:none!important;max-height:none!important;';
    target.replaceChildren(flat);
    target.classList.add('is-flattened-output');
  });
}

function createCleanPreviewClone(){
  const clone=capture.cloneNode(true);
  clone.id='previewCapture';
  clone.classList.add('clean-output');
  clone.querySelectorAll('[contenteditable="true"]').forEach(el=>{
    el.removeAttribute('contenteditable');
  });
  clone.querySelectorAll('input').forEach(el=>el.remove());
  flattenXMediaForOutput(capture,clone);
  flattenInstagramForOutput(capture,clone);
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

$('#previewBackdrop').addEventListener('click',e=>{
  if(e.target===$('#previewBackdrop'))closePreview();
});


function toggleSaveMenu(menu){
  menu.hidden=!menu.hidden;
}
$('#saveMenuBtn').addEventListener('click',e=>{
  e.stopPropagation();
  toggleSaveMenu($('#saveMenu'));
});
$('#previewSaveBtn').addEventListener('click',e=>{
  e.stopPropagation();
  toggleSaveMenu($('#previewSaveMenu'));
});
$$('[data-save-format]').forEach(btn=>btn.addEventListener('click',async()=>{
  const format=btn.dataset.saveFormat;
  $('#saveMenu').hidden=true;
  const trigger=$('#saveMenuBtn'),old=trigger.textContent;
  trigger.disabled=true;trigger.textContent='저장 중…';
  try{await saveCleanCapture(format)}
  catch(err){console.error(err);alert('저장에 실패했어요.')}
  finally{trigger.disabled=false;trigger.textContent=old}
}));
$$('[data-preview-save-format]').forEach(btn=>btn.addEventListener('click',async()=>{
  const format=btn.dataset.previewSaveFormat;
  $('#previewSaveMenu').hidden=true;
  const trigger=$('#previewSaveBtn'),old=trigger.textContent;
  trigger.disabled=true;trigger.textContent='저장 중…';
  try{
    const node=$('#previewMount .capture');
    if(node)await saveCleanCapture(format,node);
  }catch(err){console.error(err);alert('저장에 실패했어요.')}
  finally{trigger.disabled=false;trigger.textContent=old}
}));
document.addEventListener('click',e=>{
  if(!e.target.closest('.save-menu-wrap')){
    $('#saveMenu').hidden=true;
    $('#previewSaveMenu').hidden=true;
  }
});


function openHelpModal(){
  $('#helpBackdrop').hidden=false;
}
function closeHelpModal(){
  $('#helpBackdrop').hidden=true;
}
$('#helpOpenBtn')?.addEventListener('click',openHelpModal);
$('#helpCloseBtn')?.addEventListener('click',closeHelpModal);
$('#helpBackdrop')?.addEventListener('click',e=>{
  if(e.target===$('#helpBackdrop'))closeHelpModal();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!$('#helpBackdrop')?.hidden)closeHelpModal();
});

function openNotice(){
  const cfg=window.DEARLOG_NOTICE;
  if(!cfg?.enabled)return;
  $('#noticeTitle').textContent=cfg.title||'Dearlog 안내';
  $('#noticeContent').innerHTML=cfg.html||'';
  $('#noticeBackdrop').hidden=false;
}
function noticeSessionKey(){
  return `dearlogNoticeHidden-${window.DEARLOG_NOTICE?.version||'current'}`;
}
function closeNotice(){
  if($('#noticeSessionCheck').checked)sessionStorage.setItem(noticeSessionKey(),'1');
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

$('#inspectName').addEventListener('input',e=>{
  const d=selectedData();if(!d||d.kind!=='x')return;
  d.item.authorName=e.target.value;refreshSelected();
});
$('#inspectHandle').addEventListener('input',e=>{
  const d=selectedData();if(!d||d.kind!=='x')return;
  d.item.authorHandle=safeHandle(e.target.value);refreshSelected();
});
$('#inspectBody').addEventListener('input',e=>{
  const d=selectedData();if(!d)return;
  if(d.kind==='x')d.item.body=e.target.value;
  else d.item.text=e.target.value;
  refreshSelected();
});
$('#inspectPostAvatarInput').addEventListener('change',e=>{
  const d=selectedData();if(!d||d.kind!=='x')return;
  openProfileEditor(e.target.files[0],src=>{
    d.item.authorAvatar=src;
    refreshSelected();
    queueAutosave?.(250);
  });
  e.target.value='';
});
$('#inspectUseMyAvatarBtn').addEventListener('click',()=>{
  const d=selectedData();if(!d||d.kind!=='x')return;
  d.item.authorAvatar=state.avatar;
  refreshSelected();
});
$('#inspectImageBg').addEventListener('input',e=>{
  const d=selectedData();if(!d||d.kind!=='x')return;
  d.item.imageBg=e.target.value;
  refreshSelected();
});
$('#inspectSide').addEventListener('change',e=>{
  const d=selectedData();if(!d||d.kind==='x')return;
  d.item.side=e.target.value;refreshSelected();
});
$('#inspectTime').addEventListener('input',e=>{
  const d=selectedData();if(!d||d.kind==='x')return;
  d.item.time=e.target.value;refreshSelected();
});
$('#duplicateSelectedBtn').addEventListener('click',()=>{
  const d=selectedData();if(!d||d.kind==='x')return;
  const copy=JSON.parse(JSON.stringify(d.item));
  d.arr.splice(d.index+1,0,copy);
  state.selected={kind:d.kind,index:d.index+1};
  refreshSelected();
});
$('#deleteSelectedBtn').addEventListener('click',()=>{
  const d=selectedData();if(!d)return;
  d.arr.splice(d.index,1);state.selected=null;render();updateInspector();
});

window.addEventListener('resize',()=>requestAnimationFrame(fitCaptureToStage));

const SLOT_PREFIX='dearlog-slot-v1-';
const SLOT_NAME_PREFIX='dearlog-slot-name-v1-';

function storageState(){
  saveCurrentProfile();

  // Slots/autosave store text and settings only. Never store uploaded files.
  const IMAGE_KEYS=/^(avatar|theirAvatar|myAvatar|authorAvatar|image|chatBgImage)$/i;
  const IMAGE_ARRAY_KEYS=/^(igTiles)$/i;

  function clean(value,key=''){
    if(value===null||value===undefined)return value;

    if(typeof value==='string'){
      if(/^data:/i.test(value)||/^blob:/i.test(value))return '';
      if(IMAGE_KEYS.test(key))return '';
      return value;
    }
    if(typeof value==='number'||typeof value==='boolean')return value;

    if(Array.isArray(value)){
      if(IMAGE_ARRAY_KEYS.test(key))return value.map(()=>'');
      return value.map(v=>clean(v,key));
    }

    if(typeof value==='object'){
      const out={};
      for(const [k,v] of Object.entries(value)){
        if(IMAGE_KEYS.test(k)){out[k]='';continue}
        if(IMAGE_ARRAY_KEYS.test(k)){out[k]=Array.isArray(v)?v.map(()=>''):[];continue}
        out[k]=clean(v,k);
      }
      return out;
    }
    return undefined;
  }

  return clean(state);
}

function serializeState(){
  return JSON.stringify({
    version:3,
    textAndSettingsOnly:true,
    imagesExcluded:true,
    savedAt:new Date().toISOString(),
    data:storageState()
  });
}

function restoreStateObject(saved){
  if(!saved||!saved.data)return false;
  const incoming=saved.data;
  if(!incoming.commonProfile){
    incoming.commonProfile={
      name:incoming.name||incoming.profiles?.x?.name||'Dearlog',
      handle:incoming.handle||incoming.profiles?.x?.handle||'dearlog',
      avatar:incoming.avatar||incoming.profiles?.x?.avatar||DEFAULT_AVATAR()
    };
  }

  // Replace top-level values while preserving the same state object reference.
  Object.keys(state).forEach(k=>delete state[k]);
  Object.assign(state,incoming);
  syncCommonProfileToState();

  // compatibility defaults for older/missing values
  state.template=state.template||'x';
  state.brandSymbol=state.brandSymbol??'✦';
  state.selected=null;
  state.igTiles=Array.isArray(state.igTiles)?state.igTiles:Array(9).fill('');
  state.igVideos=Array.isArray(state.igVideos)?state.igVideos:Array(state.igTiles.length).fill(false);
  state.igScales=Array.isArray(state.igScales)?state.igScales:Array(state.igTiles.length).fill(1);
  state.igXs=Array.isArray(state.igXs)?state.igXs:Array(state.igTiles.length).fill(0);
  state.igYs=Array.isArray(state.igYs)?state.igYs:Array(state.igTiles.length).fill(0);
  state.xPosts=Array.isArray(state.xPosts)?state.xPosts:[];
  state.dm=Array.isArray(state.dm)?state.dm:[];
  state.kakao=Array.isArray(state.kakao)?state.kakao:[];
  state.backgrounds=state.backgrounds||{
    x:{color:'#f5f4f1',image:'',scale:100},
    instagram:{color:'#f5f4f1',image:'',scale:100},
    dm:{color:'#f5f4f1',image:'',scale:100},
    kakao:{color:'#f5f4f1',image:'',scale:100}
  };

  loadTemplateProfile();
  $('#brandSymbolSelect').value=state.brandSymbol||'';
  $('#mainColor').value=state.main||'#5d5a55';
  $('#bgColor').value=state.bg||'#f5f4f1';
  $('#cardColor').value=state.card||'#ffffff';
  $('#accentColor').value=state.accent||'#5d5a55';
  $('#autoPaletteToggle').checked=!!state.autoPalette;
  $('#darkToggle').checked=!!state.dark;
  $('#chatBgColor').value=state.chatBg||'#dfe8ef';
  syncTemplateBackgroundControls();

  $$('.template-card').forEach(b=>b.classList.toggle('active',b.dataset.template===state.template));

  render();
  updateSlotUI();
  requestAnimationFrame(()=>requestAnimationFrame(fitCaptureToStage));
  return true;
}


function slotNameKey(n){return SLOT_NAME_PREFIX+n}
function getSlotName(n){
  try{return localStorage.getItem(slotNameKey(n))||`슬롯 ${n}`}
  catch{return `슬롯 ${n}`}
}
function saveSlotName(n,name){
  const clean=(name||'').trim()||`슬롯 ${n}`;
  try{localStorage.setItem(slotNameKey(n),clean)}catch{}
  return clean;
}

function slotKey(n){return SLOT_PREFIX+n}

function readSlot(n){
  try{
    const raw=localStorage.getItem(slotKey(n));
    return raw?JSON.parse(raw):null;
  }catch(err){
    console.error(err);
    return null;
  }
}

function formatSlotTime(iso){
  if(!iso)return '저장됨';
  try{
    const d=new Date(iso);
    return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }catch{
    return '저장됨';
  }
}

function updateSlotUI(){
  $$('.slot-row').forEach(row=>{
    const n=row.dataset.slot;
    const saved=readSlot(n);
    const status=$('.slot-status',row);
    const load=$('.slot-load',row);
    const del=$('.slot-delete',row);
    const nameInput=$('.slot-name-input',row);
    if(nameInput && document.activeElement!==nameInput)nameInput.value=getSlotName(n);
    if(saved){
      status.textContent=formatSlotTime(saved.savedAt);
      load.disabled=false;
      del.disabled=false;
    }else{
      status.textContent='비어 있음';
      load.disabled=true;
      del.disabled=true;
    }
  });
}

function saveToSlot(n){
  try{
    localStorage.setItem(slotKey(n),serializeState());
    updateSlotUI();
    return true;
  }catch(err){
    console.error(err);
    alert('슬롯 저장 공간이 부족해 저장하지 못했어요. v50부터 이미지는 저장하지 않고 텍스트와 설정만 저장합니다. 오래된 슬롯을 삭제한 뒤 다시 시도해 주세요.');
    return false;
  }
}

function loadFromSlot(n){
  const saved=readSlot(n);
  if(!saved)return;
  if(!confirm(`“${getSlotName(n)}”의 내용을 불러올까요?\n현재 편집 중인 내용은 덮어씌워집니다.`))return;
  restoreStateObject(saved);
}

function deleteSlot(n){
  if(!readSlot(n))return;
  if(!confirm(`“${getSlotName(n)}”의 저장 내용을 삭제할까요?`))return;
  localStorage.removeItem(slotKey(n));
  updateSlotUI();
}

$$('.slot-row').forEach(row=>{
  const n=row.dataset.slot;
  $('.slot-save',row).addEventListener('click',()=>{
    const existing=readSlot(n);
    if(existing&&!confirm(`“${getSlotName(n)}”에 이미 저장된 내용이 있어요.\n덮어쓸까요?`))return;
    saveToSlot(n);
  });
  $('.slot-load',row).addEventListener('click',()=>loadFromSlot(n));
  $('.slot-delete',row).addEventListener('click',()=>deleteSlot(n));
});


const AUTOSAVE_KEY='dearlog-autosave-v1';
let autosaveTimer=null;
let autosaveBusy=false;

function openSlotModal(){
  updateSlotUI();
  updateAutosaveStatus();
  $('#slotBackdrop').hidden=false;
}
function closeSlotModal(){
  $('#slotBackdrop').hidden=true;
}
function readAutosave(){
  try{
    const raw=localStorage.getItem(AUTOSAVE_KEY);
    return raw?JSON.parse(raw):null;
  }catch(err){console.error(err);return null}
}
function updateAutosaveStatus(saved=null){
  const el=$('#autosaveStatus');
  if(!el)return;
  const data=saved||readAutosave();
  el.textContent=data?.savedAt?`마지막 저장 ${formatSlotTime(data.savedAt)}`:'아직 자동 저장된 작업이 없어요.';
}

function migrateStorageV50(){
  const key='dearlog-v50-storage-migrated';
  try{
    if(localStorage.getItem(key))return;
    const raw=localStorage.getItem(AUTOSAVE_KEY);
    if(raw && /data:image|data:video|blob:/i.test(raw))localStorage.removeItem(AUTOSAVE_KEY);
    localStorage.setItem(key,'1');
  }catch{}
}

function performAutosave(){
  if(autosaveBusy)return;
  autosaveBusy=true;
  try{
    const payload=JSON.parse(serializeState());
    localStorage.setItem(AUTOSAVE_KEY,JSON.stringify(payload));
    updateAutosaveStatus(payload);
  }catch(err){
    console.error('autosave failed',err);
    if($('#autosaveStatus'))$('#autosaveStatus').textContent='자동 저장 공간이 부족해요.';
  }finally{autosaveBusy=false}
}
function queueAutosave(delay=900){
  clearTimeout(autosaveTimer);
  autosaveTimer=setTimeout(performAutosave,delay);
}
function restoreAutosaveOnStartup(){
  const saved=readAutosave();
  if(!saved?.data)return false;
  try{return restoreStateObject(saved)}
  catch(err){console.error('autosave restore failed',err);return false}
}

$('#slotOpenBtn')?.addEventListener('click',openSlotModal);
$('#slotCloseBtn')?.addEventListener('click',closeSlotModal);
$('#slotBackdrop')?.addEventListener('click',e=>{if(e.target===$('#slotBackdrop'))closeSlotModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#slotBackdrop')?.hidden)closeSlotModal()});

document.addEventListener('input',e=>{if(!e.target.closest('.slot-modal'))queueAutosave()},true);
document.addEventListener('change',e=>{if(!e.target.closest('.slot-modal'))queueAutosave()},true);
document.addEventListener('click',e=>{
  if(e.target.closest('.slot-modal,.utility-dock'))return;
  if(e.target.closest('button,.template-card,.x-post,.bubble-row,.kakao-message,.typing-row'))queueAutosave(500);
},true);
window.addEventListener('beforeunload',performAutosave);
capture.addEventListener('pointerup',()=>queueAutosave(250),true);
capture.addEventListener('wheel',()=>queueAutosave(400),{passive:true,capture:true});

applyRecommendedPalette();
const restoredAutosave=restoreAutosaveOnStartup();
if(!restoredAutosave){
  loadTemplateProfile();
  $('#sidebarAvatarPreview').src=(state.template==='x'||state.template==='instagram')?state.avatar:state.theirAvatar;
  $('#brandSymbolSelect').value=state.brandSymbol;
  syncTemplateBackgroundControls();
  render();
}
updateSlotUI();
updateAutosaveStatus();
if(!readAutosave())queueAutosave(1200);
if(window.DEARLOG_NOTICE?.enabled && !sessionStorage.getItem(noticeSessionKey())) openNotice();

try{migrateStorageV50()}catch{}
