import { Line } from "@react-three/drei";
import { Line3, Vector3 } from "three";

export function GridHelper({
  gridSpacing = 1.0,
  gridLineCount = 50,
  gridThickFrequency = 10,
}) {
  const origin = new Vector3(0, 0, 0);
  const xMin = -gridLineCount * gridSpacing;
  const yMin = xMin;
  const xMax = gridLineCount * gridSpacing;
  const yMax = xMax;
  const minorLines: Line3[] = [];
  const majorLines: Line3[] = [];
  for (let i = -gridLineCount; i <= gridLineCount; i++) {
    const x = i * gridSpacing;
    const y = i * gridSpacing;
    if (i === 0) {
      majorLines.push(new Line3(new Vector3(0, yMin, 0), new Vector3(0, 0, 0)));
      majorLines.push(new Line3(new Vector3(xMin, 0, 0), new Vector3(0, 0, 0)));
      continue;
    }

    if (i % gridThickFrequency === 0) {
      majorLines.push(
        new Line3(new Vector3(x, yMin, 0), new Vector3(x, yMax, 0))
      );
      majorLines.push(
        new Line3(new Vector3(xMin, y, 0), new Vector3(xMax, y, 0))
      );
    } else {
      minorLines.push(
        new Line3(new Vector3(x, yMin, 0), new Vector3(x, yMax, 0))
      );
      minorLines.push(
        new Line3(new Vector3(xMin, y, 0), new Vector3(xMax, y, 0))
      );
    }
  }

  return (
    <group name="grid-helper">
      <Line points={[origin, new Vector3(xMax, 0, 0)]} color="red" />
      <Line points={[origin, new Vector3(0, yMax, 0)]} color="green" />
      {majorLines.map((line, i) => (
        <Line
          key={`majorLines_${i}`}
          points={[line.start, line.end]}
          linewidth={0.5}
          color="#222"
        />
      ))}
      {minorLines.map((line, i) => (
        <Line
          key={`minorLines_${i}`}
          points={[line.start, line.end]}
          linewidth={0.3}
          color="#666"
        />
      ))}
    </group>
  );
}
