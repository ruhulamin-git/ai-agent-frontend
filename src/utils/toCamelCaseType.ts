type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

type toCamelCaseType<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K] extends Array<infer U>
    ? Array<toCamelCaseType<U>>
    : T[K] extends object
    ? toCamelCaseType<T[K]>
    : T[K];
};

export type { toCamelCaseType };
