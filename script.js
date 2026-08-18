const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>[...p.querySelectorAll(s)];

const state = {
  template:'x',
  name:'Dearlog',
  handle:'dearlog',
  avatar:'',
  bg:'#f5f7fb',
  card:'#ffffff',
  accent:'#7896c6',
  dark:false,
  xPosts:[
    {body:'오늘의 작은 이야기를 이곳에 적어보세요. ✦',time:'2m',likes:'128',replies:'24',image:''},
    {body:'무언가를 기록한다는 건, 사라지기 전에 한 번 더 바라보는 일 같아.',time:'1h',likes:'86',replies:'11',image:''}
  ],
  igTiles:['','','','','',''],
  dm:[
    {side:'theirs',text:'오늘 기록은 다 했어?',time:'11:42'},
    {side:'mine',text:'응. 마지막 한 줄만 남았어.',time:'11:43'},
    {side:'theirs',text:'그럼 다 쓰고 보여줘 ☺',time:'11:43'}
  ]
};

const DEFAULT_AVATAR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
<rect width="300" height="300" rx="150" fill="#edf3fc"/>
<circle cx="150" cy="119" r="58" fill="#7896c6"/>
<path d="M52 290c10-72 47-108 98-108s88 36 98 108" fill="#7896c6"/>
<circle cx="128" cy="115" r="5" fill="white"/><circle cx="172" cy="115" r="5" fill="white"/>
<path d="M134 145c10 7 22 7 32 0" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>`)}`
state.avatar = DEFAULT_AVATAR;

const capture = $('#captureArea');

function esc(s=''){
  return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function safeHandle(s=''){
  return String(s).replace(/^@+/,'').trim() || 'dearlog';
}
function syncVars(){
  capture.style.setProperty('--preview-bg',state.bg);
  capture.style.setProperty('--preview-card',state.card);
  capture.style.setProperty('--preview-accent',state.accent);
  capture.classList.toggle('dark',state.dark);
}
function fileToData(file,cb){
  if(!file)return;
  const r=new FileReader();
  r.onload=()=>cb(r.result);
  r.readAsDataURL(file);
}

function sharedTop(title='Dearlog'){
  return `<div class="preview-top">
    <div class="preview-brand"><i>✦</i><span>${title}</span></div>
    <button class="preview-icon-btn" type="button">•••</button>
  </div>`;
}

function xPost(post,i){
  return `<article class="x-post" data-index="${i}">
    <div class="x-post-header">
      <div class="x-user">
        <img class="avatar sync-avatar" src="${state.avatar}" alt="">
        <div>
          <div class="x-user-name editable sync-name" contenteditable="true">${esc(state.name)}</div>
          <div class="x-meta">@<span class="editable sync-handle" contenteditable="true">${esc(state.handle)}</span> · <span class="editable x-time" contenteditable="true">${esc(post.time)}</span></div>
        </div>
      </div>
      <span class="x-meta">•••</span>
    </div>
    <div class="x-body editable x-body-edit" contenteditable="true">${esc(post.body)}</div>
    <label class="x-media image-picker">
      <input type="file" accept="image/*" class="x-image-input">
      ${post.image ? `<img src="${post.image}" alt="">` : `<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
    </label>
    <div class="x-actions">
      <span>♡ <b class="editable x-likes" contenteditable="true">${esc(post.likes)}</b></span>
      <span>◌ <b class="editable x-replies" contenteditable="true">${esc(post.replies)}</b></span>
      <span>↗</span><span>⌑</span>
    </div>
  </article>`;
}
function renderX(){
  $('#stageTitle').textContent='X형 템플릿';
  $('#stageDesc').textContent='게시물과 답글 느낌의 화면을 만들어보세요.';
  capture.innerHTML=`<div class="x-page">
    ${sharedTop('Dearlog')}
    <section class="x-compose">
      <img class="avatar sync-avatar" src="${state.avatar}" alt="">
      <div class="x-compose-main">
        <div class="x-compose-text editable" contenteditable="true">무슨 일이 일어나고 있나요?</div>
        <div class="x-compose-bottom"><span class="x-compose-tools">⊞ ◇ ♡</span><button class="x-post-btn">게시</button></div>
      </div>
    </section>
    <div id="xFeed">${state.xPosts.map(xPost).join('')}</div>
  </div>`;
}

function renderInstagram(){
  $('#stageTitle').textContent='Instagram형 템플릿';
  $('#stageDesc').textContent='프로필과 사진 피드를 만들어보세요.';
  capture.innerHTML=`<div class="ig-page">
    ${sharedTop('Dearlog')}
    <section class="ig-profile">
      <label class="image-picker">
        <input type="file" accept="image/*" class="avatar-local-input">
        <img class="avatar sync-avatar" src="${state.avatar}" alt="">
      </label>
      <div>
        <div class="ig-name-row">
          <span class="ig-handle editable sync-handle" contenteditable="true">${esc(state.handle)}</span>
          <button class="ig-follow editable" contenteditable="true">팔로우</button>
        </div>
        <div class="ig-counts">
          <span>게시물 <b class="editable" contenteditable="true">${state.igTiles.length}</b></span>
          <span>팔로워 <b class="editable" contenteditable="true">1.2K</b></span>
          <span>팔로잉 <b class="editable" contenteditable="true">87</b></span>
        </div>
        <div class="ig-bio"><b class="editable sync-name" contenteditable="true">${esc(state.name)}</b><br>
        <span class="editable" contenteditable="true">좋아하는 순간들을 작은 기록으로 남겨요.</span></div>
      </div>
    </section>
    <div class="ig-tabs"><span>▦</span><span>▣</span><span>♙</span></div>
    <div class="ig-grid">
      ${state.igTiles.map((src,i)=>`<label class="ig-tile image-picker" data-index="${i}">
        <input type="file" accept="image/*" class="ig-image-input">
        ${src?`<img src="${src}" alt="">`:`<div class="image-placeholder"><b>＋</b><span>사진 추가</span></div>`}
      </label>`).join('')}
    </div>
  </div>`;
}

function dmBubble(m,i){
  return `<div class="bubble-row ${m.side}" data-index="${i}">
    ${m.side==='theirs'?`<img class="avatar sync-avatar" src="${state.avatar}" alt="">`:''}
    <div class="bubble editable dm-text" contenteditable="true">${esc(m.text)}</div>
    <div class="dm-time editable" contenteditable="true">${esc(m.time)}</div>
  </div>`;
}
function renderDM(){
  $('#stageTitle').textContent='DM형 템플릿';
  $('#stageDesc').textContent='메신저처럼 대화 장면을 만들어보세요.';
  capture.innerHTML=`<div class="dm-page">
    <header class="dm-head">
      <div class="dm-user">
        <label class="image-picker">
          <input type="file" accept="image/*" class="avatar-local-input">
          <img class="avatar sync-avatar" src="${state.avatar}" alt="">
        </label>
        <div><div class="dm-name editable sync-name" contenteditable="true">${esc(state.name)}</div>
        <div class="dm-status">@<span class="editable sync-handle" contenteditable="true">${esc(state.handle)}</span> · 온라인</div></div>
      </div>
      <span>☎　ⓘ</span>
    </header>
    <main class="dm-body">
      <div class="dm-day editable" contenteditable="true">오늘</div>
      ${state.dm.map(dmBubble).join('')}
    </main>
    <footer class="dm-compose">
      <span>＋</span><div class="dm-input editable" contenteditable="true">메시지 입력...</div><button class="dm-send">보내기</button>
    </footer>
  </div>`;
}

function render(){
  if(state.template==='x')renderX();
  else if(state.template==='instagram')renderInstagram();
  else renderDM();
  syncVars();
  bindPreview();
}

function bindPreview(){
  $$('.sync-name',capture).forEach(el=>{
    el.addEventListener('input',()=>{
      state.name=el.textContent.trim()||'Dearlog';
      $('#nameInput').value=state.name;
      $$('.sync-name',capture).forEach(o=>{if(o!==el)o.textContent=state.name});
    });
  });
  $$('.sync-handle',capture).forEach(el=>{
    el.addEventListener('input',()=>{
      state.handle=safeHandle(el.textContent);
      $('#handleInput').value=state.handle;
      $$('.sync-handle',capture).forEach(o=>{if(o!==el)o.textContent=state.handle});
    });
  });
  $$('.avatar-local-input',capture).forEach(inp=>{
    inp.addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.avatar=src; render();}));
  });

  if(state.template==='x'){
    $$('.x-post',capture).forEach(card=>{
      const i=+card.dataset.index;
      $('.x-body-edit',card).addEventListener('input',e=>state.xPosts[i].body=e.target.textContent);
      $('.x-time',card).addEventListener('input',e=>state.xPosts[i].time=e.target.textContent);
      $('.x-likes',card).addEventListener('input',e=>state.xPosts[i].likes=e.target.textContent);
      $('.x-replies',card).addEventListener('input',e=>state.xPosts[i].replies=e.target.textContent);
      $('.x-image-input',card).addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.xPosts[i].image=src; render();}));
    });
  }
  if(state.template==='instagram'){
    $$('.ig-tile',capture).forEach(tile=>{
      const i=+tile.dataset.index;
      $('.ig-image-input',tile).addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.igTiles[i]=src; render();}));
    });
  }
  if(state.template==='dm'){
    $$('.bubble-row',capture).forEach(row=>{
      const i=+row.dataset.index;
      $('.dm-text',row).addEventListener('input',e=>state.dm[i].text=e.target.textContent);
      $('.dm-time',row).addEventListener('input',e=>state.dm[i].time=e.target.textContent);
    });
  }
}

$$('.template-card').forEach(btn=>btn.addEventListener('click',()=>{
  state.template=btn.dataset.template;
  $$('.template-card').forEach(b=>b.classList.toggle('active',b===btn));
  render();
}));

$('#nameInput').addEventListener('input',e=>{state.name=e.target.value||'Dearlog';render()});
$('#handleInput').addEventListener('input',e=>{state.handle=safeHandle(e.target.value);render()});
$('#avatarInput').addEventListener('change',e=>fileToData(e.target.files[0],src=>{state.avatar=src;render()}));
$('#bgColor').addEventListener('input',e=>{state.bg=e.target.value;syncVars()});
$('#cardColor').addEventListener('input',e=>{state.card=e.target.value;syncVars()});
$('#accentColor').addEventListener('input',e=>{state.accent=e.target.value;syncVars()});
$('#darkToggle').addEventListener('change',e=>{state.dark=e.target.checked;syncVars()});

$('#addItemBtn').addEventListener('click',()=>{
  if(state.template==='x'){
    state.xPosts.push({body:'새 게시물 내용을 입력하세요.',time:'now',likes:'0',replies:'0',image:''});
  }else if(state.template==='instagram'){
    state.igTiles.push('');
  }else{
    const side=state.dm.length%2===0?'theirs':'mine';
    state.dm.push({side,text:'새 메시지를 입력하세요.',time:'now'});
  }
  render();
  requestAnimationFrame(()=>capture.lastElementChild?.scrollIntoView?.({behavior:'smooth',block:'end'}));
});
$('#removeItemBtn').addEventListener('click',()=>{
  if(state.template==='x'){
    if(state.xPosts.length<=1)return alert('게시물은 최소 1개가 필요해요.');
    state.xPosts.pop();
  }else if(state.template==='instagram'){
    if(state.igTiles.length<=1)return alert('사진 칸은 최소 1개가 필요해요.');
    state.igTiles.pop();
  }else{
    if(state.dm.length<=1)return alert('메시지는 최소 1개가 필요해요.');
    state.dm.pop();
  }
  render();
});

$('#resetBtn').addEventListener('click',()=>{if(confirm('편집 내용을 모두 초기화할까요?'))location.reload()});

$('#exportBtn').addEventListener('click',async()=>{
  const btn=$('#exportBtn'), old=btn.textContent;
  btn.disabled=true;btn.textContent='저장 중…';
  $$('[contenteditable=true]',capture).forEach(e=>e.blur());
  try{
    const canvas=await html2canvas(capture,{
      scale:Math.min(3,window.devicePixelRatio||2),
      backgroundColor:null,useCORS:true,logging:false
    });
    const a=document.createElement('a');
    const d=new Date();
    const stamp=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    a.download=`dearlog-${state.template}-${stamp}.png`;
    a.href=canvas.toDataURL('image/png');
    a.click();
  }catch(err){
    console.error(err);
    alert('PNG 저장에 실패했어요. 직접 업로드한 이미지를 사용했는지 확인해 주세요.');
  }finally{
    btn.disabled=false;btn.textContent=old;
  }
});

render();
