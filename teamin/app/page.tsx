
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function HomePage() {
  // Get session on the server
  const session :any = await getServerSession(authOptions);

  return (
    
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
      {session && 
        <>
          <h2>Welcome, {session.user?.name || session.user?.email}</h2>
          <p>{session.user?.id}</p>
          <img src={session.user?.image || "/default-avatar.png"} alt="Profile Picture" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
          <p>Email: {session.user?.email}</p>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" style={{ padding: "8px 16px", marginTop: "10px" }}>
              Logout
            </button>
          </form>
        </>
      }

    </div>
  );
}
