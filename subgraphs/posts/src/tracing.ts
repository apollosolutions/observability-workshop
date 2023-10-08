// Import required symbols
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";

const collectorOptions = {
  url: "http://localhost:43178",
  timeoutMillis: 500,
};

const sdk = new NodeSDK({
  serviceName: "posts",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new GraphQLInstrumentation(),
  ],
  traceExporter: new OTLPTraceExporter(collectorOptions),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(collectorOptions),
  }),
});

// Register the provider to begin tracing
sdk.start();
