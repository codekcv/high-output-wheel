import { ApolloServer } from "apollo-server-micro";
import { schema } from "./schema";
import { createContext } from "src/pages/api/context";

const apolloServer = new ApolloServer({
  context: createContext,
  schema,
  tracing: process.env.NODE_ENV === "development",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api",
});
