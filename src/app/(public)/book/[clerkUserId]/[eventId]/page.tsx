//google integration

import { db } from "@/drizzle"
import { clerkClient } from "@clerk/nextjs/server"
import { addMonths, endOfDay, roundToNearestMinutes } from "date-fns"
import { notFound } from "next/navigation"

export default async function BookEventPage({ 
    params: { clerkUserId, eventId } 
}: { 
    params: { clerkUserId: string, eventId: string } 
}) {
    const event = await db.query.EventTable.findFirst({ 
        where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) => and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId))
    })/* is active, is for the correct user, is for the correct event id */
    /* Suppose you have a page that allows users to book events. The URL for this page might look like /book-event/:clerkUserId/:eventId, where :clerkUserId and :eventId are placeholders for the actual IDs.
        When a user navigates to this page, Next.js automatically populates the params object with the values from the URL. You can then use these values to fetch relevant data or perform actions: */
    if (event == null) return notFound()

    const calendarUser = await (await clerkClient()).users.getUser(clerkUserId) /* starting user */
    const startDate =roundToNearestMinutes(new Date(), { 
        nearestTo: 15,
        roundingMethod: "ceil", })
    const endDate = endOfDay(addMonths(startDate, 2)) /* last day, 2 months in the future */
    return (
        <div>
            <h1>Book Event</h1>
        </div>
    )
}