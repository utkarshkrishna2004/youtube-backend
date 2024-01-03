import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
            index: true,
        },

        avatar: {
            type: String, //cloudinary url
            required: true,
        },

        coverImage: {
            type: String, //cloudinary url
            required: false,
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // ie, if the password isn't modified, then just return the next() flag.

    this.password = await bcrypt.hash(this.password, 10);
    next(); // ie, if the password is modified, then, first encrypt it just before saving (that's why we used .pre) and then only return the next() flag.
});

//designing a custom method in mongoose by ourselves
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
    //bcrypt has the power to compare so we give it both the passwords to compare, ie, "password" is our plain text password and "this.password" is our encrypted password.
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}; //doesn't need async coz it's quite fast!

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
