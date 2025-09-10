import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../MDB_Schema/MDB";

interface userProp {
  name: string;
  avatar: string;
  contact: string;
  sem: number;
  gender: string;
  Skills: {
    tech: string[];
    soft: string[];
  };
  branch: string;
  clg: string;
  experince_of_Hacks: number;
  won: {
    Hackathon_name: string;
    year: number;
    position: number;
  }[];
  listed_for: {
    id: string;
    hackathon: [{
      id: string;
      name: string;
    }];
    status: string;
  }[];
}

function transformUser(user: any): userProp {
  return {
    name: user.name,
    avatar: user.profile_pic,
    contact: user.email,
    sem: user.sem,
    gender: user.gender,
    Skills: {
      tech: user.tech_SKILLS || [],
      soft: user.soft_SKILLS || [],
    },
    branch: user.branch,
    clg: user.clg,
    experince_of_Hacks: user.participated_hack || 0,
    won: user.won?.map((w: any) => ({
      Hackathon_name: w.Hackathon_name,
      year: w.year,
      position: w.position,
    })) || [],
    listed_for: user.listed?.map((l: any) => ({
      id: l._id?.toString() || "",
      hackathon: Array.isArray(l.hackathon)
        ? l.hackathon.map((h: any) => ({
            id: h?._id?.toString() || "",
            name: h?.name || ""
          }))
        : [],
      status: l.status || "",
    })) || [],
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const { userid } = await params;
  console.log("finding for", userid);

  const rawUser = await User.findById(userid)
    .select(
      "name email profile_pic gender sem branch clg tech_SKILLS soft_SKILLS participated_hack won listed"
    )
    .lean()
    .populate({
      path: "listed",
      select: "_id status hackathon",
      populate: {
        path: "hackathon",
        select: "_id name",
        
      },
    })
    .exec();



    // .populate({
    //   path: "user",
    //   select: "_id name profile_pic",
    // })
    // .populate({
    //   path: "hackathon",
    //   select: "_id name",
    // });





  if (!rawUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userData: userProp = transformUser(rawUser);
  return NextResponse.json( userData );
}
