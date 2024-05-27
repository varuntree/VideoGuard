"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VideoForm from '@/components/VideoForm';
import VideoComponent from '@/components/VideoComponent';
import { SubmitHandler } from 'react-hook-form';
import { Snippet } from '../../upload/page';

export type video = {
    id: number;
    title: string;
    description: string;
    s3Key: string;
    createdAt: Date;
    updatedAt: Date;
    editorId: string;
    url: string;
} | null;

const Page = () => {
    const router = useRouter();
    const { id } = useParams();
    const [video, setVideo] = useState<video>(null);
    const [file, setFile] = useState<File | null>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await fetch('/api/get-video', {
                method: "POST",
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            setVideo(data);
        };

        fetchVideos();
    }, [id]);

    const onSubmit: SubmitHandler<Snippet> = async (formData) => {
        setVideo(video => video ? { ...video, title: formData.title, description: formData.description } : video);

        try {
            if (formData.video && formData.video.length > 0) {
                const file = formData.video[0];
                setFile(file);

                // Get the presigned URL
                const response = await fetch("/api/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: file.name,
                        type: file.type,
                        title: formData.title,
                        description: formData.description
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
                    alert("File uploaded successfully");
                } else {
                    alert("Failed to upload file");
                }
            } else {
                await fetch("/api/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: video?.s3Key,
                        title: formData.title,
                        description: formData.description
                    }),
                });
            }
        } catch (error) {
            console.error("Error during file upload", error);
        } finally {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                // window.location.reload();
            }, 3000);
        }
    };

    return (
        <div>
            {showToast && (
                <div className="toast z-20">
                    <div className="alert bg-green-600 alert-info">
                        <span>Updated Successfully</span>
                    </div>
                </div>
            )}
            <div className='h-full flex lg:flex-row  flex-wrap justify-between items-center p-5'>
                <div className='basis-2/3'>
                    <p className=' text-xl font-bold'>Edit the Contents</p>
                    <VideoForm initialData={{ title: video?.title || "", description: video?.description || "" }} onSubmit={onSubmit} />
                </div>
                <div className='basis-1/3 flex  justify-center'>
                    {video && <VideoComponent video={video} setvideo={setVideo} />}
                </div>
            </div>
        </div>
    );
}

export default Page;
