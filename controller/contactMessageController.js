const contactMessages = require("../model/contactModel");


// SEND MESSAGE (User / Doctor)

exports.sendMessageController = async (req, res) => {
  try {
    const { name, email, subject, message, role } = req.body;

    // basic validation
    if (!name || !email || !subject || !message || !role) {
      return res.status(400).json("All fields are required");
    }

    if (!["user", "doctor"].includes(role)) {
      return res.status(400).json("Invalid role");
    }

    const newMessage = new contactMessages({
      name,
      email,
      subject,
      message,
      role,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json("Server error");
  }
};



// ADMIN – GET USER MESSAGES ONLY
exports.getUserMessagesController = async (req, res) => {
  try {
    const messages = await contactMessages.find({ role: "user" }).sort({
      createdAt: -1,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Get User Messages Error:", error);
    res.status(500).json("Server error");
  }
};

// ADMIN – GET DOCTOR MESSAGES ONLY
exports.getDoctorMessagesController = async (req, res) => {
  try {
    const messages = await contactMessages.find({ role: "doctor" }).sort({
      createdAt: -1,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Doctor Messages Error:", error);
    res.status(500).json("Server error");
  }
};

// ADMIN – DELETE MESSAGE
exports.deleteMessageController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await contactMessages.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json("Message not found");
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json("Server error");
  }
};
