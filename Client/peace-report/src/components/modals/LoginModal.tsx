import React from 'react';
import { useRouter } from 'next/router';
import PublicButton from '@/src/components/buttons/PublicButton';

interface LoginModalProps {
  message: string | null;
  error: string | null;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ message, error, onClose }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center space-y-4">
        {error ? (
          <div className="text-red-500">
            <h2 className="text-xl font-semibold">Error Occurred</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="text-green-500">
            <h2 className="text-xl font-semibold">Success</h2>
            <p>{message}</p>
            <PublicButton text="Go to Login" onClick={handleRedirect} />
          </div>
        )}
        <PublicButton text="Close" onClick={onClose} />
      </div>
    </div>
  );
};

export default LoginModal;
