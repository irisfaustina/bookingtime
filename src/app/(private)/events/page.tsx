import { CopyEventButton } from "@/components/CopyEventButton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { db } from "@/drizzle";
import { formatEventDescription } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";

export const revalidate = 0 /* you are telling Next.js to revalidate the page data on every request. This means that instead of serving cached data, the server will always fetch fresh data from the source. */

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
                <Link href="/events/new">
                <CalendarPlus className="size-5"/>New Event
                </Link>
            </Button>
        </div>
        {events.length > 0 ? (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]"> {/* allows eventcard compoenent child to be position in grid */}
                {events.map((event) => ( /* loop through all the events and arrow function takes object input and returns JSX for rendering*/
                    <EventCard key={event.id} {...event}/> /* unique key prop is evnet id, passess all prop of event objects */
                ))}
            </div>
        ):(
            <div className="flex flex-col items-center gap-4">
                <CalendarRange className="size-16 mx-auto"/>
                You do not have any events yet. Create your first event to get started!
                <Button size="lg" className="text-lg" asChild>
                <Link href="/events/new">
                <CalendarPlus className="mr-2 size-5"/>New Event
                </Link>
            </Button>
            </div>
        )}
        </>
    )
}

type EventCardProps = { /* comes from drizzle schema, can hard code or import from drizzle */
    id: string
    name: string
    description: string | null
    durationInMinutes: number
    isActive: boolean
    clerkUserId: string
}

function EventCard({
    id, 
    name, 
    description, 
    durationInMinutes, 
    isActive,
    clerkUserId}: EventCardProps){ /* only used once here so safe to create in the same page, otherwise compoenents */
    return(
        <Card className={cn("flex flex-col", !isActive && "border-secondary/50")}> {/* conditional classname to make border lighter when toggle is inactive */}
            <CardHeader className={cn(!isActive && "opacity-50")}>
                <CardTitle>{name}</CardTitle> {/* how you structures your card with info */}
                <CardDescription>
                    {formatEventDescription(durationInMinutes)}
                </CardDescription>
            </CardHeader>
            {description != null &&(
                <CardContent className={cn(!isActive && "opacity-50")}>{description}</CardContent>
            )}
            <CardFooter className="flex justify-end gap-2 mt-auto">  
                {isActive && (
                    <CopyEventButton 
                        variant="outline" 
                        eventId={id} 
                        clerkUserId={clerkUserId}
                    />
                )}
                <Button asChild>
                    <Link href={`/events/${id}/edit`}>Edit</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}