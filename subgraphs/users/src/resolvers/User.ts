import { GraphQLError } from "graphql";
import { Resolvers } from "../__generated__/resolvers-types";

export const User: Resolvers = {
  User: {
    __resolveReference: async (parent, { usersAPI }) => {
      if (!parent.id) {
        return new GraphQLError("missing required key value");
      }
      let user = await usersAPI.getUser(parent.id);
      if (!user) {
        return null;
      }
      let address = await usersAPI.getUserAddress(parent.id);
      user.address = address;
      return user;
    },
  },
};
