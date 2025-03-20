"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { Copy, CopyCheck, CopyX } from "lucide-react";
import { ComponentProps } from "react";
import { useState } from "react";

type CopyState = "idle" | "copied" | "error"

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean
} /* no longer avail for direct import need to create */

export function CopyEventButton({
    eventId, 
    clerkUserId, 
    ...buttonProps
}: Omit<ButtonProps, "children" | "onClick"> & {eventId: string, clerkUserId: string}){
    
    const [copyState, setCopyState] = useState<CopyState>("idle")
    
    const CopyIcon = getCopyIcon(copyState)
   
    return (
        <Button {...buttonProps} onClick={() => {
            navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`).then(() => {
                setCopyState("copied")
                setTimeout(() => {
                    setCopyState("idle")
                }, 2000)
            }).catch(() => {
                setCopyState("error")
                setTimeout(() => {
                    setCopyState("idle")
                }, 2000)
            })
        }}>
            <CopyIcon className="size-4"/>
            {getChildren(copyState)}
        </Button>
    )
}

function getCopyIcon(copystate: CopyState) {
    switch (copystate) {
        case "idle":
            return Copy
        case "copied":
            return CopyCheck
        case "error":
            return CopyX
    }
}

function getChildren(copystate: CopyState) {
    switch (copystate) {
        case "idle":
            return "Copy Link"
        case "copied":
            return "Copied"
        case "error":
            return "Error"
    }
}