import express from 'express'
import { registerUser, loginUser, getUserProfile, adminLogin } from '../controller/userController.js'
import { clearCart, getCart, updateCart } from '../controller/cartController.js'
import authUser from '../middleware/authUser.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/me', authUser, getUserProfile)
userRouter.get('/cart', authUser, getCart)
userRouter.patch('/cart', authUser, updateCart)
userRouter.delete('/cart', authUser, clearCart)
userRouter.post('/admin', adminLogin)

export default userRouter
