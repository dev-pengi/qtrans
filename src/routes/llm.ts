//contects urls to controllers

import {Router} from "express"
import { getProvider } from "../controllers/llm.controller"


const llmRouter = Router()

llmRouter.get("/providers" , getProvider)

export default llmRouter