// Import required symbols
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { metrics } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// Configure trace exporter
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

// Configure metrics separately
const metricExporter = new OTLPMetricExporter({
  url: "http://localhost:4318/v1/metrics",
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000,
});

const meterProvider = new MeterProvider();
meterProvider.addMetricReader(metricReader);

metrics.setGlobalMeterProvider(meterProvider);

// Create resource with explicit service name
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "posts",
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "local",
});

// Simple NodeSDK configuration
const sdk = new NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
