import React from "react";

export default function LoadingBars({
  color = "#3b82f6",
  size = "medium",
  className = "",
}) {
  const sizeConfig = {
    small: { width: "4px", height: "20px", gap: "3px" },
    medium: { width: "6px", height: "30px", gap: "4px" },
    large: { width: "8px", height: "40px", gap: "5px" },
  };

  const config = sizeConfig.small;

  const barStyle = {
    width: config.width,
    height: config.height,
    borderRadius: "3px",
    animation: "bounce 1.2s infinite ease-in-out",
  };

  const containerStyle = {
    display: "flex",
    gap: config.gap,
    alignItems: "end",
  };

  return (
    <div className={`loading-bars ${className}`} style={containerStyle}>
      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scaleY(0.6);
          }
          40% {
            transform: scaleY(1);
          }
        }

        .bar:nth-child(1) {
          animation-delay: -0.24s;
        }
        .bar:nth-child(2) {
          animation-delay: -0.12s;
        }
        .bar:nth-child(3) {
          animation-delay: 0s;
        }
        .bar:nth-child(4) {
          animation-delay: 0.12s;
        }
      `}</style>
      <div
        className="bar bg-primary"
        style={{ ...barStyle, animationDelay: "-0.24s" }}
      ></div>
      <div
        className="bar bg-primary"
        style={{ ...barStyle, animationDelay: "-0.12s" }}
      ></div>
      <div
        className="bar bg-primary"
        style={{ ...barStyle, animationDelay: "0s" }}
      ></div>
      <div
        className="bar bg-primary"
        style={{ ...barStyle, animationDelay: "0.12s" }}
      ></div>
    </div>
  );
}
