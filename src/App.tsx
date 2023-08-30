import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, SMAA } from "@react-three/postprocessing";
import { Suspense, useCallback, useState } from "react";
import { GridHelper } from "./components/grid-helper";
import { SolidObject } from "./components/solid-object";
import { Editor } from "./components/editor";
import Split from "react-split";
import vm from "node:vm";
import { Solid, cube, cylinder, isSolid, sphere } from "@/csg";

export function App() {
  const [solids, setSolids] = useState<Solid[]>([]);
  const onExecHandler = useCallback(
    (code: string) => {
      try {
        const ctx = vm.createContext({ cube, cylinder, sphere });
        const result = vm.runInContext(code, ctx);
        if (!Array.isArray(result)) throw new Error("");

        setSolids((result as Array<unknown>).filter(isSolid));
      } catch (e) {
        console.error(e);
      }
    },
    [setSolids]
  );
  return (
    <div style={{ height: "100%" }}>
      <Split className="split" gutterSize={3}>
        <div style={{ height: "100%", position: "relative" }}>
          <Editor onExec={onExecHandler} />
        </div>
        <Canvas
          camera={{
            up: [0, 0, 1],
            fov: 45,
            position: [100, -100, 100],
            near: 0.1,
            far: 100000,
          }}
        >
          <Suspense fallback={null}>
            <EffectComposer multisampling={16}>
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
          <SolidObject solids={solids} />
          <GridHelper />
        </Canvas>
      </Split>
    </div>
  );
}
