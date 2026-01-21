import { Query } from "./Query";
import { User } from "./User";
import { Mutation } from "./Mutation";

const resolvers = {
  ...Query,
  ...User,
  ...Mutation,
};

export default resolvers;
