import { makeSchema, mutationType, objectType, queryType } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import { ApolloServer } from 'apollo-server-micro';
import { createContext } from './context';
import path from 'path';

export default new ApolloServer({
  schema: makeSchema({
    types: {
      User: objectType({
        name: 'User',
        definition(t) {
          t.model.id();
          t.model.name();
          t.model.img();
          t.model.done();
        },
      }),
      Query: queryType({
        definition(t) {
          t.crud.user();
          t.crud.users();
        },
      }),
      Mutation: mutationType({
        definition(t) {
          t.crud.createOneUser();
          t.crud.deleteOneUser();
          t.crud.updateOneUser();
        },
      }),
    },
    plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
    shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
    outputs: {
      typegen: path.join(process.cwd(), 'pages/api/nexus-typegen.ts'),
      schema: path.join(process.cwd(), 'pages/api/schema.graphql'),
    },
    typegenAutoConfig: {
      contextType: 'Context.Context',
      sources: [
        {
          source: '.prisma/client',
          alias: 'prisma',
        },
        {
          source: require.resolve('./context'),
          alias: 'Context',
        },
      ],
    },
  }),
  context: createContext,
}).createHandler({
  path: '/api',
});

export const config = {
  api: {
    bodyParser: false,
  },
};
