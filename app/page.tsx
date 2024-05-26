"use client"

import { useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react";
import { Spotlight } from '@/components/ui/SpotlightPreview';



export default function Signin(){
  // const handleSignIn = (role:any) => {
  //   signIn('google', {
  //     callbackUrl: `/auth/callback?role=${role}`, // Pass role in the URL
  //     scope: role === 'editor' ? 'openid profile email' : 'https://www.googleapis.com/auth/youtube.upload'
  //   });
  // };
  const router = useRouter()
  const {data, status} = useSession()
  
  if(status=="loading"){
    return(
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )
  }
  if(status=="authenticated"){
      return router.push('/dashboard')
  }
    return (
    <div className="min-h-screen flex flex-col items-center md:flex-row md:justify-around p-10">
      <div className="h-full lg:flex justify-center items-center  prose p-5">
        <Spotlight></Spotlight>
          <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              VIDEOGUARD <br /> Create fearlessly, <br /> upload effortlessly.
            </h1>
            <p className="mt-10 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            <b><u>Credential Fortress:</u></b> Editors upload their masterpieces to VideoGuard without ever needing your YouTube credentials. Think of it as a secure vault where only you hold the master key. <br /> <br />
                  <b><u>Effortless Uploading:</u></b> On the road? No problem. Review, tweak titles or descriptions, and with a single, powerful <span className='text-neutral-50 textl'>CLICK</span>, send your video soaring to YouTube. All the heavy lifting is done by VideoGuard’s servers, ensuring your connection speed is never a barrier.
            </p>
          </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="card w-96 shadow-2xl border-2 border-gray-00  border-gray-500 hover:shadow-2xl transition duration-500 ease-in-out">
          <div className="card-body">
            <h2 className="card-title mb-6">Sign in to Your Account With Google</h2>
            <div className="card-actions justify-center items-center ">
              <p>Owner</p>
              <button className="btn btn-outline gap-3"  onClick={() => signIn("google-owner", { callbackUrl: "/dashboard" })}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6 LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                Sign in with Google
              </button>
            </div>
            <div className="card-actions justify-center items-center ">
              <p>Editor</p>
              <button className="btn btn-outline gap-3" onClick={() => signIn("google-editor",{ callbackUrl: "/dashboard" })}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6 LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}