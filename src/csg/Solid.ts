import { Polygon } from "./Polygon";
import { Vector } from "./Vector";
import { Node } from "./Node";
import { Vertex } from "./Vertex";
import { BufferGeometry, BufferAttribute } from "three";
import { Transform } from "./Transform";
import { Plane } from "./Plane";
import polybool from "polybooljs";

// # class CSG
// Holds a binary space partition tree representing a 3D solid. Two solids can
// be combined using the `union()`, `subtract()`, and `intersect()` methods.
export class Solid implements ISolid {
  polygons: Polygon[] = [];
  constructor() {}
  // Construct a CSG solid from a list of `Solid.Polygon` instances.
  static fromPolygons(polygons: Polygon[]) {
    const csg = new Solid();
    csg.polygons = polygons;
    return csg;
  }
  clone() {
    const csg = new Solid();
    csg.polygons = this.polygons.map(function (p) {
      return p.clone();
    });
    return csg;
  }
  toPolygons() {
    return this.polygons;
  }
  // Return a new Solid solid representing space in either this solid or in the
  // solid `csg`. Neither this solid nor the solid `csg` are modified.
  //
  //     A.union(B)
  //
  //     +-------+            +-------+
  //     |       |            |       |
  //     |   A   |            |       |
  //     |    +--+----+   =   |       +----+
  //     +----+--+    |       +----+       |
  //          |   B   |            |       |
  //          |       |            |       |
  //          +-------+            +-------+
  //
  union(csg: Solid) {
    const a = new Node(this.clone().polygons);
    const b = new Node(csg.clone().polygons);
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    return Solid.fromPolygons(a.allPolygons());
  }
  // Return a new Solid solid representing space in this solid but not in the
  // solid `csg`. Neither this solid nor the solid `csg` are modified.
  //
  //     A.subtract(B)
  //
  //     +-------+            +-------+
  //     |       |            |       |
  //     |   A   |            |       |
  //     |    +--+----+   =   |    +--+
  //     +----+--+    |       +----+
  //          |   B   |
  //          |       |
  //          +-------+
  //
  subtract(csg: Solid) {
    const a = new Node(this.clone().polygons);
    const b = new Node(csg.clone().polygons);
    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    a.invert();
    return Solid.fromPolygons(a.allPolygons());
  }
  // Return a new Solid solid representing space both this solid and in the
  // solid `csg`. Neither this solid nor the solid `csg` are modified.
  //
  //     A.intersect(B)
  //
  //     +-------+
  //     |       |
  //     |   A   |
  //     |    +--+----+   =   +--+
  //     +----+--+    |       +--+
  //          |   B   |
  //          |       |
  //          +-------+
  //
  intersect(csg: Solid) {
    const a = new Node(this.clone().polygons);
    const b = new Node(csg.clone().polygons);
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.build(b.allPolygons());
    a.invert();
    return Solid.fromPolygons(a.allPolygons());
  }
  // Return a new Solid solid with solid and empty space switched. This solid is
  // not modified.
  inverse() {
    const csg = this.clone();
    csg.polygons.map(function (p) {
      p.flip();
    });
    return csg;
  }

  toGeometry(): BufferGeometry {
    let triCount = 0;
    const ps = this.polygons;
    for (const p of ps) {
      triCount += p.vertices.length - 2;
    }
    const geom = new BufferGeometry();

    const vertices = new Vector3Float32Array(triCount * 3 * 3);
    const normals = new Vector3Float32Array(triCount * 3 * 3);
    const uvs = new Vector2Float32Array(triCount * 2 * 3);
    let colors: Vector3Float32Array | undefined;
    const grps: number[][] = [];
    const dgrp: number[] = [];
    for (const p of ps) {
      const pvs = p.vertices;
      const pvlen = pvs.length;
      if (p.shared !== undefined) {
        if (!grps[p.shared]) grps[p.shared] = [];
      }
      if (pvlen && pvs[0].color !== undefined) {
        if (!colors) colors = new Vector3Float32Array(triCount * 3 * 3);
      }
      for (let j = 3; j <= pvlen; j++) {
        const grp = p.shared === undefined ? dgrp : grps[p.shared];
        grp.push(vertices.top / 3, vertices.top / 3 + 1, vertices.top / 3 + 2);
        vertices.write(pvs[0].pos);
        vertices.write(pvs[j - 2].pos);
        vertices.write(pvs[j - 1].pos);
        normals.write(pvs[0].normal);
        normals.write(pvs[j - 2].normal);
        normals.write(pvs[j - 1].normal);
        if (uvs) {
          uvs.write(pvs[0].uv);
          uvs.write(pvs[j - 2].uv);
          uvs.write(pvs[j - 1].uv);
        }

        if (colors) {
          colors.write(pvs[0].color);
          colors.write(pvs[j - 2].color);
          colors.write(pvs[j - 1].color);
        }
      }
    }
    geom.setAttribute("position", new BufferAttribute(vertices.array, 3));
    geom.setAttribute("normal", new BufferAttribute(normals.array, 3));
    uvs && geom.setAttribute("uv", new BufferAttribute(uvs.array, 2));
    colors && geom.setAttribute("color", new BufferAttribute(colors.array, 3));
    for (let gi = 0; gi < grps.length; gi++) {
      if (grps[gi] === undefined) {
        grps[gi] = [];
      }
    }
    if (grps.length) {
      let index: number[] = [];
      let gbase = 0;
      for (let gi = 0; gi < grps.length; gi++) {
        geom.addGroup(gbase, grps[gi].length, gi);
        gbase += grps[gi].length;
        index = index.concat(grps[gi]);
      }
      geom.addGroup(gbase, dgrp.length, grps.length);
      index = index.concat(dgrp);
      geom.setIndex(index);
    }

    geom.computeBoundingSphere();
    geom.computeBoundingBox();

    return geom;
  }

  duplicateEdges(): Polyline[][] {
    const plMap: Record<string, Polygon[]> = {};

    for (const pl of this.polygons) {
      const normal = pl.plane.normal;
      const key = `${normal.x}_${normal.y}_${normal.z}_${pl.plane.w}`;
      if (!plMap[key]) plMap[key] = [];
      plMap[key].push(pl);
    }

    const results: Polyline[][] = [];

    for (const pls of Object.values(plMap)) {
      const polygons = pls.map((item) =>
        item.vertices.map((v) => v.pos).concat(item.vertices[0].pos)
      );
      results.push(unionPlanarPolygon(polygons));
    }

    return results;
  }
}

// Construct an axis-aligned solid cuboid. Optional parameters are `center` and
// `radius`, which default to `[0, 0, 0]` and `[1, 1, 1]`. The radius can be
// specified using a single number or a list of three numbers, one for each axis.
//
// Example code:
//
//     const cube = Solid.cube({
//       center: [0, 0, 0],
//       radius: 1
//     });
export function cube(options?: CubeCreationArgs) {
  const c = getVectorFromVectorLike(options?.center);
  const r = !options?.radius
    ? [1, 1, 1]
    : Array.isArray(options.radius)
    ? options.radius
    : [options.radius, options.radius, options.radius];

  return Solid.fromPolygons(
    [
      [
        [0, 4, 6, 2],
        [-1, 0, 0],
      ],
      [
        [1, 3, 7, 5],
        [+1, 0, 0],
      ],
      [
        [0, 1, 5, 4],
        [0, -1, 0],
      ],
      [
        [2, 6, 7, 3],
        [0, +1, 0],
      ],
      [
        [0, 2, 3, 1],
        [0, 0, -1],
      ],
      [
        [4, 5, 7, 6],
        [0, 0, +1],
      ],
    ].map(function (info) {
      return new Polygon(
        info[0].map(function (i) {
          const pos = new Vector(
            c.x + r[0] * (2 * Number(!!(i & 1)) - 1),
            c.y + r[1] * (2 * Number(!!(i & 2)) - 1),
            c.z + r[2] * (2 * Number(!!(i & 4)) - 1)
          );
          return new Vertex(
            pos,
            new Vector(info[1][0], info[1][1], info[1][2])
          );
        })
      );
    })
  );
}
// Construct a solid sphere. Optional parameters are `center`, `radius`,
// `slices`, and `stacks`, which default to `[0, 0, 0]`, `1`, `16`, and `8`.
// The `slices` and `stacks` parameters control the tessellation along the
// longitude and latitude directions.
//
// Example usage:
//
//     const sphere = Solid.sphere({
//       center: [0, 0, 0],
//       radius: 1,
//       slices: 16,
//       stacks: 8
//     });
export function sphere(options?: SphereCreationArgs) {
  const c = getVectorFromVectorLike(options?.center);
  const r = options?.radius || 1;
  const slices = options?.slices || 16;
  const stacks = options?.stacks || 8;
  const polygons: Polygon[] = [];
  let vertices: Vertex[];
  function vertex(theta: number, phi: number) {
    theta *= Math.PI * 2;
    phi *= Math.PI;
    const dir = new Vector(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi)
    );
    vertices.push(new Vertex(c.plus(dir.times(r)), dir));
  }
  for (let i = 0; i < slices; i++) {
    for (let j = 0; j < stacks; j++) {
      vertices = [];
      vertex(i / slices, j / stacks);
      if (j > 0) vertex((i + 1) / slices, j / stacks);
      if (j < stacks - 1) vertex((i + 1) / slices, (j + 1) / stacks);
      vertex(i / slices, (j + 1) / stacks);
      polygons.push(new Polygon(vertices));
    }
  }
  return Solid.fromPolygons(polygons);
}
// Construct a solid cylinder. Optional parameters are `start`, `end`,
// `radius`, and `slices`, which default to `[0, -1, 0]`, `[0, 1, 0]`, `1`, and
// `16`. The `slices` parameter controls the tessellation.
//
// Example usage:
//
//     const cylinder = Solid.cylinder({
//       start: [0, -1, 0],
//       end: [0, 1, 0],
//       radius: 1,
//       slices: 16
//     });
export function cylinder(options?: CylinderCreateionArgs) {
  const s = getVectorFromVectorLike(options?.start, new Vector(0, -1, 0));
  const e = getVectorFromVectorLike(options?.end, new Vector(0, 1, 0));
  const ray = e.minus(s);
  const r = options?.radius ?? 1;
  const slices = options?.slices ?? 16;
  const axisZ = ray.unit(),
    isY = Math.abs(axisZ.y) > 0.5;
  const axisX = new Vector(Number(isY), Number(!isY), 0).cross(axisZ).unit();
  const axisY = axisX.cross(axisZ).unit();
  const start = new Vertex(s, axisZ.negated());
  const end = new Vertex(e, axisZ.unit());
  const polygons = [];
  function point(stack: number, slice: number, normalBlend: number) {
    const angle = slice * Math.PI * 2;
    const out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
    const pos = s.plus(ray.times(stack)).plus(out.times(r));
    const normal = out
      .times(1 - Math.abs(normalBlend))
      .plus(axisZ.times(normalBlend));
    return new Vertex(pos, normal);
  }
  for (let i = 0; i < slices; i++) {
    const t0 = i / slices,
      t1 = (i + 1) / slices;
    polygons.push(new Polygon([start, point(0, t0, -1), point(0, t1, -1)]));
    polygons.push(
      new Polygon([
        point(0, t1, 0),
        point(0, t0, 0),
        point(1, t0, 0),
        point(1, t1, 0),
      ])
    );
    polygons.push(new Polygon([end, point(1, t1, 1), point(1, t0, 1)]));
  }
  return Solid.fromPolygons(polygons);
}

function getVectorFromVectorLike(v?: VectorLikeInput, defaultValue?: Vector) {
  if (v === undefined) return defaultValue ?? new Vector(0, 0, 0);
  else if (typeof v === "number") return new Vector(v, v, v);
  else if (Array.isArray(v)) {
    if (v.length === 2) {
      return new Vector(v[0], v[1], 0);
    } else if (v.length >= 3) {
      return new Vector(v[0], v[1], v[2]);
    }
  } else if (typeof v === "object") return new Vector(v.x, v.y, v.z);

  throw new Error("参数错误");
}

class Vector3Float32Array {
  top = 0;
  array: Float32Array;

  constructor(ct: number) {
    this.array = new Float32Array(ct);
  }

  write(v?: Vector): void {
    if (!v) return;
    this.array[this.top++] = v.x;
    this.array[this.top++] = v.y;
    this.array[this.top++] = v.z;
  }
}

class Vector2Float32Array {
  top = 0;
  array: Float32Array;

  constructor(ct: number) {
    this.array = new Float32Array(ct);
  }

  write(v?: Vector): void {
    if (!v) return;
    this.array[this.top++] = v.x;
    this.array[this.top++] = v.y;
  }
}

type Polyline = Vector[];

function unionPlanarPolygon(polygons: Array<Polyline>): Array<Polyline> {
  const first = polygons[0];
  const p = Plane.fromPoints(first[0], first[1], first[2]);
  const xform1 = Transform.changeBasis(Plane.WorldXY, p)!;

  const tmp = polygons
    .map((pl) =>
      pl
        .map((item) => {
          const pt = item.clone();
          pt.transform(xform1);
          return pt;
        })
        .map((item) => [item.x, item.y])
    )
    .map((item) => ({ regions: [item], inverted: false }));

  let result = tmp[0];
  for (let i = 1; i < tmp.length; i++) result = polybool.union(result, tmp[i]);
  const xform2 = Transform.changeBasis(p, Plane.WorldXY)!;

  return result.regions.map((region) =>
    region.map(([x, y]) => {
      const pt = new Vector(x, y, 0);
      pt.transform(xform2);
      return pt;
    })
  );
}

export function isSolid(object: unknown): object is Solid {
  return object instanceof Solid;
}
