// HackerCard.tsx
import Link from "next/link"
interface HackerProps {
    id: string,
    user: { _id: string, name: string, profile_pic: string },
    skills: { tech: string[], soft: string[] },
    status: string,
    hackathon: { name: string, id: string }[],
    sem: number,
    branch: string,
    clg: string,
}

export function Card({ hacker }: { hacker: HackerProps }) {
    return (
        <div className="hacker-card">
            <img 
                src={hacker.user.profile_pic} 
                alt={hacker.user.name} 
                className="hacker-image" 
            />
<Link href={`/hacker/${hacker.user._id}`} className="apply-btn">{hacker.user.name}</Link>            <p><strong>Status:</strong> {hacker.status}</p>
            <p><strong>College:</strong> {hacker.clg}</p>
            <p><strong>Branch:</strong> {hacker.branch}</p>
            <p><strong>Semester:</strong> {hacker.sem}</p>
            
            <div>
                <h3>Technical Skills:</h3>
                <ul>
                    {hacker.skills.tech.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                    ))}
                </ul>
                
                <h3>Soft Skills:</h3>
                <ul>
                    {hacker.skills.soft.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h3>Hackathons:</h3>
                <ul>
                    {(hacker.hackathon || []).map(h => (
  <Link href={`/Hackthons/${h.id}`} key={h.id}>{h.name}</Link>
))}

                </ul>
            </div>
            <Link href={`/Hacker/ask/${hacker.id}`} className="apply-btn">Ask to join</Link>
            <Link href={`/Chat/${hacker.id}`} className="apply-btn">Have Conversastion</Link>
        </div>
    )
}

// Main Page Component