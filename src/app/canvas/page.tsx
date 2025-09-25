"use client";
import dynamic from "next/dynamic";

import useInitArrays from "@/components/fbo-utils/hooks/useInitArrays";
import { OrbitControls } from "@react-three/drei";
const SceneFBO = dynamic(
  () => import("../../components/noise/curl/scene/SceneFBO")
);
const MainCanvas = dynamic(
  () => import("../../components/fbo-utils/MainCanvas")
);
const Page = () => {
  const texSize = 512;
  const { particles, random4D, fiboSphere } = useInitArrays({
    size: texSize,
  });
  return (
    <>
      <nav></nav>
      {/* <div className="fixed top-0 left-0 mix-blend-exclusion bg-white w-screen h-screen z-10"></div> */}
      <MainCanvas cam={[0, -3, 60]} dpr={2}>
        <SceneFBO
          size={texSize}
          particles={particles}
          pos={fiboSphere}
          offset={random4D}
        />
        <OrbitControls />
      </MainCanvas>
    </>
  );
};

export default Page;
