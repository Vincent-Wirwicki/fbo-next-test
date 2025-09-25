import { FC, useEffect, useMemo, useRef } from "react";
import {
  ShaderMaterial,
  Scene,
  OrthographicCamera,
  RGBAFormat,
  FloatType,
  DataTexture,
  NearestFilter,
  Vector2,
} from "three";
import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber";
import PortalMesh from "../../../fbo-utils/PortalMesh";
import Particles from "../../../fbo-utils/Particles";
import SimMatCurly from "../shader/SimMat";
// import useInitAndAnimateFBO from "../../../fbo-utils/hooks/useInitAndAnimateFBO";
import { FBOType } from "../../../../types/FboType";
import { useWindowResizeReload } from "../../../fbo-utils/hooks/useOnResizeReload";
import { useFBO } from "@react-three/drei";

extend({
  SimMatCurly,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatCurly: Object3DNode<SimMatCurly, typeof SimMatCurly>;
  }
}
const SceneFBO: FC<FBOType> = ({ size, particles, pos, offset }) => {
  // FBO SCENE -----------------------------
  const scene = useMemo(() => new Scene(), []);
  const cam = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  //SHADER REF-------------------------------
  const simRef = useRef<ShaderMaterial>(null!);
  const renderRef = useRef<ShaderMaterial>(null!);
  const lerpedMouse = useRef(new Vector2(0.5, 0.5));

  // DATA POINT TEXTURE --------------
  const dataTex = useMemo(
    () => new DataTexture(pos, size, size, RGBAFormat, FloatType),
    [size, pos]
  );
  dataTex.needsUpdate = true;
  //  An other texture with random value as params like speed etc --------
  const offsetTex = useMemo(
    () => new DataTexture(offset, size, size, RGBAFormat, FloatType),
    [offset, size]
  );
  offsetTex.needsUpdate = true;

  let target = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
    // depth: true,
    // stencilBuffer: true,
  });
  let target1 = target.clone();

  const state = useThree();

  //init all the texture
  useEffect(() => {
    const { gl } = state;
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(null);
  });

  useFrame(state => {
    if (!simRef.current || !renderRef.current)
      return console.error("no sim or render mat");

    const { gl, clock, pointer } = state;
    simRef.current.uniforms.uTime.value = clock.elapsedTime;
    simRef.current.uniforms.uPositions.value = target.texture;
    renderRef.current.uniforms.uPositions.value = target1.texture;
    const mx = pointer.x + 1;
    const my = pointer.y + 1;
    lerpedMouse.current.lerp(new Vector2(mx, my), 0.1);

    simRef.current.uniforms.uMouse.value = new Vector2(
      lerpedMouse.current.x,
      lerpedMouse.current.y
    );
    gl.setRenderTarget(target1);
    gl.clear();
    gl.render(scene, cam);
    gl.setRenderTarget(null);
    //swap texture
    const temp = target;
    target = target1;
    target1 = temp;
  });

  useWindowResizeReload();

  return (
    <>
      <PortalMesh scene={scene}>
        <simMatCurly ref={simRef} args={[dataTex, offsetTex]} />
      </PortalMesh>
      <Particles renderMatRef={renderRef} particles={particles} />
    </>
  );
};

export default SceneFBO;
