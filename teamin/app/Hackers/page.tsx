

import { Card } from '../../Component/HackerCard'

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

export default async function HackersPage() {
    

    try {
  const data = (await fetch(`http://localhost:3000/api/hackers`));
        const hackers = await data.json();

        if (!hackers || hackers.length === 0) {
            return (
                <div className="no-data">
                    <p>No hackers found</p>
                </div>
            );
        }


        return (
            <>
                
                <div className="hackers-container">
                    <h1>Hackers Directory</h1>
                    <div className="hackers-grid">
                        {hackers.map((hacker: HackerProps) => (
                            <Card key={hacker.id} hacker={hacker} />
                        ))}
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error('Error fetching hackers:', error);
        return (
            <div className="error-container">
                <h2>Error Loading Data</h2>
                <p>Sorry, there was an issue loading the hackers data.</p>
                <p>Please try again later.</p>
            </div>
        );
    }
}