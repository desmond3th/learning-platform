import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const dbConnect = async () => {
    try {
        const connectionInst = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n connected to mongodb: ${connectionInst.connection.host}`)
    }catch(error) {
        console.log("Couldn't connect to Mongo", error);
        process.exit(1);
    }
}

export {dbConnect}