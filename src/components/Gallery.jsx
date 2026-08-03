import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const TRAIN_URL = '/train.glb';
const WAGON_URL = '/wagon.glb';

const WAGON_COUNT = 4;
const CONTAINERS_PER_WAGON = 2;
const CONTAINER_COUNT = WAGON_COUNT * CONTAINERS_PER_WAGON;

// Big scene scale
const ENGINE_SIZE = 150;
const WAGON_SIZE = 60.5;
// Gap between engine and first wagon only
const ENGINE_WAGON_GAP = -73;

// Gap between wagons
const WAGON_GAP = 0.5;

const FIRST_WAGON_OFFSET =
  ENGINE_SIZE / 2 + WAGON_SIZE / 2 + ENGINE_WAGON_GAP;

const WAGON_STEP =
  WAGON_SIZE + WAGON_GAP;
const LAST_WAGON_X = -(FIRST_WAGON_OFFSET + (WAGON_COUNT - 1) * WAGON_STEP);
const TRAIN_TRAIL_SPAN = Math.abs(LAST_WAGON_X) + WAGON_SIZE / 2;

// How far off-screen the train starts/ends
const OFFSCREEN_X = 90;

// STOP_X — where the train's centre comes to rest and waits for the signal.
// // Increase this number to make the train stop further FORWARD (right).
// // Decrease it (make it negative) to make the train stop further BACK (left).
const STOP_X = 0;

// GATE_X — matches the SignalPost's x position below, used only to work out
// when each wagon is passing the gate so its message fires at the right
// moment. If you move SignalPost's position, update this to match.
const GATE_X = 14;

const POST_SCALE = 16;
const CAMERA_POST_SCALE = 11;

const SIGNAL_GREEN = { r: 0.13, g: 0.77, b: 0.37 };

const CONTAINER_IDS = [
  'CSQU 305438 3',
  'TEMU 192837 4',
  'MSCU 556210 8',
  'HLXU 778832 1',
  'OOLU 231445 9',
  'MAEU 908172 6',
  'CMAU 447102 9',
  'TCLU 339055 8',
];

/* ==========================================================================
   Random wagon / container ID generator for the detection messages —
   generates a fresh set each time the page loads, instead of a fixed list.
   ========================================================================== */

const CONTAINER_PREFIXES = ['CSQU', 'TEMU', 'MSCU', 'HLXU', 'OOLU', 'MAEU', 'CMAU', 'TCLU', 'FCIU', 'GESU'];

function randomDigits(n) {
  let out = '';
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
  return out;
}

function generateWagonId() {
  return `WG-${randomDigits(4)}`;
}

function generateContainerId() {
  const prefix = CONTAINER_PREFIXES[Math.floor(Math.random() * CONTAINER_PREFIXES.length)];
  return `${prefix}${randomDigits(6)}${randomDigits(1)}`;
}

function normalizeModel(object3D, targetSize) {
  const box = new THREE.Box3().setFromObject(object3D);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;

  object3D.scale.setScalar(scale);
  object3D.position.sub(center.multiplyScalar(scale));
  return object3D;
}

/* ==========================================================================
   Signal post — camera housing + red/green light
   ========================================================================== */

const SignalPost = ({ signalRef }) => {
  useFrame(({ clock }) => {
    if (signalRef.current) {
      const pulse = 0.6 + Math.sin(clock.getElapsedTime() * 2.4) * 0.4;
      signalRef.current.emissiveIntensity = Math.max(pulse, 0.15);
    }
  });

  return (
    <group position={[14, 0, 10]} scale={POST_SCALE}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 1.8, 12]} />
        <meshStandardMaterial color="#2a3050" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.1, 20]} />
        <meshStandardMaterial color="#12162a" roughness={0.6} />
      </mesh>

      {/* signal light */}
      <group position={[0.13, 0.78, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.26, 0.1]} />
          <meshStandardMaterial color="#12162a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.07, 0.06]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshStandardMaterial
            ref={signalRef}
            color="#e11d2e"
            emissive="#e11d2e"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, -0.07, 0.06]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshStandardMaterial color="#1c2140" />
        </mesh>
      </group>
    </group>
  );
};

/* ==========================================================================
   Camera post — a separate, smaller, orange pole with the OCR camera on
   top, standing a little ahead of the signal.
   ========================================================================== */

const CameraPost = () => (
  <group position={[9, 0, 10]} scale={CAMERA_POST_SCALE}>
    <mesh position={[0, 0.42, 0]}>
      <cylinderGeometry args={[0.028, 0.038, 1.4, 12]} />
      <meshStandardMaterial color="#ff8a1e" roughness={0.4} metalness={0.25} />
    </mesh>
    <mesh position={[0, -0.32, 0]}>
      <cylinderGeometry args={[0.09, 0.11, 0.08, 20]} />
      <meshStandardMaterial color="#7a3d0a" roughness={0.6} />
    </mesh>

    {/* camera housing, angled toward the track */}
    <group position={[0, 1.06, 0]} rotation={[0, 0, -0.35]}>
      <mesh>
        <boxGeometry args={[0.15, 0.11, 0.19]} />
        <meshStandardMaterial color="#0a0e1f" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.055, 16]} />
        <meshStandardMaterial color="#ff8a1e" emissive="#ff8a1e" emissiveIntensity={0.6} />
      </mesh>
    </group>
  </group>
);

/* ==========================================================================
   The rig: engine + wagons, coupled. Builds the full sequenced timeline
   once its own models AND the signal light are both ready.
   ========================================================================== */

function TrainRig({ sectionRef, signalRef, wagonMessages }) {
  const groupRef = useRef(null);

  const { scene: trainSource } = useGLTF(TRAIN_URL);
  const { scene: wagonSource } = useGLTF(WAGON_URL);

  const trainScene = useMemo(
    () => normalizeModel(trainSource.clone(true), ENGINE_SIZE),
    [trainSource]
  );

  const wagonScenes = useMemo(
    () =>
      Array.from({ length: WAGON_COUNT }, () =>
        normalizeModel(wagonSource.clone(true), WAGON_SIZE)
      ),
    [wagonSource]
  );

  useEffect(() => {
    if (!groupRef.current || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      const PHASE3_DUR = 1.2;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1 — train arrives and stops centered on screen (signal red)
      tl.fromTo(
        groupRef.current.position,
        { x: -OFFSCREEN_X },
        { x: STOP_X, ease: 'none', duration: 1 }
      ).addLabel('stopped');

      // Phase 2 — signal flips red -> green while the train waits
      if (signalRef.current) {
        tl.to(signalRef.current.color, { ...SIGNAL_GREEN, duration: 0.5 }, 'stopped+=0.15')
          .to(signalRef.current.emissive, { ...SIGNAL_GREEN, duration: 0.5 }, '<')
          .addLabel('cleared', '+=0.1');
      } else {
        tl.addLabel('cleared', 'stopped+=0.25');
      }

      const EXIT_X = OFFSCREEN_X + TRAIN_TRAIL_SPAN;

      // Phase 3 — cleared to proceed. Continues until the LAST wagon has
      // fully cleared the screen, before the pin releases.
      tl.to(groupRef.current.position, { x: EXIT_X, ease: 'none', duration: PHASE3_DUR }, 'cleared');

      // One random "wagon / container detected" message per wagon, timed
      // to fire right as that wagon crosses the gate (GATE_X).
      wagonMessages.forEach((_, i) => {
        const wagonLocalOffset = -(FIRST_WAGON_OFFSET + i * WAGON_STEP);
        const groupXAtGate = GATE_X - wagonLocalOffset;
        const frac = THREE.MathUtils.clamp((groupXAtGate - STOP_X) / (EXIT_X - STOP_X), 0, 1);
        const t = frac * PHASE3_DUR;

        tl.to(`.gallery__scan-msg--${i}`, { opacity: 1, y: 0, duration: 0.2 }, `cleared+=${t}`)
          .to(`.gallery__scan-msg--${i}`, { opacity: 0, y: -8, duration: 0.2 }, `cleared+=${t + 0.35}`);
      });
    });

    return () => ctx.revert();
  }, [sectionRef, signalRef, wagonMessages]);

  return (
    <group ref={groupRef} position={[-OFFSCREEN_X, 0, 0]}>
      {/* Engine rotated 90° so it faces the direction of travel */}
      <primitive object={trainScene} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      {wagonScenes.map((wagon, i) => (
        <primitive
          object={wagon}
          key={i}
          position={[-(FIRST_WAGON_OFFSET + i * WAGON_STEP), 0, 0]}
          rotation={[0, 0, 0]}
        />
      ))}
    </group>
  );
}

useGLTF.preload(TRAIN_URL);
useGLTF.preload(WAGON_URL);

/* ==========================================================================
   Section
   ========================================================================== */

const Gallery = () => {
  const sectionRef = useRef(null);
  const signalRef = useRef(null);

  // Generated once per page load — a fresh wagon + container number each
  // time, instead of a fixed message.
  const wagonMessages = useMemo(
    () =>
      Array.from({ length: WAGON_COUNT }, () => {
        const wagonId = generateWagonId();
        const containerId = generateContainerId();
        return `Wagon ${wagonId} detected \u00b7 Container ${containerId} detected`;
      }),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery__head > *', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery__head', start: 'top 90%' },
      });

      gsap.from('.gallery__stat', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery__stats', start: 'top 90%' },
      });

      gsap.from('.gallery__id', {
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.gallery__ids', start: 'top 92%' },
      });

      const ids = gsap.utils.toArray('.gallery__id');
      if (ids.length) {
        const scan = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
        ids.forEach((id) => {
          scan
            .to(id, { color: 'var(--accent-teal)', duration: 0.25 })
            .to(id, { color: 'var(--text-secondary)', duration: 0.35 }, '+=0.25');
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="gallery__stage">
        {/* zoom is the main knob for framing — lower = more zoomed out.
            Tune this together with ENGINE_SIZE / OFFSCREEN_X if you resize
            the models again. */}
        <Canvas orthographic camera={{ position: [0, 6, 70], zoom: 9, near: 0.1, far: 400 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[20, 26, 16]} intensity={1.1} />
          <directionalLight position={[-20, 12, -16]} intensity={0.3} />

          <SignalPost signalRef={signalRef} />
          <CameraPost />

          <Suspense fallback={null}>
            <TrainRig sectionRef={sectionRef} signalRef={signalRef} wagonMessages={wagonMessages} />
          </Suspense>

          {/* Full 360° camera orbit — the model itself never rotates, only
              the viewing angle does */}
          <OrbitControls enableZoom={false} enablePan={false} enableRotate />
        </Canvas>

        {wagonMessages.map((msg, i) => (
          <div className={`gallery__scan-msg gallery__scan-msg--${i}`} key={i}>
            {msg}
          </div>
        ))}
      </div>

      <div className="container">
        <div className="gallery__head">
          <span className="eyebrow">Yard automation / Wagon OCR</span>
          <h2 className="gallery__title">Every wagon counted, every container read</h2>
          <p className="gallery__sub">
            As the train rolls into the yard, gate cameras capture each wagon
            in sequence — counting the consist, reading every container ID
            off the side panels, and matching them against the manifest
            before a single box is unloaded. No manual tally, no misplaced
            containers.
          </p>
        </div>

        <div className="gallery__stats">
          <div className="gallery__stat">
            <span className="gallery__stat-value">{String(WAGON_COUNT).padStart(2, '0')}</span>
            <span className="gallery__stat-label">Wagons detected</span>
          </div>
          <div className="gallery__stat">
            <span className="gallery__stat-value">{String(CONTAINER_COUNT).padStart(2, '0')}</span>
            <span className="gallery__stat-label">Containers scanned</span>
          </div>
          <div className="gallery__stat">
            <span className="gallery__stat-value">100%</span>
            <span className="gallery__stat-label">Manifest match rate</span>
          </div>
        </div>

        <div className="gallery__ids">
          {CONTAINER_IDS.map((id) => (
            <span className="gallery__id" key={id}>
              {id}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;