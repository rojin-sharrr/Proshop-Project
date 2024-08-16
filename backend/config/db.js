import mongoose from "mongoose"; // To connect to our database from the VS Code, URI need for the connection


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (error) {
        console.log(`Error Message: ${error.message}`)
        process.exit(1)
    }
}


export default connectDB;