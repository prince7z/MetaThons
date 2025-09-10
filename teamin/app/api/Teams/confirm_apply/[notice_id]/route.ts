import { NextRequest } from "next/server";
import { User, Wanted } from "../../../../../../MDB_Schema/MDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: NextRequest,{ params }: { params: { notice_id: string } }) {
    try{const par =await params;
        const notice_id = par.notice_id; 
        const session: any = await getServerSession(authOptions);
        const userlog = session?.user;
        const body  :any =await  req.json();
        const note = body.note;
        if (!userlog) return new Response("Unauthorized", { status: 401 });

        const notice = await Wanted.findById(notice_id);
        const alreadyapplied = Array.isArray(notice?.requests) && notice.requests.some(
            (app: any) => app.user.toString() === userlog.id
        );

        if (alreadyapplied) return new Response("Already applied", { status: 400 });

        await User.updateOne(
            { _id: userlog.id },
            { $push: { applied: { notice_id: notice_id, status: "pending" } } }
        );

        await Wanted.updateOne(
            { _id: notice_id },
            { $push: { requests: { user: userlog.id, note: note } } }
        );

        const wantedDoc = await Wanted.findById(notice_id).populate({ path: "team", select: "leader" });
       console.log("request array", wantedDoc?.requests);
        const leaderId = wantedDoc?.team?.leader?._id;
        if (leaderId) {
            await User.updateOne(
                { _id: leaderId },
                { $push: { notifications: { type: "request", message: `User ${userlog.name} has applied for hackathon ${wantedDoc?.name} and saying: ${note}`, from: userlog.id, notice_id } } }
            );
        }

        return new Response("Application and request submitted notification sent", { status: 200 });
    } 
    catch(e){
        console.log(e);
        return new Response("Internal Server Error", { status: 500 });
    }
}
