export default async function User({ params }: { params: { user_id: string } }) {
  const Id =  await params;
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

  const data = await fetch(`http://localhost:3000/api/hackers/${Id.user_id}`);
  const user: userProp = await data.json();

  return (
    <div>
      <div>
        <img src={user.avatar} alt={user.name} />
        <div>
          <h1>{user.name}</h1>
          <p>{user.contact}</p>
        </div>
      </div>

      <div>
        <div>
          <h2>Personal Info</h2>
          <p>Semester: {user.sem}</p>
          <p>Gender: {user.gender}</p>
          <p>Branch: {user.branch}</p>
          <p>College: {user.clg}</p>
          <p>Hackathon Experience: {user.experince_of_Hacks} Hacks</p>
        </div>

        <div>
          <h2>Skills</h2>
          <div>
            <h3>Technical:</h3>
            <div>
              {user.Skills.tech.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h3>Soft Skills:</h3>
            <div>
              {user.Skills.soft.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Hackathon Wins</h2>
        <div>
          {user.won.map((win, index) => (
            <div key={index}>
              <p>{win.Hackathon_name}</p>
              <p>Year: {win.year} | Position: {win.position}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Listed Hackathons</h2>
        <div>
          {user.listed_for.map((listing, index) => (
            <div key={index}>
              <>
                {listing.hackathon.map((hack, idx) => (
                  <span key={hack.id || idx}>{hack.name}</span>
                ))}
                <p>Status: {listing.status}</p>
              </>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



