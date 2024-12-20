import { Router } from "express";
import {
  fetchAllTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation,
} from "../controllers/translations.controller";

const translationsRouter = Router();

translationsRouter
  .route("/:translationKey")
  .get(getTranslation)
  .patch(updateTranslation)
  .delete(deleteTranslation);

translationsRouter.route("/").get(fetchAllTranslations).post(createTranslation);

export default translationsRouter;
