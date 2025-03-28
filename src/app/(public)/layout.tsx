
export default function PublicLayout({ children }: { children: React.ReactNode }) { /* layout is a container with some margin */
    return <main className="container my-6">{children}</main>
}