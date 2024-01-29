import { Resolvers, User } from "../__generated__/resolvers-types";

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
      let userPromises = await usersAPI.getUsers(
        [...Array(10).keys()].map((i) => (i + 1).toString())
      );
      let users = await Promise.all(
        userPromises.map(async (user) => {
          if (!user) {
            return null;
          }
          user.address = await usersAPI.getUserAddress(user.id!);
          return user;
        })
      );

      return users.filter((user): user is User => user !== null);
    },
  },
};
