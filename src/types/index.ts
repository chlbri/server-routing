import type { Booleans, Objects, Pipe, Tuples } from 'hotscript';
import type {
  Config,
  Flat,
  IO,
  RouteJSON,
  RoutesMap,
  _RouteJSON,
} from './helpers';

export type SimpleRouteJSON = _RouteJSON & {
  routes?: Record<string, SimpleRouteJSON>;
};

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

export type RouteTypes<T extends RouteJSON> = Partial<
  Record<RoutesMap<T>, IO>
>;

export type RoutesStrings<T extends Config> = Pipe<
  Flat<T>,
  [Objects.PickBy<Booleans.Extends<string>>, Objects.Values]
>;

// #region Options
export type RoutesOptions<
  Route extends Config,
  TTypes extends RouteTypes<Route> = RouteTypes<Route>,
> = {
  controllers?: {
    [key in ExtractControllerStrings<Route> &
      string]?: ExtractTypesForController<
      Route,
      TTypes,
      key
    > extends infer TT
      ? (input: Pipe<TT, [Tuples.At<0>]>) => Pipe<TT, [Tuples.At<1>]>
      : never;
  };

  middlewares?: {
    [key in ExtractMiddlewareStrings<Route> &
      string]?: ExtractTypesForMiddleware<
      Route,
      TTypes,
      key
    > extends infer TT
      ? (input: Pipe<TT, [Tuples.At<0>]>) => Pipe<TT, [Tuples.At<0>]>
      : never;
  };

  routes?: {
    [key in RoutesStrings<Route> & string]?: any;
  };
};
// #endregion

export type { RoutesMap, Config };
