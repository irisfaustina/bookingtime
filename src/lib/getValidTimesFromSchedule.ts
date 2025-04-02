import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { db } from "@/drizzle"
import { ScheduleAvailabilityTable } from "@/drizzle/schema"
import { getCalendarEventTimes } from "@/server/googleCalendar"
import { addMinutes, areIntervalsOverlapping, isFriday, isMonday, isSaturday, isSunday, isThursday, isTuesday, isWednesday, isWithinInterval, setHours, setMinutes } from "date-fns"
import { fromZonedTime } from "date-fns-tz"

export async function getValidTimesFromSchedule(
    timesInOrder: Date[],
    event: {clerkUserId: string, durationInMinutes: number} ) {
    const start = timesInOrder[0]
    const end = timesInOrder.at(-1)
   
    if(start == null || end == null) return []

    const schedule = await db.query.ScheduleTable.findFirst({
        where: ({clerkUserId: userIdCol}, {eq}) => eq(userIdCol, event.clerkUserId),
        with: { availabilities: true },
    })

    if(schedule == null) return []

    const groupedAvailabilities = Object.groupBy(
        schedule.availabilities, 
        (a) => a.dayOfWeek
    )

    const eventTimes = await getCalendarEventTimes(event.
        clerkUserId, { 
            start, 
            end 
        })

    return timesInOrder.filter(intervalDate => { /* filter availble time slots that don't conflict with group avail and event times */
        const availabilities = getAvailabilities( /* for each interval date, check if it's available */
            groupedAvailabilities, 
            intervalDate, 
            schedule.timezone
        ) /* account for time zone possibilities */
        const eventInterval = { /* for each interval date, check if it conflicts with event times */
            start: intervalDate,
            end: addMinutes(intervalDate, event.durationInMinutes),
        }

        return (
          eventTimes.every(eventTime => { /* makes sure no calendar events conflict */
            return !areIntervalsOverlapping(eventTime, eventInterval)
        }) && 
          availabilities.some(availability => {
            return (isWithinInterval(eventInterval.start, availability) && /* is start of my event within this availability */
            isWithinInterval(eventInterval.end, availability)) /* is end of my event within this availability */
          })
        )
    })
}

function getAvailabilities(
    groupedAvailabilities: Partial< /* partial object that contains day of week */
    Record<
    (typeof DAYS_OF_WEEK_IN_ORDER)[number],
    (typeof ScheduleAvailabilityTable.$inferSelect)[] 
    >
    >, 
    date: Date,
    timezone: string
){
    let availabilities: /* checking each time what day of the week are we */
    | (typeof ScheduleAvailabilityTable.$inferSelect)[] /* array of schedule avails */
    | undefined 

    if (isMonday (date)){
        availabilities = groupedAvailabilities.monday
    }
    if (isTuesday (date)){
        availabilities = groupedAvailabilities.tuesday
    }
    if (isWednesday (date)){
        availabilities = groupedAvailabilities.wednesday
    }
    if (isThursday (date)){
        availabilities = groupedAvailabilities.thursday
    }
    if (isFriday (date)){
        availabilities = groupedAvailabilities.friday
    }
    if (isSaturday (date)){
        availabilities = groupedAvailabilities.saturday
    }
    if (isSunday (date)){
        availabilities = groupedAvailabilities.sunday
    }
    if (availabilities == null) return []

    return availabilities.map(({ startTime, endTime }) => {
        // Convert timestamp to hours and minutes
        const startHours = startTime.getHours().toString()
        const startMinutes = startTime.getMinutes().toString().padStart(2, '0')

        const endHours = endTime.getHours().toString()
        const endMinutes = endTime.getMinutes().toString().padStart(2, '0')
        
        const start = fromZonedTime(
            setMinutes(
                setHours(startTime, parseInt(startHours)),
                parseInt(startMinutes)
            ),timezone
        )

        const end = fromZonedTime(
            setMinutes(
                setHours(endTime, parseInt(endHours)),
                parseInt(endMinutes)
            ),timezone
        )

        return { start, end }
    })
}
function isIntervalsOverlapping(eventInterval: { start: Date; end: Date }, eventIntervals: { /* for each interval date, check if it conflicts with event times */ start: Date; end: Date }) {
    throw new Error("Function not implemented.")
}

