import TeamCard from "../../Component/TeamCard";



export default async function Page() {
  try {
    // Fetch data from MongoDB
    const res = await fetch(`http://localhost:3000/api/Teams`);
    
    const data = await res.json();
    

    return (
      <div>
        
      <div>
        {data.map((team:any) => (
          <TeamCard key={team.id}  team={{...team, leader: {...team.leader, id: team.leader.id.toString()}}} />
        ))}
      </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching teams:', error);
    return <div>Error loading teams</div>;
  }
}

