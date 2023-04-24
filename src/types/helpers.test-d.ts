import { expectType } from 'jest-tsd';
import type { RoutesMap } from './helpers';

// #region Routes strings
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
