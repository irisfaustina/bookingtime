"use client"

import { useFieldArray, useForm } from "react-hook-form" /* we're trying to use client side hook but in server side component */
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Fragment, useState, useTransition } from "react"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { scheduleFormSchema } from "@/schema/schedule"
import { timeToInt } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatTimezoneOffset } from "@/lib/formatters"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { saveSchedule } from "@/server/actions/schedule"

type Availability = {
    startTime: string;
    endTime: string;
    dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
}

export default function ScheduleForm({ 
    schedule,
}: { 
    schedule?: { /* pass dynamic data from user input*/
        timezone: string;
        availabilities: Availability[]
    }
  }) {
    const [successMessage, setSuccessMessage] = useState<string>()
    const form = useForm<z.infer<typeof scheduleFormSchema>>({ /* type safety */
        resolver: zodResolver(scheduleFormSchema), /* validation */
        defaultValues: {
            timezone: 
                schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone, /* gives all current time zone user is in */
            availabilities: schedule?.availabilities.toSorted((a, b) => { 
                return timeToInt(a.startTime) - timeToInt(b.startTime)
            }),
        }
    })

    async function onSubmit(values: z.infer<typeof scheduleFormSchema>) { /* make sure form is working before calling actions */
        const data = await saveSchedule(values)
        
        if (data?.error) { /* root level error returned from server side function */
            form.setError("root", { 
                message: "There was an error saving your schedule" 
            }) /* set error message */
        } else {
            setSuccessMessage("Schedule saved successfully!")
        }
    }

    const { 
        append: addAvailability, 
        remove: removeAvailability, 
        fields: availabilityFields, 
    } = useFieldArray({
        name: "availabilities",
        control: form.control
    })

    const groupedAvailabilityFields = Object.groupBy(
        availabilityFields.map((field, index) => ({ /* add index to each field */
            ...field,
            index
        })),
        availability => availability.dayOfWeek /* group by day of week */
    ) 
        
    return (
        <Form {...form}> {/* form components come from shadcn */}
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
        > {/* wrapped the entire form in type safety form declared earlier */}
            {form.formState.errors.root && (
                <div className="text-destructive text-sm">
                    {form.formState.errors.root.message}
                </div>
            )}
            {successMessage && (
                <div className="text-green-500 text-sm">
                    {successMessage}
                </div>
            )}
            <FormField 
            control={form.control}
            name="timezone"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>{/* thing that we click on to open select box */}
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent> {/* loop through timezones */}
                            {Intl.supportedValuesOf("timeZone").map((timezone) => (
                                <SelectItem key={timezone} value={timezone}> {/* value is the value that will be sent to the server */}
                                    {timezone}
                                    {` (${formatTimezoneOffset(timezone)})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
            />

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => ( /* When you map over an array and return multiple elements, React requires each element to have a unique key */
                    <Fragment key={dayOfWeek}> {/* in this case, you're returning two div elements for each iteration. The Fragment allows you to group these elements together so that you can assign a single key to the group. */}
                        <div className="capitalize text-sm font-semibold">{dayOfWeek.substring(0, 3)}</div>
                        <div className="flex flex-col gap-2">
                            <Button type="button" variant="outline" onClick={() => {
                                addAvailability({
                                    dayOfWeek,
                                    startTime: "09:00",
                                    endTime: "17:00",
                                })
                            }}>Add Availability<Plus className="size-4"/></Button>
                            {groupedAvailabilityFields[dayOfWeek]?.map((field, labelIndex) => (
                                <div className="flex flex-col gap-1" key={field.id}>
                                <div className="flex items-center gap-2">
                                <FormField 
                                control={form.control}
                                name={`availabilities.${field.index}.startTime`}/* startTime is the name of the field */
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                            aria-label={`${dayOfWeek} Start Time${labelIndex + 1}`} {...field} 
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <span className="text-center">-</span>
                                <FormField 
                                control={form.control}
                                name={`availabilities.${field.index}.endTime`}/* endTime is the name of the field */
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                            aria-label={`${dayOfWeek} End Time${labelIndex + 1}`} {...field} 
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <Button type="button" className="size-8 p-.5 flex items-center justify-center" variant="destructiveGhost" onClick={() => removeAvailability(field.index)}>
                                    <X className="size-4" />
                                </Button>
                                </div>
                                <FormMessage>
                                    {form.formState.errors.availabilities?.[field.index]?.message ||
                                     form.formState.errors.availabilities?.[field.index]?.root?.message ||
                                     form.formState.errors.availabilities?.[field.index]?.startTime?.message ||
                                     form.formState.errors.availabilities?.[field.index]?.endTime?.message}
                                </FormMessage>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                ))}
            </div>
            <div className="flex gap-2 justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
            </div>
        </form>
        </Form>
    )
}