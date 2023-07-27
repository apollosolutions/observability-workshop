import { Resolvers } from "../__generated__/resolvers-types";

export const Post: Resolvers = {
  Post: {
    __resolveReference: async (parent, { postsAPI }) => {
      return await postsAPI.getPost(parent.id);
    },
    featuredImage: async (parent) => {
      return (parent as any).featured_imaging.toString();
    },
  },
};
