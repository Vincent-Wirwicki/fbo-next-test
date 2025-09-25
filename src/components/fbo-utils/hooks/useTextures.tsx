import { useMemo } from "react";
import { DataTexture, FloatType, RGBAFormat } from "three";

const useTextures = ({
  pos,
  offset,
  size,
}: {
  pos: Float32Array;
  offset: Float32Array;
  size: number;
}) => {
  const dataTex = useMemo(() => {
    const tex = new DataTexture(pos, size, size, RGBAFormat, FloatType);
    tex.needsUpdate = true;
    return tex;
  }, [size, pos]);
  //  An other texture with random value as params like speed etc --------
  const offsetTex = useMemo(() => {
    const tex = new DataTexture(offset, size, size, RGBAFormat, FloatType);
    tex.needsUpdate = true;
    return tex;
  }, [offset, size]);
  return { dataTex, offsetTex };
};

export default useTextures;
