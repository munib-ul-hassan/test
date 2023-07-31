// resolvers/userResolver.js

import authModel from "../DB/Model/authModel.js";


import CustomError from "../Utils/ResponseHandler/CustomError.js";
import CustomSuccess from "../Utils/ResponseHandler/CustomSuccess.js";
import { hashPassword } from "../Utils/SecuringPassword.js";

import { mongoose } from "mongoose";



//import NotificationController from "./NotificationController.js";
import { tokenGen } from "../Utils/AccessTokenManagement/Tokens.js";


// CREATE CACHING
import NodeCache from "node-cache";
const myCache = new NodeCache();
myCache.set("environment","PRODUCTION")
//myCache.del("environment") //for delete cache value
const authResolvers = {
  Query: {
    users: async () => {
      try {
        const users = await authModel.find();
        return users;
      } catch (error) {
        console.log(error);
        // Handle the error appropriately
        throw new Error("An error occurred while fetching users.");
      }
    },
    user: async (_, { id }) => {
      try {
        const user = await authModel.findOne({ _id: id });
        return user;
      } catch (error) {
        console.log(error);
        // Handle the error appropriately
        throw new Error("An error occurred while fetching the user.");
      }
    },
  },
  Mutation: {
    createProfile: async (_, args) => {
      try {
        const { email, password, userType } = args;
        if(myCache.get("environment")=="PRODUCTION"){

          
          const existingUser = await authModel.findOne({ email });
          if (existingUser) {
            throw new Error("Email already exists");
          }        
          const hashedPassword = hashPassword(password);        
          const newUser = await authModel.create({
            email,
            password: hashedPassword,
            userType,
          });
          const dataExist = await authModel.findOne({
            email: newUser.email,
            isDeleted: false,
          });
          if (!dataExist) {
            return CustomError.badRequest("User Not Found");
          }
          const token = await tokenGen(
            { id: dataExist._id, userType: dataExist.userType },
            "verifyUser"
          );        
          return { _id: newUser._id, token: token };
          
        }else{
          throw new Error("Server is in maintainance");

        }

      } catch (error) {
        throw new Error(error.message);
      }
    },







    deleteUser: async (_, args) => {
      try {
        const { id } = args
        
        const existingUser = await authModel.findOne({ _id: id });
        if (!existingUser) {
          throw new Error("User Not exists");
        }
        await authModel.deleteOne({ _id: id })
        return { message: "User is deleted successfully" }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateUser: async (_, args, contextValue) => {
      try {

       

        // const { deviceToken } = req.headers;
        // const { error } = updatevalidator.validate(data);
        // if (error) {
        //   return (CustomError.badRequest(error.details[0].message));
        // }
        const { user } = req;

        if (!user) {
          return next(CustomError.badRequest("User Not Found"));
        }



        if (args.password) {
          args.password = hashPassword(args.password);
        }


        const updateUser = await authModel.findByIdAndUpdate(user._id, args, {
          new: true,
        });
        const token = await tokenGen(
          { id: updateUser._id, userType: updateUser.userType },
          "auth",
          deviceToken
        );
        const userdata = (
          await authModel.aggregate([
            {

              $match: { _id: new mongoose.Types.ObjectId(user._id.toString()) },
            },
            { $limit: 1 },
          ])
        )[0];

        return next(
          CustomSuccess.createSuccess(
            { ...userdata, token },
            "Profile updated successfully",
            200
          )
        );
      } catch (error) {

        (CustomError.createError(error.message, 500));
      }
    }




  },
};

export default authResolvers;


