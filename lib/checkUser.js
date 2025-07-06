import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";


export const checkUser = async (req, res, next) => {
    const user = await currentUser(req, res);
    if (!user) {
        return null;
    }

    try {
        const loggedIn = await db.user.findUnique({
            where: {    
                clerkUserId: user.id,
            },
        });

        if (loggedIn) {
            return loggedIn;
        }

        const name = `${user.firstName} ${user.lastName}`;

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: name,
                imageUrl : user.imageUrl || null,
            },
        });

        return newUser;
    } catch (error) {
        console.error("Error checking user:", error);
        return null;
    }
}