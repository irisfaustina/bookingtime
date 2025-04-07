import EventForm from "@/components/forms/EventForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const revalidate = 0 /* you are telling Next.js to revalidate the page data on every request. This means that instead of serving cached data, the server will always fetch fresh data from the source. */

export default async function EditEventPage({ 
    params
}: {
    params: Promise<{ eventId: string }> 
}) { /* [eventId allows to take in dynamic parameters with the same name] */
    const { userId, redirectToSignIn } = await auth()
    if (userId == null) return redirectToSignIn()

    const event = await db.query.EventTable.findFirst({
        where: ({id, clerkUserId}, { and, eq}) => and(eq(clerkUserId, userId), eq(id, eventId))
    })

    if (!event) return notFound() /* catch with event is not */
    
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Edit Event</CardTitle>
            </CardHeader>
            <CardContent>
                <EventForm event = {{...event, description: event.description || undefined}} /> {/* address description can be undefined */}
            </CardContent>
        </Card>
    )
}