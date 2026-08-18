const qs = (s, p=document) => p.querySelector(s);
const qsa = (s, p=document) => [...p.querySelectorAll(s)];

const captureArea = qs('#captureArea');
const feed = qs('#feed');
const template = qs('#postTemplate');

const DEFAULT_AVATAR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" rx="150" fill="#fff0f5"/>
  <circle cx="150" cy="120" r="58" fill="#ef9fba"/>
  <path d="M55 282c9-65 44-99 95-99s86 34 95 99" fill="#ef9fba"/>
  <circle cx="128" cy="115" r="5" fill="#fff"/>
  <circle cx="172" cy="115" r="5" fill="#fff"/>
  <path d="M132 145c12 8 24 8 36 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>`)}`
let avatarData = DEFAULT_AVATAR;

function updateAvatar(src = avatarData){
  avatarData = src;
  qs('#avatarPreview').src = src;
  qsa('.sync-avatar').forEach(img => img.src = src);
}

function syncName(value){
  qs('#profileName').textContent = value;
  qsa('.sync-name').forEach(el => el.textContent = value);
}
function syncHandle(value){
  const clean = value.replace(/^@+/, '');
  qs('#profileHandle').textContent = clean;
  qsa('.sync-handle').forEach(el => el.textContent = clean);
}

function readImage(file, cb){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

function bindMediaInputs(scope=document){
  qsa('.post-image-input', scope).forEach(input => {
    if(input.dataset.bound) return;
    input.dataset.bound = '1';
    input.addEventListener('change', e => {
      readImage(e.target.files[0], src => {
        const box = e.target.closest('.media-box');
        const img = qs('.post-image', box);
        const ph = qs('.media-placeholder', box);
        img.src = src;
        img.hidden = false;
        ph.style.display = 'none';
      });
    });
  });
}

function bindSyncEditables(){
  qsa('.sync-name').forEach(el => {
    if(el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('input', () => {
      qs('#nameInput').value = el.textContent.trim();
      qsa('.sync-name').forEach(other => { if(other !== el) other.textContent = el.textContent; });
      qs('#profileName').textContent = el.textContent;
    });
  });
  qsa('.sync-handle').forEach(el => {
    if(el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('input', () => {
      const v = el.textContent.trim().replace(/^@+/, '');
      qs('#handleInput').value = v;
      qsa('.sync-handle').forEach(other => { if(other !== el) other.textContent = v; });
      qs('#profileHandle').textContent = v;
    });
  });
}

qs('#nameInput').addEventListener('input', e => syncName(e.target.value || 'Dearlog'));
qs('#handleInput').addEventListener('input', e => syncHandle(e.target.value || 'dearlog'));

qs('#profileName').addEventListener('input', e => {
  const v = e.target.textContent.trim();
  qs('#nameInput').value = v;
  qsa('.sync-name').forEach(el => el.textContent = v);
});
qs('#profileHandle').addEventListener('input', e => {
  const v = e.target.textContent.trim().replace(/^@+/, '');
  qs('#handleInput').value = v;
  qsa('.sync-handle').forEach(el => el.textContent = v);
});

qs('#avatarInput').addEventListener('change', e => readImage(e.target.files[0], updateAvatar));
qs('#avatarOverlay').addEventListener('click', () => qs('#hiddenAvatarInput').click());
qs('#hiddenAvatarInput').addEventListener('change', e => readImage(e.target.files[0], updateAvatar));

qs('#bgColor').addEventListener('input', e => captureArea.style.setProperty('--local-bg', e.target.value));
qs('#cardColor').addEventListener('input', e => captureArea.style.setProperty('--local-card', e.target.value));
qs('#accentColor').addEventListener('input', e => {
  document.documentElement.style.setProperty('--accent', e.target.value);
  document.documentElement.style.setProperty('--accent-soft', hexToSoft(e.target.value));
});
qs('#darkToggle').addEventListener('change', e => document.body.classList.toggle('dark', e.target.checked));

function hexToSoft(hex){
  const h = hex.replace('#','');
  if(h.length !== 6) return '#fff0f5';
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},.14)`;
}

qs('#addPostBtn').addEventListener('click', () => {
  const node = template.content.cloneNode(true);
  feed.appendChild(node);
  const newest = feed.lastElementChild;
  qs('.sync-avatar', newest).src = avatarData;
  qs('.sync-name', newest).textContent = qs('#nameInput').value || 'Dearlog';
  qs('.sync-handle', newest).textContent = qs('#handleInput').value || 'dearlog';
  bindMediaInputs(newest);
  bindSyncEditables();
  newest.scrollIntoView({behavior:'smooth', block:'center'});
});

qs('#removePostBtn').addEventListener('click', () => {
  if(feed.children.length <= 1){
    alert('게시물은 최소 1개가 필요해요.');
    return;
  }
  feed.lastElementChild.remove();
});

qsa('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    qsa('.tab').forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
  });
});

qs('#resetBtn').addEventListener('click', () => {
  if(!confirm('현재 편집 내용을 초기화할까요?')) return;
  location.reload();
});

qs('#saveBtn').addEventListener('click', async () => {
  const btn = qs('#saveBtn');
  const prev = btn.textContent;
  btn.textContent = '저장 중…';
  btn.disabled = true;

  qsa('[contenteditable="true"]').forEach(el => el.blur());

  try{
    const canvas = await html2canvas(captureArea, {
      scale: Math.min(3, window.devicePixelRatio || 2),
      backgroundColor: null,
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    link.download = `dearlog-${stamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }catch(err){
    console.error(err);
    alert('이미지 저장에 실패했어요. 외부 이미지 대신 직접 업로드한 이미지를 사용해 주세요.');
  }finally{
    btn.textContent = prev;
    btn.disabled = false;
  }
});

updateAvatar();
bindMediaInputs();
bindSyncEditables();
