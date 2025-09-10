
import HackathonCard from '../../Component/HackathonCard'

interface HackathonType {
  _id: string;
  name: string;
  description: string;
  location:string;
  Reg_start_date: string;
  Reg_end_date: string;
  thumbnail: string;
}

export default async function HackathonPage() {
try{
const data = (await fetch(`http://localhost:3000/api/hackathon`));
const hackathons = await data.json();
  return (
    <div>
      {hackathons.map((hackathon :HackathonType) => (
        <HackathonCard key={hackathon._id} {...hackathon} />
      ))}
    </div>
  );
  }catch(e){
    console.log(e)
    return(<>error somthing</>)
  }
}

