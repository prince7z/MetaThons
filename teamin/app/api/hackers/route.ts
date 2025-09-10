import { Listed } from "../../../../MDB_Schema/MDB";
import { NextRequest, NextResponse } from "next/server";


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

const transformToHackerProps = (data: any): HackerProps => {
    return {
        id: data._id.toString(),
        user: {
            id: data.user?._id?.toString() || '',
            User_name: data.user?.name || 'Unknown User',
            img: data.user?.profile_pic || '/default-avatar.png'
        },
        skills: {
            tech: data.skills?.tech || [],
            soft: data.skills?.soft || []
        },
        status: data.status || 'Unknown',
        hackathons: data.hackathon?.map((h: any) => ({
            name: h.name || 'Unnamed Hackathon',
            id: h._id?.toString() || ''
        })) || [],
        sem: data.sem || 0,
        branch: data.branch || 'Unknown',
        clg: data.clg || 'Unknown'
    };
};


// api/hacker?skill=react&skill=node&sem=5

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const skills = searchParams.getAll("skill");  
  const sem = searchParams.get("sem");
  const clg = searchParams.get("clg");  
  const gender = searchParams.get("gender");

  const filters: any = {};

if (skills.length > 0) {

    filters.$and = skills.map(skill => ({
      $or: [
        { "skills.tech": { $regex: new RegExp(skill, "i") } },
        { "skills.soft": { $regex: new RegExp(skill, "i") } }
      ]
    }));
  }

  if (sem) filters.sem = sem;
  if (clg) filters.clg = clg;
  if (gender) filters.gender = gender;
console.log(filters);
  const hackers = await Listed.find(filters)
    .select("status clg branch skills sem _id gender")
    .populate({
      path: "user",
      select: "_id name profile_pic",
    })
    .populate({
      path: "hackathon",
      select: "_id name",
    });

    const hackersProps: HackerProps[] = hackers.map(transformToHackerProps);

  return NextResponse.json(hackers);
}
