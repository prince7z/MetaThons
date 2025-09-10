import { NextRequest, NextResponse } from "next/server";
import {Wanted} from '../../../../MDB_Schema/MDB'

interface TeamCardData {
  id: string;
  team_name: string;
  leader: {
    name:String,
    id:String
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
  hackathon_name: string;
  slots: number;
  status: string;
}

// Interface for the raw data from MongoDB
interface WantedData {
  _id: string;
  status: string;
  requirements: Array<{
    skill: string;
    soft_skill: string;
    gender: 'male' | 'female';
    sem: number;
    branch: string;
    clg: string;
  }>;
  team: {
    _id: string;
    team_name: string;
    leader: {
      _id: string;
      name: string;
    };
  };
  hackathon: {
    _id: string;
    name: string;
  };
}

// Transform function to match TeamCard component interface
function transformWantedToTeamCard(wantedData: WantedData[]): TeamCardData[] {
  return wantedData.map((wanted) => ({
    id: wanted._id,
    team_name: wanted.team?.team_name || 'Unknown Team',
    leader: {name:wanted.team?.leader?.name || 'Unknown Leader',
             id: wanted.team?.leader?._id ||'Unknown'  },
    requirment: wanted.requirements?.map((req) => ({
      skill: {
        soft_skill: req.soft_skill,
        tech_skill: req.skill // Map 'skill' to 'tech_skill'
      },
      gender: req.gender,
      sem: req.sem,
      branch: req.branch,
      clg: req.clg
    })) || [],
    hackathon_name: wanted.hackathon?.name || 'Unknown Hackathon',
    slots: wanted.requirements?.length || 0, // Assuming slots = number of open positions
    status: wanted.status
  }));
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hackathon = searchParams.get('hackathon');
  const tech_stack = searchParams.get('tech_stack');
  const gen = searchParams.get('gen');
  const lead = searchParams.get('lead');

  const filters: any = {};
  if (hackathon) filters.hackathon = hackathon;
  if (lead) filters.team.leader = lead;
  if (gen || tech_stack) {
    filters.requirements = { $elemMatch: {} };
    if (gen) filters.requirements.$elemMatch.gender = gen;
    if (tech_stack) filters.requirements.$elemMatch.skill = tech_stack;
  }

  const wantedData: WantedData[] = await Wanted.find(filters)
    .select('_id status requirements')
    .populate({
      path: 'team',
      select: '_id team_name leader',
      populate: { path: 'leader', select: '_id name' },
    })
    .populate({ path: 'hackathon', select: '_id name' });

  const transformedTeams = transformWantedToTeamCard(wantedData);
  return NextResponse.json(transformedTeams);
}
