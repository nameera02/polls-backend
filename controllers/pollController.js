import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { Polls } from "../models/Polls.js";
import { PollOptions } from "../models/PollOptions.js";
import { upload } from "../middlewares/uploadMiddleware.js";

export const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params; // Extract pollId from the URL parameter

    // Find the specific poll by ID
    const poll = await Polls.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    // Fetch the associated options for the poll
    const options = await PollOptions.find({ p_id: poll._id }, 'option');

    // Return the poll with the options
    res.status(200).json({
      success: true,
      poll: {
        ...poll.toObject(),
        options: options.map(option => ({
          optionId: option._id, // Include the option ID
          option: option.option, // Include the option text
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch poll",
      error: error.message,
    });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Polls.find(); // Fetches all polls
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const options = await PollOptions.find({ p_id: poll._id }, 'option');
        return {
          ...poll.toObject(),
          options: options.map(option => ({
            optionId: option._id, // Include the option ID
            option: option.option, // Include the option text
          })) // Only include the option column
        };
      })
    );

    res.status(200).json({
      success: true,
      pollsWithOptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch polls",
      error: error.message,
    });
  }
};

export const createPolls = catchAsyncError(async (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return next(new Error(`File upload error: ${err.message}`));
      }
  
      const { user_id, options,question } = req.body;
  
      if (!user_id || !options || !req.file || !question) {
        return next(new Error("Please enter all fields and provide an image"));
      }
  
      const image = req.file.filename;
  
      const poll = await Polls.create({
        user_id,
        question,
        votes: 0,
        image,
      });
  
      const pollId = poll.id;
  
      const pollOptions = options.map(option => ({
        p_id: pollId,
        option,
      }));
  
      await PollOptions.insertMany(pollOptions); 
  
      res.status(201).json({
        success:true,
        pollOptions,
    })
    });
  });

  export const deletePoll = catchAsyncError(async (req, res, next) => {
    const { pollId } = req.params;
  
    // Check if the poll exists
    const poll = await Polls.findById(pollId);
    if (!poll) {
      return next(new Error("Poll not found"));
    }
  
    // Delete the poll
    await Polls.findByIdAndDelete(pollId);
  
    // Delete all associated options for the poll
    await PollOptions.deleteMany({ p_id: pollId });
  
    res.status(200).json({
      success: true,
      message: "Poll and associated options deleted successfully",
    });
  });


  export const updatePolls = catchAsyncError(async (req, res, next) => {
    // First, we use the upload middleware to handle file uploads
    upload.single('image')(req, res, async (err) => {
      if (err) {
        // Handle any file upload errors
        return next(new Error(`File upload error: ${err.message}`));
      }
      
      
      // Destructure the necessary fields from the request body
      const { pollId, options,question } = req.body;
      console.log(req.body);
  
      
      if (!pollId || !options) {
        return next(new Error("Please enter all fields"));
      }
  
      // Find the existing poll
      const poll = await Polls.findById(pollId);
  
      let image = poll.image;
      if (req.file) {
        
        image = req.file.filename;
      }
      const updateFields = { question };
      if (req.file) {
        updateFields.image = image; // Include image only if a new one is uploaded
      }

      const updatedpoll = await Polls.findOneAndUpdate(
        { _id:pollId },
         updateFields ,
        { new: true }
      );
      console.log(updatedpoll);
      
      // Parse and update the options
      const parsedOptions = JSON.parse(options);
      for (const optionItem of parsedOptions) {
        const { id, option } = optionItem;
        if (!id) {
          return next(new Error('Invalid option data'));
        }
  
        const updatedOption = await PollOptions.findOneAndUpdate(
          { _id:id },
          { $set: { option } },
          { new: true }
        );
        if (!updatedOption) {
          return next(new Error('Failed to update option'));
        }
      }
  
      // Send success response
      res.status(200).json({
        success: true,
        message: "Poll updated successfully",
      });
    });
  });