const express = require("express")
const { registerController, loginController, getFeaturedMedicinesController } = require("./controller/userController")
const { addMedicineController, getAllMedicinesController, updateMedicineController, deleteMedicineController } = require("./controller/adminController")
const adminJwtMiddleware = require("./middleware/adminJwtMiddleware")

const router = express.Router()

// register
router.post("/register",registerController)

//login 
router.post("/login",loginController)

// get home medicines
router.get("/featured-medicines", getFeaturedMedicinesController);

// get all medicines
router.get("/getall-medicines", getAllMedicinesController);


// ..............................................patient.................................................


// ..............................................Admin.................................................
// add medicine
router.post("/add-medicine",adminJwtMiddleware, addMedicineController);

// get all medicines
router.get("/all-medicines", adminJwtMiddleware,getAllMedicinesController);

// update medicine
router.put("/update-medicines/:id",adminJwtMiddleware, updateMedicineController);

// delete medicine
router.delete("/delete-medicines/:id",adminJwtMiddleware, deleteMedicineController);

module.exports = router