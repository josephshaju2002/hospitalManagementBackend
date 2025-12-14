const medicines = require("../model/medicineModel");

/* ===============================
   ADD MEDICINE
================================ */
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

/* ===============================
   GET ALL MEDICINES
================================ */
exports.getAllMedicinesController = async (req, res) => {
  try {
    const allMedicines = await medicines.find().sort({ createdAt: -1 });
    res.status(200).json(allMedicines);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* ===============================
   UPDATE MEDICINE
================================ */
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

/* ===============================
   DELETE MEDICINE
================================ */
exports.deleteMedicineController = async (req, res) => {
  const { id } = req.params;

  try {
    await medicines.findByIdAndDelete(id);
    res.status(200).json("Medicine deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};
