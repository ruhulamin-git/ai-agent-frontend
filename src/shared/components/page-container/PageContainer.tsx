import type { PageContainerProps } from "./types";

const PageContainer = ({ title, description, children }: PageContainerProps) => (
  <div>
    <title>{title}</title>
    <meta name="description" content={description} />
    {children}
  </div>
);

export { PageContainer };
