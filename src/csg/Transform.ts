import { Plane } from "./Plane";
import { Vector } from "./Vector";

export type Matrix4LikeArray = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

export class Transform {
  m_00: number = 0;
  m_01: number = 0;
  m_02: number = 0;
  m_03: number = 0;
  m_10: number = 0;
  m_11: number = 0;
  m_12: number = 0;
  m_13: number = 0;
  m_20: number = 0;
  m_21: number = 0;
  m_22: number = 0;
  m_23: number = 0;
  m_30: number = 0;
  m_31: number = 0;
  m_32: number = 0;
  m_33: number = 0;

  public get isValid() {
    return (
      !isNaN(this.m_00) &&
      !isNaN(this.m_01) &&
      !isNaN(this.m_02) &&
      !isNaN(this.m_03) &&
      !isNaN(this.m_10) &&
      !isNaN(this.m_11) &&
      !isNaN(this.m_12) &&
      !isNaN(this.m_13) &&
      !isNaN(this.m_20) &&
      !isNaN(this.m_21) &&
      !isNaN(this.m_22) &&
      !isNaN(this.m_23) &&
      !isNaN(this.m_30) &&
      !isNaN(this.m_31) &&
      !isNaN(this.m_32) &&
      !isNaN(this.m_33)
    );
  }

  public multiply(other: Transform) {
    const xf = new Transform();

    // prettier-ignore
    xf.m_00 = this.m_00 * other.m_00 + this.m_01 * other.m_10 + this.m_02 * other.m_20 + this.m_03 * other.m_30;
    // prettier-ignore
    xf.m_01 = this.m_00 * other.m_01 + this.m_01 * other.m_11 + this.m_02 * other.m_21 + this.m_03 * other.m_31;
    // prettier-ignore
    xf.m_02 = this.m_00 * other.m_02 + this.m_01 * other.m_12 + this.m_02 * other.m_22 + this.m_03 * other.m_32;
    // prettier-ignore
    xf.m_03 = this.m_00 * other.m_03 + this.m_01 * other.m_13 + this.m_02 * other.m_23 + this.m_03 * other.m_33;

    // prettier-ignore
    xf.m_10 = this.m_10 * other.m_00 + this.m_11 * other.m_10 + this.m_12 * other.m_20 + this.m_13 * other.m_30;
    // prettier-ignore
    xf.m_11 = this.m_10 * other.m_01 + this.m_11 * other.m_11 + this.m_12 * other.m_21 + this.m_13 * other.m_31;
    // prettier-ignore
    xf.m_12 = this.m_10 * other.m_02 + this.m_11 * other.m_12 + this.m_12 * other.m_22 + this.m_13 * other.m_32;
    // prettier-ignore
    xf.m_13 = this.m_10 * other.m_03 + this.m_11 * other.m_13 + this.m_12 * other.m_23 + this.m_13 * other.m_33;

    // prettier-ignore
    xf.m_20 = this.m_20 * other.m_00 + this.m_21 * other.m_10 + this.m_22 * other.m_20 + this.m_23 * other.m_30;
    // prettier-ignore
    xf.m_21 = this.m_20 * other.m_01 + this.m_21 * other.m_11 + this.m_22 * other.m_21 + this.m_23 * other.m_31;
    // prettier-ignore
    xf.m_22 = this.m_20 * other.m_02 + this.m_21 * other.m_12 + this.m_22 * other.m_22 + this.m_23 * other.m_32;
    // prettier-ignore
    xf.m_23 = this.m_20 * other.m_03 + this.m_21 * other.m_13 + this.m_22 * other.m_23 + this.m_23 * other.m_33;

    // prettier-ignore
    xf.m_30 = this.m_30 * other.m_00 + this.m_31 * other.m_10 + this.m_32 * other.m_20 + this.m_33 * other.m_30;
    // prettier-ignore
    xf.m_31 = this.m_30 * other.m_01 + this.m_31 * other.m_11 + this.m_32 * other.m_21 + this.m_33 * other.m_31;
    // prettier-ignore
    xf.m_32 = this.m_30 * other.m_02 + this.m_31 * other.m_12 + this.m_32 * other.m_22 + this.m_33 * other.m_32;
    // prettier-ignore
    xf.m_33 = this.m_30 * other.m_03 + this.m_31 * other.m_13 + this.m_32 * other.m_23 + this.m_33 * other.m_33;

    return xf;
  }

  print() {
    console.log(`${this.m_00} ${this.m_01} ${this.m_02} ${this.m_03}`);
    console.log(`${this.m_10} ${this.m_11} ${this.m_12} ${this.m_13}`);
    console.log(`${this.m_20} ${this.m_21} ${this.m_22} ${this.m_23}`);
    console.log(`${this.m_30} ${this.m_31} ${this.m_32} ${this.m_33}`);
    console.log();
  }

  public static fromTransform(transform: Transform) {
    const xform = new Transform();

    xform.m_00 = transform.m_00;
    xform.m_01 = transform.m_01;
    xform.m_02 = transform.m_02;
    xform.m_03 = transform.m_03;
    xform.m_10 = transform.m_10;
    xform.m_11 = transform.m_11;
    xform.m_12 = transform.m_12;
    xform.m_13 = transform.m_13;
    xform.m_20 = transform.m_20;
    xform.m_21 = transform.m_21;
    xform.m_22 = transform.m_22;
    xform.m_23 = transform.m_23;
    xform.m_30 = transform.m_30;
    xform.m_31 = transform.m_31;
    xform.m_32 = transform.m_32;
    xform.m_33 = transform.m_33;

    return xform;
  }

  public static fromArray(array: Matrix4LikeArray) {
    const xform = new Transform();

    xform.m_00 = array[0][0];
    xform.m_01 = array[0][1];
    xform.m_02 = array[0][2];
    xform.m_03 = array[0][3];
    xform.m_10 = array[1][0];
    xform.m_11 = array[1][1];
    xform.m_12 = array[1][2];
    xform.m_13 = array[1][3];
    xform.m_20 = array[2][0];
    xform.m_21 = array[2][1];
    xform.m_22 = array[2][2];
    xform.m_23 = array[2][3];
    xform.m_30 = array[3][0];
    xform.m_31 = array[3][1];
    xform.m_32 = array[3][2];
    xform.m_33 = array[3][3];

    return xform;
  }

  public toArray(): number[] {
    return [
      this.m_00,
      this.m_01,
      this.m_02,
      this.m_03,
      this.m_10,
      this.m_11,
      this.m_12,
      this.m_13,
      this.m_20,
      this.m_21,
      this.m_22,
      this.m_23,
      this.m_30,
      this.m_31,
      this.m_32,
      this.m_33,
    ];
  }

  public static identity() {
    const xform = new Transform();
    xform.m_00 = 1.0;
    xform.m_11 = 1.0;
    xform.m_22 = 1.0;
    xform.m_33 = 1.0;

    return xform;
  }

  public static translation(dx: number, dy: number, dz: number) {
    const xform = Transform.identity();
    xform.m_03 = dx;
    xform.m_13 = dy;
    xform.m_23 = dz;
    xform.m_33 = 1.0;
    return xform;
  }

  public static changeBasis(source: Plane, target: Plane) {
    const p0: Vector = source.origin;
    const x0: Vector = source.xaxis;
    const y0: Vector = source.yaxis;
    const z0: Vector = source.zaxis;

    const p1: Vector = target.origin;
    const x1: Vector = target.xaxis;
    const y1: Vector = target.yaxis;
    const z1: Vector = target.zaxis;

    const f0 = createMatrixFromPlane(p0, x0, y0, z0);

    const origin = new Vector(0, 0, 0).minus(p1);

    const t1 = Transform.translation(origin.x, origin.y, origin.z);

    const cb = ChangeBasis(
      new Vector(1, 0, 0),
      new Vector(0, 1, 0),
      new Vector(0, 0, 1),
      x1,
      y1,
      z1
    );

    if (!cb) return null;

    const m = Transform.fromTransform(cb);
    return m.multiply(t1).multiply(f0);
  }
}

function createMatrixFromPlane(
  origin: Vector,
  xaxis: Vector,
  yaxis: Vector,
  zaxis: Vector
) {
  const xform = new Transform();

  xform.m_00 = xaxis.x;
  xform.m_10 = xaxis.y;
  xform.m_20 = xaxis.z;
  xform.m_30 = 0;

  xform.m_01 = yaxis.x;
  xform.m_11 = yaxis.y;
  xform.m_21 = yaxis.z;
  xform.m_31 = 0;

  xform.m_02 = zaxis.x;
  xform.m_12 = zaxis.y;
  xform.m_22 = zaxis.z;
  xform.m_32 = 0;

  xform.m_03 = origin.x;
  xform.m_13 = origin.y;
  xform.m_23 = origin.z;
  xform.m_33 = 1;

  return xform;
}

// function printMatrix(matrix: Matrix4) {
//   console.log();
//   for (let i = 0; i < 4; i++) {
//     let row = "";
//     for (let j = 0; j < 4; j++) {
//       row += matrix.elements[i + j * 4];
//       row += " ";
//     }
//     console.log(row);
//   }
//   console.log();
// }

function ChangeBasis(
  x0: Vector,
  y0: Vector,
  z0: Vector,
  x1: Vector,
  y1: Vector,
  z1: Vector
) {
  const m_xform: Matrix4LikeArray = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  const X0 = x0.clone();
  const Y0 = y0.clone();
  const Z0 = z0.clone();
  const X1 = x1.clone();
  const Y1 = y1.clone();
  const Z1 = z1.clone();

  let a, b, c, d;
  a = X1.dot(Y1);
  b = X1.dot(Z1);
  c = Y1.dot(Z1);
  // prettier-ignore
  let R = [
      [X1.dot(X1), a, b, X1.dot(X0), X1.dot(Y0), X1.dot(Z0)],
      [a, Y1.dot(Y1), c, Y1.dot(X0), Y1.dot(Y0), Y1.dot(Z0)],
      [b, c, Z1.dot(Z1), Z1.dot(X0), Z1.dot(Y0), Z1.dot(Z0)],
    ];
  //double R[3][6] = {{X1*X1,      a,      b,       X0*X1, X0*Y1, X0*Z1},
  //                  {    a,  Y1*Y1,      c,       Y0*X1, Y0*Y1, Y0*Z1},
  //                  {    b,      c,  Z1*Z1,       Z0*X1, Z0*Y1, Z0*Z1}};

  // row reduce R
  let i0 = R[0][0] >= R[1][1] ? 0 : 1;
  if (R[2][2] > R[i0][i0]) i0 = 2;
  let i1 = (i0 + 1) % 3;
  let i2 = (i1 + 1) % 3;
  if (R[i0][i0] == 0.0) return false;
  d = 1.0 / R[i0][i0];
  R[i0][0] *= d;
  R[i0][1] *= d;
  R[i0][2] *= d;
  R[i0][3] *= d;
  R[i0][4] *= d;
  R[i0][5] *= d;
  R[i0][i0] = 1.0;
  if (R[i1][i0] != 0.0) {
    d = -R[i1][i0];
    R[i1][0] += d * R[i0][0];
    R[i1][1] += d * R[i0][1];
    R[i1][2] += d * R[i0][2];
    R[i1][3] += d * R[i0][3];
    R[i1][4] += d * R[i0][4];
    R[i1][5] += d * R[i0][5];
    R[i1][i0] = 0.0;
  }
  if (R[i2][i0] != 0.0) {
    d = -R[i2][i0];
    R[i2][0] += d * R[i0][0];
    R[i2][1] += d * R[i0][1];
    R[i2][2] += d * R[i0][2];
    R[i2][3] += d * R[i0][3];
    R[i2][4] += d * R[i0][4];
    R[i2][5] += d * R[i0][5];
    R[i2][i0] = 0.0;
  }

  if (Math.abs(R[i1][i1]) < Math.abs(R[i2][i2])) {
    let i = i1;
    i1 = i2;
    i2 = i;
  }
  if (R[i1][i1] == 0.0) return false;
  d = 1.0 / R[i1][i1];
  R[i1][0] *= d;
  R[i1][1] *= d;
  R[i1][2] *= d;
  R[i1][3] *= d;
  R[i1][4] *= d;
  R[i1][5] *= d;
  R[i1][i1] = 1.0;
  if (R[i0][i1] != 0.0) {
    d = -R[i0][i1];
    R[i0][0] += d * R[i1][0];
    R[i0][1] += d * R[i1][1];
    R[i0][2] += d * R[i1][2];
    R[i0][3] += d * R[i1][3];
    R[i0][4] += d * R[i1][4];
    R[i0][5] += d * R[i1][5];
    R[i0][i1] = 0.0;
  }
  if (R[i2][i1] != 0.0) {
    d = -R[i2][i1];
    R[i2][0] += d * R[i1][0];
    R[i2][1] += d * R[i1][1];
    R[i2][2] += d * R[i1][2];
    R[i2][3] += d * R[i1][3];
    R[i2][4] += d * R[i1][4];
    R[i2][5] += d * R[i1][5];
    R[i2][i1] = 0.0;
  }

  if (R[i2][i2] == 0.0) return false;
  d = 1.0 / R[i2][i2];
  R[i2][0] *= d;
  R[i2][1] *= d;
  R[i2][2] *= d;
  R[i2][3] *= d;
  R[i2][4] *= d;
  R[i2][5] *= d;
  R[i2][i2] = 1.0;
  if (R[i0][i2] != 0.0) {
    d = -R[i0][i2];
    R[i0][0] += d * R[i2][0];
    R[i0][1] += d * R[i2][1];
    R[i0][2] += d * R[i2][2];
    R[i0][3] += d * R[i2][3];
    R[i0][4] += d * R[i2][4];
    R[i0][5] += d * R[i2][5];
    R[i0][i2] = 0.0;
  }
  if (R[i1][i2] != 0.0) {
    d = -R[i1][i2];
    R[i1][0] += d * R[i2][0];
    R[i1][1] += d * R[i2][1];
    R[i1][2] += d * R[i2][2];
    R[i1][3] += d * R[i2][3];
    R[i1][4] += d * R[i2][4];
    R[i1][5] += d * R[i2][5];
    R[i1][i2] = 0.0;
  }

  m_xform[0][0] = R[0][3];
  m_xform[0][1] = R[0][4];
  m_xform[0][2] = R[0][5];

  m_xform[1][0] = R[1][3];
  m_xform[1][1] = R[1][4];
  m_xform[1][2] = R[1][5];

  m_xform[2][0] = R[2][3];
  m_xform[2][1] = R[2][4];
  m_xform[2][2] = R[2][5];

  return Transform.fromArray(m_xform);
}
