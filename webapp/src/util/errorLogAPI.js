import { API, graphqlOperation } from "@aws-amplify/api";

export const config = {
  aws_appsync_graphqlEndpoint:
    "https://ggjy7ittb5bn5e24kiito25twq.appsync-api.eu-west-1.amazonaws.com/graphql",
  aws_appsync_region: "eu-west-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-dlp3x2ejofbffgyepywd6guigu",
};

API.configure(config);

export const getLogs = /* GraphQL */ `
  query MyQuery($group: String!) {
    listKoseproggLogs(filter: { group: { eq: $group } }) {
      nextToken
      items {
        group
        log_events
      }
    }
  }
`;
export async function get(group) {
  return await API.graphql(graphqlOperation(getLogs, { group }));
}
