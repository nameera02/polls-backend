import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { Vote } from "../models/Vote.js";
import { Polls } from "../models/Polls.js";
import { PollOptions } from "../models/PollOptions.js";
import { getSocketInstance } from '../socket.js';

export const updVote = catchAsyncError(async (req, res, next) => {
        const { pollId, optionId, userId } = req.body;
        if (userId) {
            // Check if the user has already voted on this poll
            const existingVote = await Vote.findOne({ poll_id: pollId, user_id: userId });
        
            // if (existingVote) {
            //   return res.status(403).json({ success: false, message: "You have already voted on this poll." });
            // }
        
            // Record the vote and increment the poll's vote count
            await Vote.create({ poll_id: pollId, user_id: userId, option_id: optionId });
            await Polls.findByIdAndUpdate(pollId, { $inc: { votes: 1 } });
            io.emit("voteUpdate", { pollId, optionId });
          } else {
            // Non-logged-in users: use cookies
            let votes = req.cookies.votes ? JSON.parse(req.cookies.votes) : {};      
        
            // Record the vote in cookies and increment the poll's vote count
            votes[pollId] = optionId;
            res.cookie('votes', JSON.stringify(votes), {
              maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
              httpOnly: true,
              // secure: process.env.NODE_ENV === 'production'
            });
            await Vote.create({ poll_id: pollId, option_id: optionId });
            await Polls.findByIdAndUpdate(pollId, { $inc: { votes: 1 } });
            // const socket = req.socket.get(req.socket.id);
            io.emit("voteUpdate", { pollId, optionId });
            console.log("voteUpdate");
          }
        
          // Respond with success message
          res.status(200).json({
            success: true,
            message: "Vote submitted successfully",
          });
        });