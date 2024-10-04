import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
const bcrypt = require('bcrypt');
import {sendVerificationEmail} from '@/helpers/sendVerificationEmail';

export async function POST(request:Request){
    await dbConnect()
    try{
        const {username,email,password }= await request.json();
        const existingUserVerifiedByUsername=  await UserModel.findOne({
            username,
            isVerified:true
        });
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:'Username already exists and is verified'
            },{status:400})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode =Math.floor(1000+Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"Verified"
    
                },{status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password=  hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry= new Date(Date.now() + 360000)
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate =  new Date()
            expiryDate.setDate(expiryDate.getHours()+1)
            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                messages:[],
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true
            })
            await newUser.save();
        }
        //send verification email
        const emailResponse= await sendVerificationEmail(
            email,
            username,
            verifyCode,
        );
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message

            },{status:500})
        }
        return Response.json({
            success:true,
            message:"Usern registered successfully"

        },{status:201})
    }catch(e){
        console.error("Error registering user",e);
        return Response.json({
            success:false,
            message:'Error registering user'

        },{
            status:500
        }
    )
        
    }
}
