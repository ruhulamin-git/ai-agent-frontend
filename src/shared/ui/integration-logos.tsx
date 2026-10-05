import React from "react";

import * as Icons from "@/shared/icons";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  colorful?: boolean;
}

export const IntegrationLogo = ({
  name,
  colorful = true,
  size = 24,
  ...props
}: LogoProps & { name: string }) => {
  const iconProps = { width: size, height: size, ...props };
  switch (name.toLowerCase()) {
    case "slack":
      return <Icons.SlackIcon {...iconProps} />;
    case "notion":
      return <Icons.NotionIcon {...iconProps} />;
    case "github":
      return <Icons.GitHubIcon {...iconProps} />;
    case "facebook":
      return <Icons.FacebookIcon {...iconProps} />;
    case "instagram":
      return <Icons.InstagramIcon {...iconProps} />;
    case "messenger":
      return <Icons.MessengerIcon {...iconProps} />;
    case "gmail":
      return <Icons.GmailIcon {...iconProps} />;
    case "google meet":
    case "meet":
      return <Icons.GoogleMeetIcon {...iconProps} />;
    case "google sheets":
    case "sheets":
      return <Icons.GoogleSheetsIcon {...iconProps} />;
    case "x":
    case "twitter":
      return <Icons.XIcon colorful={colorful} {...iconProps} />;
    case "linkedin":
      return <Icons.LinkedInIcon colorful={colorful} {...iconProps} />;
    default:
      return null;
  }
};
