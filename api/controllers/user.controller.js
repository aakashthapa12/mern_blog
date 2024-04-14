// import User from "../models/user.model.js";
// import bcryptjs from 'bcryptjs';
// import { errorHandler } from "../utils/error";

// export const test = (req, res) => {
//     res.json({message: 'API is working!'});
// }

// export const updateUser = async (req, res, next) => {
//     if(req.user.id !== req.params.userId){
//         return next(errorHandler(403, 'You are not allowed to update this user'));
//     }
//     if(req.body.password){
//         if(req.body.password.length < 6){
//             return next(errorHandler(400, 'Passoword must be at least 6 characters'));
//         }
//         req.body.password = bcryptjs.hashSync(req.body.password, 10);
//     }
//     if(req.body.username){
//         if(req.body.username.length < 7 || req.body.username.length > 20){
//             return next(errorHandler(400, 'Username must be between 7 an 20 characters'));
//         }
//         if(req.body.username.includes(' ')){
//             return next(errorHandler(400, 'Username cannot contain spaces'));
//         }
//         if(req.body.username !== req.body.username.toLowerCase()){
//             return next(errorHandler(400, 'Username must be lowercase'));
//         }
//         if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
//             return next(errorHandler(400, 'Username can only contain letters and numbers'));
//         }
//         try{
//             const updateUser = await User.findByIdAndUpdate(req.params.userId, {
//                 $set: {
//                     username: req.body.username,
//                     email: req.body.email,
//                     profilePicture: req.body.profilePicture,
//                     password: req.body.password,
//                 }
//             }, { new: true });
//             const { password, ...rest } = updateUser._doc;
//             res.status(200).json(rest);
//         }catch(error){
//             next(error);
//         }
//     }
// }





import User from "../models/user.model.js"; // Ensure correct model import
import bcryptjs from 'bcryptjs'; // Import bcryptjs for password hashing
import { errorHandler } from "../utils/error.js"; // Import error handler

export const test = (req, res) => {
    res.json({message: 'API is working!'});
}

export const updateUser = async (req, res, next) => {
    try {
        // Check if user ID in request matches authenticated user's ID
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to update this user'));
        }
        
        // Check if password is provided and hash it
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(errorHandler(400, 'Password must be at least 6 characters'));
            }
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        
        // Check if username is provided and validate it
        if (req.body.username) {
            const username = req.body.username;
            if (username.length < 7 || username.length > 20) {
                return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
            }
            if (username.includes(' ')) {
                return next(errorHandler(400, 'Username cannot contain spaces'));
            }
            if (username !== username.toLowerCase()) {
                return next(errorHandler(400, 'Username must be lowercase'));
            }
            if (!username.match(/^[a-zA-Z0-9]+$/)) {
                return next(errorHandler(400, 'Username can only contain letters and numbers'));
            }
        }

        // Update user information in the database
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            }
        }, { new: true });
        
        // Return updated user data to the client
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        // Handle errors
        next(error);
    }
}

