const doctorProfiles = require("../model/doctorModel");

// edit doctor profile
exports.saveOrUpdateDoctorProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;

    // ✅ parse arrays safely
    if (typeof data.availableDays === "string") {
      data.availableDays = JSON.parse(data.availableDays);
    }

    if (typeof data.qualifications === "string") {
      data.qualifications = JSON.parse(data.qualifications);
    }

    if (typeof data.skills === "string") {
      data.skills = JSON.parse(data.skills);
    }

    // ✅ find existing profile
    const existingProfile = await doctorProfiles.findOne({ userId });

    // ✅ IMPORTANT FIX HERE
   if (req.file) {
  data.photo = req.file.filename;
} else if (existingProfile) {
  data.photo = existingProfile.photo;
}


    const doctorProfile = await doctorProfiles.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctorProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};


// get doctor profile


exports.getDoctorProfileController = async (req, res) => {
  try {
    const userId = req.userId; 

    const doctorProfile = await doctorProfiles.findOne({ userId });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctorProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor profile",
      error: error.message,
    });
  }
};
