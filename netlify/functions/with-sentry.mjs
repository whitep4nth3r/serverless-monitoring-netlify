/*
the wrapper code - you're right that, yes, a user could configure all the Sentry stuff themselves in the Netlify Function through a copy/paste.
The purpose of the wrapper was to accomplish:
as much 'out of the box' set up as possible for the user once the Sentry config was added to the site via environment variables.
If a user wanted to manually send exceptions to Sentry they still can using Sentry.captureException but they can also lean on us automatically sending the errors for them.
to handle setting Netlify-specific information to the function.
At the moment it's just the name of the function (netlify/functions/<name-of-function>) but we could always add more if more information if desired over time.
If the wrapper were not used and the Sentry/Netlify user didn't manually set this via Sentry's configureScope, when an error is thrown the filename is a bunch of gobbledegook which isn't very helpful.
*/

import * as Sentry from "@sentry/node";

function sortByNameAsc(a, b) {
  if (a.name.charAt(0) < b.name.charAt(0)) {
    return -1;
  }

  if (a.name.charAt(0) > b.name.charAt(0)) {
    return 1;
  }

  return 0;
}

// path: /functions/with-sentry
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
      `Netlify serverless function, with Sentry error monitoring. \n\nTime to execute: ${timeToExecute}.`,
    );
  } catch (error) {
    Sentry.captureException(error);
    return new Response(error);
  }
};
