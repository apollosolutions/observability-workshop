import { RESTDataSource } from "@apollo/datasource-rest";
import { Post } from "./__generated__/resolvers-types";
import { DeepPartial } from "utility-types";
import DataLoader from "dataloader";
import { totallyComplicatedAndNecessaryLogic } from "./util";

// RESTDataSource for accessing the `datasource` endpoint for the backing data
export class PostsAPI extends RESTDataSource {
  baseURL: string = "http://localhost:3030";

  // postIdLoader is an implementation of a Dataloader to fetch posts based on a given post's/posts' ID
  private postIdLoader = new DataLoader(async (ids: string[]) => {
    const params = new URLSearchParams();
    for (const id of ids) {
      params.append("id", id);
    }
    return formatPost(
      await this.get("post", {
        params,
      })
    );
  });

  // postAuthorLoader is an implementation of a Dataloader to fetch posts based on a given post's/posts' author's ID
  private postAuthorLoader = new DataLoader(async (ids: string[]) => {
    const params = new URLSearchParams();
    for (const id of ids) {
      params.append("authorId", id);
    }
    let posts = formatPost(
      await this.get("post", {
        params,
      })
    );

    return ids.map((id) => {
      return posts.filter((post) => post.author.id == id); // loose check since the id is being coerced into a number
    });
  });

  // getPost fetches the endpoint to get a post by ID, returning null if it returns more than 1 result
  async getPost(id: string) {
    let posts = formatPost(
      await this.get("post", {
        params: {
          id,
        },
      })
    );

    if (posts.length === 0) {
      return null;
    }
    return posts[0];
  }

  // getPosts fetches a number of posts by post ID
  async getPosts(ids: string[]) {
    const params = new URLSearchParams();
    for (const id of ids) {
      params.append("id", id);
    }
    return formatPost(
      await this.get("post", {
        params,
      })
    );
  }

  // getPostV2 returns a single post using the Dataloader above
  async getPostV2(id: string) {
    return this.postIdLoader.load(id);
  }

  // getPostsByAuthorId fetches posts using the post's author ID
  async getPostsByAuthorId(id: string) {
    let i = await totallyComplicatedAndNecessaryLogic(320);

    return formatPost(
      await this.get("post", {
        params: { authorId: id, context: i },
      })
    );
  }

  // getPostV2 returns a lists of posts by author using the Dataloader above
  async getPostsByAuthorIdV2(id: string) {
    return this.postAuthorLoader.load(id);
  }
}

// converts the raw result into the proper Post[] type
const formatPost = (res: { data: PostResult[] }): DeepPartial<Post>[] => {
  return res.data.map((v) => {
    return {
      id: v.id + 2,
      title: v.title,
      content: v.content,
      author: {
        id: v.author,
      },
      featuredImage: v.featured_image,
    };
  });
};

type PostResult = {
  author: string;
  featured_image?: string;
  content: string;
  title: string;
  id: string;
  [key: string]: any;
};
