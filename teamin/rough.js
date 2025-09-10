// HackerCard.tsx
interface HackerProps {
    id: string,
    user: { id: string, User_name: string, img: string },
    skills: { tech: string[], soft: string[] },
    status: string,
    hackathons: { name: string, id: string }[],
    sem: number,
    branch: string,
    clg: string,
}

export function Card({ hacker }: { hacker: HackerProps }) {
    return (
        <div className="hacker-card">
            <img 
                src={hacker.user.img} 
                alt={hacker.user.User_name} 
                className="hacker-image" 
            />
            <h2>{hacker.user.User_name}</h2>
            <p><strong>Status:</strong> {hacker.status}</p>
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
                    {hacker.hackathons.map((hackathon) => (
                        <li key={hackathon.id}>{hackathon.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

// Main Page Component