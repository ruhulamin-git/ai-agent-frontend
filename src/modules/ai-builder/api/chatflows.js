import client from "./client";
import { axios as djangoAxios } from "@/utils/axios";

const getAllChatflows = (params) => client.get("/chatflows?type=CHATFLOW", { params });

const getAllChatflowsDjango = async () => {
  const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
  const agents = response?.data || [];
  // Filter for chatflows (single agents) and map fields
  const chatflows = (Array.isArray(agents) ? agents : [])
    .filter(a => String(a.type).toUpperCase() === 'CHATFLOW')
    .map(a => ({
      ...a,
      id: a.chatflow_id || a.id,
      django_id: a.id,
      flowData: a.flowData || a.workflow_definition,
      updatedDate: a.updated_at || a.created_at
    }));
  return {
    data: {
      data: chatflows,
      total: chatflows.length
    }
  };
};

const getAllAgentflows = (type, params) => client.get(`/chatflows?type=${type}`, { params });

const getAllAgentflowsDjango = async () => {
  const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
  const agents = response?.data || [];
  // Filter for multiagents (agentflows) and map fields
  const agentflows = (Array.isArray(agents) ? agents : [])
    .filter(a => String(a.type).toUpperCase() === 'MULTIAGENT' || String(a.type).toUpperCase() === 'AGENTFLOW')
    .map(a => ({
      ...a,
      id: a.chatflow_id || a.id,
      django_id: a.id,
      flowData: a.flowData || a.workflow_definition,
      updatedDate: a.updated_at || a.created_at
    }));
  return {
    data: {
      data: agentflows,
      total: agentflows.length
    }
  };
};

const getSpecificChatflow = (id) => client.get(`/chatflows/${id}`);

const getSpecificChatflowDjango = async (id) => {
  let agent;
  try {
    // If ID is numeric, try the detail endpoint directly
    if (!isNaN(id) && !id.toString().includes('-')) {
      const response = await djangoAxios.get(`/api/ai-agents/v1/user-created-agents/${id}/`);
      agent = response?.data || response;
    } else {
      // If it's a UUID, search for it in the list
      const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
      const agents = response?.data || [];
      agent = agents.find(a => a.chatflow_id === id || a.id === id);
    }
  } catch (error) {
    // If 404 or other error on direct detail, try list lookup as fallback
    const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
    const agents = response?.data || [];
    agent = agents.find(a => a.chatflow_id === id || a.id === id);
  }

  if (!agent) {
    try {
      // Fallback to Flowise backend
      return await getSpecificChatflow(id);
    } catch (e) {
      throw new Error(`Agent with ID ${id} not found`);
    }
  }

  return {
    data: {
      ...agent,
      id: agent.chatflow_id || agent.id,
      django_id: agent.id,
      flowData: agent.flowData || agent.workflow_definition,
      updatedDate: agent.updated_at || agent.created_at
    }
  };
};

const getSpecificChatflowFromPublicEndpoint = (id) => client.get(`/public-chatflows/${id}`);

const createNewChatflow = (body) => client.post(`/chatflows`, body);

const updateChatflow = (id, body) => client.put(`/chatflows/${id}`, body);

const updateChatflowDjango = async (id, body) => {
  const formData = new FormData();
  if (body.name) formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.flowData) formData.append("workflow_definition", body.flowData);

  try {
    const response = await djangoAxios.put(`/api/ai-agents/v1/user-created-agents/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const agent = response?.data || response;
    return {
      data: {
        ...agent,
        id: agent.chatflow_id || agent.id,
        django_id: agent.id,
        flowData: agent.flowData || agent.workflow_definition,
        updatedDate: agent.updated_at || agent.created_at
      }
    };
  } catch (error) {
    // If not found in Django (e.g. it's a replicated flowise chatflow from marketplace), fallback to native Flowise
    return await updateChatflow(id, body);
  }
};

const deleteChatflow = (id) => client.delete(`/chatflows/${id}`);

const getIsChatflowStreaming = async (id) => {
  try {
    return await client.get(`/chatflows-streaming/${id}`);
  } catch (error) {
    if (error.response?.status === 500 || error.response?.status === 404) {
      // It's likely a Django User-Created Agent which Flowise API lacks context for.
      return { data: { isStreaming: false } };
    }
    throw error;
  }
};

const getAllowChatflowUploads = (id) => client.get(`/chatflows-uploads/${id}`);

const getHasChatflowChanged = (id, lastUpdatedDateTime) =>
  client.get(`/chatflows/has-changed/${id}/${lastUpdatedDateTime}`);

const generateAgentflow = (body) => client.post(`/agentflowv2-generator/generate`, body);

const setWebhookSecret = (id) => client.post(`/chatflows/${id}/webhook-secret`);

const clearWebhookSecret = (id) => client.delete(`/chatflows/${id}/webhook-secret`);

const getScheduleStatus = (id) => client.get(`/chatflows/${id}/schedule/status`);

const toggleScheduleEnabled = (id, enabled) =>
  client.patch(`/chatflows/${id}/schedule/enabled`, { enabled });

const getScheduleTriggerLogs = (id, params) =>
  client.get(`/chatflows/${id}/schedule/trigger-logs`, { params });

const deleteScheduleTriggerLogs = (id, logIds) =>
  client.delete(`/chatflows/${id}/schedule/trigger-logs`, { data: { logIds } });

const createNewAgentflowDjango = async (body) => {
  const formData = new FormData();
  if (body.name) formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.flowData) formData.append("workflow_definition", body.flowData);
  formData.append("type", "MULTIAGENT");
  formData.append("source_type", "canvas");
  formData.append("is_active", "true");

  const response = await djangoAxios.post('/api/ai-agents/v1/user-created-agents/', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const agent = response?.data || response;
  return {
    data: {
      ...agent,
      id: agent.chatflow_id || agent.id,
      django_id: agent.id,
      flowData: agent.flowData || agent.workflow_definition,
      updatedDate: agent.updated_at || agent.created_at
    }
  };
};

const updateAgentflowDjango = async (id, body) => {
  let targetId = id;
  // If targetId is not a number, meaning it's a uuid, do a lookup
  if (isNaN(targetId) || String(targetId).includes('-')) {
    try {
      const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
      const agents = response?.data?.data || response?.data || [];
      const currentAgent = agents.find(a => a.chatbot_id === id || a.uuid === id || a.chatflow_id === id);
      if (currentAgent) {
        targetId = currentAgent.id;
      }
    } catch (e) {
      // Ignore
    }
  }

  const formData = new FormData();
  if (body.name) formData.append("name", body.name);
  if (body.description) formData.append("description", body.description);
  if (body.flowData) formData.append("workflow_definition", body.flowData);

  const response = await djangoAxios.put(`/api/ai-agents/v1/user-created-agents/${targetId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const agent = response?.data || response;
  return {
    data: {
      ...agent,
      id: agent.chatflow_id || agent.id,
      django_id: agent.id,
      flowData: agent.flowData || agent.workflow_definition,
      updatedDate: agent.updated_at || agent.created_at
    }
  };
};

const deleteAgentflowDjango = async (id) => {
  let targetId = id;
  // If targetId is not a number, meaning it's a uuid, do a lookup
  if (isNaN(targetId) || String(targetId).includes('-')) {
    try {
      const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
      const agents = response?.data?.data || response?.data || [];
      const currentAgent = agents.find(a => a.chatbot_id === id || a.uuid === id || a.chatflow_id === id);
      if (currentAgent) {
        targetId = currentAgent.id;
      }
    } catch (e) {
      // Ignore
    }
  }

  const response = await djangoAxios.delete(`/api/ai-agents/v1/user-created-agents/${targetId}/`);
  return { data: response?.data || response };
};

export default {
  getAllChatflows,
  getAllChatflowsDjango,
  getAllAgentflows,
  getAllAgentflowsDjango,
  getSpecificChatflow,
  getSpecificChatflowDjango,
  getSpecificChatflowFromPublicEndpoint,
  createNewChatflow,
  updateChatflow,
  updateChatflowDjango,
  deleteChatflow,
  getIsChatflowStreaming,
  getAllowChatflowUploads,
  getHasChatflowChanged,
  generateAgentflow,
  setWebhookSecret,
  clearWebhookSecret,
  getScheduleStatus,
  toggleScheduleEnabled,
  getScheduleTriggerLogs,
  deleteScheduleTriggerLogs,
  createNewAgentflowDjango,
  updateAgentflowDjango,
  deleteAgentflowDjango,
};
