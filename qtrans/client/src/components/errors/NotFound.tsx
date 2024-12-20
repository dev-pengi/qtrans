import { Link } from "@tanstack/react-router";
import { FC } from "react";

const NotFound: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-9xl font-bold text-white">404</h1>
      <h2 className="mt-9 text-lg font-bold text-white">
        this page does not exist,{" "}
        <Link to="/" className="text-accent underline">
          go home
        </Link>
      </h2>
    </div>
  );
};

export default NotFound;
