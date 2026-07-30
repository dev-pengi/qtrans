//for handling http requests

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {AVAILABLE_PROVIDERS} from "../providers/provider.config"



//tell the frontend what providers are available
export const getProvider = asyncHandler(
    async (_req: Request, res: Response) => {
      //give it name and model only 
      const providers = Object.fromEntries(Object.entries(AVAILABLE_PROVIDERS).map(([key , value])=>[
        key, {
          name: value.name,
          model : value.model
        }
      ]))
      res.json(providers)
  }
)


