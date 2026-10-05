import React from "react";

export const LinkedInIcon = ({
  colorful = true,
  ...props
}: React.SVGProps<SVGSVGElement> & { colorful?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zM8 19H5V10H8V19zM6.5 8.5C5.4 8.5 4.5 7.6 4.5 6.5s.9-2 2-2 2 .9 2 2-.9 2-2 2zM19 19h-3v-5.5c0-1.4-.5-2-1.5-2s-1.5.6-1.5 1.5V19h-3V10h3v1.5c.4-.7 1.2-1.2 2.5-1.2 2 0 3.5 1.5 3.5 4V19z"
      fill={colorful ? "#0A66C2" : "currentColor"}
    />
  </svg>
);
