'use client'

import React, { useEffect, useState } from "react";
import "./Popup.css";

interface PopupProps {
  isOpen: boolean;
  close: () => void;
  title: string;
  message: string;
  isError?: boolean;
}

const Popup: React.FC<PopupProps> = ({ isOpen, close, title, message, isError = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 500);
    } else {
      setTimeout(() => setIsVisible(false), 500); // Sync with CSS transition time
    }
  }, [isOpen]);

  if (!isVisible) return null; // Prevent rendering when closed

  return (
    <div className={`popup-overlay ${isOpen ? "show" : "hide"}`}>
      <div className={`popup-content ${isOpen ? "show" : "hide"}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={close} className={isError ? "button-error" : ""}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;