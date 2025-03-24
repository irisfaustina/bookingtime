import { z } from "zod";

import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";

export const scheduleFormSchema = z.object({
    timezone: z.string().min(1, "Required"),
    availabilities: z.array
    (z.object({
        startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be between 00:00 and 23:59 (in the format HH:MM)"),/* regex broken into two parts, demote time in 01:12, 14:20 2nd half is beween 00 and 59 */
        endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER)
    })
).superRefine((availabilities, ctx) => { /* add errors if certian conditions are not met: get availabilities and ctx for context */
    availabilities.forEach((availability, index) => { /* take my avails and loop through each one of them, which produces avail and index numbers to add error */
        const overlaps = availabilities.some((a, i) => { /* check for overlaps and makes sure end time is always after start imte */
            return i !== index && /* check if a particular avail overlaps with other avail: if i is not equal to current index in question, ignore it */
            a.dayOfWeek === availability.dayOfWeek && /* TODO: check if we need to check for dates. are they both on the same day */
            timeToInt(a.startTime) < timeToInt(availability.endTime) && /* ensures that the start time of one event (a.startTime) occurs before the end time of the other event (availability.endTime)*/
            timeToInt(a.endTime) > timeToInt(availability.startTime) /* ensures that the end time of one event (a.endTime) occurs after the start time of the other event (availability.startTime) */
        })
        if (overlaps) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom, /* custom error code */
                message: "Availabilities overlaps with another",
                path: [index, "startTime"]
            })
        }
    })
})
})

function timeToInt(time: string) {
    return parseFloat(time.replace(":", ".")) /* convert time to flaot, anything larger on the timescale will be a larger number, like 23:52 becomes 23.52 > 22.51 */
}

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>