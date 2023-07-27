import { Resolvers } from "../__generated__/resolvers-types";

export const User: Resolvers = {
  User: {
    __resolveReference: async (parent, { usersAPI }) => {
      let user = await usersAPI.getUser(parent.id);
      return user;
    },
  },
};
