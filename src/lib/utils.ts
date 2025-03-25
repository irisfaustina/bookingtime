import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeToInt(time: string) {
  return parseFloat(time.replace(":", ".")) /* convert time to flaot, anything larger on the timescale will be a larger number, like 23:52 becomes 23.52 > 22.51 */
}