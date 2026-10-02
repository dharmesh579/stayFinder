import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than zero"],
    },
    mainImage: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        public_id: {
          type: String,
          default: "",
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Cabin",
        "Hotel",
        "Resort",
        "Beach",
        "Mountain",
        "Camping",
        "Farmhouse",
        "Treehouse",
      ],
      required: [true, "Category is required"],
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

listingSchema.index({
  location: 1,
  category: 1,
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
