function sortByNameAsc(a, b) {
  if (a.name.charAt(0) < b.name.charAt(0)) {
    return -1;
  }

  if (a.name.charAt(0) > b.name.charAt(0)) {
    return 1;
  }

  return 0;
}

// path: /functions/default
// NOT cached by default: https://docs.netlify.com/platform/caching/#default-caching-behavior

export default async () => {
  const startTime = performance.now();
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
    );

    const data = await response.json();
    const sorted = data.results.sort(sortByNameAsc);
    const endTime = performance.now();
    const timeToExecute = endTime - startTime;
    return new Response(
      `Netlify serverless function, no error monitoring. \n\nTime to execute: ${timeToExecute}.`,
    );
  } catch (error) {
    return new Response(error);
  }
};
