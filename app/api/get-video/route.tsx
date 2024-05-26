import AWS from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getServerSession } from 'next-auth';
import { authoptions } from '@/lib/authOption';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3ClientObj = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(req: NextRequest){
 const session = await getServerSession(authoptions)
    const body = await req.json()

 try{
    const result = await prisma.video.findFirst({
        where:{
            id:Number(body.id)
        }
    })
    if(!result){
        return NextResponse.json({message:body})
    }
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: result.s3Key,
      });
      const url = await getSignedUrl(s3ClientObj, command, { expiresIn: 3600 });
    

        return NextResponse.json({...result, url})
 }catch(e){
    console.log(e)
    return NextResponse.json({message:"There something wrong with the getting signedurl's", error:e})
 }

 
}