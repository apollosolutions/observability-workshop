import { Resolvers, User } from "../__generated__/resolvers-types";

export const Mutation: Resolvers = {
  Mutation: {
    updateUserEmail: async (_, { userId, email }, { usersAPI }) => {
      let user = await usersAPI.getUser(userId);
      if (!user) {
        return null;
      }
      user.email = email;
      let address = await usersAPI.getUserAddress(userId);
      user.address = address;
      return user;
    }
  },
};
