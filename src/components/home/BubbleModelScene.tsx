'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { RendererCleanup } from '@/components/common/RendererCleanup';
import fragmentShader from './fragmentShader.glsl';
import vertexShader from './vertexShader.glsl';

// 섹션 정의
const SECTIONS = {
  HERO: 0, // 인트로 히어로 - 완전히 퍼진 상태 (배경 입자)
  DEVELOPMENT: 1, // 개발 포트폴리오 - 퍼진 상태에서 모이기 시작
  DESIGN: 2, // 디자인 포트폴리오 - 구체
  BLOG: 3, // 블로그 섹션 - 모인 상태
  CONTACT: 4, // Contact - 구체가 왼쪽으로
};

// 섹션별 스크롤 상태 계산
function useScrollState() {
  const [state, setState] = useState({
    scrollProgress: 0,
    section: 0,
    sectionProgress: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;

      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // 섹션 높이가 제각각(예: 디자인 띠배너)이어도 동작하도록 실제 DOM 경계로 판정.
      // 규칙은 기존과 동일: 섹션 상단이 뷰포트 상단을 지나면 그 섹션이 활성.
      const sectionEls = Array.from(
        document.querySelectorAll<HTMLElement>('section[aria-label]'),
      );
      let section = 0;
      let sectionProgress = 0;
      if (sectionEls.length > 0) {
        for (let i = 0; i < sectionEls.length; i++) {
          if (sectionEls[i].offsetTop <= scrollY + 1) section = i;
        }
        const active = sectionEls[section];
        sectionProgress = Math.min(
          1,
          Math.max(0, (scrollY - active.offsetTop) / active.offsetHeight),
        );
      } else {
        // 폴백: 모든 섹션이 100vh라는 기존 가정
        const scrollInSections = scrollY / viewportHeight;
        section = Math.floor(scrollInSections);
        sectionProgress = scrollInSections - section;
      }

      setState({
        scrollProgress: Math.min(1, Math.max(0, scrollProgress)),
        section,
        sectionProgress,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return state;
}

// 섹션별 3D 오브젝트 상태 계산
function useObjectState(section: number, sectionProgress: number) {
  // spread: 1 = 완전히 퍼짐, 0 = 모임
  // morph: 0 = blob (일렁임), 1 = 구체
  // scale: 오브젝트 크기
  // positionX: 오브젝트 X 위치

  const getState = () => {
    switch (section) {
      case SECTIONS.HERO:
        // 인트로 히어로: 완전히 퍼진 입자가 텍스트 뒤의 배경 역할
        return {
          spread: 1,
          morph: 0,
          scale: 1.0,
          positionX: 0,
        };

      case SECTIONS.DEVELOPMENT:
        // 개발 포트폴리오: 퍼진 상태에서 시작, 점점 모임
        return {
          spread: 1 - sectionProgress * 0.5, // 1.0 -> 0.5 (점점 모임)
          morph: sectionProgress * 0.3, // 0 -> 0.3 (약간 구체화)
          scale: 1.0,
          positionX: 0,
        };

      case SECTIONS.DESIGN:
        // 디자인 포트폴리오: 구체로 변환
        return {
          spread: 0.5 - sectionProgress * 0.5, // 0.5 -> 0
          morph: 0.3 + sectionProgress * 0.5, // 0.3 -> 0.8 (구체화)
          scale: 1.1,
          positionX: -0.1,
        };

      case SECTIONS.CONTACT:
      default:
        // Contact: 완전한 구체, 중앙
        return {
          spread: 0,
          morph: 1, // 완전한 구체
          scale: 1.0,
          positionX: 0,
        };
    }
  };

  return getState();
}

export default function BubbleModelScene() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollProgress, section, sectionProgress } = useScrollState();
  const objectState = useObjectState(section, sectionProgress);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saturation = mounted && theme === 'dark' ? 0.4 : 0.7;
  const lightness = mounted && theme === 'dark' ? 0.3 : 0.5;

  return (
    <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 pointer-events-none">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ width: '100%', height: '100vh' }}>
        <ambientLight intensity={0.5} />
        <CameraController
          scrollProgress={scrollProgress}
          section={section}
          objectPositionX={objectState.positionX}
        />
        <ResponsiveParticles
          saturation={saturation}
          lightness={lightness}
          spread={objectState.spread}
          morph={objectState.morph}
          objectScale={objectState.scale}
          positionX={objectState.positionX}
        />
        <RendererCleanup />
      </Canvas>
    </div>
  );
}

// 스크롤에 따라 카메라를 움직이는 컴포넌트
const CameraController = ({
  scrollProgress,
  section,
  objectPositionX,
}: {
  scrollProgress: number;
  section: number;
  objectPositionX: number;
}) => {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 4 });
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    let targetX = 0;
    let targetY = 0;
    let targetZ = 4;
    let lookAtX = objectPositionX;

    if (section === SECTIONS.HERO || section === SECTIONS.DEVELOPMENT) {
      // 히어로·개발 포트폴리오: 정면에서 약간씩 회전
      const angle = scrollProgress * Math.PI * 0.3;
      targetX = Math.sin(angle) * 0.5;
      targetY = Math.cos(angle) * 0.2;
      targetZ = 4;
      lookAtX = 0;
    } else if (section === SECTIONS.DESIGN) {
      // 디자인 포트폴리오: 정면
      targetX = 0;
      targetY = 0;
      targetZ = 4;
      lookAtX = 0;
    } else if (section === SECTIONS.BLOG) {
      // 블로그: 살짝 왼쪽에서 봄
      targetX = -0.5;
      targetY = 0;
      targetZ = 4;
    } else {
      // Contact: 정면
      targetX = 0;
      targetY = 0;
      targetZ = 4;
      lookAtX = 0;
    }

    targetRef.current = { x: targetX, y: targetY, z: targetZ };

    // 부드러운 카메라 이동
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetRef.current.x,
      0.05,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetRef.current.y,
      0.05,
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetRef.current.z,
      0.05,
    );

    // 오브젝트 위치를 바라보도록
    lookAtRef.current.x = THREE.MathUtils.lerp(
      lookAtRef.current.x,
      lookAtX,
      0.05,
    );
    camera.lookAt(lookAtRef.current);
  });

  return null;
};

interface ResponsiveParticlesProps {
  saturation: number;
  lightness: number;
  spread: number;
  morph: number;
  objectScale: number;
  positionX: number;
}

const ResponsiveParticles = (props: ResponsiveParticlesProps) => {
  const { viewport } = useThree();
  const baseScale = Math.max(0.5, viewport.width / 6);

  return (
    <CustomGeometryParticles
      saturation={props.saturation}
      lightness={props.lightness}
      scale={baseScale * props.objectScale}
      spread={props.spread}
      morph={props.morph}
      positionX={props.positionX}
    />
  );
};

interface CustomGeometryParticlesProps {
  saturation: number;
  lightness: number;
  scale: number;
  spread: number;
  morph: number;
  positionX: number;
}

const CustomGeometryParticles = ({
  saturation,
  lightness,
  scale,
  spread,
  morph,
  positionX,
}: CustomGeometryParticlesProps) => {
  const points = useRef<THREE.Points>(null!);
  const initialCount = 20000;
  const count = Math.floor(initialCount * Math.max(0.5, scale));

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    let phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      let y = 1 - (i / (count - 1.0)) * 2;
      let radius = Math.sqrt(1 - y * y);
      let theta = phi * i;

      let x = Math.cos(theta) * radius;
      let z = Math.sin(theta) * radius;
      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uSaturation: { value: saturation },
      uLightness: { value: lightness },
      uOpacity: { value: 1.0 },
      uMorph: { value: morph },
      uSpread: { value: spread },
      uPositionOffset: { value: new THREE.Vector3(positionX, 0, 0) },
    }),
    [],
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uSaturation.value = saturation;
    uniforms.uLightness.value = lightness;
    uniforms.uMorph.value = THREE.MathUtils.lerp(
      uniforms.uMorph.value,
      morph,
      0.05,
    );
    uniforms.uSpread.value = THREE.MathUtils.lerp(
      uniforms.uSpread.value,
      spread,
      0.05,
    );
    uniforms.uPositionOffset.value.x = THREE.MathUtils.lerp(
      uniforms.uPositionOffset.value.x,
      positionX,
      0.05,
    );
  });

  return (
    <points ref={points} scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent={true}
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};
