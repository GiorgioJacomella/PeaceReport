import React from 'react';
import PublicButton from '@/src/components/buttons/publicButton';

interface SignupModalProps {
  message: string | null;
  error: string | null;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ message, error}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center space-y-4">
        {error ? (
          <div className="text-red-500">
            <h2 className="text-xl font-semibold">Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="text-green-500">
            <h2 className="text-xl font-semibold">Success</h2>
            <p>{message}</p>
            <a href="/login"><PublicButton text="Go to Login" /></a>
          </div>
          
        )}
        <br></br>
        <a href='/signup'><PublicButton text="Close"/></a>
      </div>
    </div>
  );
};

export default SignupModal;
