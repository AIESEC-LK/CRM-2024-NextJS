import mongoose from "mongoose";

if (!global.mongoose) {
    global.mongoose = {
        conn: null,
        promise: null,
    };
}

export async function dbConnect() {/*
    if (global.mongoose.conn) {
        console.log("Connected from previous connection");
        return global.mongoose.conn;
    }*/

    const conString = process.env.CONNECTION_STRING;

    try {
        const promise = mongoose.connect(conString, {
            useNewUrlParser: true,      // Ensure proper URL parsing
            useUnifiedTopology: true,   // Handles different server topologies
            dbName: process.env.DB_NAME,              // Ensure the correct database name (case-sensitive)
            autoIndex: true,            // Ensure indexes are auto-created
        });

        global.mongoose.conn = await promise;
        global.mongoose.promise = promise;

        console.log("Newly Connected");
        return global.mongoose.conn;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error('Failed to connect to the database.');
    }
}
