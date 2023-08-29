import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, SMAA } from "@react-three/postprocessing";
import { Suspense, useMemo } from "react";
import {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { cube, sphere } from "./csg";
import { Vector } from "./csg/Vector";
import { GridHelper } from "./grid-helper";

const __lineMaterial = new LineBasicMaterial({
  color: "#000",
});

function SolidGeometry() {
  const object = useMemo(() => {
    const result = cube().subtract(
      sphere({
        radius: 1.3,
        slices: 16,
        stacks: 8,
      })
    );
    const group = new Group();

    const geometry = result.toGeometry();
    const material = new MeshStandardMaterial({
      color: "#fff",
      metalness: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new Mesh(geometry, material);
    group.add(mesh);

    result.duplicateEdges().forEach((pls) =>
      pls.forEach((pl) => {
        addPolylineToGroup(group, pl);
      })
    );

    return group;
  }, []);

  return <primitive object={object} />;
}

function App() {
  return (
    <div id="main-content">
      <Canvas
        camera={{
          up: [0, 0, 1],
          fov: 45,
          position: [5, -5, 5],
        }}
      >
        <Suspense fallback={null}>
          <EffectComposer multisampling={8}>
            <SMAA />
          </EffectComposer>
        </Suspense>
        <ambientLight />
        <directionalLight
          castShadow
          position={[500, -500, 500]}
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={3000}
          shadow-camera-near={0}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-bias={-0.00005}
        />
        <CameraControls makeDefault />
        <SolidGeometry />
        <GridHelper />
      </Canvas>
    </div>
  );
}

function addPolylineToGroup(group: Group, polyline: Vector[]) {
  const geometry = new BufferGeometry().setFromPoints(
    polyline.map((item) => new Vector3(item.x, item.y, item.z))
  );
  const line = new LineLoop(geometry, __lineMaterial);
  group.add(line);
}

export default App;
