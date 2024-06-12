import React from 'react';

interface CheckboxInputProps {
  id?: string;
  label?: React.ReactNode;
  required?: boolean;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const PublicCheckboxInput: React.FC<CheckboxInputProps> = ({
  id,
  label,
  required,
  checked,
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
      <input
        id={id}
        name={name}
        type="checkbox"
        className="w-5 h-5 text-sky-700 border-2 border-sky-500 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
        required={required}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default PublicCheckboxInput;
