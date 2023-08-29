/// <reference types="vite/client" />
declare module "polybooljs" {
  export function union(poly1, poly2);
  export function intersect(poly1, poly2);
  export function difference(poly1, poly2); // poly1 - poly2
  export function differenceRev(poly1, poly2); // poly2 - poly1
  export function xor(poly1, poly2);
  export function segments(polygon);
  export function combine(segments1, segments2);
  export function selectUnion(combined);
  export function selectIntersect(combined);
  export function selectDifference(combined);
  export function selectDifferenceRev(combined);
  export function selectXor(combined);
  export function polygon(segments);
}
