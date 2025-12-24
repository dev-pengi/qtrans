import { Router } from "express";
import {
  fetchAllTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  generateTranslations,
  renameTranslation,
} from "../controllers/translations.controller";

const translationsRouter = Router();

translationsRouter.post("/ai/generate", generateTranslations);

translationsRouter
  .route("/:translationKey")
  .get(getTranslation)
  .patch(updateTranslation)
  .delete(deleteTranslation);

translationsRouter.put("/:translationKey/rename", renameTranslation);

translationsRouter.route("/").get(fetchAllTranslations).post(createTranslation);

export default translationsRouter;
