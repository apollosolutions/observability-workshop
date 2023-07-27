import { RESTDataSource } from "@apollo/datasource-rest";

export class UsersAPI extends RESTDataSource {
  baseURL: string = "http://localhost:3000" || process.env["DATASOURCE_URL"];

  async getUser(id: string) {
    return this.get("user", {
      params: {
        id,
      },
    });
  }

  async getUsers(ids: string[]) {
    let params = new URLSearchParams();
    for (let id of ids) {
      params.append("id", id);
    }
    return this.get("user", {
      params,
    });
  }
}
