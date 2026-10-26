import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { RoomKey } from '../../types';

interface PortalNode {
  key: RoomKey;
  label: string;
  angle: number; // in radians
  distance: number;
  color: number;
}

const PORTALS: PortalNode[] = [
  { key: 'command-center', label: 'COMMAND CENTER', angle: 0, distance: 14, color: 0x38bdf8 },
  { key: 'simulation-arena', label: 'SIMULATION ARENA', angle: (Math.PI * 2 * 1) / 7, distance: 14, color: 0xf59e0b },
  { key: 'career-explorer', label: 'CAREER EXPLORER', angle: (Math.PI * 2 * 2) / 7, distance: 14, color: 0x8b5cf6 },
  { key: 'skill-scan', label: 'SKILL SCAN LAB', angle: (Math.PI * 2 * 3) / 7, distance: 14, color: 0x06b6d4 },
  { key: 'learning-roadmap', label: 'LEARNING ROADMAP', angle: (Math.PI * 2 * 4) / 7, distance: 14, color: 0x10b981 },
  { key: 'skill-gap', label: 'SKILL GAP ANALYSIS', angle: (Math.PI * 2 * 5) / 7, distance: 14, color: 0xec4899 },
  { key: 'lobby', label: 'STATION LOBBY', angle: (Math.PI * 2 * 6) / 7, distance: 14, color: 0x6366f1 }
];

export const SpaceshipCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openRoom, profile, playBeep, viewMode, isRoomOpenIn3D } = useApp();
  const [nearbyPortal, setNearbyPortal] = useState<PortalNode | null>(null);
  const nearbyPortalRef = useRef<PortalNode | null>(null);

  // Character position state for UI sync
  const playerPosRef = useRef({ x: 0, z: 2, angle: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040817);
    scene.fog = new THREE.FogExp2(0x040817, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const centerPointLight = new THREE.PointLight(0x06b6d4, 3, 30);
    centerPointLight.position.set(0, 6, 0);
    scene.add(centerPointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // 3. Starfield & Cosmic Dust
    const starsCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 200;
      starPositions[i + 1] = Math.random() * 80 + 5;
      starPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.6,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. Station Floor Deck
    const deckRadius = 18;
    const floorGeo = new THREE.CylinderGeometry(deckRadius, deckRadius, 0.6, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090f24,
      roughness: 0.35,
      metalness: 0.75
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.3;
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer Glowing Cyan Rim Ring
    const rimGeo = new THREE.TorusGeometry(deckRadius + 0.1, 0.22, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    scene.add(rim);

    // Inner Decorative Circular Floor Tracks
    [6, 10, 14].forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.08, radius + 0.08, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x1e3a8a : 0x4f46e5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const track = new THREE.Mesh(ringGeo, ringMat);
      track.rotation.x = Math.PI / 2;
      track.position.y = 0.02;
      scene.add(track);
    });

    // Central Energy Core
    const coreGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
    const energyCore = new THREE.Mesh(coreGeo, coreMat);
    energyCore.position.set(0, 1.8, 0);
    scene.add(energyCore);

    const coreInnerGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const coreInnerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7
    });
    const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    coreInner.position.set(0, 1.8, 0);
    scene.add(coreInner);

    // 5. Portal Gateways & Signage
    const portalMeshes: { portal: PortalNode; mesh: THREE.Group }[] = [];

    PORTALS.forEach(portal => {
      const group = new THREE.Group();
      const x = Math.sin(portal.angle) * portal.distance;
      const z = Math.cos(portal.angle) * portal.distance;
      group.position.set(x, 0, z);
      // Face towards center
      group.rotation.y = portal.angle + Math.PI;

      // Gateway Arch Pillars
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.85,
        roughness: 0.2
      });
      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 0.8), pillarMat);
      leftPillar.position.set(-2, 2.1, 0);
      leftPillar.castShadow = true;
      group.add(leftPillar);

      const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 0.8), pillarMat);
      rightPillar.position.set(2, 2.1, 0);
      rightPillar.castShadow = true;
      group.add(rightPillar);

      // Top Crossbar Arch
      const archMat = new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        metalness: 0.8
      });
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.9, 1.0), archMat);
      crossbar.position.set(0, 4.3, 0);
      group.add(crossbar);

      // Neon Signboard on top
      const signGeo = new THREE.BoxGeometry(4.2, 0.7, 0.2);
      const signMat = new THREE.MeshStandardMaterial({
        color: portal.color,
        emissive: portal.color,
        emissiveIntensity: 0.8
      });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(0, 4.3, 0.5);
      group.add(signMesh);

      // Portal Force Field / Gate plane (semi-transparent)
      const fieldGeo = new THREE.PlaneGeometry(3.4, 3.8);
      const fieldMat = new THREE.MeshBasicMaterial({
        color: portal.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const field = new THREE.Mesh(fieldGeo, fieldMat);
      field.position.set(0, 2.0, 0);
      group.add(field);

      // Interactive terminal pedestal in front
      const consoleGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.1, 16);
      const consoleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
      consoleMesh.position.set(0, 0.55, 1.8);
      group.add(consoleMesh);

      const screenGeo = new THREE.BoxGeometry(0.7, 0.45, 0.08);
      const screenMat = new THREE.MeshBasicMaterial({ color: portal.color });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 1.2, 1.8);
      screenMesh.rotation.x = -Math.PI / 4;
      group.add(screenMesh);

      scene.add(group);
      portalMeshes.push({ portal, mesh: group });
    });

    // 6. Crewmate Character (Original Sci-Fi Bean / Capsule Avatar)
    const characterGroup = new THREE.Group();
    characterGroup.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);

    const charColor = new THREE.Color(profile.characterColor || '#a855f7');
    const bodyMat = new THREE.MeshStandardMaterial({
      color: charColor,
      roughness: 0.35,
      metalness: 0.25
    });

    // Capsule Body (cylinder with sphere caps)
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.1, 32);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.05;
    body.castShadow = true;
    characterGroup.add(body);

    const headGeo = new THREE.SphereGeometry(0.55, 32, 16);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.y = 1.6;
    head.castShadow = true;
    characterGroup.add(head);

    const bottomGeo = new THREE.SphereGeometry(0.55, 32, 16);
    const bottom = new THREE.Mesh(bottomGeo, bodyMat);
    bottom.position.y = 0.55;
    bottom.castShadow = true;
    characterGroup.add(bottom);

    // Visor (Shiny curved cyan helmet glass facing forward)
    const visorGeo = new THREE.BoxGeometry(0.65, 0.38, 0.32);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.9
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.45, 0.45);
    characterGroup.add(visor);

    // Backpack / Life Support Tank
    const packGeo = new THREE.BoxGeometry(0.65, 0.9, 0.35);
    const packMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 1.1, -0.45);
    characterGroup.add(backpack);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 16);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.25, 0.25, 0);
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.25, 0.25, 0);
    characterGroup.add(rightLeg);

    scene.add(characterGroup);

    // 7. Input Event Listeners
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      keysRef.current[key] = true;

      // Interact 'E'
      if (key === 'e') {
        if (nearbyPortalRef.current) {
          e.preventDefault();
          openRoom(nearbyPortalRef.current.key);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Raycaster for click-to-move / click portal
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        // Check if hit a portal group or its children
        for (const item of portalMeshes) {
          if (hit.object === item.mesh || hit.object.parent === item.mesh) {
            openRoom(item.portal.key);
            return;
          }
        }
        // If clicked on floor, smoothly steer towards it
        if (hit.object === floor) {
          const targetX = THREE.MathUtils.clamp(hit.point.x, -16, 16);
          const targetZ = THREE.MathUtils.clamp(hit.point.z, -16, 16);
          const dx = targetX - playerPosRef.current.x;
          const dz = targetZ - playerPosRef.current.z;
          const dist = Math.hypot(dx, dz);
          if (dist > 0.5) {
            playerPosRef.current.angle = Math.atan2(dx, dz);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Core rotation & pulsation
      energyCore.rotation.y += delta * 0.4;
      energyCore.rotation.x += delta * 0.2;
      coreInner.scale.setScalar(1.0 + Math.sin(time * 3) * 0.08);

      // Starfield subtle drift
      starField.rotation.y += delta * 0.01;

      // Movement Input Handling
      const moveSpeed = 8.5 * delta;
      let vx = 0;
      let vz = 0;

      if (keysRef.current['w'] || keysRef.current['arrowup']) vz -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) vz += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) vx -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) vx += 1;

      if (vx !== 0 || vz !== 0) {
        const len = Math.hypot(vx, vz);
        vx /= len;
        vz /= len;

        const nextX = playerPosRef.current.x + vx * moveSpeed;
        const nextZ = playerPosRef.current.z + vz * moveSpeed;

        // Circular boundary collision
        const distFromCenter = Math.hypot(nextX, nextZ);
        if (distFromCenter < 16.5) {
          playerPosRef.current.x = nextX;
          playerPosRef.current.z = nextZ;
        }

        // Steer character angle smoothly
        const targetAngle = Math.atan2(vx, vz);
        playerPosRef.current.angle = targetAngle;
        characterGroup.rotation.y = THREE.MathUtils.lerp(characterGroup.rotation.y, targetAngle, 0.25);

        // Walking wobble
        characterGroup.position.y = Math.abs(Math.sin(time * 12)) * 0.12;
        leftLeg.rotation.x = Math.sin(time * 12) * 0.4;
        rightLeg.rotation.x = -Math.sin(time * 12) * 0.4;
      } else {
        characterGroup.position.y = 0;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
      }

      characterGroup.position.x = playerPosRef.current.x;
      characterGroup.position.z = playerPosRef.current.z;

      // Camera smoothly follows player with third-person offset
      const camTargetX = playerPosRef.current.x;
      const camTargetZ = playerPosRef.current.z + 8.5;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, camTargetZ, 0.08);
      camera.position.y = 8.5;
      camera.lookAt(playerPosRef.current.x, 1.2, playerPosRef.current.z);

      // Check proximity to portals
      let closestPortal: PortalNode | null = null;
      let closestDist = Infinity;

      for (const p of PORTALS) {
        const px = Math.sin(p.angle) * p.distance;
        const pz = Math.cos(p.angle) * p.distance;
        const d = Math.hypot(playerPosRef.current.x - px, playerPosRef.current.z - pz);
        if (d < 5.0 && d < closestDist) {
          closestDist = d;
          closestPortal = p;
        }
      }

      nearbyPortalRef.current = closestPortal;
      setNearbyPortal(closestPortal);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [profile.characterColor]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Prompt above character when near a room console (Matches reference image prompt) */}
      {nearbyPortal && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all animate-bounce">
          <button
            onClick={() => {
              if (nearbyPortal) {
                openRoom(nearbyPortal.key);
              }
            }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-space-900/90 border border-cyan-400/80 text-cyan-200 shadow-glow-cyan backdrop-blur-md hover:bg-cyan-950/80 transition-all cursor-pointer group"
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-300 font-medium">Press</span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-sm">
              E
            </span>
            <span className="text-slate-300 font-medium">or Click to Enter</span>
            <span className="text-cyan-300 font-bold tracking-wide group-hover:text-cyan-100">
              {nearbyPortal.label}
            </span>
          </button>
        </div>
      )}

      {/* Floating Nameplate on player */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
        <div className="px-3 py-1 rounded-full bg-space-900/90 border border-cyan-500/40 text-cyan-300 font-medium text-xs shadow-md backdrop-blur-sm">
          {profile.name}
        </div>
      </div>
    </div>
  );
};
