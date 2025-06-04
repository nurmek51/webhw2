import type { FC, HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  customOnClick?: () => void;
}

export const Button: FC<ButtonProps> = (props) => {
  return (
    <button {...props} onClick={() => props.customOnClick()}>
      Custom Button
    </button>
  );
};
