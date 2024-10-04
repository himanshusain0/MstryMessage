import {resend} from '@/lib/resend';
import VerificationEmails from '../../emails/VerificationEmails';

import { ApiResponse } from '@/types/ApiResponse';


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to:email,
            subject: 'verotation code',
            react: VerificationEmails({username, otp:verifyCode}),
          });
        return { success: true, message: 'Verification email sent successfully' };
    } catch (emailError) {
        console.error(emailError);
        return { success: false, message: 'Failed to send verification email' };
    }
}