import React, { useState } from 'react';

interface TextInputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const PublicTextInput: React.FC<TextInputProps> = ({
  id,
  type = 'text',
  placeholder,
  label,
  required,
  value,
  onChange,
  name,
}) => {
  const [inputType, setInputType] = useState(type);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="mb-4 w-full flex items-center">
      {label && (
        <label htmlFor={id} className="w-40 text-sm font-medium text-sky-700">
          {label}
        </label>
      )}
      <div className="relative flex-1">
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className="w-full text-lg border-2 border-sky-500 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none text-black"
          required={required}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {inputType === 'password' ? 'Show' : 'Hide'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PublicTextInput;
