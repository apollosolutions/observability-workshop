import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    user: async (_, { id }, { usersAPI }) => {
      let user = await usersAPI.getUser(id);
      if (!user) {
        return null;
      }
      let address = await usersAPI.getUserAddress(id);
      user.address = address;
      return user;
    },
    users: async (_p, _a, { usersAPI }) => {
      let users = await usersAPI.getUsers(
        [...Array(10).keys()].map((i) => (i + 1).toString())
      );
      users = await Promise.all(
        users.map(async (user) => {
          user.address = await usersAPI.getUserAddress(user.id!);
          return user;
        })
      );
      return users;
    },
  },
};
