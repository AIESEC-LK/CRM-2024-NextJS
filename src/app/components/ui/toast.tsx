interface ToastNotificationProps {
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
  return (
    <div className="toast-notification bg-green-500 text-white p-2 rounded flex justify-between items-center mb-2">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 bg-transparent text-white font-bold"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default ToastNotification;

