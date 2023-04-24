import { expectType } from 'jest-tsd';

import { EmptyObject, IO } from './helpers';
import type {
  ExtractControllerStrings,
  ExtractMiddlewareStrings,
  RouteTypes,
  RoutesOptions,
} from './index';

// #region Controllers Strings
{
  // #region Simple, without nested routes
  {
    type Actual = ExtractControllerStrings<{
      controller: 'ret';
    }>;

    type Expect = 'ret';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With one nested routes
  {
    type Actual = ExtractControllerStrings<{
      controller: 'ret';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          output: 'output2';
        };
      };
    }>;

    type Expect = 'ret' | 'control';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller
  {
    type Actual = ExtractControllerStrings<{
      controller: 'control';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          output: 'output2';
        };
        route4: {
          controller: 'control';
        };
        route5: {
          controller: 'control';
        };
      };
    }>;

    type Expect = 'control';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes with specifics controllers
  {
    type Actual = ExtractControllerStrings<{
      controller: 'control1';
      output: 'output';
      routes: {
        machine: {
          controller: 'control2';
          output: 'output2';
        };
        route4: {
          controller: 'control4';
          output: 'output4';
        };
        route5: {
          controller: 'control5';
          output: 'output5';
        };
      };
    }>;

    type Expect = 'control1' | 'control2' | 'control4' | 'control5';

    expectType<Expect>({} as Actual);
  }
  // #endregion
}
// #endregion

// #region Middlewares Strings
{
  // #region Simple, without nested routes
  {
    type Actual = ExtractMiddlewareStrings<{
      controller: 'control';
      middleware: 'ret';
    }>;

    type Expect = 'ret';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With one nested routes
  {
    type Actual = ExtractMiddlewareStrings<{
      controller: 'control';
      middleware: 'ret';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware';
          output: 'output2';
        };
      };
    }>;

    type Expect = 'ret' | 'middleware';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller
  {
    type Actual = ExtractMiddlewareStrings<{
      controller: 'control';
      middleware: 'middleware';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware';
          output: 'output2';
        };
        route4: {
          controller: 'control';
          middleware: 'middleware';
        };
        route5: {
          controller: 'control';
          middleware: 'middleware';
        };
      };
    }>;

    type Expect = 'middleware';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes with specifics controllers
  {
    type ActualTest = {
      controller: 'control';
      middleware: 'middleware1';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware2';
        };
        route4: {
          controller: 'control';
          middleware: 'middleware4';
        };
        route5: {
          controller: 'control';
          middleware: 'middleware5';
          routes: {
            grandRoute: {
              controller: 'control';
            };
            grandRoute2: {
              controller: 'controle';
              routes: {
                greatGrandRoute1: {
                  controller: 'control';
                };
              };
            };
          };
        };
      };
    };

    type Actual = ExtractMiddlewareStrings<ActualTest>;

    type Expect =
      | 'middleware1'
      | 'middleware2'
      | 'middleware4'
      | 'middleware5';

    expectType<Expect>({} as Actual);
  }
  // #endregion
}
// #endregion

// #region RouteType
{
  // #region Simple, without nested routes
  {
    type Actual = RouteTypes<{
      controller: 'control';
      middleware: 'ret';
    }>;

    type Expect = {
      '/'?: IO;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With one nested routes
  {
    type Actual = RouteTypes<{
      controller: 'control';
      middleware: 'ret';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware';
          output: 'output2';
        };
      };
    }>;

    type Expect = {
      '/'?: IO;
      '/machine'?: IO;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller
  {
    type Actual = RouteTypes<{
      controller: 'control';
      middleware: 'middleware';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware';
          output: 'output2';
        };
        route4: {
          controller: 'control';
          middleware: 'middleware';
        };
        route5: {
          controller: 'control';
          middleware: 'middleware';
        };
      };
    }>;

    type Expect = {
      '/'?: IO;
      '/machine'?: IO;
      '/route4'?: IO;
      '/route5'?: IO;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes with specifics controllers
  {
    type ActualTest = {
      controller: 'control';
      middleware: 'middleware1';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware2';
        };
        route4: {
          controller: 'control';
          middleware: 'middleware4';
        };
        route5: {
          controller: 'control';
          middleware: 'middleware5';
          routes: {
            grandRoute: {
              controller: 'control';
            };
            grandRoute2: {
              controller: 'controle';
              routes: {
                greatGrandRoute1: {
                  controller: 'control';
                };
              };
            };
          };
        };
      };
    };

    type Actual = RouteTypes<ActualTest>;

    type Expect = {
      '/'?: IO;
      '/machine'?: IO;
      '/route4'?: IO;
      '/route5'?: IO;
      '/route5/grandRoute'?: IO;
      '/route5/grandRoute2'?: IO;
      '/route5/grandRoute2/greatGrandRoute1'?: IO;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion
}
// #endregion

// #region Options
{
  // #region Simple, without nested routes
  {
    type TT = {
      '/'?: [string, boolean];
    };

    type Actual = RoutesOptions<
      {
        controller: 'control';
        middleware: 'ret';
      },
      TT
    >;

    type Expect = {
      controllers?: {
        control?: (input: string) => boolean;
      };
      middlewares?: {
        ret?: (input: string) => string;
      };
      routes?: EmptyObject;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With one nested routes
  {
    type TT = {
      '/'?: [string, string[]];
      '/machine'?: [boolean, object];
    };

    type Actual = RoutesOptions<
      {
        controller: 'control';
        middleware: 'ret';
        routes: {
          machine: {
            controller: 'control';
            middleware: 'middleware';
          };
        };
      },
      TT
    >;

    type Expect = {
      controllers?: {
        control?: (input: string | boolean) => object | string[];
      };
      middlewares?: {
        ret?: (input: string) => string;
        middleware?: (input: boolean) => boolean;
      };
      routes?: EmptyObject;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller
  {
    type TT = {
      '/'?: [symbol, string];
      '/machine'?: [string, string];
      '/route4'?: [boolean, string];
      '/route5'?: [number, string];
    };

    type Actual = RoutesOptions<
      {
        controller: 'control';
        middleware: 'middleware';
        routes: {
          machine: {
            controller: 'control';
            middleware: 'middleware';
          };
          route4: {
            controller: 'control';
            middleware: 'middleware';
          };
          route5: {
            controller: 'control';
            middleware: 'middleware';
          };
        };
      },
      TT
    >;

    type Expect = {
      controllers?: {
        control?: (input: string | number | boolean | symbol) => string;
      };
      middlewares?: {
        middleware?: (
          input: string | number | boolean | symbol,
        ) => string | number | boolean | symbol;
      };
      routes?: EmptyObject;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes with specifics controllers
  {
    type TT = {
      '/'?: [string, string];
      '/machine'?: [string, string];
      '/route4'?: [string, string];
      '/route5'?: [number, object];
      '/route5/grandRoute'?: [string, number];
      '/route5/grandRoute2'?: [boolean, string];
      '/route5/grandRoute2/greatGrandRoute1'?: [string, object];
    };

    type ActualTest = {
      controller: 'control';
      middleware: 'middleware1';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware2';
        };
        route4: {
          controller: 'control';
          middleware: 'middleware4';
        };
        route5: {
          controller: 'control';
          middleware: 'middleware5';
          routes: {
            grandRoute: {
              controller: 'control';
            };
            grandRoute2: {
              controller: 'controle';
              routes: {
                greatGrandRoute1: {
                  controller: 'control';
                  middleware: 'middleware1';
                };
              };
            };
          };
        };
      };
    };

    type Actual = RoutesOptions<ActualTest, TT>;

    type Expect = {
      controllers?: {
        control?: (input: string | number) => string | number | object;
        controle?: (input: boolean) => string;
      };
      middlewares?: {
        middleware1?: (input: string) => string;
        middleware2?: (input: string) => string;
        middleware4?: (input: string) => string;
        middleware5?: (input: number) => number;
      };
      routes?: EmptyObject;
    };

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region String route
  {
    type TT = {
      '/'?: [string, number];
      '/machine'?: [boolean, number];
      '/composite': [number, number];
      '/composite/child1': [boolean, number];
      '/composite/child2': [number, string];
    };

    type ActualTest = {
      controller: 'control';
      middleware: 'middleware1';
      routes: {
        machine: 'routeStr';
        composite: {
          controller: 'control2';
          routes: {
            child1: 'routeStr2';
            child2: {
              controller: 'control2';
              middleware: 'middleware2';
            };
          };
        };
      };
    };

    type Actual5 = RoutesOptions<ActualTest, TT>;

    // type Help = Actual5['routes'];
    // type Help2 = RoutesStrings<ActualTest>;
    // type Help3 = ExtractMiddlewareStrings<ActualTest>;

    type Expect5 = {
      controllers?: {
        control?: (input: string) => number;
        control2?: (input: number) => string | number;
      };
      middlewares?: {
        middleware1?: (input: string) => string;
        middleware2?: (input: number) => number;
      };
      routes?: {
        routeStr?: any;
        routeStr2?: any;
      };
    };

    expectType<Expect5>({} as Actual5);
  }
  // #endregion
}
// #endregion
