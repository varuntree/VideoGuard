"use client";
import VideoForm from "@/components/VideoForm";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

export type Snippet = {
  title: string;
  description: string;
  video?: FileList;
};

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const onSubmit: SubmitHandler<Snippet> = async (formData) => {
    console.log("on submit reached");
    if (!formData.video || formData.video.length === 0) {
      alert("Please select a file first");
      return;
    }

    const file = formData.video[0];
    setFile(file);

    
    setUploadStatus("Uploading...");
    setShowToast(true);

    try {
      
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          title: formData.title,
          description: formData.description,
        }),
      });

      const { url } = await response.json();

      
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (uploadResponse.ok) {
        setUploadStatus("File uploaded successfully");
      } else {
        setUploadStatus("Failed to upload file");
      }
    } catch (error) {
      console.error("Error during file upload", error);
      setUploadStatus("Failed to upload file");
    } finally {
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="rounded-lg h-full">
      {showToast && (
        <div className="toast">
          <div className={`alert ${uploadStatus === "File uploaded successfully" ? "bg-green-600" : "bg-youtube-red"}`}>
            <span className="text-white">{uploadStatus}</span>
          </div>
        </div>
      )}
      <VideoForm onSubmit={onSubmit}></VideoForm>
    </div>
  );
}
