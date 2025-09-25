"use client";
import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode, useEffect, useState } from "react";
import { Vector3 } from "three";

const MainCanvas = ({
  children,
  dpr = 2,
  cam = [4, 4, 18],
}: {
  children: ReactNode;
  dpr?: number;
  cam?: [number, number, number];
}) => {
  // const [width, setWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const onResize = () => setWidth(window.innerWidth);
  //   window.addEventListener("resize", onResize);
  //   return () => window.removeEventListener("resize", onResize);
  // });

  return (
    <div className="w-full h-full fixed top-0 left-0 z-0">
      <Canvas
        //orthographic={true}
        camera={{
          position: cam,
          lookAt: () => new Vector3(0, 0, 0),
        }}
        dpr={dpr}
      >
        <color attach={"background"} args={["black"]} />
        {children}
        <Stats />
      </Canvas>
    </div>
  );
};
export default MainCanvas;
