import mongoose from "mongoose";
import { User } from "../MDB_Schema/MDB"; // adjust path to your User model

async function migrateNoticeId() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/yourDB"); // <-- replace yourDB
    console.log("MongoDB connected");

    // 2️⃣ Migrate old applied entries
    const appliedResult = await User.updateMany(
      { "applied._id": { $exists: true }, "applied.notice_id": { $exists: false } },
      [
        { $set: { "applied.$[elem].notice_id": "$$elem._id" } } // copy _id to notice_id
      ],
      { arrayFilters: [{ "elem._id": { $exists: true } }] }
    );
    console.log("Applied array migration done:", appliedResult.modifiedCount, "documents updated");

    // 3️⃣ Migrate old notice entries
    const noticeResult = await User.updateMany(
      { "notice._id": { $exists: true }, "notice.notice_id": { $exists: false } },
      [
        { $set: { "notice.$[elem].notice_id": "$$elem._id" } } // copy _id to notice_id
      ],
      { arrayFilters: [{ "elem._id": { $exists: true } }] }
    );
    console.log("Notice array migration done:", noticeResult.modifiedCount, "documents updated");

    // 4️⃣ Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Migration completed and DB disconnected");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

// Run the migration
migrateNoticeId();
