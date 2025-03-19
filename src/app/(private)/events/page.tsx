import { Button } from "@/components/ui/button";
import { db } from "@/drizzle";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";

export default async function EventsPage(){
    const { userId, redirectToSignIn } = await auth()

    if (userId == null) return redirectToSignIn()
        
    const events = await db.query.EventTable.findMany({ /* we pass db from index.ts so we can make quries here */
        where: ({ clerkUserId }, {eq}) => eq(clerkUserId, userId), /* find events by clerk id */
        orderBy:({ createdAt }, {desc}) => desc(createdAt) /* order from the most recent to the oldest */
    })
    return (
        <>
        <div className="flex gap-4 items-baseline">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold mb-6">Events</h1>
            <Button asChild>
                <Link href="/events/new"><CalendarPlus className="mr-2 size-5"/>New Event</Link>
            </Button>
        </div>
        {events.length > 0 ? (<h1>Events</h1>):(
            <div className="flex flex-col items-center gap-4">
                <CalendarRange className="size-16 mx-auto"/>
                You do not have any events yet. Create your first event to get started!
                <Button size="lg" className="text-lg" asChild>
                <Link href="/events/new"><CalendarPlus className="mr-2 size-5"/>New Event</Link>
            </Button>
            </div>
        )}
        </>
    )
}