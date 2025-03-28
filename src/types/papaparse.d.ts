declare module "papaparse" {
  interface UnparseConfig {
    quotes?: boolean | boolean[];
    quoteChar?: string;
    escapeChar?: string;
    delimiter?: string;
    header?: boolean;
    newline?: string;
    skipEmptyLines?: boolean | "greedy";
    columns?: string[];
  }

  export function unparse<T = unknown>(data: T[] | { fields: string[]; data: string[][] }, config?: UnparseConfig): string;
}
