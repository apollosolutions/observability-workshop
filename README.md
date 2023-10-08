# GraphQL Summit Observability Workshop

- [GraphQL Summit Observability Workshop](#graphql-summit-observability-workshop)
  - [Prerequisites](#prerequisites)
    - [MacOS \& Linux (incl. WSL)](#macos--linux-incl-wsl)
    - [Windows](#windows)
  - [Getting oriented](#getting-oriented)
  - [Running the stack](#running-the-stack)
    - [MacOS \& Linux (incl. WSL)](#macos--linux-incl-wsl-1)
    - [Windows](#windows-1)
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
- An enterprise Apollo Graph Ref and Apollo Key
  - An enterprise trial is sufficient: [https://studio.apollographql.com/signup?type=enterprise-trial](https://bit.ly/studio-trial)
  - If you are signed in to your existing Studio account, please sign out before registering

### MacOS & Linux (incl. WSL)

Once you have the prerequisites installed, you can run the `setup.sh` script included to fetch the additional dependencies.

<details>
<summary>What if I want to install them manually?</summary>

If you'd like to install those manually, you will need to:

- Run `docker compose pull` to pull the associated Docker images
- Run `docker pull grafana/k6:0.46.0` to fetch the required [k6 Docker image](https://k6.io) for load testing
- Run `npm install` from the root of the folder to download all required dependencies
- Download the Apollo Router, as noted [on the Apollo Router documentation](https://www.apollographql.com/docs/router/quickstart/)

</details>

### Windows

Once you have the prerequisites installed, you can run the `setup.ps1` script included to fetch the additional dependencies.

<details>
<summary>What if I want to install them manually?</summary>

If you'd like to install those manually, you will need to:

- Run `docker compose pull` to pull the associated Docker images
- Run `docker pull grafana/k6:0.46.0` to fetch the required [k6 Docker image](https://k6.io) for load testing
- Run `npm install` from the root of the folder to download all required dependencies
- Download the Apollo Router using Powershell and extract using `tar`

</details>

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

Before running, there's one final step you'll need to take. You'll need to populate the `.env.sample` with an Apollo key and graphref as noted during the presentation. Once you've filled it out, rename it to just `.env`. Once you've done this, you'll need to then run `publish.sh` to publish the schema to Apollo Studio.

### MacOS & Linux (incl. WSL)

To run the stack, you will need to run `npm run dev` from the root of this folder after running `setup.sh` and `publish.sh` (or as noted above in the [Prerequisites](#prerequisites)).

<details>
<summary>What does the script do?</summary>

- Run `docker compose up -d` to start the observability tooling applications using `docker compose`
- Start the router with a config and the associated environment variables
- Start the subgraphs using those subgraphs' `npm run dev` commands

Using the singular command is preferable since it will run these all in parallel for you.

</details>

### Windows

If running on Windows natively (meaning not through WSL), you will need to run `npm run dev:windows` after running `setup.sh` and `publish.sh` (or as noted above in the [Prerequisites](#prerequisites)).

<details>
<summary>What does the script do?</summary>

- Run `docker compose up -d` to start the observability tooling applications using `docker compose`
- Start the router with a config and the associated environment variables when on Windows
- Start the subgraphs using those subgraphs' `npm run dev` commands

Using the singular command is preferable since it will run these all in parallel for you.

</details>

## Tasks

### Important

Please do not modify the `datasource` code - while it is apparent that there are waits throughout the code, it is also a simple way to show how a downstream service introduces latency, and isn't intended to be something a graph team would traditionally fix.

With that said, you can (and should!) look through the code to see if you can find the source of a few of these issues, including the `datasource`'s.

### Issues

We've included a number of issues within the code, and while you're likely to find quite a few of them, we want to outline a few here that you can look for if you're looking for a place to start.

**Please note that the resolution may not be something you can do today- just identifying the issue is often sufficient so that another development team can eventually address.**

- One of the fields is causing an error, and the team isn't sure which.
- The team managing the backing REST API is noting that they are seeing too much traffic, and would like us to optimize the number of requests from both subgraphs
  - _There are two places where you can optimize for this_
- The `User` type takes a long time to resolve and the team isn't sure why.

There are a few other areas to investigate to improve, but these are just a few start points. Note what you've done and we'll discuss the listed three during the specific section.

### What should I do?

As mentioned above, this workshop consists of debugging and resolving issues within a poorly performing federated graph. When trying to resolve these issues, you can debug using this flow:

- Open up [Grafana (hosted on http://localhost:3000/)](http://localhost:3000) (default username/password are admin/admin) and [Jaeger (on http://localhost:16686)](http://localhost:16686) to see the current metrics and traces of the application
- Use k6 to simulate load via running `npm run loadtest` in another console window to run a short (30 second) load test. If you'd prefer a longer test, feel free to run `npm run loadtest:long`
- Review Grafana, Jaeger, and the k6 results to identify problems
  - Grafana includes two prepopulated dashboards; one for `k6` results, which include HTTP response times, test results (e.g. percent errors on responses), and throughput, and another for some basic metrics for the router, such as error rates per operation, subgraph response times, and the like
  - Traces can be helpful in determining where time is being spent the most in a given request, so reviewing traces can help provide concrete action items
- Utilize Apollo Studio for further debugging using the Operations tab to better visualize the error rates and per-field execution times to see if there's a specific field slowing the entire operation

Once you've reviewed and identified items, adjust and re-test. Note which tasks you've addressed and how you identified them for use later.
