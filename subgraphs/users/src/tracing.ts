// Import required symbols
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

const collectorOptions = {
    url: 'http://collector:4317',
};

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new GraphQLInstrumentation()
    ],
})
const sdk = new NodeSDK({
    serviceName: 'users',
    traceExporter: new OTLPTraceExporter(collectorOptions),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(collectorOptions)
    }),
});

// Register the provider to begin tracing
sdk.start()
