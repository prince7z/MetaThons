"use client";
import { useEffect ,useState } from "react";
import {User} from "../../../../MDB_Schema/MDB"
import { SessionProvider, useSession } from "next-auth/react";

export default function profile(){

    return(
        <SessionProvider  >
            <Page />
        </SessionProvider>
    )
}

 function Page() { 
    const [dataa, setDataa] = useState(null);
    const { data: session, status } = useSession();
    const user:any =session?.user;
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not logged in</p>;
useEffect(() =>{
const fetchData = async () => {
  const res = await fetch(`/api/Hackers/${user.id}`);
  const data = await res.json();
  setDataa(data);
};
  fetchData();
}, [])


    return (
        <div>
            <pre>{JSON.stringify(dataa  , null, 2)}</pre>
            {/* */}
        </div>
    );
}