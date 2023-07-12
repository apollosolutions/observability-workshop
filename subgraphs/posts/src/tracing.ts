// Import required symbols
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

const collectorOptions = {
    url: 'http://collector:4317',
    timeoutMillis: 500
};

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new GraphQLInstrumentation()
    ],
})
const sdk = new NodeSDK({
    serviceName: 'posts',
    traceExporter: new OTLPTraceExporter(collectorOptions),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(collectorOptions),
        exportIntervalMillis: 500
    }),
});

// Register the provider to begin tracing
sdk.start()