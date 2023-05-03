import { Parser } from '@trpc/server/dist/core/parser';
import type { Booleans, Objects, Pipe, Strings, Tuples } from 'hotscript';
import { Primitive } from 'zod';

export type WithRoutes = {
  routes?: Record<string, RouteJSON>;
};

export type UnknownToUndefined<T> = unknown extends T ? undefined : T;

export type U_U<T> = UnknownToUndefined<T>;

export type EmptyObject = NonNullable<unknown>;

export type Config = _RouteJSON &
  WithRoutes & { context?: Primitive | Record<string, any> };

export type RouteJSON = Config | string;

export type IO = [any, any];

export type ControllerType = 'get' | 'post' | 'subscription';

export type _RouteJSON = {
  types?: IO;
  controller: string;
  middleware?: string;
  input?: string;
  output?: string;
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

export type Contexts<T extends Config> = {
  [K in RoutesMap<T>]?: GetConfigContextP<T>;
};

export type ChildRoutes<T> = T extends WithRoutes
  ? Exclude<T['routes'], undefined>[keyof T['routes']]
  : never;

export type InvertExclude<T, K> = K extends T ? never : T;

// #region Building RoutesMap
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

// #region Type: RoutesMap
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

// #region ExtractInputStrings
export type ExtractInputStrings<T extends Config> = Pipe<
  Flat<T>,
  [
    Objects.PickBy<Booleans.Extends<{ input: string }>>,
    Objects.OmitBy<Booleans.Extends<{ input?: undefined }>>,
    Objects.Values,
    Objects.Get<'input'>,
  ]
>;
// #endregion

// #region ExtractOutputStrings
export type ExtractOutputStrings<T extends Config> = Pipe<
  Flat<T>,
  [
    Objects.PickBy<Booleans.Extends<{ output: string }>>,
    Objects.OmitBy<Booleans.Extends<{ output?: undefined }>>,
    Objects.Values,
    Objects.Get<'output'>,
  ]
>;
// #endregion

export type GetConfigContext<T extends Config> = Pipe<
  T,
  [Objects.Get<'context'>]
>;

export type GetConfigContextP<T extends Config> =
  | Pipe<GetConfigContext<T>, [Objects.PartialDeep]>
  | undefined;

export type GetRoutesForController<T extends Config, K> = Pipe<
  Flat<T>,
  [Objects.PickBy<Booleans.Extends<{ controller: K }>>]
>;

export type GetRoutesForMiddleware<T extends Config, K> = Pipe<
  Flat<T>,
  [Objects.PickBy<Booleans.Extends<{ middleware: K }>>]
>;

export type ConfigTypes<R extends Config> = {
  inputs?: {
    [key in ExtractInputStrings<R> & string]?: Parser;
  };

  outputs?: {
    [key in ExtractOutputStrings<R> & string]?: Parser;
  };

  contexts?: {
    [key in keyof Flat<R>]?: GetConfigContextP<R>;
  };
};

// #region ExtractInputForController
export type ExtractInputForController<
  R extends Config,
  TT extends ConfigTypes<R>,
  K,
> = GetRoutesForController<R, K> extends { input?: infer I }
  ? I extends keyof TT['inputs']
    ? TT['inputs'][I]
    : any
  : any;
// #endregion

// #region ExtractOutputForController
export type ExtractOutputForController<
  R extends Config,
  TT extends ConfigTypes<R>,
  K,
> = GetRoutesForController<R, K> extends { output?: infer I }
  ? I extends keyof TT['inputs']
    ? TT['inputs'][I]
    : any
  : any;
// #endregion

// #region ExtractContextForController
export type ExtractContextForController<
  R extends Config,
  TT extends ConfigTypes<R>,
  C,
> = keyof GetRoutesForController<R, C> extends infer K
  ? K extends keyof TT['contexts']
    ? GetConfigContext<R> & TT['contexts'][K]
    : GetConfigContext<R>
  : never;
// #endregion

// #region ExtractTypesForController2
export type ExtractTypesForController2<
  R extends Config,
  TT extends ConfigTypes<R>,
  C,
> = (opts: {
  input: ExtractInputForController<R, TT, C>;
  ctx: ExtractContextForController<R, TT, C>;
}) => ExtractOutputForController<R, TT, C>;
// #endregion

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
