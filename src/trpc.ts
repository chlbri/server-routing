import {
  BuildProcedure,
  DefaultDataTransformer,
  DefaultErrorShape,
  RootConfig,
  Router,
  inferAsyncReturnType,
  initTRPC,
} from '@trpc/server';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { RouterDef } from '@trpc/server/dist/core/router';
import { z } from 'zod';
import { EmptyObject } from './types/helpers';
import { Parser } from '@trpc/server/dist/core/parser';

type P = Parser;

// Initialize a context for the server
function createContext(opts: CreateHTTPContextOptions) {
  return {};
}

// Get the context type
type Context = inferAsyncReturnType<typeof createContext>;

initTRPC;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Create main router
const appRouter = t.router({
  // Greeting procedure
  greeting: t.procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => `Hello, ${input.name}!`),
  training: t.procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .output(z.string())
    .mutation(({ input }) => `Hello, ${input.name}!`),
  machine: t.router({}),
  all: {
    reta: t.procedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .query(({ input }) => `Hello, ${input.name}!`),
    teta: t.router({}),
  },
});

// Export the app router type to be imported on the client side
export type AppRouter = typeof appRouter;

type Test1 = Router<
  RouterDef<
    RootConfig<{
      ctx: EmptyObject;
      meta: object;
      errorShape: DefaultErrorShape;
      transformer: DefaultDataTransformer;
    }>,
    {
      greeting: BuildProcedure<
        'query',
        {
          _config: RootConfig<{
            ctx: EmptyObject;
            meta: object;
            errorShape: DefaultErrorShape;
            transformer: DefaultDataTransformer;
          }>;
          _meta: object;
          _ctx_out: EmptyObject;
          _input_in: { name: string };
          _input_out: { name: string };
          readonly _output_in: unique symbol;
          readonly _output_out: unique symbol;
        },
        string
      >;
      training: BuildProcedure<
        'mutation',
        {
          _config: RootConfig<{
            ctx: EmptyObject;
            meta: object;
            errorShape: DefaultErrorShape;
            transformer: DefaultDataTransformer;
          }>;
          _meta: object;
          _ctx_out: EmptyObject;
          _input_in: { name: string };
          _input_out: { name: string };
          _output_in: string;
          _output_out: string;
        },
        unknown
      >;
      machine: Router<
        RouterDef<
          RootConfig<{
            ctx: EmptyObject;
            meta: object;
            errorShape: DefaultErrorShape;
            transformer: DefaultDataTransformer;
          }>,
          EmptyObject,
          {
            queries: EmptyObject;
            mutations: EmptyObject;
            subscriptions: EmptyObject;
          }
        >
      >;
    },
    {
      queries: EmptyObject;
      mutations: EmptyObject;
      subscriptions: EmptyObject;
    }
  >
> & {
  greeting: BuildProcedure<
    'query',
    {
      _config: RootConfig<{
        ctx: EmptyObject;
        meta: object;
        errorShape: DefaultErrorShape;
        transformer: DefaultDataTransformer;
      }>;
      _meta: object;
      _ctx_out: EmptyObject;
      _input_in: { name: string };
      _input_out: { name: string };
      readonly _output_in: unique symbol;
      readonly _output_out: unique symbol;
    },
    string
  >;
  training: BuildProcedure<
    'mutation',
    {
      _config: RootConfig<{
        ctx: EmptyObject;
        meta: object;
        errorShape: DefaultErrorShape;
        transformer: DefaultDataTransformer;
      }>;
      _meta: object;
      _ctx_out: EmptyObject;
      _input_in: { name: string };
      _input_out: { name: string };
      _output_in: string;
      _output_out: string;
    },
    unknown
  >;
  machine: Router<
    RouterDef<
      RootConfig<{
        ctx: EmptyObject;
        meta: object;
        errorShape: DefaultErrorShape;
        transformer: DefaultDataTransformer;
      }>,
      EmptyObject,
      {
        queries: EmptyObject;
        mutations: EmptyObject;
        subscriptions: EmptyObject;
      }
    >
  >;
};
type Test2 = AppRouter['machine'];

// Create HTTP server
