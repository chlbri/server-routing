import { expectType } from 'jest-tsd';
import {
  ExtractControllerStrings,
  ExtractMiddlewareStrings,
  ExtractTypesForController,
} from './types';

// #region Controllers
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

// #region Types for Controllers
{
  // #region Simple, without nested routes
  {
    type Actual = ExtractTypesForController<
      {
        controller: 'ret';
        types: [string, number];
      },
      'ret'
    >;

    type Expect = [string, number];

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With one typed inside nested routes
  {
    type Actual = ExtractTypesForController<
      {
        controller: 'ret';
        types: [string, number];
        routes: {
          machine: {
            controller: 'control';
            types: [number, boolean];
          };
        };
      },
      'control'
    >;

    type Expect = [number, boolean];

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller, and without types
  {
    type Actual = ExtractTypesForController<
      {
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
      },
      'control'
    >;

    type Expect = [unknown, unknown];

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller, and without types, with a non existing controller
  {
    type Actual = ExtractTypesForController<
      {
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
      },
      'not exists'
    >;

    type Expect = [never, never];

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller, but only one type,
  {
    type Actual = ExtractTypesForController<
      {
        controller: 'control';
        output: 'output';
        types: [string, number];
        routes: {
          machine: {
            controller: 'control';
          };
          route4: {
            controller: 'control';
          };
          route5: {
            controller: 'control';
          };
        };
      },
      'control'
    >;

    type Expect = [string, number];

    expectType<Expect>({} as Actual);
  }
  // #endregion

  // #region With many nested routes, but they have same controller, and with different types,
  {
    type Actual = ExtractTypesForController<
      {
        controller: 'control';
        types: [string, boolean];
        routes: {
          machine: {
            controller: 'control';
            types: [number, boolean];
          };
          route4: {
            controller: 'control';
            types: [number, null];
          };
          route5: {
            controller: 'control';
            types: [string, number];
          };
        };
      },
      'control'
    >;

    type Expect = [string | number, boolean | number | null];

    expectType<Expect>({} as Actual);
  }
  // #endregion
}
// #endregion

// #region Middlewares
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
    type Actual = ExtractMiddlewareStrings<{
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
        };
      };
    }>;

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
