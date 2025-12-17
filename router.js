const express = require("express");
const {
  registerController,
  loginController,
  getFeaturedMedicinesController,
  getSingleMedicineController,
  makeCartPaymentController,
  updateUserProfile,
  getAllDoctorsController,
  bookAppointmentController,
  getUserAppointmentsController,
  cancelAppointmentController,
} = require("./controller/userController");
const {
  addMedicineController,
  getAllMedicinesController,
  updateMedicineController,
  deleteMedicineController,
} = require("./controller/adminController");
const adminJwtMiddleware = require("./middleware/adminJwtMiddleware");
const jwtMiddleware = require("./middleware/jwtMiddleware");
const {
  sendMessageController,
  getUserMessagesController,
  getDoctorMessagesController,
  deleteMessageController,
} = require("./controller/contactMessageController");
const multerConfig = require("./middleware/imgMulterMiddleware");
const {
 
  saveOrUpdateDoctorProfile,
  getDoctorProfileController,
  getDoctorAppointmentsController,
} = require("./controller/doctorController");
const doctorJwtMiddleware = require("./middleware/doctorJwtMiddleware");

const router = express.Router();

// register
router.post("/register", registerController);

//login
router.post("/login", loginController);

// get home medicines
router.get("/featured-medicines", getFeaturedMedicinesController);

// get all medicines
router.get("/getall-medicines", jwtMiddleware, getAllMedicinesController);

// get single medicine
router.get("/medicine/:id", jwtMiddleware, getSingleMedicineController);

// ..............................................patient.................................................

// payment
router.post("/cart-payment", jwtMiddleware, makeCartPaymentController);

// send messages
router.post("/send-message", sendMessageController);

// update user profile
router.put("/update-userProfile",jwtMiddleware,multerConfig.single("profile"),updateUserProfile);

// get all doctor profiles
router.get("/get-all-doctors", getAllDoctorsController);

// book an appointment
router.post("/book-appointment",jwtMiddleware,bookAppointmentController);

// get user appointments
router.get("/my-appointments",jwtMiddleware,getUserAppointmentsController);

// cancel appointment
router.delete("/cancel-appointment/:id",jwtMiddleware,cancelAppointmentController);






// ..............................................Doctor.................................................

// UPDATE DOCTOR PROFILE
router.put("/update-doctor-profile",doctorJwtMiddleware,multerConfig.single("photo"),saveOrUpdateDoctorProfile);

// GET DOCTOR PROFILE
router.get("/get-doctor-profile",doctorJwtMiddleware,getDoctorProfileController);

// get all appointments
router.get("/doctor/appointments",jwtMiddleware,getDoctorAppointmentsController);



// ..............................................Admin.................................................
// add medicine
router.post("/add-medicine", adminJwtMiddleware, addMedicineController);

// get all medicines
router.get("/all-medicines", adminJwtMiddleware, getAllMedicinesController);

// update medicine
router.put("/update-medicines/:id",adminJwtMiddleware,updateMedicineController);

// delete medicine
router.delete("/delete-medicines/:id",adminJwtMiddleware,deleteMedicineController);

// get user messages
router.get("/user-messages", adminJwtMiddleware, getUserMessagesController);

// get doctor messages
router.get("/doctor-messages", adminJwtMiddleware, getDoctorMessagesController);

// delete the message
router.delete("/delete-messages/:id",adminJwtMiddleware,deleteMessageController);

module.exports = router;
