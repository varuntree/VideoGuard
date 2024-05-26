import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/prisma"
import { getServerSession } from "next-auth"
import { authorizedbuyersmarketplace } from "googleapis/build/src/apis/authorizedbuyersmarketplace"
import { authoptions } from "@/lib/authOption"

export async function POST(req: NextRequest){
    const body = await req.json()
    const session = await getServerSession(authoptions)
    if(!session?.user?.email){
        return NextResponse.json({message:"Autentication Failed", status:false})
    }
    try{
        const result = await prisma.user.findUnique({
            where:{
                editorcode:String(body.editorcode)
            }
        })
        console.log(result)
        if(!result){
            return NextResponse.json({status:false})
        }
        const update = await prisma.user.update({
            where:{
                email: session?.user?.email
            },
            data:{
                editorId:result.id
            }
        })
        console.log("update reached!!")
        if(update){
            return NextResponse.json({status:true})
        }
    }catch(e){
        console.log(e)
        return NextResponse.json({error:e, status:false})
        
    }
}