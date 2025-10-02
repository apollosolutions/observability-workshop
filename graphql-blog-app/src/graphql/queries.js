export const GET_POSTS = `
  query GetPosts {
    posts {
      id
      title
      content
      author {
        id
        name
        email
      }
    }
  }
`;

export const GET_TOP_POSTS = `
  query GetTopPosts {
    topPosts {
      id
      title
      content
      author {
        id
        name
        email
      }
    }
  }
`;

export const GET_POST = `
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author {
        id
        name
        email
        bio
        address {
          streetAddress1
          streetAddress2
          city
          state
          postCode
          country
        }
      }
    }
  }
`;

export const GET_USER = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      bio
      address {
        streetAddress1
        streetAddress2
        city
        state
        postCode
        country
      }
    }
  }
`;

export const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      email
      bio
      address {
        city
        state
        country
      }
    }
  }
`;
