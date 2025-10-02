import { FC } from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}

const Button: FC<ButtonProps> = ({ text, onClick, type = "button", variant = "primary" }) => {
  const baseStyle =
    "px-6 py-2 rounded-lg font-medium transition focus:outline-none";

  const styles = {
    primary: `${baseStyle} bg-blue-600 text-white hover:bg-blue-700`,
    secondary: `${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300`,
  };

  return (
    <button type={type} onClick={onClick} className={styles[variant]}>
      {text}
    </button>
  );
};

export default Button;
