"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { video } from "@/app/(navgrp)/videoedit/[id]/page";

const VideoComponent = ({
  video,
  setvideo,
}: {
  video: video;
  setvideo?: any;
}) => {
  const pathname = usePathname();
  const isUploadRoute = pathname.startsWith("/videoedit/");
  const isEditRoute = pathname === "/edit";
  const { data: session, status } = useSession();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (!video) {
    return <div className="h-full">no Video</div>;
  }

  const handleUpload = async () => {
    setToastMessage("Take a chill pill, upload is started....");
    setShowToast(true);
    try {
      const response = await fetch("/api/uploadToYouTube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src: video.url,
          title: video.title,
          description: video.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage("Successfully uploaded");
      } else {
        setToastMessage(`Failed to upload video: ${data.error}`);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setToastMessage("An error occurred while uploading the video.");
    }

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDelete = async () => {
    const response = await fetch("/api/delete-video", {
      method: "DELETE",
      body: JSON.stringify({
        id: Number(video.id),
      }),
    });

    if (setvideo) {
      setToastMessage("Deleted Successfully");
      setShowToast(true);     
      setTimeout(() => {
        setShowToast(false);
        // window.location.reload();
      }, 3000);
      setvideo((prevVideos: video[]) =>
        prevVideos.filter((v: video) => v?.id !== video.id)
      );
    } else {
      console.warn("setvideo is not defined.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl p-3">
      {showToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <figure>
        <video className="rounded-md h-64 min-w-72 max-w-96" controls>
          <source src={video.url} />
        </video>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{video.title}</h2>
        <div className="card-actions justify-end">
          <button onClick={handleDelete} className="btn btn-primary">
            Delete Video
          </button>
          {isEditRoute && (
            <Link href={`/videoedit/${video.id}`} className="btn btn-primary">
              Open Video Editor
            </Link>
          )}
          {session?.user?.role === "owner" && isUploadRoute && (
            <button onClick={handleUpload} className="btn btn-primary">
              Upload to YouTube
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
