import { WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

/////////////////////////////////opentelemetry///////////////////////////////////////
const traceCollectorOptions = {
  url: 'http://localhost:5080/api/default/v1/traces', // url is optional and can be omitted - default is http://localhost:4318/v1/traces
  headers: {
    Authorization: "Basic cm9vdEBleGFtcGxlLmNvbTpKQzlBQnV1cWw3VDRKa3RT"
  }, // an optional object containing custom headers to be sent with each request
  concurrencyLimit: 10, // an optional limit on pending requests
};

const tracerProvider = new WebTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'web-frontend-app'
  })
});

tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
tracerProvider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter(traceCollectorOptions), {
  // The maximum queue size. After the size is reached spans are dropped.
  maxQueueSize: 100,
  // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
  maxExportBatchSize: 10,
  // The interval between two consecutive exports
  scheduledDelayMillis: 500,
  // How long the export can run before it is cancelled
  exportTimeoutMillis: 30000,
}));

// b3: {TraceId}-{SpanId}-{SamplingState}-{ParentSpanId}
tracerProvider.register({
  contextManager: new ZoneContextManager(), // support async fetch context
  propagator: new W3CTraceContextPropagator(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new UserInteractionInstrumentation({
      eventNames: ['submit', 'click', 'keypress'],
    }),
    new FetchInstrumentation({
      ignoreUrls: [/localhost:5080\/rum/],
    }),
    new XMLHttpRequestInstrumentation(),
  ],
  tracerProvider,
});
