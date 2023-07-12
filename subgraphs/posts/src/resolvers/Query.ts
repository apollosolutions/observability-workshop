import { Post, Resolvers } from "../__generated__/resolvers-types";
import { generatePost } from "./Post";

export const Query: Resolvers = {
  Query: {
    posts(_parent, _, _context) {
      let posts: Array<Post> = []
      for (let i = 1; i < Math.floor(Math.random() * 10); i++) {
        posts.push(generatePost(i.toString(), (Math.floor(Math.random() * 10)).toString()))
      }
      return posts
    },
    post: (_, { id }) => {
      return generatePost(id, (Math.floor(Math.random() * 10)).toString())
    }
  },
};
