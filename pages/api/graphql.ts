// // import { makeSchema, mutationType, objectType, queryType } from '@nexus/schema';
// // import { nexusPrisma } from 'nexus-plugin-prisma';
// // import { ApolloServer } from 'apollo-server-micro';
// // import { createContext } from './context';
// // import path from 'path';

// // export default new ApolloServer({
// //   schema: makeSchema({
// // types: {
// //   User: objectType({
// //     name: 'User',
// //     definition(t) {
// //       t.model.id();
// //       t.model.name();
// //       t.model.img();
// //       t.model.done();
// //       t.model.sharer();
// //     },
// //   }),
// //   Query: queryType({
// //     definition(t) {
// //       t.crud.user();
// //       t.crud.users();
// //     },
// //   }),
// //   Mutation: mutationType({
// //     definition(t) {
// //       t.crud.createOneUser();
// //       t.crud.deleteOneUser();
// //       t.crud.updateOneUser();
// //     },
// //   }),
// // },
// //     plugins: [
// //       nexusPrisma({
// //         experimentalCRUD: true,
// //       }),
// //     ],
// //     shouldGenerateArtifacts: true,
// //     // outputs: {
// //     //   typegen: path.join(process.cwd(), 'pages/api/nexus-typegen.ts'),
// //     //   schema: path.join(process.cwd(), 'pages/api/schema.graphql'),
// //     // },
// //     // outputs: {
// //     //   typegen: path.join(
// //     //     process.cwd(),
// //     //     'pages/api/generated/typegen-nexus-plugin-prisma.d.ts'
// //     //   ),
// //     // },
// //     outputs: {
// //       typegen: path.join(
// //         process.cwd(),
// //         'pages',
// //         'api',
// //         'typegen-nexus-plugin-prisma.d.ts'
// //       ),
// //       schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql'),
// //     },
// //     typegenAutoConfig: {
// //       contextType: 'Context.Context',
// //       sources: [
// //         {
// //           source: '.prisma/client',
// //           alias: 'prisma',
// //         },
// //         {
// //           source: require.resolve('./context'),
// //           alias: 'Context',
// //         },
// //       ],
// //     },
// //   }),
// //   context: createContext,
// // }).createHandler({
// //   path: '/api/graphql',
// // });

// import { ApolloServer } from 'apollo-server-micro';
// import { nexusPrisma } from 'nexus-plugin-prisma';
// import { makeSchema, objectType } from '@nexus/schema';

// schema.objectType({
//   name: 'Post',
//   rootTyping: 'Post',
//   definition(t) {
//     t.id('id');
//     t.string('title');
//     t.string('date');
//     t.string('content');
//   },
// });

// const schema = makeSchema({
//   types: [
//     objectType({
//       name: 'User',
//       definition(t) {
//         t.model.id();
//         t.model.name();
//         t.model.img();
//         t.model.done();
//         t.model.sharer();
//       },
//     }),
//   ],
//   plugins: [nexusPrisma({ experimentalCRUD: true })],
// });

// // export const schema = makeSchema({
// //   types: [
// // objectType({
// //   name: 'User',
// //   definition(t) {
// //     t.model.id();
// //     t.model.name();
// //     t.model.img();
// //     t.model.done();
// //     t.model.sharer();
// //   },
// // }),
// //     // Query: queryType({
// //     //   definition(t) {
// //     //     t.crud.user();
// //     //     t.crud.users();
// //     //   },
// //     // }),
// //     // Mutation: mutationType({
// //     //   definition(t) {
// //     //     t.crud.createOneUser();
// //     //     t.crud.deleteOneUser();
// //     //     t.crud.updateOneUser();
// //     //   },
// //     // }),
// //   ],
// // });

// const apolloServer = new ApolloServer({ schema });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default apolloServer.createHandler({ path: '/api/graphql' });

import { makeSchema, objectType } from '@nexus/schema';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';

const prisma = new PrismaClient();

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

export const schema = makeSchema({
  types: [User],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql'),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
});
