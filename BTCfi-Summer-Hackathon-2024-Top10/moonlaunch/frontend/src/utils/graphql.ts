import { GraphQLClient } from "graphql-request";

const endpoint = "https://moonlaunch-indexer-production.up.railway.app/";

export const client = new GraphQLClient(endpoint);
