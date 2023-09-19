import { Resolvers } from "../__generated__/resolvers-types";

export const Post: Resolvers = {
  Post: {
    __resolveReference: async (parent, { postsAPI }) => {
      return await postsAPI.getPost(parent.id);
    },
  },
};
