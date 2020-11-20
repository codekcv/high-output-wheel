import { makeSchema, mutationType, objectType, queryType } from '@nexus/schema';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
// import { nexusPrisma } from 'nexus-plugin-prisma';
import { ApolloServer } from 'apollo-server-micro';
import { createContext } from './context';
import path from 'path';
import { PrismaClient } from '@prisma/client';

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
    plugins: [
      nexusSchemaPrisma({
        experimentalCRUD: true,
        shouldGenerateArtifacts: true,
        // outputs: {
        //   typegen: __dirname + '/generated/typegen-nexus-plugin-prisma.d.ts',
        // },
      }),
    ],
    // outputs: {
    //   typegen: path.join(process.cwd(), 'pages/api/nexus-typegen.ts'),
    //   schema: path.join(process.cwd(), 'pages/api/schema.graphql'),
    // },
    outputs: {
      typegen: path.join(
        process.cwd(),
        'pages',
        'api',
        'generated',
        'typegen-nexus-plugin-prisma.d.ts'
      ),
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
