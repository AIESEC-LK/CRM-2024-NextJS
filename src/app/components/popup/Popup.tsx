import React from 'react';
import './Popup.css';

interface PopupProps {
    isOpen: boolean;
    close: () => void;
    title: string;  // New prop for title content
    message: string;  // New prop for message content
}

const Popup: React.FC<PopupProps> = ({ isOpen, close, title,message }) => {
    if (!isOpen) return null;  // Don't render the modal if it's not open

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{title}</h2>
                <p>{message}</p> 
                <button onClick={close}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
