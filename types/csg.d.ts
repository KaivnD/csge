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
}

declare type VectorLikeInput =
  | { x: number; y: number; z: number }
  | number[]
  | number;

declare type CubeCreationArgs = {
  center?: VectorLikeInput;
  radius?: number | [number, number, number];
};

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

declare function cube(args?: CubeCreationArgs): ISolid;
declare function sphere(args?: SphereCreationArgs): ISolid;
declare function cylinder(args?: CylinderCreateionArgs): ISolid;
