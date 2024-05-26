import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authoptions } from "@/lib/authOption";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Configure your AWS S3 client with credentials
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authoptions);
    const body = await req.json();
    
    if (!session?.user) {
        return NextResponse.json({ Message: "The User is not Authenticated" });
    }
    
    try {
        // Fetch the video record to get the S3 key
        const videoRecord = await prisma.video.findUnique({
            where: {
                id: body.id
            }
        });

        if (!videoRecord) {
            return NextResponse.json({ Message: "Video not Found" });
        }

        // Delete the video file from S3
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: videoRecord.s3Key
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3Client.send(deleteCommand);

        // Delete the video record from the database
        const result = await prisma.video.delete({
            where: {
                id: body.id
            }
        });

        return NextResponse.json({ message: "Deleted Successfully" });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ Message: "An error occurred", error:e });
    }
}
