import { Resolvers } from "../__generated__/resolvers-types";

export const PostTest: Resolvers = {
  PostTest: {
    post: async (parent, {id}, {postsAPI} ) => {
      return await postsAPI.getPost(id);
    },
  },
};
