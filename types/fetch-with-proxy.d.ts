declare module 'fetch-with-proxy' {
  import { RequestInfo, RequestInit, Response } from 'node-fetch';
  export default function fetch(
    url: RequestInfo,
    init?: RequestInit
  ): Promise<Response>;
}
