import mongoose from "mongoose";


const AuthSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  
    password: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      //unique: true,      
    },
   
    isDeleted: {
      type: Boolean,
      default: false,
    },

  
  },
  {
    timestamps: true,
  }
);

AuthSchema.index({ coordinates: "2dsphere" });
const authModel = mongoose.model("auth", AuthSchema);
export default authModel;
