// ai-builder API client — use app-wide shared axios and cookies (login token)
import { baseURL as aiBaseURL } from "@/modules/ai-builder/store/constant";
import { axios as sharedAxios } from "@/utils/axios";

const API_PREFIX = "/api/v1";

const mergeConfig = (config) => {
  const cfg = config ? { ...config } : {};
  cfg.headers = { ...(cfg.headers || {}), "x-request-from": "internal" };
  // ensure cookies are sent so the app login token (cookie) is included
  cfg.withCredentials = true;
  return cfg;
};

const absolute = (url) => `${aiBaseURL.replace(/\/$/, "")}${API_PREFIX}${url}`;

const client = {
  get: (url, config) =>
    sharedAxios.get(absolute(url), mergeConfig(config)).then((data) => ({ data })),
  post: (url, body, config) =>
    sharedAxios.post(absolute(url), body, mergeConfig(config)).then((data) => ({ data })),
  put: (url, body, config) =>
    sharedAxios.put(absolute(url), body, mergeConfig(config)).then((data) => ({ data })),
  delete: (url, config) =>
    sharedAxios.delete(absolute(url), mergeConfig(config)).then((data) => ({ data })),
  patch: (url, body, config) =>
    sharedAxios.patch(absolute(url), body, mergeConfig(config)).then((data) => ({ data })),
};

export default client;
