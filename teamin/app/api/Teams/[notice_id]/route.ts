import { NextRequest, NextResponse } from "next/server";
import { Wanted } from '../../../../../MDB_Schema/MDB';

interface TeamCardData {
    id: string;
    team_name: string;
    leader: {
        name: string;
        id: string;
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
    hackathon: {
        id: string;
        name: string;
    };
    slots: number;
    status: string;
}

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

function transformWantedToTeamCard(wanted: WantedData): TeamCardData {
    return {
        id: wanted._id,
        team_name: wanted.team?.team_name || 'Unknown Team',
        leader: {
            name: wanted.team?.leader?.name || 'Unknown Leader',
            id: wanted.team?.leader?._id || 'Unknown'
        },
        requirment: wanted.requirements?.map((req) => ({
            skill: {
                soft_skill: req.soft_skill,
                tech_skill: req.skill
            },
            gender: req.gender,
            sem: req.sem,
            branch: req.branch,
            clg: req.clg
        })) || [],
        hackathon: {
            id: wanted.hackathon?._id || '',
            name: wanted.hackathon?.name || 'Unknown Hackathon'
        },
        slots: wanted.requirements?.length || 0,
        status: wanted.status
    };
}

export async function GET(
    req: NextRequest,
    { params }: { params: { notice_id: string } }
) {const par = await params;
    const id =  par.notice_id;
    const wantedData: WantedData = await Wanted.findById(id)
        .select('status requirements')
        .populate({
            path: 'team',
            select: 'team_name leader',
            populate: { path: 'leader', select: '_id name' },
        })
        .populate({ path: 'hackathon', select: '_id name' });

    const transformedTeam = transformWantedToTeamCard(wantedData);
    return NextResponse.json(transformedTeam);
}
