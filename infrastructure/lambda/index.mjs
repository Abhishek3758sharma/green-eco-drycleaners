import server from "./server/server.js";

const textTypes = /^(text\/|application\/(json|javascript|xml)|.*\+json)/i;

export async function handler(event) {
  const headers = new Headers(event.headers || {});
  const protocol = headers.get("cloudfront-forwarded-proto") || "https";
  const host = headers.get("x-forwarded-host") || headers.get("host") || event.requestContext?.domainName;
  const query = event.rawQueryString ? `?${event.rawQueryString}` : "";
  const url = `${protocol}://${host}${event.rawPath || event.requestContext?.http?.path || "/"}${query}`;
  const method = event.requestContext?.http?.method || event.requestContext?.httpMethod || "GET";
  const body = event.body ? (event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body) : undefined;
  const request = new Request(url, { method, headers, body: ["GET", "HEAD"].includes(method) ? undefined : body });
  const response = await server.fetch(request, process.env, {});
  const responseBody = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "";
  const isBase64Encoded = !textTypes.test(contentType);
  const responseHeaders = Object.fromEntries(response.headers.entries());
  const cookies = response.headers.getSetCookie?.() || [];
  delete responseHeaders["set-cookie"];

  return {
    statusCode: response.status,
    headers: responseHeaders,
    cookies,
    body: isBase64Encoded ? responseBody.toString("base64") : responseBody.toString("utf8"),
    isBase64Encoded,
  };
}
