"use client";
import { authoptions } from "@/lib/authOption";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Snippet = {
  title: string;
  description: string;
  video?: FileList;
};

type VideoFormProps = {
  onSubmit: SubmitHandler<Snippet> ;
  initialData?: Snippet;
};

const VideoForm = ({ onSubmit, initialData }: VideoFormProps) => {
  const { register, handleSubmit, setValue } = useForm<Snippet>();
  const { data, status } = useSession();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description);
      // Note: You cannot set the value of a file input programmatically for security reasons.
    }
  }, [initialData, setValue]);

  if (status === 'loading' || !data?.user) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  return (
    <form
      className="h-full flex flex-col gap-5 rounded-lg p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="file">Upload Video</label>
      <input
        {...register("video")}
        type="file"
        id="file"
        className="file-input file-input-bordered bg-red-700 w-full max-w-xs"
      />
      <label htmlFor="title">Title</label>
      <input
        placeholder="Title"
        className="outline-none p-4"
        id="title"
        {...register("title")}
      />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        {...register("description")}
        className="bg-black textarea textarea-bordered min-h-40"
        placeholder="Description"
      ></textarea>
      <input type="submit" className="btn btn-ghost bg-youtube-red w-fit" />
    </form>
  );
};

export default VideoForm;
