export type MergeSpan = {
  colSpan: number;
  rowSpan: number;
};

export type MergeLookup = {
  covered: Set<string>;
  spans: Map<string, MergeSpan>;
};
