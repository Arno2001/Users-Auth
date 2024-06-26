// Represents a constructor function that creates instances of type T, optionally accepting Arguments as constructor parameters.
export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (
  ...arguments_: Arguments
) => T;

// Represents a type that can either be a value of type T or undefined.
export type Optional<T> = T | undefined;
