import { makeSchema, mutationType, objectType, queryType } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import path from 'path';

const User = objectType({
  name: 'User',
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
  // plugins: [nexusPrisma({ experimentalCRUD: true })],
  plugins: [
    nexusSchemaPrisma({
      outputs: {
        typegen: path.join(
          process.cwd(),
          'pages',
          'api',
          'generated',
          'typegen-nexus-plugin-prisma.d.ts'
        ),
      },
    }),
  ],
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: path.join(process.cwd(), 'graphql', 'context.ts'),
        alias: 'Context',
      },
    ],
  },
  shouldExitAfterGenerateArtifacts: true,
});
