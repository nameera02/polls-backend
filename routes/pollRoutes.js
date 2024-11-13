import express, { Router } from "express"
import { createPolls,getAllPolls,getPollById,updatePolls,deletePoll } from "../controllers/pollController.js";
const router =express.Router();
router.route("/polls").post(createPolls)
router.route("/polls").get(getAllPolls)
router.route("/poll/:pollId").get(getPollById)
router.route("/poll/:pollId").delete(deletePoll)
router.route("/update-poll").put(updatePolls)
export default router;