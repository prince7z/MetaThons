import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SessionProvider } from "next-auth/react";


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get session on the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <header style={{ padding: "10px 20px", borderRadius: 20, backgroundColor: "#eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <nav style={{ display: "flex", gap: "20px" }}>
            <Link href="/">Home</Link>
            
          </nav>

          <div>
            {session ? (
              <Link href="/profile">
                <button style={{ padding: "6px 12px" }}>Profile</button>
              </Link>
            ) : (
              <Link href="/login">
                <button style={{ padding: "6px 12px" }}>Login</button>
              </Link>
            )}
          </div>
        </header>
        <main style={{ padding: "20px" }}>{children}</main>

<div style={{bottom:40,position:"fixed",width:"100%"}}>
        <div style={{ padding: "10px 20px", borderRadius: 20, backgroundColor: "#eee", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          
            <Link href="/Hackathons">Hackathons</Link>
            <Link href="/Teams">Teams</Link>
            <Link href="/Hackers">Hackers</Link>
            <Link href="/Chats">Chats</Link>

          

        </div>
        </div>
      </body>
    </html>
  );
}
