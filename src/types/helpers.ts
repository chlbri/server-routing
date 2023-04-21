import type { Booleans, Objects, Pipe, Strings, Tuples } from 'hotscript';

export type WithRoutes = {
  routes?: Record<string, RouteJSON>;
};
export type Config = _RouteJSON & WithRoutes;

export type RouteJSON = Config | string;

export type IO = [any, any];

type _RouteJSON = {
  types?: IO;
  controller: string;
  middleware?: string;
};

type Reducer<T extends Config, R extends readonly string[]> = Pipe<
  R,
  [Tuples.Length]
> extends 0
  ? Pick<T, 'controller' | 'middleware'>
  : R[0] extends infer R0
  ? R0 extends keyof T['routes']
    ? T['routes'][R0] extends infer A
      ? A extends Config
        ? Reducer<A, Pipe<R, [Tuples.Drop<1>]>>
        : never
      : never
    : never
  : never;

export type Flat<T extends Config> = {
  [K in RoutesStrings<T>]: Reducer<
    T,
    Pipe<K, [Strings.Split<'/'>, Tuples.Drop<1>]>
  >;
};

export type ChildRoutes<T extends RouteJSON> = T extends WithRoutes
  ? Exclude<T['routes'], undefined>[keyof T['routes']]
  : never;

export type InvertExclude<T, K> = K extends T ? never : T;

// #region Building RouteStrings
// #region Type: RecursiveRoutes
type RecursiveRoutes<T> = Pipe<
  T,
  [
    Objects.Get<'routes'>,
    Objects.PickBy<
      Booleans.Extends<RouteJSON & { routes: Record<string, RouteJSON> }>
    >,
  ]
>;
// #endregion

// #region Type: GetShallowRoutesStrings
type GetShallowRoutesStrings<T, K> = Pipe<
  T,
  [
    Objects.Get<'routes'>,
    Objects.Keys,
    Strings.Prepend<'/'>,
    Strings.Prepend<K & string>,
  ]
>;
// #endregion

// #region Type: RecursiveRouteStrings
type RecursiveRouteStrings<T, K> = RecursiveRoutes<T> extends infer R
  ? R[keyof R] extends infer A
    ? A extends RouteJSON
      ? RoutesStrings<A, `${K & string}/${keyof R & string}`>
      : never
    : never
  : never;
// #endregion

// #region Type: RoutesStrings
export type RoutesStrings<T, K = ''> =
  | '/'
  | GetShallowRoutesStrings<T, K>
  | RecursiveRouteStrings<T, K>;
// #endregion
// #endregion
