import React from 'react';

interface ButtonProps {
  action?: () => void;
  text?: string;
  type?: 'button' | 'submit' | 'reset';
}

const PublicButton: React.FC<ButtonProps> = ({
  action = () => {},
  text = 'Click me',
  type = 'button',
}) => {
  return (
    <button
      onClick={action}
      className="px-6 py-3 text-lg font-bold text-white bg-sky-500 rounded-md hover:bg-sky-700 transition duration-300"
      type={type}
    >
      {text}
    </button>
  );
};

export default PublicButton;
