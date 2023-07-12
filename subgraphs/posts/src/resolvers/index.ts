import { Query } from "./Query";
import { Post } from "./Post";
import { User } from "./User";
const resolvers = {
  ...Query,
  ...Post,
  ...User,
};

export default resolvers;
