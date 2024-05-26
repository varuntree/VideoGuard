"use client"
import { Navbar } from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { useRouter } from 'next/navigation'

export default function Layout({children}:{children:ReactNode}){
    const {data, status} = useSession()
    const router = useRouter()
    if(status=="loading"){
      return(
        <div className="min-h-screen flex justify-center items-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )
    }
    if(status=="unauthenticated"){
        return router.push('/')
    }
    return (
        <div className="flex flex-col min-h-screen" >
            <Navbar></Navbar>
            <div className="flex-grow pt-20">
                {children}
            </div>
        </div>
    )
}