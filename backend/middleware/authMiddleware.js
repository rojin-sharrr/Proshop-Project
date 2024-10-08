import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js';

//Protect routes:

const protect = asyncHandler( async (req, res, next) => {
    // read token from the cookie
    let token;
    token = req.cookies.jwt;

    if (token){ 
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized, Token failed');
        }

    }else{
        res.status(401);
        throw new Error('Not Authorized, No token found');
    }
})



//Admin middleware
const admin = (req, res,  next) => {
    if (req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error('Not Authorized as admin');
    }

}


export {protect, admin};