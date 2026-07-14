/**
 * Netlify Function: itunes.js
 *
 * Acts as a server-side proxy for the iTunes Search API.
 * Called via /.netlify/functions/itunes?term=...&entity=song&limit=20
 *
 * This bypasses browser CORS since the fetch happens server-side.
 */

exports.handler = async (event) => {
  // Forward all query params directly to iTunes
  const params = new URLSearchParams(event.queryStringParameters || {});
  const itunesUrl = `https://itunes.apple.com/search?${params.toString()}`;

  try {
    const response = await fetch(itunesUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `iTunes returned ${response.status}` }),
      };
    }

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // cache 5 mins to avoid hammering iTunes
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
