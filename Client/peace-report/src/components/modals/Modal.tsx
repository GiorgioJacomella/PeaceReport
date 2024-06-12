import React from 'react';
import { useRouter } from 'next/router';
import PublicButton from '@/src/components/buttons/PublicButton';

interface ModalProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onClose: () => void;
  redirectPath?: string;
  redirectLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ type, message, onClose, redirectPath, redirectLabel }) => {
  const router = useRouter();
  
  const handleRedirect = () => {
    if (redirectPath) {
      router.push(redirectPath);
      onClose();
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      case 'info':
        return 'Information';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center space-y-4">
        <div className={getColor()}>
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
          <p>{message}</p>
        </div>
        {redirectPath && (
          <PublicButton text={redirectLabel || 'Go'} onClick={handleRedirect} />
        )}
        <PublicButton text="Close" onClick={onClose} />
      </div>
    </div>
  );
};

export default Modal;