import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where:{
                role : Role.SUPER_ADMIN
            }
        })

        if(isSuperAdminExist) {
            console.log("Super admin already exists. Skipping seeding super admin.");
            return;
        }

        const existingEmailUser = await prisma.user.findUnique({
            where: {
                email: envVars.SUPER_ADMIN_EMAIL
            }
        });

        if (existingEmailUser) {
            console.log("A user with the super admin email already exists but is not a super admin. Promoting them to super admin.");
            await prisma.user.update({
                where: { email: envVars.SUPER_ADMIN_EMAIL },
                data: { role: Role.SUPER_ADMIN, emailVerified: true }
            });
            console.log("Existing user promoted to Super Admin.");
            return;
        }

        const superAdminUser = await auth.api.signUpEmail({
            body:{
                email : envVars.SUPER_ADMIN_EMAIL,
                password : envVars.SUPER_ADMIN_PASSWORD,
                name : "Super Admin",
                role : Role.SUPER_ADMIN,
                needPasswordChange : false,
                rememberMe : false,
            }
        })

        await prisma.user.update({
            where : {
                id : superAdminUser.user.id
            },
            data : {
                emailVerified : true,
            }
        });

        const superAdmin = await prisma.user.findFirst({
            where : {
                email : envVars.SUPER_ADMIN_EMAIL,
            }
        })

        console.log("Super Admin Created ", superAdmin);
    } catch (error) {
        console.error("Error seeding super admin: ", error);
        await prisma.user.delete({
            where : {
                email : envVars.SUPER_ADMIN_EMAIL,
            }
        }).catch(() => {});
    }
}