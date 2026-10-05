import { NewDashboard } from "@/modules/newdashboard/NewDashboard";
import { AgentUsageDashboard } from "@/modules/newdashboard/user-dashboard/pages/my-agent/agent-usage/AgentUsageDashboard";

const AgentUsagePage = () => {
  return (
    <NewDashboard>
      <AgentUsageDashboard />
    </NewDashboard>
  );
};

export default AgentUsagePage;
