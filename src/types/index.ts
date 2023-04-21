import type { Booleans, Objects, Pipe, Tuples } from 'hotscript';
import type {
  ChildRoutes,
  Config,
  Flat,
  IO,
  RouteJSON,
  RoutesStrings,
} from './helpers';

// #region ExtractControllerStrings
export type ExtractControllerStrings<T extends Config> =
  Flat<T> extends Record<
    string,
    {
      controller: infer K;
    }
  >
    ? K
    : never;
// #endregion

// #region ExtractMiddlewareStrings
export type ExtractMiddlewareStrings<T extends Config> = T extends {
  middleware?: infer Middleware;
}
  ?
      | Middleware
      | (ChildRoutes<T> extends Config
          ? ExtractMiddlewareStrings<ChildRoutes<T>>
          : never)
  : never;
// #endregion

export type GetRoutesForController<T extends Config, K> = Pipe<
  Flat<T>,
  [Objects.PickBy<Booleans.Extends<{ controller: K }>>]
>;

export type GetRoutesForMiddleware<T extends Config, K> = Pipe<
  Flat<T>,
  [Objects.PickBy<Booleans.Extends<{ middleware: K }>>]
>;

// #region ExtractTypesForController
export type ExtractTypesForController<
  R extends Config,
  TTypes extends Types<R>,
  K,
> = GetRoutesForController<R, K> extends infer A
  ? A extends keyof TTypes
    ? TTypes[A]
    : never
  : never;
// #endregion

// #region ExtractTypesForMiddleware
export type ExtractTypesForMiddleware<
  R extends Config,
  TTypes extends Types<R>,
  K,
> = GetRoutesForMiddleware<R, K> extends infer A
  ? A extends keyof TTypes
    ? TTypes[A]
    : never
  : never;
// #endregion

export type Types<T extends RouteJSON> = Partial<
  Record<RoutesStrings<T>, IO>
>;

// #region Options
// TODO: Test it
export type Options<
  Route extends Config,
  TTypes extends Types<Route> = Types<Route>,
> = {
  controllers: {
    [key in ExtractControllerStrings<Route> &
      string]: ExtractTypesForController<
      Route,
      TTypes,
      key
    > extends infer TT
      ? (input: Pipe<TT, [Tuples.At<0>]>) => Pipe<TT, [Tuples.At<1>]>
      : never;
  };
};
// #endregion

export type { RoutesStrings, Config };
