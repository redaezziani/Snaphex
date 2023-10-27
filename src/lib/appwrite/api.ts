import { INewUser } from "@/types";
import { ID } from "appwrite";
import { account, appWriteConfig, avatars, databases } from "./config";


export async function createUserAccount(user:INewUser){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );

        if (!newAccount) throw new Error("Account creation failed");

        const avatarUrl = avatars.getInitials(user.name);

        const newUser= await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            imageUrl: avatarUrl,
            username: user.username,


        })

        return newUser;
    }
    catch(err){
        console.error(err);
        return err;
    }
}

export async function saveUserToDB(user:{
    accountId: string;
    email: string;
    name: string;
    imageUrl:URL;
    username?: string;
}){
    try{
        const newUser = await databases.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            ID.unique(),
            user,
        )

        return newUser;
    }
    catch(err){
        console.error(err);
        return err;
    }

}

export async function signInAccount(user:{
    email:string;
    password:string;
}){
    try{
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    }
    catch(err){
        console.error(err);
        return err;
    }
}