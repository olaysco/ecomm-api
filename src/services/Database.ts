import mongoose from "mongoose";

class Database {
  public async connect(uri: string) {
    if (!uri) {
      return;
    }

    try {
      mongoose.set("strictQuery", true);
      await mongoose.connect(uri);
    } catch (error) {
      console.log("error connecting DB %s", error);
    }
  }
}

export default new Database();
