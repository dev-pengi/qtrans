import { FC } from "react";

interface ButtonProps {
  // Add your prop types here
}

const Button: FC<ButtonProps> = () => {
  const stringgoo = `HEY THERE`;
  return (
    <div className="this is stupid lol">
      <p>{stringgoo}</p>
      <h1>hello too buddy</h1>
      <h1>HELLO WORLD!</h1>
    </div>
  );
};

export default Button;
