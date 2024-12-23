import React from "react";

interface ProgressBarProps {
  text: string; // Label text (e.g., "45%")
  color: "dark" | "blue" | "red" | "green" | "yellow" | "indigo" | "purple"; // Restricted color selection
  width: string; // Width of the progress (as a percentage, e.g., "45%")
  className?: string; // Optional additional styles for the outer container
}

const colorClasses: Record<ProgressBarProps["color"], { bg: string; text: string }> = {
  dark: { bg: "bg-gray-700", text: "text-gray-100" },
  blue: { bg: "bg-blue-600", text: "text-blue-100" },
  red: { bg: "bg-red-600", text: "text-red-100" },
  green: { bg: "bg-green-600", text: "text-green-100" },
  yellow: { bg: "bg-yellow-600", text: "text-yellow-900" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-100" },
  purple: { bg: "bg-purple-600", text: "text-purple-100" },
};

const ProgressBar: React.FC<ProgressBarProps> = ({ text, color, width, className }) => {
  const { bg, text: textColor } = colorClasses[color];

  return (
    <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${className || ""}`}>
      <div
        className={`text-xs font-medium text-center p-2 leading-none rounded-full ${bg} ${textColor}`}
        style={{ width }}
      >
        {text}
      </div>
    </div>
  );
};

export default ProgressBar;
