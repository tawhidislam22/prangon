import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordPayload, ILoginUserPayload, IRegisterUserPayload } from "./auth.interface";




const registerUser = async(payload: IRegisterUserPayload) => {
    const { name, email, password, role } = payload;
    const normalizedEmail = email.trim().toLowerCase();

    let assignedRole: Role = Role.USER;
    if (role === "OWNER") {
        assignedRole = Role.OWNER;
    } else if (role === "MEMBER") {
        assignedRole = Role.MEMBER;
    }

    // If an unverified account already exists (e.g. from a prior timed-out attempt),
    // remove it cleanly so registration succeeds with fresh credentials and role.
    const existingUnverifiedUser = await prisma.user.findFirst({
        where: {
            email: { equals: normalizedEmail, mode: "insensitive" },
            emailVerified: false,
        }
    });

    if (existingUnverifiedUser) {
        await prisma.session.deleteMany({ where: { userId: existingUnverifiedUser.id } });
        await prisma.account.deleteMany({ where: { userId: existingUnverifiedUser.id } });
        await prisma.verification.deleteMany({ where: { identifier: normalizedEmail } });
        await prisma.user.delete({ where: { id: existingUnverifiedUser.id } });
    }

    const data = await auth.api.signUpEmail({
        body:{
            name,
            email: normalizedEmail,
            password,
        }
    });

    if(!data.user){
        throw new AppError(status.INTERNAL_SERVER_ERROR,"User registration failed")
    }

    const updatedUser = await prisma.user.update({
        where: { id: data.user.id },
        data: {
            role: assignedRole,
            ...(assignedRole === Role.OWNER ? { onboardingDraft: {} } : {})
        }
    });

    const accessToken = tokenUtils.getAccessToken({
        userId: updatedUser.id,
        role: updatedUser.role,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
        isDeleted: updatedUser.isDeleted,
        emailVerified: updatedUser.emailVerified,
        needPasswordChange: updatedUser.needPasswordChange,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: updatedUser.id,
        role: updatedUser.role,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
        isDeleted: updatedUser.isDeleted ,
        emailVerified: updatedUser.emailVerified,
        needPasswordChange: updatedUser.needPasswordChange,
    });

    return {
        ...data,
        user: {
            ...data.user,
            role: updatedUser.role,
        },
        accessToken,
        refreshToken,
    }
}


const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })

    if (data.user.status === UserStatus.BLOCKED) {
        //throw new Error("User is blocked");

        throw new AppError(status.FORBIDDEN,"User is blocked")
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        //throw new Error("User is deleted");
        throw new AppError(status.NOT_FOUND,"User is deleted")
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
        needPasswordChange: data.user.needPasswordChange,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
        needPasswordChange: data.user.needPasswordChange,
    });

    return {
        ...data,
        accessToken,
        refreshToken
    };

}

const getMe = async (user: any) => {
    const userId = user?.userId || user?.id;
    let isUserExists = userId
        ? await prisma.user.findUnique({
              where: {
                  id: userId,
              },
          })
        : null;

    if (!isUserExists && user?.email) {
        isUserExists = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });
    }

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return isUserExists;
};

const getNewToken=async(refreshToken:string,sessionToken:string)=>{
    const isSessionTokenExists= await prisma.session.findUnique({
        where:{
            token:sessionToken,
            expiresAt:{
                gt:new Date()
            }
        },
        include:{
            user:true
        }
    })

    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED,"Unauthorized access! Session token is invalid or expired.")
    }

    const verifiedRefreshToken= jwtUtils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET)

    if(!verifiedRefreshToken){
        throw new AppError(status.UNAUTHORIZED,"Unauthorized access! Refresh token is invalid or expired.")
    }

    const data= verifiedRefreshToken as JwtPayload

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
        needPasswordChange: data.needPasswordChange,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
        needPasswordChange: data.needPasswordChange,
    });

    const {token}= await prisma.session.update({
        where:{
            token:sessionToken
        },
        data:{
            token:sessionToken,
            expiresAt:new Date(Date.now() + 60*60*1000*24*7),
            updatedAt:new Date()
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }


}

const changePassword=async(payload:IChangePasswordPayload,sessionToken:string)=>{
    const session= await auth.api.getSession({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`,
        })
    })

    if(!session){
        throw new AppError(status.UNAUTHORIZED,"Unauthorized access! Session token is invalid or expired.")
    }

    const { currentPassword, newPassword } = payload;
    const result= await auth.api.changePassword({
        body:{
            currentPassword,
            newPassword
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`,
        })
    })
    if(session.user.needPasswordChange){
        await prisma.user.update({
            where:{
                id:session.user.id
            },
            data:{
                needPasswordChange:false
            }
        })

    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });
    
    return {
        ...result,
        accessToken,
        refreshToken
    }
}

const logoutUser=async(sessionToken:string)=>{
    
    const result= await auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`,
        })
    })
    return result
}

const verifyEmail = async (email: string, otp: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    const result = await auth.api.verifyEmailOTP({
        body: {
            email: normalizedEmail,
            otp: normalizedOtp
        }
    });

    if (!result?.status) {
        throw new AppError(status.BAD_REQUEST, "Invalid or expired OTP");
    }

    let user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: result.user.id },
                { email: { equals: normalizedEmail, mode: "insensitive" } }
            ]
        }
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (!user.emailVerified) {
        user = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                emailVerified: true
            }
        });
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: true,
        needPasswordChange: user.needPasswordChange,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: true,
        needPasswordChange: user.needPasswordChange,
    });

    return {
        user,
        accessToken,
        refreshToken,
        token: (result as any)?.token || (result as any)?.session?.token
    };
};

const resendVerificationOtp = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const isUserExists = await prisma.user.findFirst({
        where: {
            email: {
                equals: normalizedEmail,
                mode: "insensitive"
            }
        }
    });

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "No account found with this email address");
    }

    if (isUserExists.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "This email is already verified. Please log in.");
    }

    await auth.api.sendVerificationOTP({
        body: {
            email: isUserExists.email,
            type: "email-verification"
        }
    });
};


const forgetPassword=async(email:string)=>{
    const isUserExists= await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!isUserExists){
        throw new AppError(status.NOT_FOUND,"User not found")
    }

    if(!isUserExists.emailVerified){
        throw new AppError(status.BAD_REQUEST,"Email is not verified. Please verify your email first.")
    }
    if(isUserExists.isDeleted || isUserExists.status===UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND,"User not found")
    }

    await auth.api.requestPasswordResetEmailOTP({
        body:{
            email
        }
    })

}

const resetPassword=async(email:string,otp:string,newPassword:string)=>{
    const isUserExists= await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!isUserExists){
        throw new AppError(status.NOT_FOUND,"User not found")
    }

    if(!isUserExists.emailVerified){
        throw new AppError(status.BAD_REQUEST,"Email is not verified. Please verify your email first.")
    }
    if(isUserExists.isDeleted || isUserExists.status===UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND,"User not found")
    }

    await auth.api.resetPasswordEmailOTP({
        body:{
            email,
            otp,
            password:newPassword
        }
    })

    if (isUserExists.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: isUserExists.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }

    await prisma.session.deleteMany({
        where: {
            userId: isUserExists.id,
        }
    })


}

const googleLoginSuccess=async(session:Record<string, any>)=>{
    const isUserExists= await prisma.user.findUnique({
        where:{
            id:session.user.id
        }
    })

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
    });
    return {
        accessToken,
        refreshToken
    }
}

export const AuthService={
    registerUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
    resendVerificationOtp,
    forgetPassword,
    resetPassword,
    googleLoginSuccess

}