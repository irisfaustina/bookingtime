import { and } from "drizzle-orm"
import { db } from "@/drizzle"
import { notFound } from "next/navigation"
import { clerkClient } from "@clerk/nextjs/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/formatters"

const revalidate = 0

export default async function SuccessPage({
    params,
    searchParams
}: { 
    params: Promise<{ clerkUserId: string, eventId: string }>
    searchParams: Promise<{ startTime: string }>
}) {
    if (!process.env.DATABASE_URL) {
        return (
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Configuration Error</CardTitle>
                    <CardDescription>Database connection not configured</CardDescription>
                </CardHeader>
                <CardContent>
                    Please contact the administrator to set up the database connection.
                </CardContent>
            </Card>
        )
    }

    const { clerkUserId, eventId } = await params
    const event = await db.query.EventTable.findFirst({ 
        where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) => 
            and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
    })

    if (event == null) return notFound()

    const calendarUser = await (await clerkClient()).users.getUser(clerkUserId)
    const startDate = new Date((await searchParams).startTime)

    return (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>
              Successfully Booked {event.name} with {calendarUser.fullName}
            </CardTitle>
            <CardDescription>{formatDateTime(startDate)}</CardDescription>
          </CardHeader>
          <CardContent>
            You should receive an email confirmation shortly. You can safely close
            this page now.
          </CardContent>
        </Card>
      )
}