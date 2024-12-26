import React from "react";

interface ProgressBarProps {
  text: string; // Label text (e.g., "45%")
  color: string; // Any string input for color
  width: string; // Width of the progress (as a percentage, e.g., "45%")
  className?: string; // Optional additional styles for the outer container
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  dark: { bg: "bg-gray-700", text: "text-gray-100" },
  blue: { bg: "bg-blue-600", text: "text-blue-100" },
  red: { bg: "bg-red-600", text: "text-red-100" },
  green: { bg: "bg-green-600", text: "text-green-100" },
  yellow: { bg: "bg-yellow-500", text: "text-yellow-900" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-100" },
  purple: { bg: "bg-purple-600", text: "text-purple-100" },
  teal: { bg: "bg-teal-600", text: "text-teal-100" },
};

const ProgressBar: React.FC<ProgressBarProps> = ({ text, color, width, className }) => {
  const { bg, text: textColor } = colorClasses[color] || { bg: "bg-gray-300", text: "text-gray-800" }; // Default styles

  return (
    <div
      className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${className || ""}`}
      aria-label={`Progress at ${text}`} // Improves accessibility
    >
      <div
        className={`text-xs font-medium text-center p-2 leading-none rounded-full transition-all duration-300 ease-in-out ${bg} ${textColor}`}
        style={{ width }}
      >
        {text}
      </div>
    </div>
  );
};

export default ProgressBar
