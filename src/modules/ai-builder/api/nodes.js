import client from "./client";

// In-memory caches and in-flight promise trackers
let allNodesCache = null;
let allNodesPromise = null;
const specificNodeCache = new Map();
const specificNodePromises = new Map();
const loadMethodCache = new Map();
const loadMethodPromises = new Map();
const LOAD_METHOD_TTL_MS = 10 * 60 * 1000; // 10 minutes

const getAllNodes = (options = {}) => {
  if (!options.forceRefresh && allNodesCache) {
    return Promise.resolve({ data: allNodesCache });
  }

  if (allNodesPromise) {
    return allNodesPromise;
  }

  allNodesPromise = client
    .get("/nodes", { params: { client: "agentflowv2" } })
    .then((res) => {
      allNodesCache = res.data;
      if (Array.isArray(res.data)) {
        res.data.forEach((node) => {
          if (node?.name) {
            specificNodeCache.set(node.name, node);
          }
        });
      }
      return res;
    })
    .finally(() => {
      allNodesPromise = null;
    });

  return allNodesPromise;
};

const getSpecificNode = (name, options = {}) => {
  if (!options.forceRefresh) {
    if (specificNodeCache.has(name)) {
      return Promise.resolve({ data: specificNodeCache.get(name) });
    }
    if (Array.isArray(allNodesCache)) {
      const found = allNodesCache.find((node) => node?.name === name);
      if (found) {
        specificNodeCache.set(name, found);
        return Promise.resolve({ data: found });
      }
    }
  }

  if (specificNodePromises.has(name)) {
    return specificNodePromises.get(name);
  }

  const promise = client
    .get(`/nodes/${name}`, { params: { client: "agentflowv2" } })
    .then((res) => {
      if (res.data) {
        specificNodeCache.set(name, res.data);
      }
      return res;
    })
    .finally(() => {
      specificNodePromises.delete(name);
    });

  specificNodePromises.set(name, promise);
  return promise;
};

const getNodesByCategory = (categoryName) => {
  if (Array.isArray(allNodesCache)) {
    const filtered = allNodesCache.filter((nd) => nd.category === categoryName);
    if (filtered.length > 0) {
      return Promise.resolve({ data: filtered });
    }
  }
  return client.get(`/nodes/category/${categoryName}`, { params: { client: "agentflowv2" } });
};

const executeCustomFunctionNode = (body) => client.post(`/node-custom-function`, body);

const executeNodeLoadMethod = (name, body = {}) => {
  const isForceRefresh = !!body.forceRefresh;
  const loadMethodName = body.loadMethod || "";
  const paramName = body.name || "";
  const credentialId = body.credential || "";

  // Extract stable cache key for the dynamic options
  const cacheKey = `${name}:${loadMethodName}:${paramName}:${credentialId}`;

  if (!isForceRefresh && loadMethodCache.has(cacheKey)) {
    const cached = loadMethodCache.get(cacheKey);
    if (Date.now() - cached.timestamp < LOAD_METHOD_TTL_MS) {
      return Promise.resolve({ data: cached.data });
    }
    loadMethodCache.delete(cacheKey);
  }

  if (loadMethodPromises.has(cacheKey)) {
    return loadMethodPromises.get(cacheKey);
  }

  const promise = client
    .post(`/node-load-method/${name}`, body)
    .then((res) => {
      loadMethodCache.set(cacheKey, {
        data: res.data,
        timestamp: Date.now(),
      });
      return res;
    })
    .finally(() => {
      loadMethodPromises.delete(cacheKey);
    });

  loadMethodPromises.set(cacheKey, promise);
  return promise;
};

const clearNodesCache = () => {
  allNodesCache = null;
  allNodesPromise = null;
  specificNodeCache.clear();
  specificNodePromises.clear();
  loadMethodCache.clear();
  loadMethodPromises.clear();
};

export default {
  getAllNodes,
  getSpecificNode,
  executeCustomFunctionNode,
  getNodesByCategory,
  executeNodeLoadMethod,
  clearNodesCache,
};

