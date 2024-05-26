import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
type video = {
  id: number;
  title: string;
  description: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
  editorId: string;
  url: string;
} | null;

export const useFetchVideos = () => {
  const [videos, setVideos] = useState<video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchVideos = async () => {
      if (status !== 'authenticated') return;

      try {
        const response = await fetch('/api/get-videos');
        if (!response.ok) {
          throw new Error(`Error fetching videos: ${response.statusText}`);
        }

        const data = await response.json();
        setVideos(data.videosWithUrls);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [session, status]);

  return { videos, loading, error, setVideos };
};
