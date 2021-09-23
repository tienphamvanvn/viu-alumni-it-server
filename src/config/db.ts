import { connect } from "mongoose";

const connectDB = async (URI: string) => {
  try {
    await connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
