//google integration

import { MeetingForm } from "@/components/forms/MeetingForm"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { db } from "@/drizzle"
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { clerkClient } from "@clerk/nextjs/server"
import { addMonths, eachMinuteOfInterval, endOfDay, roundToNearestMinutes } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BookEventPage({ 
    params
}: { 
    params: Promise<{ clerkUserId: string, eventId: string }>
}) {
    const { clerkUserId, eventId } = await params
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

    const validTimes = await getValidTimesFromSchedule(eachMinuteOfInterval({ start: startDate, end: endDate },{
        step: 15}), /* returns an array of valid dates that do not conflict with schedule and avail */
         event)

    if (validTimes.length === 0) {
        return <NoTimeSlots event={event} calendarUser={calendarUser} />
    }
    
    return (
        <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Book {event.name} with {calendarUser.fullName}
        </CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <MeetingForm
          validTimes={validTimes}
          eventId={event.id}
          clerkUserId={clerkUserId}
        />
      </CardContent>
    </Card>
    )
}

function NoTimeSlots({ /* rendering out a simple card that says no time slots are available */
    event,
    calendarUser,
  }: {
    event: { name: string; description: string | null }
    calendarUser: { id: string; fullName: string | null }
  }) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            Book {event.name} with {calendarUser.fullName}
          </CardTitle>
          {event.description && (
            <CardDescription>{event.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {calendarUser.fullName} is currently booked up. Please check back later
          or choose a shorter event.
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href={`/book/${calendarUser.id}`}>Choose Another Event</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }