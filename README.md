# GraphQL Summit Observability Workshop

- [GraphQL Summit Observability Workshop](#graphql-summit-observability-workshop)
  - [Prerequisites](#prerequisites)
  - [Getting oriented](#getting-oriented)
  - [Running the stack](#running-the-stack)
  - [Tasks](#tasks)
    - [Important](#important)
    - [Issues](#issues)
    - [What should I do?](#what-should-i-do)

This workshop is designed to demonstrate how to diagnose a poor performing supergraph through the use of observability tooling.

This mock supergraph is a simple example of a blog-style API which exposes a list of posts and associated authors (users).

## Prerequisites

To be able to run the workshop, you will need:

- Docker (or [Colima](https://github.com/abiosoft/colima))
- [NodeJS](https://nodejs.org/en)
- [Rover](https://www.apollographql.com/docs/rover/getting-started) to publish the provided schema
- The provided Apollo Studio Graph ID and access to the associated Apollo Studio instance

Once you have the above installed, you can run the `setup.sh` script included to fetch the additional dependencies. If you'd like to install those manually, you will need to:

- Run `docker compose pull` to pull the associated Docker images
- Run `docker pull grafana/k6:0.46.0` to fetch the required [k6 Docker image](https://k6.io) for load testing
- Run `npm install` from the root of the folder to download all required dependencies
- Download the Apollo Router, as noted [on the Apollo Router documentation](https://www.apollographql.com/docs/router/quickstart/)

## Getting oriented

This project consists of a number of distinct services that combine together to make the federated application and associated tooling.

For the supergraph itself, it consists of:

- A mock REST API hosted on [http://localhost:3030](http://localhost:3030), with source code located in the [`datasource`](/datasource/) folder
- Two subgraphs, both within the [`subgraphs`](/subgraphs/) folder:
  - `users`, which houses user-related data
  - `posts`, which controls data related to the blog posts
- An Apollo Router fronting the two subgraphs on [http://localhost:4000](http://localhost:4000)

And for the observability tooling:

- Grafana for metrics visualization, hosted on [http://localhost:3000](http://localhost:3000)
- Prometheus for metrics aggregation, hosted on [http://localhost:9000](http://localhost:9000)
- Jaeger for trace visualization, hosted on [http://localhost:16686](http://localhost:16686)
- OpenTelemetry Collector to ingest all metrics/traces from both the router and the subgraphs
- k6 for load testing using the script at [`k6/script.js`](/k6/script.js)

## Running the stack

Before running, there's one final step you'll need to take. You'll need to populate the `.env.sample` with an Apollo key and graphref as noted during the presentation. Once you've filled it out, rename it to just `.env`.

To run the stack, you will need to run `npm run dev` from the root of this folder after running `setup.sh` (or as noted above in the [Prerequisites](#prerequisites)). This will do a few things:

- Run `docker compose up -d` to start the observability tooling applications using Docker compose
- Start the router with a config and the associated environment variables
- Start the subgraphs using those subgraphs' `npm run dev` commands

Using the singular command is preferable since it will run these all in parallel for you.

## Tasks

### Important

Please do not modify the `datasource` code - while it is apparent that there are waits throughout the code, it is also a simple way to show how a downstream service introduces latency, and isn't intended to be something a graph team would traditionally fix.

With that said, you can (and should!) look through the code to see if you can find the source of a few of these issues, including the `datasource`'s.

### Issues

We've included a number of issues within the code, and while you're likely to find a number of them, we want to outline a few here that you can look for if you're looking for a place to start.

**Please note that the resolution may not be something you can do today- just identifying the issue is often sufficient so that another team can actually address.**

- One of the fields is causing an error, and we aren't sure which.
- The team managing the backing REST API is noting that they are seeing too much traffic, and would like us to optimize the number of requests from both subgraphs
  - _There are two places where you can optimize for this_
- The `User` type takes a long time to resolve and the team isn't sure why.

There are a few other areas to investigate to improve, but these are just a few start points. Note what you've done and we'll discuss towards the end of the workshop.

### What should I do?

As mentioned above, this workshop consists of debugging and resolving issues within a poorly performing federated graph. When trying to resolve these issues, you can debug using this flow:

- Open up [Grafana (hosted on http://localhost:3000/)](http://localhost:3000) (default credentials are admin/admin) and [Jaeger (on http://localhost:16686)](http://localhost:16686) to see the current metrics and traces of the application
- Use k6 to simulate load via running `npm run loadtest` in another console window to run a short (30 second) load test. If you'd prefer a longer test, feel free to modify [`k6/script.js`](/k6/script.js)'s `duration`
- Review Grafana, Jaeger, and the k6 results to identify problems
  - Grafana includes two prepopulated dashboards; one for k6 results, which include HTTP response times and test results (e.g. percent errors on responses) and throughput, and another for some basic metrics for the router, such as error rates per operation, subgraph response times, and the like
  - Traces can be helpful in determining where time is being spent the most in a given request, so reviewing traces can help provide concrete action items to do
- Utilize Apollo Studio for further debugging using the Operations tab to better visualize the error rates and per-field execution times to see if there's a specific field slowing the entire operation

Once you've reviewed and identified items, adjust and re-test.
