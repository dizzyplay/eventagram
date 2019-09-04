import { Router } from "express";
import {
  authControl,
  deleteTag,
  hashFeed,
  hashFeedRefresh,
  root,
  searchTag
} from "../controller/controllers";

export const apiRouter = Router();

apiRouter.get("/", root);
apiRouter.get("/hash_feed", hashFeed);
apiRouter.get("/search_tag", searchTag);
apiRouter.get("/hash_feed_refresh", hashFeedRefresh);

apiRouter.post("/auth", authControl);
apiRouter.post("/delete_tag", deleteTag);
