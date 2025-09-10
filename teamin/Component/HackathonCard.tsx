import Link from "next/link";

interface HackathonType {
  _id: string;
  name: string;
  description: string;
  location:String;
  Reg_start_date: string | Date;
  Reg_end_date: string | Date;
  thumbnail: string;
}

const HackathonCard = (hackathon: HackathonType) => {
  const formatDate = (date: string | Date) => {
    if (typeof date === "string") return date;
    if (date instanceof Date) return date.toLocaleDateString();
    return "";
  };

  return (
    <div className="hackathon-card">
      <div key={hackathon._id.toString()} className="hackathon-card">
        <img src={hackathon.thumbnail} alt={hackathon.name} className="hackathon-image" />
        <h2>{hackathon.name}</h2>
        <p>{hackathon.description}</p>
        <p>{hackathon.location}</p>
        <p>From: {formatDate(hackathon.Reg_start_date)}</p>
        <p>To: {formatDate(hackathon.Reg_end_date)}</p>
        <Link href={`/Teams/${hackathon._id}`}>Find Teams</Link>
        <Link href={`/Hackers/${hackathon._id}`}>Find Hackers</Link>
      </div>
    </div>
  );
};

export default HackathonCard;
