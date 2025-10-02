import express, { Response, Request } from "express";
import {
  RequestParams,
  RequestBody,
  UserRequestQuery,
  ResponseBody,
  sleep,
  PostRequestQuery,
  CommentRequestQuery,
} from "./util";
import { FAKE_POST } from "./posts";
import { FAKE_USER, UserAddressRestResponse } from "./users";
import { find, omit } from "lodash";
import { FAKE_POSTS, FAKE_USERS } from "./mocked_data";
import { FAKE_COMMENT } from "./comments";
import { loremIpsum } from "lorem-ipsum";

const PORT = 3030;
const app = express();

app.use(express.json());

app.get(
  "/user",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, UserRequestQuery>,
    res: Response
  ) => {
    await sleep(150);
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

      users.push(omit(u, "address"));
    }

    res.json({ data: users });
  }
);

app.get(
  "/user/address",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, UserRequestQuery>,
    res: Response
  ) => {
    await sleep(10);
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

    let users: UserAddressRestResponse[] = [];
    for (let user of params) {
      let u = find(FAKE_USERS, { id: parseInt(user) });
      if (!u) {
        continue;
      }
      users.push({
        user_id: u.id,
        ...u.address,
      });
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
    await sleep(50);
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

app.get(
  "/comment",
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, CommentRequestQuery>,
    res: Response
  ) => {
    await sleep(500);
    let comments: FAKE_COMMENT[] = [];

    if (!req.query.post_id) {
      console.log("no query params");
      res.sendStatus(400);
      return;
    }
    let idParams: string[] = [];
    if (typeof req.query.post_id === "string") {
      idParams.push(req.query.post_id);
    } else if (req.query.post_id instanceof Array) {
      idParams = req.query.post_id;
    }

    for (let post of idParams) {
      comments.push({
          id: require("crypto").randomBytes(64).toString('hex'),
          post_id: post,
          content: loremIpsum(),
          author: Math.floor(Math.random() * 999)
      })
    }
    res.header("cache-control", "public,max-age=20");
    res.json(comments);
  }
);

app.listen(PORT, () => {
  console.log(`REST Server started on port ${PORT}\n`);
});
