import { Router } from "express";
import {
  configureLanguages,
  configureLLM,
  fetchConfig,
} from "../controllers/settings.controller";

const settingsRouter = Router();

settingsRouter.route("/").get(fetchConfig);
settingsRouter.route("/languages").put(configureLanguages);
settingsRouter.put("/llm", configureLLM);

export default settingsRouter;
