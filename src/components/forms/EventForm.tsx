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

export default function EventForm() {

    const form = useForm<z.infer<typeof eventFormSchema>>({ /* type safety */
        resolver: zodResolver(eventFormSchema), /* validation */
        defaultValues: {
            isActive: true,
            durationInMinutes: 30
        }
    })

    function onSubmit(values: z.infer<typeof eventFormSchema>) {
        console.log(values)
    }

    return (
        <Form {...form}> {/* form components come from shadcn */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> {/* wrapped the entire form in type safety form declared earlier */}
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
                <Button asChild type="button" variant="outline">
                    <Link href="/events">Cancel</Link>
                </Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
        </Form>
    )
}

