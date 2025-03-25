//libs folder is typically used to organize reusable code or utility functions that can be shared across different parts of a project. It serves as a centralized location for libraries or helper functions that provide functionality but are not tied to any specific feature or component.
export function formatEventDescription(durationInMinutes: number) {
    const hours = Math.floor(durationInMinutes / 60) /* floor rounds down */
    const minutes = durationInMinutes % 60 /* remainder */
    const minutesString = `${minutes} ${minutes > 1 ? "mins" : "min"}`/*  if remainer is 1, return min, else return mins */
    const hoursString = `${hours} ${hours > 1 ? "hrs" : "hr"}` /*  if hours is 1, return hr, else return hrs */
  
    if (hours === 0) return minutesString /* return just the minutes */
    if (minutes === 0) return hoursString /* return just the hours */
    return `${hoursString} ${minutesString}` /* otherwise return both concatenated */
  }

  export function formatTimezoneOffset(timezone: string) {
    return new Intl.DateTimeFormat(undefined, { /* It's initialized with options to specify how dates should be formatted. */
      timeZone: timezone, /* Sets the timezone to use for formatting. This is where you pass the input timezone string. */
      timeZoneName: "shortOffset",/* Specifies that the timezone should be displayed as a short offset (e.g., "UTC-5" instead of "Eastern Standard Time"). */
    }).formatToParts(new Date()).find(part => part.type === "timeZoneName")?.value /* give us timezone name portion from the formatter */
  }
