// # class Vector

import { Transform } from "./Transform";

// Represents a 3D vector.
//
// Example usage:
//
//     new Vector(1, 2, 3);
//     new Vector([1, 2, 3]);
//     new Vector({ x: 1, y: 2, z: 3 });

export class Vector {
  x: number;
  y: number;
  z: number;
  static get UnitZ(): Vector {
    return new Vector(0, 0, 1);
  }
  static get UnitX(): Vector {
    return new Vector(1, 0, 0);
  }
  static get UnitY(): Vector {
    return new Vector(0, 1, 0);
  }
  static get Origin(): Vector {
    return new Vector(0, 0, 0);
  }

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
  clone() {
    return new Vector(this.x, this.y, this.z);
  }
  negated() {
    return new Vector(-this.x, -this.y, -this.z);
  }
  plus(a: Vector) {
    return new Vector(this.x + a.x, this.y + a.y, this.z + a.z);
  }
  minus(a: Vector) {
    return new Vector(this.x - a.x, this.y - a.y, this.z - a.z);
  }
  times(a: number) {
    return new Vector(this.x * a, this.y * a, this.z * a);
  }
  dividedBy(a: number) {
    return new Vector(this.x / a, this.y / a, this.z / a);
  }
  dot(a: Vector) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }
  lerp(a: Vector, t: number) {
    return this.plus(a.minus(this).times(t));
  }
  length() {
    return Math.sqrt(this.dot(this));
  }
  unit() {
    return this.dividedBy(this.length());
  }
  cross(a: Vector) {
    return new Vector(
      this.y * a.z - this.z * a.y,
      this.z * a.x - this.x * a.z,
      this.x * a.y - this.y * a.x
    );
  }
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  public transform(xform: Transform) {
    let xx, yy, zz, ww;
    ww =
      xform.m_30 * this.x +
      xform.m_31 * this.y +
      xform.m_32 * this.z +
      xform.m_33;
    if (ww != 0.0) ww = 1.0 / ww;
    xx =
      ww *
      (xform.m_00 * this.x +
        xform.m_01 * this.y +
        xform.m_02 * this.z +
        xform.m_03);
    yy =
      ww *
      (xform.m_10 * this.x +
        xform.m_11 * this.y +
        xform.m_12 * this.z +
        xform.m_13);
    zz =
      ww *
      (xform.m_20 * this.x +
        xform.m_21 * this.y +
        xform.m_22 * this.z +
        xform.m_23);
    this.x = xx;
    this.y = yy;
    this.z = zz;
  }

  perpendicularTo(v: Vector) {
    let i, j, k;
    let a, b;
    k = 2;
    if (Math.abs(v.y) > Math.abs(v.x)) {
      if (Math.abs(v.z) > Math.abs(v.y)) {
        // |v.z| > |v.y| > |v.x|
        i = 2;
        j = 1;
        k = 0;
        a = v.z;
        b = -v.y;
      } else if (Math.abs(v.z) >= Math.abs(v.x)) {
        // |v.y| >= |v.z| >= |v.x|
        i = 1;
        j = 2;
        k = 0;
        a = v.y;
        b = -v.z;
      } else {
        // |v.y| > |v.x| > |v.z|
        i = 1;
        j = 0;
        k = 2;
        a = v.y;
        b = -v.x;
      }
    } else if (Math.abs(v.z) > Math.abs(v.x)) {
      // |v.z| > |v.x| >= |v.y|
      i = 2;
      j = 0;
      k = 1;
      a = v.z;
      b = -v.x;
    } else if (Math.abs(v.z) > Math.abs(v.y)) {
      // |v.x| >= |v.z| > |v.y|
      i = 0;
      j = 2;
      k = 1;
      a = v.x;
      b = -v.z;
    } else {
      // |v.x| >= |v.y| >= |v.z|
      i = 0;
      j = 1;
      k = 2;
      a = v.x;
      b = -v.y;
    }

    const __map: Record<number, "x" | "y" | "z"> = {
      0: "x",
      1: "y",
      2: "z",
    };
    this.__set(__map[i], b);
    this.__set(__map[j], a);
    this.__set(__map[k], 0);
  }

  private __set(key: "x" | "y" | "z", value: number) {
    switch (key) {
      case "x":
        this.x = value;
        break;
      case "y":
        this.y = value;
        break;
      case "z":
        this.z = value;
        break;
    }
  }
}
