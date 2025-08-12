import Session from "../models/Session.js";

// ✅ Public sessions (only published)
export const getPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" }).populate(
      "user_id",
      "name profilePic"
    );
    res.json(sessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: error.message });
  }
};

// ✅ My sessions (draft + published)
export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id });
    res.json(sessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching your sessions", error: error.message });
  }
};

// ✅ Single session by ID (only owner)
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Not found" });
    res.json(session);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching session", error: error.message });
  }
};

// ✅ Save or update draft
export const saveDraft = async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;

    let session;
    if (id) {
      session = await Session.findOne({ _id: id, user_id: req.user._id });
      if (!session) return res.status(404).json({ message: "Not found" });

      session.title = title || session.title;
      session.tags = tags || session.tags;
      session.json_file_url = json_file_url || session.json_file_url;

      await session.save();
    } else {
      session = await Session.create({
        user_id: req.user._id,
        title,
        tags,
        json_file_url,
        status: "draft", // New sessions start as draft
      });
    }

    res.json(session);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving draft", error: error.message });
  }
};

//  Publish session
export const publishSession = async (req, res) => {
  const { id } = req.body;
  console.log("Publishing session ID:", id);
  console.log("Publish endpoint hit, user:", req.user._id);

  try {
    const session = await Session.findOne({ _id: id, user_id: req.user._id });
    if (!session) {
      console.log("Session not found or not owned by user");
      return res.status(404).json({ message: "Not found" });
    }

    if (!session.title || session.title.trim() === "") {
      console.log("Session title is missing");
      return res.status(400).json({ message: "Title is required to publish" });
    }

    session.status = "published";
    await session.save();

    console.log("Session published successfully");
    res.json(session);
  } catch (error) {
    console.error("Publish error:", error);
    res
      .status(500)
      .json({ message: "Error publishing session", error: error.message });
  }
};

export const getPublicSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      status: "published",
    }).populate("user_id", "name email profilePic");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete session by ID (only owner)
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found or not owned by user" });
    }

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Error deleting session", error: error.message });
  }
};

