require("./tracing");
import { readFileSync } from "fs";
import gql from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { ApolloServer, ContextFunction } from "@apollo/server";
import {
  StandaloneServerContextFunctionArgument,
  startStandaloneServer,
} from "@apollo/server/standalone";
import resolvers from "./resolvers";
import { DataSourceContext } from "./types/DataSourceContext";
import { PostsAPI } from "./datasource";

const port = process.env.PORT ?? "4002";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const subgraphName = require("../package.json").name;

const context: ContextFunction<
  [StandaloneServerContextFunctionArgument],
  DataSourceContext
> = async () => {
  return {
    postsAPI: new PostsAPI(),
  };
};

async function main() {
  const typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });
  const { url } = await startStandaloneServer(server, {
    context,
    listen: { port: Number.parseInt(port) },
  });

  console.log(`🚀  Subgraph ${subgraphName} ready at ${url}`);
}

main();
