declare interface ISolid {
  /**
   * # 合并
   *
   * Return a new Solid solid representing space in either this solid or in the
   * solid `csg`. Neither this solid nor the solid `csg` are modified.
   *     A.union(B)
   *
   *     +-------+            +-------+
   *     |       |            |       |
   *     |   A   |            |       |
   *     |    +--+----+   =   |       +----+
   *     +----+--+    |       +----+       |
   *          |   B   |            |       |
   *          |       |            |       |
   *          +-------+            +-------+
   * @param solid
   */
  union(solid: ISolid): ISolid;
  /**
   * # 减去
   * Return a new Solid solid representing space in this solid but not in the
   * solid `csg`. Neither this solid nor the solid `csg` are modified.
   *     A.subtract(B)
   *
   *     +-------+            +-------+
   *     |       |            |       |
   *     |   A   |            |       |
   *     |    +--+----+   =   |    +--+
   *     +----+--+    |       +----+
   *          |   B   |
   *          |       |
   *          +-------+
   * @param solid
   */
  subtract(solid: ISolid): ISolid;
  /**
   * # 相交
   *
   * Return a new Solid solid representing space both this solid and in the
   * solid `csg`. Neither this solid nor the solid `csg` are modified.
   *     A.intersect(B)
   *
   *     +-------+
   *     |       |
   *     |   A   |
   *     |    +--+----+   =   +--+
   *     +----+--+    |       +--+
   *          |   B   |
   *          |       |
   *          +-------+
   * @param solid
   */
  intersect(solid: ISolid): ISolid;
  /**
   * # 反向
   *
   * Return a new Solid solid with solid and empty space switched. This solid is not modified.
   * @param solid
   */
  inverse(): ISolid;

  move(all: number): ISolid;
  move(x: number, y: number): ISolid;
  move(x: number, y: number, z: number): ISolid;

  rotate(x: number, y?: number, z?: number): ISolid;
  mirror(x: boolean, y?: boolean, z?: boolean): ISolid;

  scale(all: number): ISolid;
  scale(x: number, y: number, z: number): ISolid;
}

declare type VectorLikeInput =
  | { x: number; y: number; z: number }
  | number[]
  | number;

declare type CubeCreationArgs = number | [number, number, number];

declare type SphereCreationArgs = {
  center?: VectorLikeInput;
  radius?: number;
  slices?: number;
  stacks?: number;
};

declare type CylinderCreateionArgs = {
  start?: VectorLikeInput;
  end?: Point3d;
  radius?: number;
  slices?: number;
};

declare function cube(all?: number): ISolid;
declare function cube(x: number, y: number): ISolid;
declare function cube(x: number, y: number, z: number): ISolid;
declare function sphere(radius?: number): ISolid;
declare function cylinder(radius?: number, height?: number): ISolid;
