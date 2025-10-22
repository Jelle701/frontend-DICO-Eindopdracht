[//]: # (````// sentry is een tracking tool - werkt waarschijnlijk pas als het online gaat)

[//]: # ()
[//]: # (These examples should be used as guidance when configuring Sentry functionality within a project.)

[//]: # ()
[//]: # (# Error / Exception Tracking)

[//]: # ()
[//]: # (Use `Sentry.captureException&#40;error&#41;` to capture an exception and log the error in Sentry.)

[//]: # (Use this in try catch blocks or areas where exceptions are expected)

[//]: # ()
[//]: # (# Tracing Examples)

[//]: # ()
[//]: # (Spans should be created for meaningful actions within an applications like button clicks, API calls, and function calls)

[//]: # (Ensure you are creating custom spans with meaningful names and operations)

[//]: # (Use the `Sentry.startSpan` function to create a span)

[//]: # (Child spans can exist within a parent span)

[//]: # ()
[//]: # (## Custom Span instrumentation in component actions)

[//]: # ()
[//]: # (```javascript)

[//]: # (function TestComponent&#40;&#41; {)

[//]: # (  const handleTestButtonClick = &#40;&#41; => {)

[//]: # (    // Create a transaction/span to measure performance)

[//]: # (    Sentry.startSpan&#40;)

[//]: # (      {)

[//]: # (        op: "ui.click",)

[//]: # (        name: "Test Button Click",)

[//]: # (      },)

[//]: # (      &#40;span&#41; => {)

[//]: # (        const value = "some config";)

[//]: # (        const metric = "some metric";)

[//]: # ()
[//]: # (        // Metrics can be added to the span)

[//]: # (        span.setAttribute&#40;"config", value&#41;;)

[//]: # (        span.setAttribute&#40;"metric", metric&#41;;)

[//]: # ()
[//]: # (        doSomething&#40;&#41;;)

[//]: # (      },)

[//]: # (    &#41;;)

[//]: # (  };)

[//]: # ()
[//]: # (  return &#40;)

[//]: # (    <button type="button" onClick={handleTestButtonClick}>)

[//]: # (      Test Sentry)

[//]: # (    </button>)

[//]: # (  &#41;;)

[//]: # (})

[//]: # (```)

[//]: # ()
[//]: # (## Custom span instrumentation in API calls)

[//]: # ()
[//]: # (```javascript)

[//]: # (async function fetchUserData&#40;userId&#41; {)

[//]: # (  return Sentry.startSpan&#40;)

[//]: # (    {)

[//]: # (      op: "http.client",)

[//]: # (      name: `GET /api/users/${userId}`,)

[//]: # (    },)

[//]: # (    async &#40;&#41; => {)

[//]: # (      const response = await fetch&#40;`/api/users/${userId}`&#41;;)

[//]: # (      const data = await response.json&#40;&#41;;)

[//]: # (      return data;)

[//]: # (    },)

[//]: # (  &#41;;)

[//]: # (})

[//]: # (```)

[//]: # ()
[//]: # (# Logs)

[//]: # ()
[//]: # (Where logs are used, ensure Sentry is imported using `import * as Sentry from "@sentry/react"`)

[//]: # (Enable logging in Sentry using `Sentry.init&#40;{ enableLogs: true }&#41;`)

[//]: # (Reference the logger using `const { logger } = Sentry`)

[//]: # (Sentry offers a consoleLoggingIntegration that can be used to log specific console error types automatically without instrumenting the individual logger calls)

[//]: # ()
[//]: # (## Configuration)

[//]: # ()
[//]: # (### Baseline)

[//]: # ()
[//]: # (```javascript)

[//]: # (import * as Sentry from "@sentry/react";)

[//]: # ()
[//]: # (Sentry.init&#40;{)

[//]: # (  dsn: "https://32b6c11e5a7b7916c32f09d7601ec1c7@o4510192880582656.ingest.de.sentry.io/4510192885563472",)

[//]: # ()
[//]: # (  enableLogs: true,)

[//]: # (}&#41;;)

[//]: # (```)

[//]: # ()
[//]: # (### Logger Integration)

[//]: # ()
[//]: # (```javascript)

[//]: # (Sentry.init&#40;{)

[//]: # (  dsn: "https://32b6c11e5a7b7916c32f09d7601ec1c7@o4510192880582656.ingest.de.sentry.io/4510192885563472",)

[//]: # (  integrations: [)

[//]: # (    // send console.log, console.warn, and console.error calls as logs to Sentry)

[//]: # (    Sentry.consoleLoggingIntegration&#40;{ levels: ["log", "warn", "error"] }&#41;,)

[//]: # (  ],)

[//]: # (}&#41;;)

[//]: # (```)

[//]: # ()
[//]: # (## Logger Examples)

[//]: # ()
[//]: # (`logger.fmt` is a template literal function that should be used to bring variables into the structured logs.)

[//]: # ()
[//]: # (```javascript)

[//]: # (logger.trace&#40;"Starting database connection", { database: "users" }&#41;;)

[//]: # (logger.debug&#40;logger.fmt`Cache miss for user: ${userId}`&#41;;)

[//]: # (logger.info&#40;"Updated profile", { profileId: 345 }&#41;;)

[//]: # (logger.warn&#40;"Rate limit reached for endpoint", {)

[//]: # (  endpoint: "/api/results/",)

[//]: # (  isEnterprise: false,)

[//]: # (}&#41;;)

[//]: # (logger.error&#40;"Failed to process payment", {)

[//]: # (  orderId: "order_123",)

[//]: # (  amount: 99.99,)

[//]: # (}&#41;;)

[//]: # (logger.fatal&#40;"Database connection pool exhausted", {)

[//]: # (  database: "users",)

[//]: # (  activeConnections: 100,)

[//]: # (}&#41;;)

[//]: # (```````)