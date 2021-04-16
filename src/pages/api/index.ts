import { ApolloServer } from "apollo-server-micro";
import {
  booleanArg,
  intArg,
  makeSchema,
  mutationField,
  mutationType,
  nonNull,
  objectType,
  queryType,
} from "nexus";
import path from "path";
import { PrismaClient } from "@prisma/client";

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("img");
    t.boolean("done");
    t.boolean("sharer");
  },
});

const Query = queryType({
  definition(t) {
    t.list.field("users", {
      type: "User",
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
  },
});

const Mutation = mutationType({
  definition(t) {
    t.field("updateUser", {
      type: "User",
      args: {
        id: nonNull(intArg()),
        sharer: booleanArg(),
        done: booleanArg(),
      },
      resolve(_root, args, ctx) {
        const obj = { done: args?.done, sharer: args?.sharer };

        Object.keys(obj).forEach(
          (key) => obj[key] === undefined && delete obj[key]
        );

        return ctx.db.user.update({
          where: { id: args.id },
          data: obj,
        });
      },
    });

    t.field("deleteUser", {
      type: "User",
      args: { id: nonNull(intArg()) },
      resolve: async (_root, args, ctx) => {
        const findUser = await ctx.db.user.findUnique({
          where: { id: args.id },
        });

        console.log("Deleting!");
        const x = await ctx.db.user.delete({
          where: {
            id: findUser.id,
          },
        });
        console.log("DELETED:", x);

        return findUser;
      },
    });
  },
});

const db = new PrismaClient();

const apolloServer = new ApolloServer({
  schema: makeSchema({
    types: [User, Query, Mutation],
    outputs: {
      typegen: path.join(process.cwd(), "nexus-typegen.ts"),
      schema: path.join(process.cwd(), "schema.graphql"),
    },
    // typegenAutoConfig: {
    //   sources: [
    //     {
    //       source: require.resolve("./context"),
    //       alias: "ContextModule",
    //     },
    //   ],
    //   contextType: "ContextModule.Context",
    // },
  }),
  context: () => ({ db }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api",
});
