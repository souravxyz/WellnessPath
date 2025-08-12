import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./app/models/User.js";
import Session from "./app/models/Session.js";

dotenv.config();

const seedSessions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Get some users to link sessions
    const users = await User.find();
    if (users.length === 0) {
      console.log("No users found. Seed users first.");
      process.exit();
    }

    // Sample sessions
    const sessionsData = [];
    for (let i = 0; i < 10; i++) {
      sessionsData.push({
        user_id: users[i % users.length]._id, // rotate between users
        title: `Sample Session ${i + 1}`,
        tags: ["wellness", "mindfulness"],
        json_file_url: `https://example.com/session${i + 1}.json`,
        status: i % 2 === 0 ? "published" : "draft",
      });
    }

    await Session.deleteMany();
    const createdSessions = await Session.insertMany(sessionsData);
    console.log(`✅ ${createdSessions.length} sessions seeded`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSessions();
