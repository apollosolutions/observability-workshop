import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    user: async (_parent, { id }, { usersAPI }) => {
      let user = await usersAPI.getUser(id);
      if (!user.data) {
        return null;
      }
      if (user.data.length != 1) {
        return null;
      }

      return {
        ...user.data[0],
        name: `${user.data[0].first_name} ${user.data[0].last_name}`,
      };
    },
    users: async (_p, _a, { usersAPI }) => {
      let users = await usersAPI.getUsers(
        [...Array(10).keys()].map((i) => (i + 1).toString())
      );
      if (!users.data) {
        return [];
      }
      if (users.data.length === 0) {
        return [];
      }
      return users.data.map((u: any) => {
        return {
          ...u,
          name: `${u.first_name} ${u.last_name}`,
        };
      });
    },
  },
};
