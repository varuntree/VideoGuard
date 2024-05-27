"use client"
import React, { useEffect, useState } from "react";

const ShowCode = () => {
  const [user, setUser] = useState<any>();
  useEffect(() => {
    const fetchCode = async () => {
      const result = await fetch("/api/get-user");
      const user = await result.json();
      setUser(user);
    };
    fetchCode();
  }, []);
  if (!user) {
    return (
      <div className="flex justify-center items-center h-lvh">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }
  return (
    <div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Give You are Code to Creator.....</h2>
          <p className="bg-black p-3 rounded-lg">{user.editorcode}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowCode;
