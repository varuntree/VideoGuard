import { authoptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function GET(){
    const session = await getServerSession(authoptions)
    if(!session?.user?.id){
        return NextResponse.json({message:"User not authenticated"})
    }
    try{
        const result = await prisma.user.findUnique({
            where:{
                id:session.user.id
            }
        })
        return NextResponse.json(result)
    }catch(e){
        console.log(e)
    }
}