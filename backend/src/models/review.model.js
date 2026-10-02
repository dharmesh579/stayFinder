import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [5, "Comment must be at least 5 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
