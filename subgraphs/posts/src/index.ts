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
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

const port = process.env.PORT ?? "4002";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const subgraphName = require("../package.json").name;

const context: ContextFunction<
  [StandaloneServerContextFunctionArgument],
  DataSourceContext
> = async () => {
  return {
    postsAPI: new PostsAPI(),
    cacheTags: [],
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
    plugins: [
      {
        async requestDidStart(requestContext) {
          return {
            async willSendResponse({ response, contextValue }) {
              const context = contextValue as DataSourceContext;
              // Add cache tags to the response's extensions
              if (
                context.cacheTags &&
                context.cacheTags.length > 0 &&
                response.body.kind === "single"
              ) {
                response.body.singleResult.extensions = {
                  apolloCacheTags: context.cacheTags,
                };
              }
            },
          };
        },
      },
      ApolloServerPluginInlineTrace({
        includeErrors: {
          unmodified: true,
        },
      }),
      ApolloServerPluginCacheControl({
        calculateHttpHeaders: true,
      })
    ],
  });
  const { url } = await startStandaloneServer(server, {
    context,
    listen: { port: Number.parseInt(port) },
  });

  console.log(`🚀  Subgraph ${subgraphName} ready at ${url}`);
}

main();
