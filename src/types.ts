export type RouteJSON = {
  types?: [any, any];
  controller: string;
  middleware?: string;
  routes?: Record<string, RouteJSON>;
};

type ChildRoutes<T extends RouteJSON> = Exclude<
  T['routes'],
  undefined
>[keyof T['routes']];

type InvertExclude<T, K> = K extends T ? never : T;

/**
 * Example before better typing
 */
// type OptionsM = {
//   inputs?: Record<string, z.ZodAny>;
//   outputs?: Record<string, z.ZodAny>;
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   controllers?: Record<string, Function>;
// };

// #region ExtractControllerStrings
export type ExtractControllerStrings<T extends RouteJSON> = T extends {
  controller: infer Controller;
}
  ? Controller | ExtractControllerStrings<ChildRoutes<T>>
  : never;

// #endregion

// #region ExtractTypesForController
export type ExtractInputForController<T extends RouteJSON, K> = T extends {
  controller: K;
  types?: [infer Types, ...any];
}
  ?
      | Types
      | InvertExclude<
          ExtractInputForController<ChildRoutes<T>, K>,
          unknown
        >
  : T extends { routes?: undefined }
  ? never
  : ExtractInputForController<ChildRoutes<T>, K>;

type ExtractOutputForController<T extends RouteJSON, K> = T extends {
  controller: K;
  types?: [any, infer Types];
}
  ?
      | Types
      | InvertExclude<
          ExtractOutputForController<ChildRoutes<T>, K>,
          unknown
        >
  : T extends { routes?: undefined }
  ? never
  : ExtractOutputForController<ChildRoutes<T>, K>;

export type ExtractTypesForController<T extends RouteJSON, K> = [
  ExtractInputForController<T, K>,
  ExtractOutputForController<T, K>,
];
// #endregion

export type ExtractMiddlewareStrings<T extends RouteJSON> = T extends {
  middleware: infer Middleware;
}
  ?
      | Middleware
      | ExtractMiddlewareStrings<
          Exclude<T['routes'], undefined>[keyof T['routes']]
        >
  : never;

export type ExtractTypesForMiddleware<T extends RouteJSON, K> = T extends {
  middleware: K;
  types?: infer Types;
}
  ?
      | Types
      | ExtractTypesForMiddleware<
          Exclude<T['routes'], undefined>[keyof T['routes']],
          K
        >
  : never;
