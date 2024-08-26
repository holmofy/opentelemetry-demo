import { openobserveRum } from '@openobserve/browser-rum';
import { openobserveLogs } from '@openobserve/browser-logs';

const options = {
    clientToken: 'rumg8wmcg10ylzusPVl', // Get this from the Ingestion page in the OpenObserve
    applicationId: 'web-frontend-app',
    site: 'localhost:5080',
    service: 'web-frontend-application',
    env: 'production',
    version: '0.0.1',
    organizationIdentifier: 'default',
    insecureHTTP: true,
    apiVersion: 'v1',
};

openobserveRum.init({
    applicationId: options.applicationId, // required, any string identifying your application
    clientToken: options.clientToken,
    site: options.site,
    organizationIdentifier: options.organizationIdentifier,
    service: options.service,
    env: options.env,
    version: options.version,
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,
    apiVersion: options.apiVersion,
    insecureHTTP: options.insecureHTTP,
    defaultPrivacyLevel: 'allow' // 'allow' or 'mask-user-input' or 'mask'. Use one of the 3 values.
});

openobserveLogs.init({
    clientToken: options.clientToken,
    site: options.site,
    organizationIdentifier: options.organizationIdentifier,
    service: options.service,
    env: options.env,
    version: options.version,
    forwardErrorsToLogs: true,
    insecureHTTP: options.insecureHTTP,
    apiVersion: options.apiVersion,
});

// You can set a user context
openobserveRum.setUser({
    id: "1",
    name: "Captain Hook",
    email: "captainhook@example.com",
});

openobserveRum.startSessionReplayRecording();
