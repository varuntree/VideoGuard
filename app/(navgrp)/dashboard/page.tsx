"use client";
import AddEditor from "@/components/AddEditor";
import ShowCode from "@/components/ShowCode";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data, status } = useSession();
  if (status == "loading") {
    return (
      <div className="flex justify-center items-center h-lvh">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }
  return (
    <WavyBackground speed="fast" className="w-full">
      <div className="flex md:flex-row flex-col justify-around min-h-screen items-center">
        <div className="h-full flex justify-center items-center mb-10">
          {data?.user?.role == "editor" ? (
            <ShowCode></ShowCode>
          ) : (
            <AddEditor></AddEditor>
          )}
        </div>
        <div className="text-center p-6  shadow-2xl">
          <p className="text-3xl font-bold mb-4 text-white">
            COMING SOON......
          </p>
          <p className="text-lg mb-4 text-white">
            Transform your content with AI-powered insights
          </p>
          <ul className="list-disc list-inside text-left text-white mb-4">
            <li className="mb-2">Unlock Automated Transcripts</li>
            <li className="mb-2">Pinpoint Timestamps</li>
            <li className="mb-2">In-depth Video Analysis</li>
          </ul>
          <p className="text-gray-500 mb-2">Powered by</p>
          <p className="text-gray-800 text-5xl font-semibold">Gemini 1.5 pro</p>
        </div>
      </div>
    </WavyBackground>
  );
};

export default Page;
