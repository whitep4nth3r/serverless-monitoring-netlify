// https://docs.sentry.io/platforms/javascript/guides/deno/
// import * as Sentry from "https://deno.land/x/sentry/index.mjs";
import * as Sentry from "@sentry/node";

// currently can't use profiling because Netlify Edge does not support --allow-ffi in Deno
// https://docs.deno.com/runtime/manual/basics/permissions
// https://answers.netlify.com/t/enabling-the-unstable-flag-for-deno-in-edge-functions/56182
// import { ProfilingIntegration } from "npm:@sentry/profiling-node";

function sortByNameAsc(a, b) {
  if (a.name.charAt(0) < b.name.charAt(0)) {
    return -1;
  }

  if (a.name.charAt(0) > b.name.charAt(0)) {
    return 1;
  }

  return 0;
}

// NOT cached by default: https://docs.netlify.com/platform/caching/#default-caching-behavior

export default async () => {
  const startTime = performance.now();

  Sentry.init({
    dsn: "https://db29b6167d476b15d4e2b51a30bca275@o4505635661873152.ingest.sentry.io/4506711381245953",
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });

  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
    );

    const data = await response.json();
    const sorted = data.results.sort(sortByNameAsc);
    const endTime = performance.now();
    const timeToExecute = endTime - startTime;
    return new Response(
      `Netlify edge function, with Sentry error monitoring. \n\nTime to execute: ${timeToExecute}.`,
    );
  } catch (error) {
    Sentry.captureException(error);
    return new Response(error);
  }
};

export const config = { path: "/edge-functions/with-sentry" };
