// Atmospheric 3D sits behind the poster. All essential content is ordinary HTML.
const heroArt = document.querySelector('.hero-art');
const canvas = document.querySelector('#hero-webgl');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (heroArt && canvas && !reduceMotion.matches && 'WebGL2RenderingContext' in window) {
  import('https://cdn.jsdelivr.net/npm/three@0.186.1/+esm').then(THREE => {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 8;
    const group = new THREE.Group();
    scene.add(group);

    // Three open, gently turning arcs echo the rings of a Bollywood party poster.
    const arcs = [
      [0xffdd53, 3.25, 0.012, -0.22, -0.18, 0.1],
      [0xffffff, 2.75, 0.009, 0.28, 0.3, -0.25],
      [0xf34b89, 3.6, 0.015, -0.43, 0.45, 0.42],
    ];
    const meshes = arcs.map(([color, radius, tube, rx, ry, rz], index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 4, 128, Math.PI * (1.15 + index * 0.15)),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: index === 1 ? 0.65 : 0.8 })
      );
      mesh.rotation.set(rx, ry, rz);
      group.add(mesh);
      return mesh;
    });

    const count = 72;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color('#ffdd53'), new THREE.Color('#ffffff'), new THREE.Color('#e74c91')];
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399963229728653;
      const radius = 1.15 + Math.sqrt(i / count) * 3.9;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = -1.5 + (i % 9) * 0.12;
      const color = palette[i % palette.length];
      colors.set(color.toArray(), i * 3);
    }
    const particles = new THREE.BufferGeometry();
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(particles, new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true }));
    group.add(stars);

    function resize() {
      const { width, height } = heroArt.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(heroArt);
    heroArt.classList.add('has-webgl');

    let visible = true;
    let frame = 0;
    let last = 0;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) requestFrame(); });
    observer.observe(heroArt);
    function requestFrame() { if (!frame && visible && !document.hidden && !reduceMotion.matches) frame = requestAnimationFrame(tick); }
    function tick(now) {
      frame = 0;
      if (!visible || document.hidden || reduceMotion.matches) return;
      if (now - last >= 33) {
        const t = now * 0.0001;
        group.rotation.z = Math.sin(t) * 0.035;
        meshes[0].rotation.z = 0.1 + t * 0.14;
        meshes[1].rotation.z = -0.25 - t * 0.1;
        meshes[2].rotation.z = 0.42 + t * 0.08;
        stars.rotation.z = -t * 0.16;
        renderer.render(scene, camera);
        last = now;
      }
      requestFrame();
    }
    document.addEventListener('visibilitychange', requestFrame);
    reduceMotion.addEventListener('change', event => {
      if (event.matches) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        heroArt.classList.remove('has-webgl');
      } else {
        heroArt.classList.add('has-webgl');
        requestFrame();
      }
    });
    requestFrame();
  }).catch(error => console.warn('3D hero unavailable; static poster remains visible.', error));
}

