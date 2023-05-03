import { expectType } from 'jest-tsd';
import type {
  ExtractControllerStrings,
  ExtractMiddlewareStrings,
  GetConfigContextP,
  IO,
  RouteTypes,
  RoutesMap,
} from './helpers';

// #region RoutesMap
{
  // #region Simple, without nested routes
  {
    type Actual = RoutesMap<{
      controller: 'control';
      middleware: 'ret';
    }>;

    type Expect = '/';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With one nested routes
  {
    type Actual = RoutesMap<{
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

    type Expect = '/' | '/machine';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller
  {
    type Actual = RoutesMap<{
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

    type Expect = '/' | '/machine' | '/route4' | '/route5';

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes with specifics controllers
  {
    type ActualTest = {
      controller: 'control';
      middleware: 'middleware1';
      output: 'output';
      routes: {
        machine: {
          controller: 'control';
          middleware: 'middleware2';
          output: 'output2';
        };
        route4: {
          controller: 'control';
          middleware: 'middleware4';
          output: 'output4';
        };
        route5: {
          controller: 'control';
          middleware: 'middleware5';
          output: 'output5';
          routes: {
            grandRoute: {
              controller: 'control';
            };
            grandRoute2: {
              controller: 'control';
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

    type Actual = RoutesMap<ActualTest>;

    type Expect =
      | '/'
      | '/machine'
      | '/route4'
      | '/route5'
      | '/route5/grandRoute'
      | '/route5/grandRoute2'
      | '/route5/grandRoute2'
      | '/route5/grandRoute2/greatGrandRoute1';

    expectType<Expect>({} as Actual);
  }
  // #endregion
}
// #endregion

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

// #region GetConfigContext

// #region Simple, without nested elements
{
  type Actual = GetConfigContextP<{
    controller: 'control';
    context: string;
  }>;

  type Expect = string | undefined;

  expectType<Expect>({} as Actual);
}
// #endregion

// #region with nested elements
{
  type Actual = GetConfigContextP<{
    controller: 'control';
    context: { data?: string; id: number };
  }>;

  type Expect = { data?: string; id?: number } | undefined;

  expectType<Expect>({} as Actual);
}
// #endregion

// #region with deep nested elements
{
  type Actual = GetConfigContextP<{
    controller: 'control';
    context: {
      data?: {
        id: string;
        name: string;
      };
      opts: number;
    };
  }>;

  type Expect =
    | {
        data?: {
          id?: string;
          name?: string;
        };
        opts?: number;
      }
    | undefined;

  expectType<Expect>({} as Actual);
}
// #endregion

// #endregion
