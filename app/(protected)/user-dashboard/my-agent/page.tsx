import { NewDashboard } from "@/modules/newdashboard/NewDashboard";
import { MyAgent } from "@/modules/newdashboard/user-dashboard/pages/my-agent/MyAgent";

const MyAgentPage = () => {
  return (
    <NewDashboard>
      <MyAgent />
    </NewDashboard>
  );
};

export default MyAgentPage;
