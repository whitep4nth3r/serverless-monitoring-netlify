# Investigations into monitoring serverless functions with Sentry

Hypothesis: adding error monitoring solutions to serverless/edge functions has
the potential to increase code execution time when cold-starting/not cached,
which _could_ lead to timeouts depending on the complexity of the logic
platform-specific function execution limits.

---

Each serverless or edge function makes an arbitrary call to the Pokemon API,
sorts the data, and returns the execution time of the function.

I collected data _in production_ for the functions with and without using
Sentry.

## Netlify Functions (AWS lambda wrapper)

- Without Sentry:
  [https://serverless-monitoring.netlify.app/functions/default](https://serverless-monitoring.netlify.app/functions/default)
- With Sentry:
  [https://serverless-monitoring.netlify.app/functions/with-sentry](https://serverless-monitoring.netlify.app/functions/with-sentry)

## Netlify Edge Functions (Deno wrapper)

- Without Sentry:
  [https://serverless-monitoring.netlify.app/functions/default](https://serverless-monitoring.netlify.app/edge-functions/default)
- With Sentry:
  [https://serverless-monitoring.netlify.app/functions/with-sentry](https://serverless-monitoring.netlify.app/edge-functions/with-sentry)
