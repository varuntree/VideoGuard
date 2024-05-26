"use client";
import VideoComponent from '@/components/VideoComponent';
import React from 'react';
import { useFetchVideos } from '@/lib/useFetchVideos ';

const Page: React.FC = () => {
  const { videos, loading, error, setVideos } = useFetchVideos();

  if (loading) {
    return (
      <div className="flex flexgrow min-h-screen justify-center items-center ">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-error">Failed to load videos</p>
      </div>
    );
  }

  if (!videos) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>There are  no videos yet.</p>
      </div>
    );
  }
console.log(videos)
  return (
      <div className="p-5 flex-grow min-h-screen flex flex-wrap md:justify-start justify-center gap-7">
        {videos.map((video:any) => (
          <div className="w-fit" key={video.id}>
            <VideoComponent video={video} setvideo={setVideos}/>
          </div>
        ))}
      </div>
  );
};

export default Page;
