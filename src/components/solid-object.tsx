import { Solid } from "@/csg";
import { Vector } from "@/csg/Vector";
import { FC, useMemo } from "react";
import {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";

const __lineMaterial = new LineBasicMaterial({
  color: "#000",
});

interface SolidObjectProps {
  solids?: Solid[];
}

export const SolidObject: FC<SolidObjectProps> = ({ solids }) => {
  const object = useMemo(() => {
    const group = new Group();
    if (!solids) return group;

    solids.forEach((solid) => {
      const geometry = solid.toGeometry();
      const material = new MeshStandardMaterial({
        color: "#fff",
        metalness: 0.2,
        transparent: true,
        opacity: 0.5,
      });
      const mesh = new Mesh(geometry, material);
      group.add(mesh);

      solid.duplicateEdges().forEach((pls) =>
        pls.forEach((pl) => {
          addPolylineToGroup(group, pl);
        })
      );
    });

    return group;
  }, [solids]);

  return <primitive object={object} />;
};

function addPolylineToGroup(group: Group, polyline: Vector[]) {
  const geometry = new BufferGeometry().setFromPoints(
    polyline.map((item) => new Vector3(item.x, item.y, item.z))
  );
  const line = new LineLoop(geometry, __lineMaterial);
  group.add(line);
}
