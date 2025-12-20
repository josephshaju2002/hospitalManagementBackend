const medicines = require("../model/medicineModel");
const users = require("../model/userModel");
const doctors = require("../model/doctorModel")
const appointments = require("../model/appointmentModel")

//    ADD MEDICINE

exports.addMedicineController = async (req, res) => {
  console.log("Inside addMedicineController");

  const { name, price, imageUrl } = req.body;

  
  try {
    const newMedicine = new medicines({
      name,
      price,
      imageUrl,
    });

    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(500).json(error);
  }
};

//    GET ALL MEDICINES

exports.getAllMedicinesController = async (req, res) => {
  try {
    const allMedicines = await medicines.find().sort({ createdAt: -1 });
    res.status(200).json(allMedicines);
  } catch (error) {
    res.status(500).json(error);
  }
};

//    UPDATE MEDICINE

exports.updateMedicineController = async (req, res) => {
  const { id } = req.params;
  const { name, price, imageUrl } = req.body;

  try {
    const updatedMedicine = await medicines.findByIdAndUpdate(
      id,
      { name, price, imageUrl },
      { new: true }
    );

    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json(error);
  }
};


//    DELETE MEDICINE

exports.deleteMedicineController = async (req, res) => {
  const { id } = req.params;

  try {
    await medicines.findByIdAndDelete(id);
    res.status(200).json("Medicine deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

// dashboard counts
exports.adminDashboardCounts = async (req, res) => {
  try {
    const totalUsers = await users.countDocuments({ role: "user" });
    const totalDoctors = await doctors.countDocuments();
    const totalAppointments = await appointments.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        doctors: totalDoctors,
        appointments: totalAppointments,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch dashboard counts");
  }
};

// get appointments

exports.adminAllAppointmentsController = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json("Access denied");
    }

    const allAppointments = await appointments
      .find()
      .populate("patientId", "username email")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: allAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch appointments");
  }
};

// get all doctors
exports.getAllDoctorsforAdminController = async (req, res) => {
  try {
    const alldoctors = await doctors.find();
    res.status(200).json(alldoctors);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get single doctor
exports.getSingleDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctors.findById(req.params.id);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update admin settings
exports.updateAdminSettingsController = async (req, res) => {
  try {
    const adminId = req.id;
    const role = req.role;

    const { username, email, password } = req.body;

    if (role !== "admin") {
      return res.status(401).json("Unauthorized user");
    }

    const updateData = {};

    if (username && username.trim() !== "") {
      updateData.username = username;
    }

    if (email && email.trim() !== "") {
      updateData.email = email;
    }

    if (password && password.trim() !== "") {
      updateData.password = password; // plain (matches your login)
    }

    if (req.file) {
      updateData.profile = req.file.filename;
    }

    const updatedAdmin = await users.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Admin settings updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to update admin settings");
  }
};









