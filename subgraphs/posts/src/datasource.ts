import { RESTDataSource } from "@apollo/datasource-rest";

export class PostsAPI extends RESTDataSource {
  baseURL: string = "http://localhost:3000" || process.env["DATASOURCE_URL"];

  async getPost(id: string) {
    return formatPost(
      await this.get("post", {
        params: {
          id,
        },
      })
    );
  }

  async getPosts(ids: string[]) {
    let params = new URLSearchParams();
    for (let id of ids) {
      params.append("id", id);
    }
    return formatPost(
      await this.get("post", {
        params,
      })
    );
  }

  async getPostsByAuthorId(ids: string[]) {
    let params = new URLSearchParams();
    for (let id of ids) {
      params.append("authorId", id);
    }
    return formatPost(
      await this.get("post", {
        params,
      })
    );
  }
}

const formatPost = (res: any) => {
  return res.data.map((v: any) => {
    return {
      ...v,
      author: {
        id: v.author,
      },
    };
  });
};
