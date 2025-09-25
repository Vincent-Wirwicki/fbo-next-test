import { useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useEffect, useRef } from "react";
import {
  Camera,
  FloatType,
  NearestFilter,
  RGBAFormat,
  Scene,
  ShaderMaterial,
} from "three";

const useInitAndAnimateFBO = (
  size: number,
  scene: Scene,
  cam: Camera,
  simMatRef: RefObject<ShaderMaterial | null>,
  renderMatRef: RefObject<ShaderMaterial | null>
) => {
  // create fbo texture
  const target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
    stencilBuffer: false,
  });

  const mouseSpeed = useRef(0);
  const targetSpeed = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  useFrame(state => {
    if (!simMatRef.current || !renderMatRef.current)
      return console.error("no sim or render mat");
    const { gl, clock, pointer, camera } = state;
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(null);
    simMatRef.current.uniforms.uTime.value = clock.elapsedTime;
    //simMatRef.current.uniforms.uPositions.value = target.texture;
    renderMatRef.current.uniforms.uPositions.value = target.texture;
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;
    // calc speed
    mouseSpeed.current = Math.sqrt(
      (mouse.current.x - lastMouse.current.x) ** 2 +
        (mouse.current.y - lastMouse.current.y) ** 2
    );
    targetSpeed.current -= 0.1 * (targetSpeed.current - mouseSpeed.current);
    // targetSpeed.current = Math.min(Math.max(targetSpeed.current, 0), 0.5);
    //    renderMatRef.current.uniforms.uSpeed.value = targetSpeed.current;
    console.log(camera.position);

    //swap texture
    // const temp = target;
    // target = target1;
    // target1 = temp;
    lastMouse.current.x = mouse.current.x;
    lastMouse.current.y = mouse.current.y;
  });
};

export default useInitAndAnimateFBO;
