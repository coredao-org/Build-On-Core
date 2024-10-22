declare type Nullable<T> = T | null
declare type Maybe<T> = Nullable<T> | undefined
declare type ValuesOf<T extends readonly unknown[]> = T[number]

export type PriceFeedData = {
  price: bigint;
  decimal: number;
  timestamp: bigint;
};