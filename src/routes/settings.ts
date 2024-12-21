import { Router } from "express";
import {
  configureLanguages,
  fetchConfig,
} from "../controllers/settings.controller";

const settingsRouter = Router();

settingsRouter.route("/").get(fetchConfig);
settingsRouter.route("/languages").put(configureLanguages);

export default settingsRouter;
