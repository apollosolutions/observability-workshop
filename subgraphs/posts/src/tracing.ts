// Import required symbols
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
const collectorOptions = {
  url: "http://localhost:43178",
  timeoutMillis: 500,
};

const sdk = new NodeSDK({
  serviceName: "posts",
  traceExporter: new OTLPTraceExporter(collectorOptions),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(collectorOptions),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
