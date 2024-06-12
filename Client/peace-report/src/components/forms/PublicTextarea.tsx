import React from 'react';

interface TextAreaProps {
  id?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
}

const PublicTextArea: React.FC<TextAreaProps> = ({
  id,
  placeholder,
  label,
  required,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="mb-4 w-full flex items-center">
      {label && (
        <label htmlFor={id} className="w-40 text-sm font-medium text-sky-700">
          {label}
        </label>
      )}
      <div className="relative flex-1">
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          className="w-full text-lg border-2 border-sky-500 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none text-black"
          required={required}
          value={value}
          onChange={onChange}
          rows={4}
        />
      </div>
    </div>
  );
};

export default PublicTextArea;
