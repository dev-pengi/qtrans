import { ReactNode } from "@tanstack/react-router";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Config } from "src/types";

interface SettingsContextProps {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const useSettingsContext = (): SettingsContextProps => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "Player context must be used within a SettingsContextProvider"
    );
  }

  return context;
};
interface SettingsContextProviderProps {
  children: ReactNode;
}

export const SettingsContextProvider: FC<SettingsContextProviderProps> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config>({
    languages: ["en"],
    defaultLanguage: "en",
    name: "Qtrans",
    port: 0,
  });

  const value: SettingsContextProps = {
    config,
    setConfig,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
