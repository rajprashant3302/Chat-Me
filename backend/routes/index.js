const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')

const router = express.Router()

//user api creation
router.post('/register',registerUser)

// login

router.post('/email',checkEmail)

//checkPassword
router.post('/password',checkPassword)

//login user details

router.get('/user-details',userDetails)

// logout
router.get('/logout',logout)

// update user details
router.post('/update-user',updateUserDetails)

//search user
router.post('/search-user',searchUser)
module.exports=router