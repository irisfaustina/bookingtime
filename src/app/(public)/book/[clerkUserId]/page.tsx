//page for individual user to view all events for user

import { CopyEventButton } from "@/components/CopyEventButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle"
import { formatEventDescription } from "@/lib/formatters"
import { clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BookingPage({ 
    params
}: { 
    params: Promise<{ clerkUserId: string }>
}) {
    const { clerkUserId } = await params
    const events = await db.query.EventTable.findMany({ /* we pass db from index.ts so we can make quries here */
        where: ({ clerkUserId: userICol, isActive }, {eq, and }) => 
            and(eq(userICol, clerkUserId), eq(isActive, true)), /* getting all events for the user and make sure they're active, checks 1/userid is correct and event is active */
        orderBy:({ name }, {asc, sql}) => asc(sql`lower(${name})`) /* order from the most recent to the oldest */
    })

    if (events.length === 0) return notFound()

    const { fullName } = await (await clerkClient()).users.getUser(clerkUserId)

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-4xl md:text-5xl font-semibold mb-4 text-center">{fullName}'s Events</div>
            <div className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
                Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.
            </div>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"> {/* allows eventcard compoenent child to be position in grid */}
                {events.map((event) => ( /* loop through all the events and arrow function takes object input and returns JSX for rendering*/
                    <EventCard key={event.id} {...event}/> /* unique key prop is evnet id, passess all prop of event objects */
                ))}
            </div>
        </div>
    )
}

type EventCardProps = { /* comes from drizzle schema, can hard code or import from drizzle */
    id: string
    name: string
    description: string | null
    durationInMinutes: number
    clerkUserId: string
}
function EventCard({
    id, 
    name, 
    description, 
    durationInMinutes, 
    clerkUserId
    }: EventCardProps){ /* only used once here so safe to create in the same page, otherwise compoenents */
    return(
        <Card className="flex flex-col"> {/* conditional classname to make border lighter when toggle is inactive */}
            <CardHeader>
                <CardTitle>{name}</CardTitle> {/* how you structures your card with info */}
                <CardDescription>
                    {formatEventDescription(durationInMinutes)}
                </CardDescription>
            </CardHeader>
            {description != null &&(
                <CardContent>{description}</CardContent>
            )}
            <CardFooter className="flex justify-end gap-2 mt-auto">  
            <Button asChild>
                    <Link href={`/book/${clerkUserId}/${id}`}>
                        Select
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

