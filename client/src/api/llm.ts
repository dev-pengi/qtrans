// llm api 

import { AvailableProviders } from "src/types";
import handleFetch from "./fetch";

export const fetchProviders = async (): Promise<AvailableProviders> => {
  return handleFetch("/api/llm/providers");
};