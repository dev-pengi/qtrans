import { Config } from "src/types/settings";
import handleFetch from "./fetch";

export const fetchSettings = async (): Promise<Config> => {
  return handleFetch("/api/settings");
};
