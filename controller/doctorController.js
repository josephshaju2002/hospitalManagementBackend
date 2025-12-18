const doctorProfiles = require("../model/doctorModel");
const appointments = require("../model/appointmentModel");
const users = require("../model/userModel");


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

// get all appointments
exports.getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctorUserId = req.userId; 

    const doctorProfile = await doctorProfiles.findOne({
      userId: doctorUserId,
    });

    if (!doctorProfile) {
      return res.status(404).json("user profile not found");
    }

    const appointmentsList = await appointments
      .find({ doctorId: doctorProfile._id })
      .populate("patientId", "username email age") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: appointmentsList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch doctor appointments");
  }
};

// get single patient details
exports.getSingleAppointmentController = async (req, res) => {
  try {
    const appointment = await appointments
      .findById(req.params.id)
      .populate("patientId")
      .populate("doctorId");

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json("Failed to fetch appointment");
  }
};

// update health status
exports.updatePatientHealthController = async (req, res) => {
  try {
    const { patientId } = req.params;
    const healthData = req.body;

    const updatedUser = await users.findByIdAndUpdate(
      patientId,
      { health: healthData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Health status updated",
      data: updatedUser.health,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to update health status");
  }
};

// to update health status in session storage
exports.getLoggedInUserController = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await users.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json("Failed to fetch user");
  }
};

// prescribe medicines
exports.updatePrescriptionController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { prescription } = req.body;

    const updatedAppointment = await appointments.findByIdAndUpdate(
      appointmentId,
      { prescription },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Prescription updated",
      data: updatedAppointment.prescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to update prescription");
  }
};




