import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 160, height, className = "" }: LogoProps) {
  return (
    <img
      src="/nagrikpartylogo.svg"
      alt="Nagrik Party"
      width={width}
      height={height}
      className={`nagrik-logo ${className}`}
      loading="eager"
      decoding="async"
      style={{
        maxWidth: "100%",
        height: height ? `${height}px` : "auto",
        aspectRatio: "1/1",
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}
