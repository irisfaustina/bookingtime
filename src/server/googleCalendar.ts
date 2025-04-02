//accessing google calendar api
//The code fetches OAuth access tokens for users using Clerk's API, which requires server-side authentication to handle sensitive user data securely. Client-side code cannot securely handle or store these tokens.
//In Next.js, server-side rendering and API routes allow you to execute code on the server before sending responses to the client. This is useful for handling sensitive operations like authentication and API calls that should not be exposed to the client.

import "use-server" /* make sure this is only called from the server */
import { clerkClient } from "@clerk/nextjs/server"
import { google } from "googleapis"
import { addMinutes, endOfDay, startOfDay } from "date-fns"

export async function getCalendarEventTimes(
  clerkUserId: string, /* get all diff cal event times for clerk id between two dates */
  { start, end }: { start: Date; end: Date }
) {
  const oAuthClient = await getOAuthClient(clerkUserId) /* access google api and know who we're authenticating against*/

  const events = await google.calendar("v3").events.list({ /* taken from getauthclient resources function below */
    calendarId: "primary", /* primary calendar */
    eventTypes: ["default"], /* default events, normal not holidays */
    singleEvents: true, /* single events, anytime reoccuring will pull every single instance within date range */
    timeMin: start.toISOString(), /* start time */
    timeMax: end.toISOString(), /* end time */
    maxResults: 2500, /* max results to get all possible events */
    auth: oAuthClient, /* verify which user is making the request */
  })

  return ( /* gives us all the events between the start and end times */
    events.data.items
      ?.map(event => {
        if (event.start?.date != null && event.end?.date != null) { /* all day events */
          return { /* event is occuring the entire day */
            start: startOfDay(event.start.date),
            end: endOfDay(event.end.date),
          }
        }

        if (event.start?.dateTime != null && event.end?.dateTime != null) {/* events that has a time */
          return {
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          }
        }
      })
      .filter(date => date != null) || [] /* removing everything that's null */
  )
}

export async function createCalendarEvent({
  clerkUserId,
  guestName,
  guestEmail,
  startTime,
  guestNotes,
  durationInMinutes,
  eventName,
}: {
  clerkUserId: string
  guestName: string
  guestEmail: string
  startTime: Date
  guestNotes?: string | null
  durationInMinutes: number
  eventName: string
}) {
  const oAuthClient = await getOAuthClient(clerkUserId)
  const calendarUser = await (await clerkClient()).users.getUser(clerkUserId)
  if (calendarUser.primaryEmailAddress == null) {
    throw new Error("Clerk user has no email")
  }

  const calendarEvent = await google.calendar("v3").events.insert({
    calendarId: "primary",
    auth: oAuthClient,
    sendUpdates: "all",
    requestBody: {
      attendees: [
        { email: guestEmail, displayName: guestName },
        {
          email: calendarUser.primaryEmailAddress.emailAddress,
          displayName: calendarUser.fullName,
          responseStatus: "accepted",
        },
      ],
      description: guestNotes ? `Additional Details: ${guestNotes}` : undefined,
      start: {
        dateTime: startTime.toISOString(),
      },
      end: {
        dateTime: addMinutes(startTime, durationInMinutes).toISOString(),
      },
      summary: `${guestName} + ${calendarUser.fullName}: ${eventName}`,
    },
  })

  return calendarEvent.data
}

async function getOAuthClient(clerkUserId: string) { /* token we get back from the user */
  const token = await (await clerkClient()).users.getUserOauthAccessToken(
    clerkUserId,
    "google"
  )

  if (token.data.length === 0 || token.data[0].token == null) { /* if token doesn't exist */
    return /* return null */
  }

  const client = new google.auth.OAuth2( /* if token is correct create client & pass in credentials we are who we say we are */
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  )

  client.setCredentials({ access_token: token.data[0].token }) /* after verifying our token, set user credentials based on access token */

  return client /* gives us access to google calendar api resources and we are who we say we are */
}