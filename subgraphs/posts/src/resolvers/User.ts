import { Resolvers } from "../__generated__/resolvers-types";

export const User: Resolvers = {
  User: {
    __resolveReference(parent, _context) {
      return { id: parent.id };
    },
    posts: async ({ id }, _, { postsAPI }) => {
      return await postsAPI.getPostsByAuthorId(id);
    },
  },
};
