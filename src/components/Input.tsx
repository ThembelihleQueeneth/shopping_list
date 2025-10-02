import { FC } from "react";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ label, type = "text", placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

export default Input;
