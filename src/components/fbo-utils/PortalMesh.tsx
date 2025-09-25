import { createPortal } from "@react-three/fiber";
import { ReactNode } from "react";
import { Scene } from "three";

const PortalMesh = ({
  children,
  scene,
}: {
  scene: Scene;
  children?: ReactNode;
}) => {
  return createPortal(
    <mesh>
      {children}
      <planeGeometry args={[2, 2]} />
    </mesh>,
    scene
  );
};

export default PortalMesh;
