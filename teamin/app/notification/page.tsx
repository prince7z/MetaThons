import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import {User} from "../../../MDB_Schema/MDB";


export default async function NotificationPage() {
    const session :any = await getServerSession(authOptions);

    if (!session) {
        return <div>login first</div>;
    }

    const userlog = await session?.user;
  console.log(session);
    if (!userlog) return new Response("Unauthorized", { status: 401 });

const data = await User.findById(userlog.id)
  .select("notifications")
  .populate({
    path: "notifications.from",
    select: "name profile_pic notice_id"
  });
  const notifications = data?.notifications || [];
return (
    <section style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
        <h1 style={{ marginBottom: "1.5rem", fontSize: "2rem", fontWeight: 700 }}>Notifications</h1>
        {notifications.length === 0 ? (
            <p style={{ color: "#888" }}>You have no notifications.</p>
        ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
                {notifications.map((notification: any) => (
                    <li key={notification._id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid #eee" }}>
                        <img
                            src={notification.from.profile_pic}
                            alt={notification.from.name}
                            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #eee" }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                                <Link href={`/Hackers/${notification.from._id}`}>{notification.from.name}</Link>
                            </h3>
                            <p style={{ margin: "0.5rem 0", color: "#333" }}>{notification.message}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <Link href={`/chat/${notification.from._id}`} style={{ color: "#0070f3", textDecoration: "underline" }}>
                                    Have conversation
                                </Link>
                                <small style={{ color: "#aaa" }}>{new Date(notification.created_at).toLocaleString()}</small>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </section>
);
}