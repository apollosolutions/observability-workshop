import { Resolvers, User } from "../__generated__/resolvers-types";
import { generateUser } from "./User";

export const Query: Resolvers = {
  Query: {
    user(_parent, { id }, _context) {
      return generateUser(id)
    },
    users: () => {
      let users: Array<User> = []
      for (let i = 1; i < 10; i++) {
        users.push(generateUser(i.toString()))
      }
      return users
    }
  },
};

