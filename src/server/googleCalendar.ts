import { clerkClient } from "@clerk/nextjs/server"
import "use-server"
import { google } from "googleapis"

export async function getCalendarEventTimes(clerkUserId: string, {start, end}: {start: Date, end: Date}) {
    const oAuthClient = await getOAuthClient(clerkUserId)
}

async function getOAuthClient(clerkUserId: string) {
    const token = await (await clerkClient()).users.getUserOauthAccessToken(clerkUserId, "oauth_google")

    if(token.data.length === 0 || token.data[0].token === null){
        return null
    }

    const client = new google.auth.OAuth2( /* here are our credentials  */
        process.env.GOOGLE_OAUTH_CLIENT_ID, 
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URL
    )

    client.setCredentials({ /* now set up user */
        access_token: token.data[0].token
    })

    return client /* return information */
}