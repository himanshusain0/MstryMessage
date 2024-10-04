import dbConnect from '@/lib/dbConnect'
import  UserModel from '@/model/User'
import {z} from 'zod'

import {usernameValidation} from '@/schemas/signUpSchema'


const UsernameQuarySchema = z.object({
    username:usernameValidation
})
//http://localhost:3000/api/check-username-unique?username=two
export async function GET(request: Request){
    
    await dbConnect();

    try {
        const {searchParams}= new URL(request.url)
        const  queryParams = {
            username:searchParams.get("username")
        }
        // validation with zod
        const result = UsernameQuarySchema.safeParse(queryParams);
        console.log(result);
        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0? usernameErrors.join(','):'Invalid query parameters',
            },{
                status:400
            })
        }
        const {username}= result.data;
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:true,
                message:'bhai ye wala username apke liye nhi hai ',
            },{
                status:400
            })
        }
        return Response.json({
            success:true,
            message:'ye apke liye hi h  ',
        },{
            status:400
        })
    } catch (error) {
        console.error('Error checking username',error)
        return Response.json({
            success:false,
            message:'Error checking username'
        },{status:500 }
    )
    }
}