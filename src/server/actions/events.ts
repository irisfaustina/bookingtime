"use server"

import { db } from "@/drizzle"
import { EventTable } from "@/drizzle/schema"
import { eventFormSchema } from "@/schema/events"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import "use-server"
import { z } from "zod"

export async function createEvent( /* call this action in eventform and make sure to use zod for type saftey so values are passed to eventforms*/
    unsafeData: z.infer<typeof eventFormSchema> /* assume submitted data unsafe */
): Promise<{error: boolean | undefined}> { /* tell ts there are two possibilities return error or not at all */
    const {userId} = await auth() /* makes sure users are signed in for create event  */
    const {success, data} = eventFormSchema.safeParse(unsafeData) /* use safeparse to process unsafe data, which will return success, data, and errors */
    
    if (!success || userId == null) { /* we already handle error on client side html so only care about success & data & not sucess errors*/
        return {error: true}
    }

    await db.insert(EventTable).values({...data, clerkUserId: userId}) /* is no error insert values into eventtable */

    redirect("/events")
}