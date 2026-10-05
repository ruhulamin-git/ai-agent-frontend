import client from "./client";

const credentialsByNameCache = new Map();
const credentialsByNamePromises = new Map();
let allComponentsCredentialsCache = null;
let allComponentsCredentialsPromise = null;

const clearCredentialsCache = () => {
  credentialsByNameCache.clear();
  credentialsByNamePromises.clear();
  allComponentsCredentialsCache = null;
  allComponentsCredentialsPromise = null;
};

const getAllCredentials = () => client.get("/credentials");

const getCredentialsByName = (componentCredentialName) => {
  if (credentialsByNameCache.has(componentCredentialName)) {
    return Promise.resolve({ data: credentialsByNameCache.get(componentCredentialName) });
  }

  if (credentialsByNamePromises.has(componentCredentialName)) {
    return credentialsByNamePromises.get(componentCredentialName);
  }

  const promise = client
    .get(`/credentials?credentialName=${componentCredentialName}`)
    .then((res) => {
      if (res.data) {
        credentialsByNameCache.set(componentCredentialName, res.data);
      }
      return res;
    })
    .finally(() => {
      credentialsByNamePromises.delete(componentCredentialName);
    });

  credentialsByNamePromises.set(componentCredentialName, promise);
  return promise;
};

const getAllComponentsCredentials = () => {
  if (allComponentsCredentialsCache) {
    return Promise.resolve({ data: allComponentsCredentialsCache });
  }
  if (allComponentsCredentialsPromise) {
    return allComponentsCredentialsPromise;
  }
  allComponentsCredentialsPromise = client
    .get("/components-credentials")
    .then((res) => {
      allComponentsCredentialsCache = res.data;
      return res;
    })
    .finally(() => {
      allComponentsCredentialsPromise = null;
    });
  return allComponentsCredentialsPromise;
};

const getSpecificCredential = (id) => client.get(`/credentials/${id}`);

const getSpecificComponentCredential = (name) => client.get(`/components-credentials/${name}`);

const createCredential = (body) => {
  clearCredentialsCache();
  return client.post(`/credentials`, body);
};

const updateCredential = (id, body) => {
  clearCredentialsCache();
  return client.put(`/credentials/${id}`, body);
};

const deleteCredential = (id) => {
  clearCredentialsCache();
  return client.delete(`/credentials/${id}`);
};

const revealCredential = (id) => client.get(`/credentials/${id}/reveal`);

export default {
  getAllCredentials,
  getCredentialsByName,
  getAllComponentsCredentials,
  getSpecificCredential,
  getSpecificComponentCredential,
  createCredential,
  updateCredential,
  deleteCredential,
  revealCredential,
  clearCredentialsCache,
};

