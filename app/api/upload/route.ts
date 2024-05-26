import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/prisma";
import { getServerSession } from 'next-auth';
import { authoptions } from '@/lib/authOption';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authoptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, title, description, type } = body;

    const videoData = {
      title,
      description,
      s3Key: name,
      editor: {
        connect: { id: session.user.id },
      },
    };

    if (type) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: name,
      };

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

      await upsertVideo(videoData);

      return NextResponse.json({ url });
    } else {
      await upsertVideo(videoData);

      return NextResponse.json({ message: "done with the update" });
    }
  } catch (err) {
    console.error("Error processing request", err);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}

async function upsertVideo(videoData: any) {
  try {
    await prisma.video.upsert({
      where: { s3Key: videoData.s3Key },
      create: videoData,
      update: {
        title: videoData.title,
        description: videoData.description,
      },
    });
  } catch (err) {
    console.error("Error upserting video", err);
  }
}
