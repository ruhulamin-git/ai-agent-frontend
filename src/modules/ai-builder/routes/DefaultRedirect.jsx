import Chatflows from "@/modules/ai-builder/views/chatflows";

// Authentication removed - always redirect to chatflows
export const DefaultRedirect = () => {
  return <Chatflows />;
};
