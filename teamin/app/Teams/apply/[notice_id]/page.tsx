"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

// Extend the session user type to include 'id'
declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
  interface Session {
    user: User;
  }
}

interface TeamCardData {
  id: string;
  team_name: string;
  leader: {
    name: string;
    id: string;
  };
  requirment: Array<{
    skill: {
      soft_skill: string;
      tech_skill: string;
    };
    gender: string;
    sem: number;
    branch: string;
    clg: string;
  }>;
  hackathon: {
    id: string;
    name: string;
  };
  slots: number;
  status: string;
}

export default function rough({ params }: { params: { notice_id: string } }) {

  return (
    <SessionProvider>
      <Component params={params} />
    </SessionProvider>
  );
}


 function Component({ params }: { params: { notice_id: string } }) {
  const { data: session, status } = useSession();
  const [note, setNote] = useState("hey, wanna join check out my profile");
  const [applicationData, setApplicationData] = useState<TeamCardData | null>(null);
 const par =  params;
 const notice_id =  par.notice_id;

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/Teams/${notice_id}`);
      const data = await res.json();
      setApplicationData(data);
    }
    fetchData();
  }, [notice_id]);

  async function SendReq(notice_id: string) {
    if (!session) {
      alert("You need to log in first!");
      signIn(); 
      return;
    }

    const response2 = await fetch(`/api/Teams/confirm_apply/${notice_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note: note,
        userId: session.user?.id,
      }),
    });

    if (response2.status === 200) alert("Applied Successfully");
    else if (response2.status === 401) alert("Unauthorized");
    else if (response2.status === 500)  console.log("Error",response2) ,alert("Internal Server Error");
    else if (response2.status === 400) alert("Already applied");
  }

  if (status === "loading") return <p>Checking login...</p>;
  if (!applicationData) return <p>Loading application data...</p>;

  return (
    <div className="confirmation-card">
      <h2>Confirm Application</h2>

      {!session ? (
        <>
          <p>You must be logged in to apply.</p>
          <button onClick={() => signIn()}>Login</button>
        </>
      ) : (
        <>
          <p><strong>Logged in as:</strong> {session.user.name} ({session.user.email})</p>
          {session.user.image && <img src={session.user.image} alt="profile" width={50} />}
        </>
      )}

      <p><strong>Team Name:</strong> {applicationData.team_name}</p>
      <p><strong>Leader:</strong> {applicationData.leader.name}</p>
      <p>{applicationData.leader.name} will reach out to you soon by mail or chat</p>

      <p><strong>Hackathon:</strong> {applicationData.hackathon.name}</p>
      <p><strong>Status:</strong> {applicationData.status}</p>

      <h3>Requirements</h3>
      <ul>
        {applicationData.requirment.map((req, idx) => (
          <li key={idx}>
            <strong>Tech Skill:</strong> {req.skill.tech_skill},&nbsp;
            <strong>Soft Skill:</strong> {req.skill.soft_skill},&nbsp;
            <strong>Gender:</strong> {req.gender},&nbsp;
            <strong>Semester:</strong> {req.sem},&nbsp;
            <strong>Branch:</strong> {req.branch},&nbsp;
            <strong>College:</strong> {req.clg}
          </li>
        ))}
      </ul>

      <p><strong>Slots:</strong> {applicationData.slots}</p>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        disabled={applicationData.status === "Expired"}
        onClick={() => SendReq(applicationData.id)}
        className="apply-button"
      >
        Apply Now
      </button>

      {applicationData.status === "Closed" && <p>This application is closed.</p>}
    </div>
  );
}
