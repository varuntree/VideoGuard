"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  editorcode: number;
};

const AddEditor: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [toast, setToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const  onSubmit: SubmitHandler<Inputs> = async (data) => {
    setToast(true)
    setToastMessage("Checking the Code.....")
    const result = await fetch("/api/verify-code", {
      method:"POST",
      body:JSON.stringify({
        editorcode:data.editorcode
      })
    })
    const {status} = await result.json()
    if(status){
      setToastMessage("Editor Added")
    }else{
      setToastMessage("No editor Found, RECHECK CODE")
    }
    setTimeout(() => {
      setToast(false)
    }, 3000);

  };

  return (
    <div>
      <div className="card card-compact w-96 bg-base-100 shadow-xl p-3">
        <div className="card-body">
          <h2 className="card-title">Enter the Editor code</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("editorcode", { required: true })}
              type="text"
              placeholder="------"
              className="input input-ghost w-full max-w-xs bg-black mb-3"
            />
            {errors.editorcode && <span>Please enter the Code</span>}
            <div className="card-actions justify-end">
              <input type="submit" className="btn"></input>
            </div>
          </form>
        </div>
      </div>
     {toast && <div className={`toast toast-end `}>
        <div className={`alert alert-info ${toastMessage=="No editor Found, RECHECK CODE"?"bg-red-700":"bg-green-600"}`}>
          <span>{toastMessage}</span>
        </div>
      </div>}
    </div>
  );
};

export default AddEditor;
