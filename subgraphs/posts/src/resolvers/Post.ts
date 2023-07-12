import { Post as PostType, Resolvers } from "../__generated__/resolvers-types";
import { faker } from '@faker-js/faker';

export const Post: Resolvers = {
  Post: {
    __resolveReference(parent, _context) {
      return generatePost(parent.id, (Math.floor(Math.random() * 10) + 1).toString())
    },
  },
};

export const generatePost = (id: string, authorId: string): PostType => {
  faker.seed(parseInt(id) + parseInt(authorId) * 10)
  return {
    id: (parseInt(id)).toString(),
    title: faker.word.words({ count: 10 }),
    content: faker.word.words({ count: 50 }),
    //@ts-ignore
    author: {
      id: authorId
    }
  }
}