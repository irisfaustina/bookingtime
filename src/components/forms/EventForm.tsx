"use client"

import { useForm } from "react-hook-form" /* we're trying to use client side hook but in server side component */
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema } from "@/schema/events"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import Link from "next/link" /* handles routing and redirection with useRouter */
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useState, useTransition } from "react"

export default function EventForm({ event }: { event?: { /* pass dynamic data from user input*/
    id: string;
    name: string;
    description?: string;
    durationInMinutes: number;
    isActive: boolean;
}}) {
    const [isDeletePending, startDeleteTransition] = useTransition()
    const form = useForm<z.infer<typeof eventFormSchema>>({ /* type safety */
        resolver: zodResolver(eventFormSchema), /* validation */
        defaultValues: event ?? {
            name: "", /* default values are required for react hook form */
            description: "",
            isActive: true,
            durationInMinutes: 30
        }
    })

    async function onSubmit(values: z.infer<typeof eventFormSchema>) { /* make sure form is working before calling actions */
        const action = event == null ? createEvent : updateEvent.bind(null, event.id) /* update server actions event based on event id */
        const data = await action(values)
        
        if (data.error) { /* root level error returned from server side function */
            form.setError("root", { 
                message: "There was an error saving your event" }) /* set error message */
        }
    }

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
            <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormDescription>
                        The name users will see when booking
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="durationInMinutes"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                        In minutes
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="description"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                    <Textarea className="resize-none h-32" {...field} />
                    </FormControl>
                    <FormDescription>
                        Optional description of the event
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="isActive" /* already set to true returns a value store for form */
            render={({field}) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Switch /* rendering out switch component */
                                checked={field.value} /* set to true by default */
                                onCheckedChange={field.onChange} /* toggle to change update the field value to false */
                                />
                        </FormControl>
                        <FormLabel>Active</FormLabel>
                    </div>
                    <FormDescription>
                        Inactive events will not be visible for users to book
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex gap-2 justify-end">
                {event && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>{/* If you didn't use asChild, Radix would render its default button element as the trigger, which might not match your application's design */}
                            <Button /* becareful linebreak can break asChild and count as a different element */
                            variant="destructiveGhost" 
                            disabled={isDeletePending || form.formState.isSubmitting}>
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your event.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel> {/* cancel delete action */}
                                <AlertDialogAction 
                                disabled={isDeletePending || form.formState.isSubmitting} /* don't allow interaction when pending */
                                variant="destructive" /* modify alertdialog action to include variant prop */
                                onClick={() => {
                                    startDeleteTransition(async () => {
                                        const data = await deleteEvent(event.id) /* delete event */

                                        if (data?.error) {   /* root level error returned from server side function */
                                            form.setError("root", { 
                                                message: "There was an error deleting your event" }) /* set error message */
                                        }
                                    })
                                }}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog> 
                )}
                <Button asChild type="button" variant="outline" disabled={form.formState.isSubmitting}>
                    <Link href="/events">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
            </div>
        </form>
        </Form>
    )
}