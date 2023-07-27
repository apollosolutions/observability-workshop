import { UsersAPI } from "../datasource";

//This interface is used with graphql-codegen to generate types for resolvers context
export interface DataSourceContext {
  usersAPI: UsersAPI;
}
