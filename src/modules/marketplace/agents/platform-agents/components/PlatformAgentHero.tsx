import { AgentAvatar } from "../../shared/components/AgentAvatar";

import type { Agent } from "../../shared/types";

interface PlatformAgentHeroProps {
  agent: Agent;
}

export const PlatformAgentHero = ({ agent }: PlatformAgentHeroProps) => {

  return (
    <div className="relative w-full bg-background text-foreground">


      {/* Main Hero Section */}
      <section className="relative px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="items-center">
            <div className=" space-y-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-start w-full mb-5">

                    <AgentAvatar
                      agent={{
                        icon: agent.icon,
                        color: agent.color,
                        imageUrl: (agent as { imageUrl?: string }).imageUrl,
                        name: agent.name,
                      }}
                      size="lg"
                      className=" rounded-xl"
                    />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight mb-4">
                    {agent.name}
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium mb-6">
                    {agent.role}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed ">
                    {agent.longDescription || "This platform agent provides enterprise-grade AI capabilities with seamless integration, automatic scaling, and built-in security. Perfect for production deployments and mission-critical applications."}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2  border border-emerald-500/20 px-4 py-2 rounded-full">
                  <span className="capitalize text-sm font-medium text-muted-foreground ">
                    {agent.category}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 ">
                  <div>
                    <div className="text-3xl font-black text-foreground">5.0</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};