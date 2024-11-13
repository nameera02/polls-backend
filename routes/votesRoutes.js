import express, { Router } from "express"
import { updVote } from "../controllers/voteController.js";
const router =express.Router();

router.route('/vote').put(updVote);


export default router;