import Link from "next/link";
import React from "react";

interface TeamCardProps {
  team: {
    id: string;
    team_name: string;
    leader: {name:String,id:string};
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
    hackathon_name: string;
    slots: number;
    status: string;
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => (
  <div className="team-card">
    <h2>{team.team_name}</h2>
    <p ><strong>Leader:</strong> <Link href={`/Hackers/${team.leader.id}`}>{team.leader.name}</Link></p>
    <p><strong>Hackathon:</strong> {team.hackathon_name}</p>
    <p><strong>Slots:</strong> {team.slots}</p>
    <p><strong>Status:</strong> {team.status}</p>
    <div>
      <h3>Requirements:</h3>
      {team.requirment.map((req, idx) => (
        <div key={idx} className="requirement">
          <p><strong>Soft Skill:</strong> {req.skill.soft_skill}</p>
          <p><strong>Tech Skill:</strong> {req.skill.tech_skill}</p>
          <p><strong>Gender:</strong> {req.gender}</p>
          <p><strong>Semester:</strong> {req.sem}</p>
          <p><strong>Branch:</strong> {req.branch}</p>
          <p><strong>College:</strong> {req.clg}</p>
        </div>
      ))}
    </div>
    <Link href={`/Teams/apply/${team.id}`} className="apply-btn">Apply</Link>
    
     <Link href={`/Chat/${team.leader.id}`} className="apply-anon-btn">Chat</Link>

  </div>
);

export default TeamCard;