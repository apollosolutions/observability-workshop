import { Resolvers, User as UserType } from "../__generated__/resolvers-types";
import { faker } from '@faker-js/faker';

export const User: Resolvers = {
  User: {
    __resolveReference(parent, _context) {
      return generateUser(parent.id)
    },
  },
};
export const generateUser = (id: string): UserType => {
  faker.seed(parseInt(id))
  let fn = faker.person.firstName()
  let ln = faker.person.lastName()
  let fullName = faker.person.fullName({
    firstName: fn,
    lastName: ln,
  })
  return { id: id.toString(), name: fullName, email: faker.internet.email({ firstName: fn, lastName: ln, allowSpecialCharacters: false }) };
}