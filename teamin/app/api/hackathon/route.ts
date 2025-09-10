import { Hackathon } from "../../../../MDB_Schema/MDB";
import { NextRequest, NextResponse } from "next/server";

interface HackathonType {
  _id: string;
  name: string;
  description: string;
  location:String;
  Reg_start_date: string;
  Reg_end_date: string;
  thumbnail: string;
}
export async function GET(req: NextRequest) {
    const {searchParams }= new URL(req.url);
    const location = searchParams.get('location');
    const status = searchParams.get('status');

    const filters :any ={};
    if (location) filters.location = location;
    if (status && status === 'active') {
        filters.Reg_end_date = { $gte: new Date() };
    }
    const hackathons = await Hackathon.find(filters)
  .select('_id name description Reg_start_date Reg_end_date location thumbnail')
  .lean() as unknown as HackathonType[];
    
  return NextResponse.json(hackathons);

}