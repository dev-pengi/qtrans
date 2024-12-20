import { FC } from "react";

const ErrorPage: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-9xl font-bold text-white">500</h1>
      <h2 className="mt-9 text-lg font-bold text-white">
        page crashed,{" "}
        <button
          className="text-accent underline"
          onClick={() => {
            window.location.reload();
          }}
        >
          refresh page
        </button>
      </h2>
    </div>
  );
};

export default ErrorPage;
