import dotenv from "dotenv";
import mongoose from "mongoose";
//
// import mongodb from "mongodb";
// import { MongoClient, ObjectId } from "mongodb";
// import { document } from "../Model/Document.js";
//

dotenv.config();

export const connectToDB = async () => {
  try {
    // console.log(process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected....!");
    //
    // const bucket = new mongodb.GirdFSBucket(document)
  } catch (err) {
    console.log(err.message);
    console.log(err);

  }
};
