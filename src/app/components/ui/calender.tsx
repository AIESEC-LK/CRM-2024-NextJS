import React from "react";
import dayjs, { Dayjs } from "dayjs";

interface CalendarProps {
  selectedDate: string; // The selected date in "YYYY-MM-DD" format
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate }) => {
  const today = dayjs(); // Current date
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");
  const startDayOfWeek = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  // Create an array of days to display in the calendar
  const daysArray: Dayjs[] = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );
  const paddedDays: (Dayjs | null)[] = [
    ...Array.from({ length: startDayOfWeek }, () => null), // Padding for the first row
    ...daysArray,
  ];

  return (
    <div className="w-80 bg-gray-100 rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="text-lg font-bold text-center mb-4">{today.format("MMMM YYYY")}</div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center">
        {paddedDays.map((day, index) => {
          const isPadding = day === null; // Empty padding cells
          const isSelected =
            day && day.format("YYYY-MM-DD") === selectedDate; // Highlight selected date
          const isToday =
            day && day.format("YYYY-MM-DD") === today.format("YYYY-MM-DD"); // Highlight today's date

          return (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                isPadding
                  ? ""
                  : isSelected
                  ? "bg-blue-500 text-white"
                  : isToday
                  ? "bg-gray-300 text-black"
                  : "bg-white text-gray-700"
              }`}
            >
              {!isPadding && day.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
