import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authoptions } from '@/lib/authOption';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authoptions);
  

  try {
    const { src, title, description } = await request.json();

    if (!src || !session?.accessToken) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    console.log("done authentication");
    
    // Fetch the video file from the pre-signed src
    const videoResponse = await fetch(src);
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video from S3');
    }

    const videoStream = videoResponse.body;
    if (!videoStream) {
      throw new Error('Failed to fetch video from S3');
    }
    console.log("done the video fetching");

    // Convert the ReadableStream to a Node.js Readable stream
    const nodeReadableStream = readableStreamToNodeReadable(videoStream);

    // Configure the YouTube API client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Upload the video to YouTube
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private', // or 'public' or 'unlisted'
        },
      },
      media: {
        body: nodeReadableStream,
      },
    });

    return NextResponse.json({ videoId: response.data.id }, { status: 200 });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


function readableStreamToNodeReadable(readableStream: ReadableStream<Uint8Array>): Readable {
  const reader = readableStream.getReader();
  return new Readable({
    async read() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
          break;
        }
        this.push(Buffer.from(value));
      }
    }
  });
}
