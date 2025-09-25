import { FC, useMemo, useRef } from "react";
import {
  ShaderMaterial,
  Scene,
  OrthographicCamera,
  RGBAFormat,
  FloatType,
  DataTexture,
} from "three";
import { extend, ThreeElement } from "@react-three/fiber";
import PortalMesh from "../../../fbo-utils/PortalMesh";
import Particles from "../../../fbo-utils/Particles";
import SimMatCurly from "../shader/SimMat";
import useInitAndAnimateFBO from "../../../fbo-utils/hooks/useInitAndAnimateFBO";
import { FBOType } from "../../../../types/FboType";
import { useWindowResizeReload } from "../../../fbo-utils/hooks/useOnResizeReload";

extend({
  SimMatCurly,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    simMatCurly: ThreeElement<typeof SimMatCurly>;
  }
}
const SceneFBO: FC<FBOType> = ({ size, particles, pos, offset }) => {
  // FBO SCENE -----------------------------
  const scene = useMemo(() => new Scene(), []);
  const cam = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, -1, 1), []);

  //SHADER REF-------------------------------
  const simRef = useRef<ShaderMaterial>(null!);
  const renderRef = useRef<ShaderMaterial>(null!);

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

  useInitAndAnimateFBO(size, scene, cam, simRef, renderRef);
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
