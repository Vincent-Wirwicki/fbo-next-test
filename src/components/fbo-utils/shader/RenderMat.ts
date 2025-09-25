import { ShaderMaterial } from "three";

export default class RenderMatTest extends ShaderMaterial {
  constructor(uSize: number) {
    super({
      uniforms: {
        uPositions: { value: null },
        uTime: { value: 0 },
        uSize: { value: uSize },
      },
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor;
        varying float vDistance;
        varying vec2 vUv;
        varying vec3 vPos;


      void main() {        


        gl_FragColor = vec4(vec3(0.75), 1.0);
      }`,

      vertexShader: /*glsl */ `
        uniform sampler2D uPositions;
        uniform float uTime;
        uniform float uSize;

        varying vec3 vPos;
        varying float vDistance;
        varying vec2 vUv;
        void main() {
          vec3 pos = texture2D( uPositions, position.xy ).xyz;
          vPos = position;
          vUv = uv;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.);
          vDistance = -mvPosition.z;
          gl_PointSize = uSize * (4./ -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

        }`,
    });
  }
}
