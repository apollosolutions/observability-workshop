import http from "k6/http";
import { sleep, check } from "k6";
export const options = {
  scenarios: {
    loadtest: {
      executor: "constant-arrival-rate",
      rate: 5,
      timeUnit: "1s",
      duration: "2h",
      preAllocatedVUs: 5,
    },
  },
};

const INVALIDATION_REQUESTS = [
  // [{ kind: "cache_tag", subgraphs: ["users"], cache_tag: "post-362" }],
  [{ kind: "cache_tag", subgraphs: ["posts"], cache_tag: "post-362" }],
  // [{ kind: "subgraph", subgraph: "user" }],
  [{ kind: "subgraph", subgraph: "posts" }],
  [{ kind: "type", subgraph: "posts", type: "User" }],
  [{ kind: "type", subgraph: "posts", type: "Post" }],
  // [{ kind: "type", subgraph: "users", type: "Post" }],
  // [{ kind: "type", subgraph: "users", type: "User" }],
];

export default function () {
  let seed = Math.floor(Math.random() * INVALIDATION_REQUESTS.length);
  let op = INVALIDATION_REQUESTS[seed];
  const payload = JSON.stringify(op);

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "invalidate",
      "apollographql-client-name": "k6",
      "apollographql-client-version": "loadtest",
    },
  };

  let resp = http.post(
    "http://host.docker.internal:4000/invalidation",
    payload,
    params,
  );
  check(resp, {
    "response code was 201": (res) => res.status === 201,
    "did not contain any errors": (res) => {
      try {
        return true;
      } catch (e) {
        console.log(res.text());
        console.log(e);
        return false;
      }
    },
  });
  sleep(2);
}
