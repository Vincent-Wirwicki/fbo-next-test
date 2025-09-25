import { useMemo } from "react";
// A hook that create and fill 32 FLOATarray
const useInitArrays = ({ size = 512 }: { size?: number }) => {
  // like vertices for the points
  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);
  // random 2d value for positions
  const random2D = useMemo(() => {
    const total = size * size * 4;
    const random2D = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      const stride = i * 4;
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = 1;
      const w = 1;

      random2D[stride] = x;
      random2D[stride + 1] = y;
      random2D[stride + 2] = z;
      random2D[stride + 3] = w;
    }
    return random2D;
  }, [size]);
  const fiboSphere = useMemo(() => {
    const total = size * size * 4;
    const fibo = new Float32Array(total);
    const r = 4;
    for (let i = 0; i < total; i++) {
      const stride = i * 4;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      fibo[stride] = x;
      fibo[stride + 1] = y;
      fibo[stride + 2] = z;
      fibo[stride + 3] = 1;
    }
    return fibo;
  }, [size]);
  // random value to use them as velocity etc
  const random4D = useMemo(() => {
    const total = size * size * 4;
    const random4D = new Float32Array(total * 4);
    for (let i = 0; i < total; i++) {
      const stride = i * 4;
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;
      const w = Math.random() - 0.5;

      random4D[stride] = x;
      random4D[stride + 1] = y;
      random4D[stride + 2] = z;
      random4D[stride + 3] = w;
    }
    return random4D;
  }, [size]);

  return { particles, random2D, random4D, fiboSphere };
};

export default useInitArrays;
