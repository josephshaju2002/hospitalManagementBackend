// 7. import .env
require("dotenv").config()

// 1.import express
const express = require("express")

// 5. import cors
const cors = require("cors")

// 8. import router
const router = require("./router")

// 11. import connection file
require("./db/connection")

// 2.create server
const HospitalServer = express()

// 6. tell server to use cors
HospitalServer.use(cors())

// 10. parse request
HospitalServer.use(express.json())

// 9. tell server to use router
HospitalServer.use(router)

// 3.create port 
const PORT = 3000

// 4. Tell server to listen
HospitalServer.listen(PORT,()=>{
    console.log(`HospitalServer Started Successfully at ${PORT}`);
    
})