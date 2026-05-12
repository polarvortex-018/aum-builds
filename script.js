// ── CURSOR ──────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursor.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
  ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;
  requestAnimationFrame(animCursor);
})();

// ── SCROLL REVEAL ────────────────────────────────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── NAV SCROLL TINT ──────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').style.background =
    window.scrollY > 60 ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.88)';
});

// ── MOBILE MENU ──────────────────────────────────────────────────────
document.getElementById('nav-hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('mobile-menu-close').addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMobileMenu));
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
}

// ── MODAL ────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('project-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('project-modal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('nav-cta-btn').addEventListener('click', openModal);
document.getElementById('hero-cta-btn').addEventListener('click', openModal);
document.getElementById('cta-start-btn').addEventListener('click', openModal);
document.getElementById('mobile-cta-btn').addEventListener('click', () => { closeMobileMenu(); openModal(); });
document.getElementById('footer-cta-link').addEventListener('click', e => { e.preventDefault(); openModal(); });
document.getElementById('modal-close-btn').addEventListener('click', closeModal);
document.getElementById('project-modal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });

document.getElementById('form-submit-btn').addEventListener('click', async function () {
  const FORMSPREE_ID = 'mrejjeqq'; // https://formspree.io/f/mrejjeqq

  const name     = document.getElementById('f-name').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const phone    = document.getElementById('f-phone').value.trim();
  const type     = document.getElementById('f-type').value;
  const family   = document.getElementById('f-family').value;
  const budget   = document.getElementById('f-budget').value;
  const sustain  = document.getElementById('f-sustain').value;
  const req      = document.getElementById('f-req').value.trim();
  const location = document.getElementById('f-location').value.trim();

  // Basic validation
  if (!name || !email) {
    alert('Please fill in at least your name and email.');
    return;
  }

  const btn = document.getElementById('form-submit-btn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, phone, type, family, budget, sustain, requirements: req, location })
    });

    if (res.ok) {
      document.getElementById('form-body').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
      setTimeout(closeModal, 3500);
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    btn.textContent = 'Send Project Brief →';
    btn.disabled = false;
    alert('Something went wrong. Please email us directly at hello@aumbuilds.in');
  }
});

// ── SERVICE CARD OVERLAYS ─────────────────────────────────────────────
function openOverlay(id) {
  document.getElementById('overlay-' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeOverlay(id) {
  document.getElementById('overlay-' + id).classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('card-site').addEventListener('click', () => openOverlay('site'));
document.getElementById('card-gen').addEventListener('click', () => openOverlay('generative'));
document.getElementById('card-material').addEventListener('click', () => openOverlay('material'));
document.getElementById('close-site').addEventListener('click', () => closeOverlay('site'));
document.getElementById('close-generative').addEventListener('click', () => closeOverlay('generative'));
document.getElementById('close-material').addEventListener('click', () => closeOverlay('material'));
document.querySelectorAll('.overlay').forEach(ov => {
  ov.addEventListener('click', function(e) { if (e.target === this) { this.classList.remove('open'); document.body.style.overflow = ''; } });
});

// ── HERO THREE.JS SCENE ───────────────────────────────────────────────
(function heroScene() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0xffffff, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 500);
  camera.position.set(0, 12, 36);
  camera.lookAt(0, 4, 0);

  scene.add(new THREE.AmbientLight(0xddeeff, 0.6));
  const sun = new THREE.DirectionalLight(0xfff5e0, 1.2); sun.position.set(20, 30, 15); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xaaccff, 0.4); fill.position.set(-15, 10, -5); scene.add(fill);

  const mMat = (c, op) => new THREE.MeshPhongMaterial({ color: c, transparent: true, opacity: op, side: THREE.DoubleSide });
  const lMat = (c, op) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: op });

  const group = new THREE.Group(); scene.add(group);

  // Ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshBasicMaterial({ color: 0xEAF0FF, transparent: true, opacity: 0.5 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; scene.add(ground);

  // Grid
  const gridMat = new THREE.LineBasicMaterial({ color: 0x1A6BFF, transparent: true, opacity: 0.07 });
  for (let i = -20; i <= 20; i += 4) {
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-20, 0, i), new THREE.Vector3(20, 0, i)]), gridMat));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i, 0, -20), new THREE.Vector3(i, 0, 20)]), gridMat));
  }

  function addBox(x, y, z, w, h, d, col, op) {
    const g = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(g, mMat(col, op)); mesh.position.set(x, y + h / 2, z); group.add(mesh);
    const wf = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x1A6BFF, wireframe: true, transparent: true, opacity: 0.15 }));
    wf.position.copy(mesh.position); group.add(wf);
  }

  // Walls
  addBox(0, 0, 0, 14, 0.5, 12, 0xD4E6FF, 0.9);
  addBox(-6.75, 0, 0, 0.5, 4.5, 12, 0xD8E8FF, 0.85);
  addBox(6.75, 0, 0, 0.5, 4.5, 12, 0xD8E8FF, 0.85);
  addBox(0, 0, -6.25, 14, 4.5, 0.5, 0xD8E8FF, 0.85);
  addBox(0, 0, 6.25, 14, 4.5, 0.5, 0xD8E8FF, 0.85);
  addBox(0, 0, 6.3, 2.5, 3, 0.1, 0xA0C0FF, 0.4);

  // Roof
  const roofL = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-7,4.5,-6.5), new THREE.Vector3(0,7,-6.5), new THREE.Vector3(0,7,6.5),
    new THREE.Vector3(-7,4.5,-6.5), new THREE.Vector3(0,7,6.5), new THREE.Vector3(-7,4.5,6.5)
  ]);
  const roofR = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(7,4.5,-6.5), new THREE.Vector3(0,7,-6.5), new THREE.Vector3(0,7,6.5),
    new THREE.Vector3(7,4.5,-6.5), new THREE.Vector3(0,7,6.5), new THREE.Vector3(7,4.5,6.5)
  ]);
  group.add(new THREE.Mesh(roofL, mMat(0x1A6BFF, 0.5)));
  group.add(new THREE.Mesh(roofR, mMat(0x1A6BFF, 0.5)));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,7,-6.5), new THREE.Vector3(0,7,6.5)]), lMat(0x1A6BFF, 0.8)));

  // Veranda
  for (const x of [-5, -1.5, 1.5, 5]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 4.5, 8), mMat(0xC0D8FF, 0.9));
    col.position.set(x, 2.25, 7.5); group.add(col);
  }
  addBox(0, 0, 7.5, 14, 0.3, 0.3, 0xA0C0EE, 0.9);

  // Trees
  function tree(x, z) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.5, 6), mMat(0xC8B89A, 0.9));
    trunk.position.set(x, 0.75, z); group.add(trunk);
    for (let i = 0; i < 3; i++) {
      const layer = new THREE.Mesh(new THREE.ConeGeometry(1.2 - i * 0.2, 1.8, 7), mMat(0x3D8EFF, 0.25 + i * 0.05));
      layer.position.set(x, 2.5 + i * 1.2, z); group.add(layer);
    }
  }
  tree(-10, 8); tree(10, 8); tree(-12, -2); tree(12, -2); tree(-9, -8); tree(9, -8);

  // Sun arc
  const sunPts = [];
  for (let i = 0; i <= 60; i++) { const a = (i / 60) * Math.PI; sunPts.push(new THREE.Vector3(Math.cos(a) * 18 - 4, Math.sin(a) * 14 + 2, -5)); }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(sunPts), lMat(0xFFCC33, 0.5)));
  const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFCC33 }));
  scene.add(sunSphere);

  // Particles
  const pp = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) { pp[i*3] = (Math.random()-.5)*60; pp[i*3+1] = Math.random()*20; pp[i*3+2] = (Math.random()-.5)*60; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x1A6BFF, size: 0.1, transparent: true, opacity: 0.3 })));

  let t = 0;
  (function anim() {
    requestAnimationFrame(anim); t += 0.005;
    group.rotation.y = Math.sin(t * 0.25) * 0.12;
    const sa = (Math.sin(t * 0.35) * 0.5 + 0.5) * Math.PI;
    sunSphere.position.set(Math.cos(sa) * 18 - 4, Math.sin(sa) * 14 + 2, -5);
    camera.position.x = Math.sin(t * 0.07) * 5;
    camera.lookAt(0, 4, 0);
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

// ── CARD CANVASES ─────────────────────────────────────────────────────
function makeCard(id, type) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x0a0a1e, 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight || 1.6, 0.1, 100);
  camera.position.set(0, 4, 10); camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  let t = Math.random() * 100;

  function resize() {
    if (!canvas.clientWidth) return;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (type === 'site') {
    const geo = new THREE.PlaneGeometry(10, 10, 22, 22);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, (Math.random() - 0.5) * 1.8);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x1A6BFF, wireframe: true, transparent: true, opacity: 0.45 }));
    mesh.rotation.x = -Math.PI / 2.5; scene.add(mesh);
    const sp = [];
    for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI; sp.push(new THREE.Vector3(Math.cos(a) * 5 - 1, Math.sin(a) * 4, 0)); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(sp), new THREE.LineBasicMaterial({ color: 0xFFCC33, transparent: true, opacity: 0.6 })));
    (function a() { requestAnimationFrame(a); t += 0.018; mesh.rotation.z = Math.sin(t * 0.15) * 0.04; resize(); renderer.render(scene, camera); })();
  }

  if (type === 'gen') {
    const boxes = [];
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.2 + Math.random() * 0.8, 1 + Math.random() * 3.5, 1.2 + Math.random() * 0.8),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x1A6BFF : 0x3D8EFF, wireframe: true, transparent: true, opacity: 0.5 }));
      m.position.set((i - 2) * 2.2, 0, 0); m.position.y = m.geometry.parameters.height / 2;
      scene.add(m); boxes.push(m);
    }
    (function a() { requestAnimationFrame(a); t += 0.014; boxes.forEach((b, i) => { b.rotation.y = t * 0.3 + i; b.scale.y = 0.7 + Math.sin(t + i) * 0.4; }); resize(); renderer.render(scene, camera); })();
  }

  if (type === 'material') {
    const colors = [0x1A6BFF, 0x3D8EFF, 0x6EAAFF, 0xA0C0FF, 0xD4E6FF, 0xEAF2FF];
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.08 + i * 0.04, side: THREE.DoubleSide }));
      m.position.y = i * 0.65 - 1.5; m.rotation.x = -0.3; scene.add(m);
      const pts = [new THREE.Vector3(-4, i * 0.65 - 1.5, 0), new THREE.Vector3(4, i * 0.65 - 1.5, 0)];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x1A6BFF, transparent: true, opacity: 0.6 })));
    }
    (function a() { requestAnimationFrame(a); t += 0.01; scene.rotation.y = Math.sin(t * 0.4) * 0.3; resize(); renderer.render(scene, camera); })();
  }
}

makeCard('canvas-site', 'site');
makeCard('canvas-gen', 'gen');
makeCard('canvas-material', 'material');

// ── VIDEO PLACEHOLDER CANVASES ────────────────────────────────────────
['vc1', 'vc2', 'vc3'].forEach((id, idx) => {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x060c1a, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 100);
  camera.position.set(0, 0, 8);
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8 + idx * 0.3, 0.25, 80, 12),
    new THREE.MeshBasicMaterial({ color: 0x1A6BFF, wireframe: true, transparent: true, opacity: 0.4 })
  );
  scene.add(knot); scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  let t = idx * 20;
  const resize = () => { renderer.setSize(canvas.clientWidth || 320, (canvas.clientWidth || 320) * 9 / 16, false); camera.aspect = 16 / 9; camera.updateProjectionMatrix(); };
  (function a() { requestAnimationFrame(a); t += 0.012; knot.rotation.x = t * 0.4; knot.rotation.y = t * 0.6; resize(); renderer.render(scene, camera); })();
});
