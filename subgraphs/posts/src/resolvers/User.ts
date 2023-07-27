import { sleep } from "../util";
import { Resolvers } from "../__generated__/resolvers-types";

export const User: Resolvers = {
  User: {
    __resolveReference(parent, _context) {
      return { id: parent.id };
    },
    posts: async ({ id }, _, { postsAPI }) => {
      for (let i = 1; i <= Math.floor(Math.random() * 10) + 1; i++) {
        await sleep(35);
      }
      return await postsAPI.getPostsByAuthorId([id]);
    },
  },
};
