import { Resolvers } from "../__generated__/resolvers-types";

export const Query: Resolvers = {
  Query: {
    posts: async (_parent, _, { postsAPI }) => {
      let ids: string[] = [];
      for (let i = 1; i <= Math.floor(Math.random() * 10) + 1; i++) {
        ids.push(i.toString());
      }
      return await postsAPI.getPosts(ids);
    },
    post: async (_, { id }, { postsAPI }) => {
      return await postsAPI.getPost(id);
    },
  },
};
