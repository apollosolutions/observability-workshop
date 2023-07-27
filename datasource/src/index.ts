import express, { Response, Request } from "express";
import {
  RequestParams,
  RequestBody,
  UserRequestQuery,
  ResponseBody,
  sleep,
  PostRequestQuery,
} from "./util";
import { FAKE_POST, FAKE_POSTS } from "./posts";
import { FAKE_USER, FAKE_USERS } from "./users";
import { find } from "lodash";

const PORT = 3000 || process.env["PORT"];
const app = express();

app.use(express.json());

app.get(
  "/user",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, UserRequestQuery>,
    res: Response
  ) => {
    await sleep(500);
    let params: string[] = [];
    if (!req.query.id) {
      res.sendStatus(400);
      return;
    }
    if (typeof req.query.id === "string") {
      params.push(req.query.id);
    } else {
      params = req.query.id;
    }

    let users: FAKE_USER[] = [];
    for (let user of params) {
      let u = find(FAKE_USERS, { id: parseInt(user) });
      if (!u) {
        continue;
      }
      users.push(u);
    }

    res.json({ data: users });
  }
);

app.get(
  "/post",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, PostRequestQuery>,
    res: Response
  ) => {
    await sleep(500);
    let posts: FAKE_POST[] = [];

    if (!req.query.id && !req.query.authorId) {
      console.log("no query params");
      res.sendStatus(400);
      return;
    }
    if (req.query.id && req.query.authorId) {
      console.log("both params provided");
      res.sendStatus(400);
      return;
    }
    let idParams: string[] = [];
    if (typeof req.query.id === "string") {
      idParams.push(req.query.id);
    } else if (req.query.id instanceof Array) {
      idParams = req.query.id;
    }
    for (let post of idParams) {
      let i = parseInt(post);
      if (!Number.isNaN(i)) {
        posts.push(FAKE_POSTS[i]);
      } else {
        let u = find(FAKE_POSTS, { id: post });
        if (!u) {
          continue;
        }
        posts.push(u);
      }
    }

    let authorParams: string[] = [];
    if (typeof req.query.authorId === "string") {
      authorParams.push(req.query.authorId);
    } else if (req.query.authorId instanceof Array) {
      authorParams = req.query.authorId;
    }
    for (let post of authorParams) {
      let u = find(FAKE_POSTS, { author: parseInt(post) });
      if (!u) {
        continue;
      }
      posts.push(u);
    }

    res.json({ data: posts });
  }
);

app.listen(PORT, () => {
  console.log(`REST Server started on port ${PORT}\n`);
});
