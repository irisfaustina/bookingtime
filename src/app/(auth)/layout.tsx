import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({children}:{children: ReactNode}){
    //here chuldren is the signup window which is centered
    const { userId } = await auth() /* redirected if already signed in */
    if (userId != null) redirect("/") /* redirect to then events */

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">{children} {/* wraps auth so components are directly centered on screen */}
        </div>
    )
}