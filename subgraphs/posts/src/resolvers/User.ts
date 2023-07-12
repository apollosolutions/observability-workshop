import { sleep } from "../util";
import { Post, Resolvers } from "../__generated__/resolvers-types";
import { generatePost } from "./Post";

export const User: Resolvers = {
  User: {
    __resolveReference(parent, _context) {
      return { id: parent.id }
    },
    posts: async (parent) => {
      let posts: Array<Post> = []
      for (let i = 1; i <= Math.floor(Math.random() * 10) + 1; i++) {
        await sleep(35)
        posts.push(generatePost((i).toString(), parent.id))
      }
      return posts
    }
  },
};
