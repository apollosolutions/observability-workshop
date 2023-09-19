import { RESTDataSource } from "@apollo/datasource-rest";
import { DeepPartial } from "utility-types";
import { User } from "./__generated__/resolvers-types";

export type UserRESTResponse = {
  data: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    state: string;
    fullCountry: string;
    postCode: string;
    country: string;
  }[];
};

export class UsersAPI extends RESTDataSource {
  baseURL: string = process.env["DATASOURCE_URL"] || "http://localhost:3030";

  async getUser(id: string) {
    let users = formatUser(
      await this.get("user", {
        params: {
          id,
        },
      })
    );
    if (users.length !== 1) {
      return null;
    }
    return users[0];
  }

  async getUserAddress(id: string) {
    let users = await this.get("user/address", {
      params: {
        id,
      },
    });

    if (users.data.length !== 1) {
      return null;
    }
    return users.data[0];
  }

  async getUsers(ids: string[]) {
    let params = new URLSearchParams();
    for (let id of ids) {
      params.append("id", id);
    }
    return formatUser(
      await this.get("user", {
        params,
      })
    );
  }
}

const formatUser = (res: UserRESTResponse): DeepPartial<User[]> => {
  return res.data.map((u) => {
    return {
      ...u,
      address: {
        ...u, // hacky, yes, but since the data exists with the same name, just folded into the same level, we'll simply move it up into the appropriate level
      },
    };
  });
};
