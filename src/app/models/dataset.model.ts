export interface Dataset {
  axe: Array<string>;
  graphs: Array<Graph>;
}

export interface Graph {
  title: string;
  color: Array<string>;
  unit: string;
  datas: Array<number>;
}
