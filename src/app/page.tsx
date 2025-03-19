import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  
  const { userId } = await auth()
  if (userId != null) redirect("/events") /* redirect to  application if signed in */

  return (
    <div className="text-center container my-4 mx-auto">
      <h1 className="text-3xl mb-4">Fancy Home Page</h1>
      <div className="flex gap-2 justify-center">
        <Button asChild><SignInButton /></Button> {/* wrap around as child so the styling is defined exactly as we want/inherited from css */}
        <Button asChild><SignUpButton /></Button>
      </div>
    </div>
  )
}
