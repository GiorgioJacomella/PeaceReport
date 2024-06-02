import React from 'react';
import PublicButton from '@/src/components/buttons/publicButton';

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center space-y-4">
        <div className="text-red-500">
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{errorMessage}</p>
        </div>
        <a href="/login">
          <PublicButton text="Go to Login" />
        </a>
        <PublicButton text="Close" onClick={onClose} />
      </div>
    </div>
  );
};

export default ErrorModal;
