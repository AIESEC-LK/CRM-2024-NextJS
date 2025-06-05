'use client';

import React, { useEffect, useState } from 'react';
import './Popup.css';

interface PopupProps {
  isOpen: boolean;
  close: () => void;
  title: string;
  message: string;
  isError?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  close,
  title,
  message,
  isError = false,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState<'show' | 'hide'>('hide');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Allow rendering before applying show animation
      requestAnimationFrame(() => {
        setAnimationClass('show');
      });
    } else {
      setAnimationClass('hide');
      // Wait for animation before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={`popup-overlay ${animationClass}`}>
      <div className={`popup-content ${animationClass}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={close} className={isError ? 'button-error' : ''}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
