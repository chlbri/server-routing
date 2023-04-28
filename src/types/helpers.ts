import type { Booleans, Objects, Pipe, Strings, Tuples } from 'hotscript';

export type WithRoutes = {
  routes?: Record<string, RouteJSON>;
};

export type UnknownToUndefined<T> = unknown extends T ? undefined : T;

export type U_U<T> = UnknownToUndefined<T>;

export type EmptyObject = NonNullable<unknown>;

export type Config = _RouteJSON & WithRoutes;

export type RouteJSON = Config | string;

export type IO = [any, any];

export type ControllerType = 'get' | 'post' | 'subscription';

export type _RouteJSON = {
  types?: IO;
  controller: string;
  middleware?: string;
  type?: ControllerType;
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
        : A extends string
        ? A
        : never
      : never
    : never
  : never;

export type Flat<T extends Config> = {
  [K in RoutesMap<T>]: Reducer<
    T,
    Pipe<K, [Strings.Split<'/'>, Tuples.Drop<1>]>
  >;
};

export type ChildRoutes<T> = T extends WithRoutes
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
      ? RoutesMap<A, `${K & string}/${keyof R & string}`>
      : never
    : never
  : never;
// #endregion

// #region Type: RoutesStrings
export type RoutesMap<T, K = ''> =
  | '/'
  | GetShallowRoutesStrings<T, K>
  | RecursiveRouteStrings<T, K>;
// #endregion
// #endregion

// #region ExtractControllerStrings
export type ExtractControllerStrings<T extends Config> = Pipe<
  Flat<T>,
  [
    Objects.PickBy<Booleans.Extends<{ controller: string }>>,
    Objects.OmitBy<Booleans.Extends<{ controller?: undefined }>>,
    Objects.Values,
    Objects.Get<'controller'>,
  ]
>;
// #endregion

// #region ExtractMiddlewareStrings
export type ExtractMiddlewareStrings<T extends Config> = Pipe<
  Flat<T>,
  [
    Objects.PickBy<Booleans.Extends<{ middleware: string }>>,
    Objects.OmitBy<Booleans.Extends<{ middleware?: undefined }>>,
    Objects.Values,
    Objects.Get<'middleware'>,
  ]
>;
// #endregion

export type GetRoutesForController<T extends Config, K> = Pipe<
  Flat<T>,
  [
    Objects.PickBy<Booleans.Extends<{ controller: K }>>,
    Objects.OmitBy<Booleans.Equals<never>>,
  ]
>;

export type GetRoutesForMiddleware<T extends Config, K> = Pipe<
  Flat<T>,
  [
    Objects.PickBy<Booleans.Extends<{ middleware: K }>>,
    Objects.OmitBy<Booleans.Equals<never>>,
  ]
>;

// #region ExtractTypesForController
export type ExtractTypesForController<
  R extends Config,
  TTypes extends RouteTypes<R>,
  K,
> = keyof GetRoutesForController<R, K> extends infer A
  ? A extends keyof TTypes
    ? TTypes[A]
    : never
  : never;
// #endregion

export type RouteTypes<T extends RouteJSON> = Partial<
  Record<RoutesMap<T>, IO>
>;

// #region ExtractTypesForMiddleware
export type ExtractTypesForMiddleware<
  R extends Config,
  TTypes extends RouteTypes<R>,
  K,
> = keyof GetRoutesForMiddleware<R, K> extends infer A
  ? A extends keyof TTypes
    ? TTypes[A]
    : never
  : never;
// #endregion
