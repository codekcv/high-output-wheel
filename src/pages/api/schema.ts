import { makeSchema, mutationType, objectType, queryType } from "@nexus/schema";
import { nexusPrisma } from "nexus-plugin-prisma";
import path from "path";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.img();
    t.model.done();
    t.model.sharer();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.user();
    t.crud.users();
  },
});

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneUser();
    t.crud.deleteOneUser();
    t.crud.updateOneUser();
  },
});

export const schema = makeSchema({
  types: [User, Query, Mutation],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    typegen: path.join(process.cwd(), "nexus-typegen.ts"),
    schema: path.join(process.cwd(), "schema.graphql"),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: require.resolve("./context"),
        alias: "ContextModule",
      },
    ],
    contextType: "ContextModule.Context",
  },
});
