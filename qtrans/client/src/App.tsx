import { Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "src/components";
import { fetchSettings } from "src/api";
import { useSettingsContext } from "src/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { setConfig } = useSettingsContext();
  useEffect(() => {
    const handleFetchConfig = async () => {
      try {
        const config = await fetchSettings();

        setConfig(config);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    //the server is running locally therefore the request will resolve fast so i added this to show a loading style
    setTimeout(() => {
      handleFetchConfig();
    }, 1000);
  }, []);

  if (isError) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col bg-background-light">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-7xl" />
        <div className="mt-6 text-center text-lg">
          <p>An error occured while fetching the config</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="text-accent hover:underline"
          >
            click here to try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col bg-background-light">
        <ActivityIndicator size={14} />
        <p className="mt-4">Loading Config...</p>
      </div>
    );
  }

  return <Outlet />;
}

export default App;
