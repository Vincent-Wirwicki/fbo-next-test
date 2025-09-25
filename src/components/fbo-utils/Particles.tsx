"use client";

import { RefObject } from "react";

import { AdditiveBlending, ShaderMaterial } from "three";
import RenderMat from "./shader/RenderMat";
import { extend, ThreeElement } from "@react-three/fiber";

extend({
  RenderMat,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    renderMat: ThreeElement<typeof RenderMat>;
  }
}

const Particles = ({
  uSize = 8,
  renderMatRef,
  particles,
}: {
  uSize?: number;
  particles: Float32Array;
  renderMatRef: RefObject<ShaderMaterial | null>;
}) => {
  return (
    <points scale={10} position={[0, 0, 0]}>
      <renderMat
        ref={renderMatRef}
        args={[uSize]}
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        transparent={true}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          args={[particles, 3]}
        />
      </bufferGeometry>
    </points>
  );
};

export default Particles;
// scale={8} position={[-4, -4, 0]} pos in view
