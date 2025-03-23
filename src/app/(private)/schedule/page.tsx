import EventForm from "@/components/forms/EventForm"
import ScheduleForm from "@/components/forms/ScheduleForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle"
import { auth } from "@clerk/nextjs/server"

export default async function SchedulePage() {

    const { userId, redirectToSignIn } = await auth() /* get user id */
    if (userId == null) return redirectToSignIn() /* redirect to sign in if not signed in */
    
    const schedule = await db.query.ScheduleTable.findFirst({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        with: { /* you can include related data from ScheduleAvailabilityTable using the with option */
            availabilities: {
                orderBy: ({ startTime }, { desc }) => desc(startTime), /* most recent schedule is listed first */
            }
        }
    }) /* get schedule when clerkuserid is equal to user id*/
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <ScheduleForm schedule={schedule} />{/* for reusability pass schedule */}
      </CardContent>
    </Card>
  )
}