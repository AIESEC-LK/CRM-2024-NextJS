import React from "react";

interface ListGroupProps {
  values: string[]; // Array of list items
  className?: string; // Additional custom class for the outer div
}

const ListGroup: React.FC<ListGroupProps> = ({ values, className }) => {
  return (
    <div
      className={`text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
        className || ""
      }`}
    >
      {values.map((value, index) => (
        <a
          key={index}
          href="#"
          className={`block w-full px-4 py-2 ${
            index < values.length - 1 ? "border-b border-gray-200" : "rounded-b-lg"
          } cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white`}
        >
          {value}
        </a>
      ))}
    </div>
  );
};

export default ListGroup;
