const express = require('express');
const { 
        registerUser, 
        verifyEmail,
        loginUser, 
        forgotPassword,
        resetPassword ,
    getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword );


router.get("/me", protect, getMe);
router.get("/verify-email",verifyEmail);


module.exports = router;
