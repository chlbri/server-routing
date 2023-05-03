import { Parser } from '@trpc/server/dist/core/parser';
import type { Booleans, Objects, Pipe, Tuples } from 'hotscript';
import type {
  Config,
  ExtractControllerStrings,
  ExtractMiddlewareStrings,
  ExtractTypesForController,
  ExtractTypesForMiddleware,
  Flat,
  GetConfigContextP,
  RouteTypes,
  RoutesMap,
  _RouteJSON,
} from './helpers';

export type SimpleRouteJSON = _RouteJSON & {
  routes?: Record<string, SimpleRouteJSON>;
};

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
      ? (
          input: Pipe<TT, [Tuples.At<0>]>,
        ) => Promise<Pipe<TT, [Tuples.At<1>]>>
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
    [key in RoutesStrings<Route> & string]?: Flat<Config>;
  };
};
// #endregion

export type { RoutesMap, Config, RouteTypes };
