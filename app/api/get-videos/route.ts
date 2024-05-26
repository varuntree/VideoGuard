import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getServerSession } from 'next-auth';
import { authoptions } from '@/lib/authOption';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type videos = {
  id: number;
  title: string;
  description: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
  editorId: string;

}

const s3ClientObj = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authoptions);
  const role = session?.user?.role;
  

  try {
    let videos:videos[] = [];
    if (role == 'editor') {
      const editor = await prisma.user.findFirst({
        where: { id: session?.user?.id },
        select: { videos: true,
          owner:{
            select:{
              videos:true
            }
          }
         },
      });

      if (editor?.videos) {
        videos = [...editor.videos];
      }
    
      if (editor?.owner?.videos) {
        videos = [...videos, ...editor.owner.videos];
      }
      
    } else {
      const owner = await prisma.user.findFirst({
        where: { id: session?.user?.id },
        select: {
          videos:true,
          editor: {
            select: { videos: true },
          },
        },
      });

      if (owner?.videos) {
        videos = [...owner.videos];
      }
      
      if (owner?.editor?.videos) {
        videos = [...videos, ...owner.editor.videos];
      }
    }

    if (videos.length === 0) {
      return NextResponse.json({ message: "There are no videos", status: false });
    }

    const videosWithUrls = [];
    for (const video of videos) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: video.s3Key,
      });
      const url = await getSignedUrl(s3ClientObj, command, { expiresIn: 3600 });
      videosWithUrls.push({
        ...video,
        url
      });
    }

    return NextResponse.json({videosWithUrls, status:true});
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "There was something wrong with getting signed URLs" });
  }
}
