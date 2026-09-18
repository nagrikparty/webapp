import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width, height, className = "" }: LogoProps) {
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
        width: width ? `${width}px` : "auto",
        aspectRatio: "1150 / 700",
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}
