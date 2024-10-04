import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    messages: Message[];
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}
const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "mandatory"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "is invalid"],
        lowercase: true
    },
    password: { type: String, required: [true, "Password is required"], trim: true },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"]

    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCode is required"]

    },
    isVerified: { type: Boolean, default: false },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema],
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;