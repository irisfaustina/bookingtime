import { ReactNode } from "react";
import "tailwindcss";
import { BsCalendar3 } from "react-icons/bs";
import { UserButton } from "@clerk/nextjs";
import { NavLink } from "@/components/ui/NavLink";
export default function PrivateLayout({children}:{children : ReactNode}){
    return(
        <>
            <header className="flex py-2 border-b bg-card">
            <nav className="font-medium flex items-center text-base gap-6 container">
                <div className="flex items-center gap-2 font-semibold mr-auto">
                    <BsCalendar3 className="size-6 text-blue-600" />
                    <span className="sr-only md:not-sr-only">bookingtime</span> {/* only show up for screen readers */}
                </div>
                <NavLink href="/events">Events</NavLink>
                <NavLink href="/schedule">Schedule</NavLink>
                <div className="ml-auto size-10 flex items-center">
                    <UserButton appearance={{ elements:{userButtonAvatarBox:"size-full"}}}/>
                </div> {/* ml is to push the button to the right */}
            </nav>
            </header>
            <main className="container my-6">{children}</main>
        </>
    )
}



