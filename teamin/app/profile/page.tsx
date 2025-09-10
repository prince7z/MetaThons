import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import {User} from "../../../MDB_Schema/MDB"

const styles = {
    container: {
        maxWidth: '800px',
        margin: '32px auto',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start'
    },
    profileImage: {
        width: '128px',
        height: '128px',
        borderRadius: '50%',
        border: '4px solid #3b82f6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    content: {
        flex: 1
    },
    name: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px'
    },
    email: {
        color: '#3b82f6',
        marginBottom: '16px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        color: '#4b5563'
    },
    infoLabel: {
        fontWeight: 600,
        color: '#1f2937'
    },
    section: {
        marginTop: '24px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
    },
    teamName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '4px'
    },
    hackathonName: {
        color: '#3b82f6',
        fontSize: '14px',
        marginBottom: '8px'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '500',
        display: 'inline-block'
    },
    requirementList: {
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px'
    },
    requestItem: {
        padding: '8px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
};

export default async function Page() {
    const session :any = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
        return (
            <div style={styles.container}>
                <div>Please sign in</div>
                <Link href="/api/auth/signin">Sign In</Link>
            </div>
        );
    }

    const res = await User.findById(user.id)
      .select("-password -__v -notifications") .populate({
    path: "applied.notice_id",
    select: "team hackathon requirements status requests",
    populate: [
      {
        path: "team",
        select: "_id team_name leader",
        populate: { path: "leader", select: "_id name" }
      },
      { path: "hackathon", select: "_id name" },
      {
        path: "requests",
        select: "user note",
        populate: { path: "user", select: "_id name" }
      }
    ]
  })
      .populate({
        path: "notice.notice_id",
        select: "team hackathon requirements status requests",
        populate: [
          {
            path: "team",
            select: "_id team_name leader",
            populate: { path: "leader", select: "_id name" }
          },
          { path: "hackathon", select: "_id name" },
          {
            path: "requests",
            select: "user note",
            populate: { path: "user", select: "_id name" }
          }
        ]
      })
      .populate({
        path: "listed",
        select: "hackathon status skills sem branch clg",
        populate: { path: "hackathon", select: "_id name" }
      });



    const data = JSON.parse(JSON.stringify(res));



    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Link href="/profile/update">Update Profile</Link>
                <img 
                    src={data.profile_pic || '/default-avatar.jpg'} 
                    alt={data.name}
                    style={styles.profileImage}
                />
                <div style={styles.content}>
                    <h1 style={styles.name}>{data.name}</h1>
                    <p style={styles.email}>{data.email}</p>
                    <div style={styles.infoGrid}>
                        <div>
                            <p><span style={styles.infoLabel}>Gender: </span>{data.gender}</p>
                            <p><span style={styles.infoLabel}>Semester: </span>{data.sem}</p>
                            <p><span style={styles.infoLabel}>Branch: </span>{data.branch}</p>
                        </div>
                        <div>
                            <p><span style={styles.infoLabel}>College: </span>{data.clg}</p>
                            <p><span style={styles.infoLabel}>Joined: </span>
                                {new Date(data.created_at).toLocaleDateString()}
                            </p>
                            <p><span style={styles.infoLabel}>Hackathons: </span>{data.participated_hack}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Technical Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {data.tech_SKILLS.map((skill: string, index: number) => (
                        <span key={index} style={{
                            backgroundColor: '#e5e7eb',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '14px'
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Soft Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {data.soft_SKILLS.map((skill: string, index: number) => (
                        <span key={index} style={{
                            backgroundColor: '#dbeafe',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '14px'
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {data.won && data.won.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Achievements</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.won.map((achievement: any, index: number) => (
                            <div key={index} style={{
                                backgroundColor: '#f3f4f6',
                                padding: '12px',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 600 }}>{achievement.Hackathon_name}</span>
                                    <span style={{ color: '#6b7280', marginLeft: '8px' }}>({achievement.year})</span>
                                </div>
                                <div style={{
                                    backgroundColor: achievement.position === 1 ? '#fef3c7' : 
                                                   achievement.position === 2 ? '#e5e7eb' : '#fee2e2',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '14px'
                                }}>
                                    {achievement.position === 1 ? '🥇 First' : 
                                     achievement.position === 2 ? '🥈 Second' : '🥉 Third'} Place
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Your Notices Section */}
            {data.notice && data.notice.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Your Team Notices</h2>
                    {data.notice.map((notice: any, index: number) => (
                        <div key={index} style={styles.card}>
                            <div style={styles.flexBetween}>
                                <div>
                                    <div style={styles.teamName}>{notice.notice_id.team.team_name}</div>
                                    <div style={styles.hackathonName}>{notice.notice_id.hackathon.name}</div>
                                </div>
                                <div style={{
                                    ...styles.statusBadge,
                                    backgroundColor: notice.notice_id.status === 'open' ? '#dcfce7' : '#fee2e2',
                                    color: notice.notice_id.status === 'open' ? '#166534' : '#991b1b'
                                }}>
                                    {notice.notice_id.status}
                                </div>
                            </div>
                            
                            <div style={styles.requirementList}>
                                <div style={{fontWeight: 500, marginBottom: '8px'}}>Requirements:</div>
                                {notice.notice_id.requirements.map((req: any, reqIndex: number) => (
                                    <div key={reqIndex} style={{marginBottom: '8px', fontSize: '14px'}}>
                                        <div>• Tech Skill: {req.skill}</div>
                                        <div>• Soft Skill: {req.soft_skill}</div>
                                        <div>• Preferences: {req.gender}, Sem {req.sem}, {req.branch}, {req.clg}</div>
                                    </div>
                                ))}
                            </div>

                            {notice.notice_id.requests && notice.notice_id.requests.length > 0 && (
                                <div style={{marginTop: '16px'}}>
                                    <div style={{fontWeight: 500, marginBottom: '8px'}}>Requests:</div>
                                    {notice.notice_id.requests.map((request: any, reqIndex: number) => (
                                        <div key={reqIndex} style={styles.requestItem}>
                                            <Link href={`/Hackers/${request.user._id}`}>{request.user.name}</Link>
                                            <Link href={`/Chat/${request.user._id}`}>Chat</Link>
                                            <div style={{fontSize: '14px', color: '#6b7280'}}>{request.note}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Applications Section */}
            {data.applied && data.applied.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>You aplied for</h2>
                    {data.applied.map((application: any, index: number) => (
                        <div key={index} style={styles.card}>
                            <div style={styles.flexBetween}>
                                <div>
                                    <div style={styles.teamName}>{application.notice_id.team.team_name}</div>
                                    <div style={styles.hackathonName}>{application.notice_id.hackathon.name}</div>
                                </div>
                                <div style={{
                                    ...styles.statusBadge,
                                    backgroundColor: 
                                        application.notice_id.status === 'accepted' ? '#dcfce7' :
                                        application.notice_id.status === 'rejected' ? '#fee2e2' :
                                        '#f3f4f6',
                                    color: 
                                        application.notice_id.status === 'accepted' ? '#166534' :
                                        application.notice_id.status === 'rejected' ? '#991b1b' :
                                        '#374151'
                                }}>
                                    {application.notice_id.status}
                                </div>
                                <br></br>
                                <div style={{
                                    ...styles.statusBadge,
                                    backgroundColor: 
                                        application.notice_id.status === 'accepted' ? '#dcfce7' :
                                        application.notice_id.status === 'rejected' ? '#fee2e2' :
                                        '#f3f4f6',
                                    color: 
                                        application.notice_id.status === 'accepted' ? '#166534' :
                                        application.notice_id.status === 'rejected' ? '#991b1b' :
                                        '#374151'
                                }}>
                                    {application.status}
                                </div>
                            </div>
                            
                            <div style={styles.requirementList}>
                                <div style={{fontWeight: 500, marginBottom: '8px'}}>Position Requirements:</div>
                                {application.notice_id.requirements.map((req: any, reqIndex: number) => (
                                    <div key={reqIndex} style={{marginBottom: '8px', fontSize: '14px'}}>
                                        <div>• Tech Skill: {req.skill}</div>
                                        <div>• Soft Skill: {req.soft_skill}</div>
                                        <div>• Preferences: {req.gender}, Sem {req.sem}, {req.branch}, {req.clg}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Listed Profile Section */}
            {data.listed && data.listed.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Your Listed Profiles</h2>
                    {data.listed.map((listing: any, index: number) => (
                        <div key={index} style={styles.card}>
                            <div style={styles.flexBetween}>
                                <div>
                                    <div style={styles.teamName}>Listed for {listing.hackathon.name}</div>
                                    <div style={{
                                        ...styles.statusBadge,
                                        backgroundColor: 
                                            listing.status === 'available' ? '#dcfce7' :
                                            listing.status === 'unavailable' ? '#fee2e2' :
                                            '#f3f4f6',
                                        color: 
                                            listing.status === 'available' ? '#166534' :
                                            listing.status === 'unavailable' ? '#991b1b' :
                                            '#374151',
                                        marginTop: '8px'
                                    }}>
                                        {listing.status}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={styles.requirementList}>
                                <div style={{fontWeight: 500, marginBottom: '8px'}}>Your Profile:</div>
                                <div style={{marginBottom: '8px', fontSize: '14px'}}>
                                    <div>• Technical Skills: {Array.isArray(listing.skills?.tech) ? listing.skills.tech.join(', ') : ''}</div>
                                    <div>• Soft Skills: {Array.isArray(listing.skills?.soft) ? listing.skills.soft.join(', ') : ''}</div>
                                    <div>• Semester: {listing.sem}</div>
                                    <div>• Branch: {listing.branch}</div>
                                    <div>• College: {listing.clg}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/*
{
  "_id": "68af53b8e15753f110efc405",
  "name": "Isaac Hahn",
  "email": "isaac_hahn@gmail.com",
  "profile_pic": "https://avatars.githubusercontent.com/u/33716645",
  "gender": "male",
  "sem": 2,
  "branch": "Electronics",
  "clg": "IIT Kanpur",
  "tech_SKILLS": [
    "Docker",
    "Vue.js",
    "Blockchain",
    "Angular",
    "Machine Learning",
    "AWS",
    "Cybersecurity",
    "Rust"
  ],
  "soft_SKILLS": [
    "Negotiation",
    "Creativity",
    "Project Management",
    "Adaptability",
    "Problem Solving"
  ],
  "created_at": "2024-06-02T13:44:29.760Z",
  "participated_hack": 5,
  "won": [
    {
      "Hackathon_name": "DevFest 2025",
      "year": 2023,
      "position": 3,
      "_id": "68af53b9e15753f110efca46"
    },
    {
      "Hackathon_name": "DevJam 2025",
      "year": 2024,
      "position": 3,
      "_id": "68af53b9e15753f110efca47"
    }
  ],
  "notice": [
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52d",
        "team": {
          "_id": "68af53b8e15753f110efc45f",
          "team_name": "Cyber Pirates",
          "leader": {
            "_id": "68af53b8e15753f110efc3f6",
            "name": "Bill Stiedemann"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc41c",
          "name": "DevQuest 2025"
        },
        "requirements": [
          {
            "skill": "C++",
            "soft_skill": "Communication",
            "gender": "male",
            "sem": 2,
            "branch": "Biotechnology",
            "clg": "IIT Kanpur",
            "_id": "68af53b9e15753f110efcd64"
          }
        ],
        "status": "Open",
        "requests": [
          {
            "user": {
              "_id": "68af53b8e15753f110efc405",
              "name": "Isaac Hahn"
            },
            "note": "hey, wanna join check out my profile",
            "_id": "68afe558315eeb515d259864"
          }
        ]
      },
      "status": "accepted",
      "_id": "68af53b9e15753f110efca48"
    },
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52f",
        "team": {
          "_id": "68af53b8e15753f110efc461",
          "team_name": "Neural Ninjas",
          "leader": {
            "_id": "68af53b8e15753f110efc416",
            "name": "Eduardo Hettinger"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc427",
          "name": "DevFest 2025"
        },
        "requirements": [
          {
            "skill": "Go",
            "soft_skill": "Negotiation",
            "gender": "female",
            "sem": 7,
            "branch": "Civil",
            "clg": "Manipal University",
            "_id": "68af53b9e15753f110efcd69"
          },
          {
            "skill": "Java",
            "soft_skill": "Negotiation",
            "gender": "male",
            "sem": 4,
            "branch": "AI/ML",
            "clg": "Delhi University",
            "_id": "68af53b9e15753f110efcd6a"
          }
        ],
        "status": "Cancelled",
        "requests": [
          {
            "user": {
              "_id": "68af53b8e15753f110efc405",
              "name": "Isaac Hahn"
            },
            "note": "hey, wanna join check out my profile",
            "_id": "68afe57d315eeb515d25988c"
          }
        ]
      },
      "status": "accepted",
      "_id": "68af53b9e15753f110efca49"
    }
  ],
  "applied": [
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52a",
        "team": {
          "_id": "68af53b8e15753f110efc45e",
          "team_name": "Neural Ninjas",
          "leader": {
            "_id": "68af53b8e15753f110efc410",
            "name": "Patti Rau"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc429",
          "name": "TechThon 2025"
        },
        "requirements": [
          {
            "skill": "Vue.js",
            "soft_skill": "Public Speaking",
            "gender": "male",
            "sem": 2,
            "branch": "Aerospace",
            "clg": "BITS Pilani",
            "_id": "68af53b9e15753f110efcd5c"
          },
          {
            "skill": "TensorFlow",
            "soft_skill": "Leadership",
            "gender": "female",
            "sem": 7,
            "branch": "Civil",
            "clg": "NIT Trichy",
            "_id": "68af53b9e15753f110efcd5d"
          }
        ],
        "status": "Expired",
        "requests": []
      },
      "status": "accepted",
      "_id": "68af53b9e15753f110efca4a"
    },
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52d",
        "team": {
          "_id": "68af53b8e15753f110efc45f",
          "team_name": "Cyber Pirates",
          "leader": {
            "_id": "68af53b8e15753f110efc3f6",
            "name": "Bill Stiedemann"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc41c",
          "name": "DevQuest 2025"
        },
        "requirements": [
          {
            "skill": "C++",
            "soft_skill": "Communication",
            "gender": "male",
            "sem": 2,
            "branch": "Biotechnology",
            "clg": "IIT Kanpur",
            "_id": "68af53b9e15753f110efcd64"
          }
        ],
        "status": "Open",
        "requests": [
          {
            "user": {
              "_id": "68af53b8e15753f110efc405",
              "name": "Isaac Hahn"
            },
            "note": "hey, wanna join check out my profile",
            "_id": "68afe558315eeb515d259864"
          }
        ]
      },
      "status": "rejected",
      "_id": "68af53b9e15753f110efca4b"
    },
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52f",
        "team": {
          "_id": "68af53b8e15753f110efc461",
          "team_name": "Neural Ninjas",
          "leader": {
            "_id": "68af53b8e15753f110efc416",
            "name": "Eduardo Hettinger"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc427",
          "name": "DevFest 2025"
        },
        "requirements": [
          {
            "skill": "Go",
            "soft_skill": "Negotiation",
            "gender": "female",
            "sem": 7,
            "branch": "Civil",
            "clg": "Manipal University",
            "_id": "68af53b9e15753f110efcd69"
          },
          {
            "skill": "Java",
            "soft_skill": "Negotiation",
            "gender": "male",
            "sem": 4,
            "branch": "AI/ML",
            "clg": "Delhi University",
            "_id": "68af53b9e15753f110efcd6a"
          }
        ],
        "status": "Cancelled",
        "requests": [
          {
            "user": {
              "_id": "68af53b8e15753f110efc405",
              "name": "Isaac Hahn"
            },
            "note": "hey, wanna join check out my profile",
            "_id": "68afe57d315eeb515d25988c"
          }
        ]
      },
      "status": "rejected",
      "_id": "68af53b9e15753f110efca4c"
    },
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52d",
        "team": {
          "_id": "68af53b8e15753f110efc45f",
          "team_name": "Cyber Pirates",
          "leader": {
            "_id": "68af53b8e15753f110efc3f6",
            "name": "Bill Stiedemann"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc41c",
          "name": "DevQuest 2025"
        },
        "requirements": [
          {
            "skill": "C++",
            "soft_skill": "Communication",
            "gender": "male",
            "sem": 2,
            "branch": "Biotechnology",
            "clg": "IIT Kanpur",
            "_id": "68af53b9e15753f110efcd64"
          }
        ],
        "status": "Open",
        "requests": [
          {
            "user": {
              "_id": "68af53b8e15753f110efc405",
              "name": "Isaac Hahn"
            },
            "note": "hey, wanna join check out my profile",
            "_id": "68afe558315eeb515d259864"
          }
        ]
      },
      "status": "pending",
      "_id": "68afe558315eeb515d259862"
    },
    {
      "notice_id": {
        "_id": "68af53b8e15753f110efc52f",
        "team": {
          "_id": "68af53b8e15753f110efc461",
          "team_name": "Neural Ninjas",
          "leader": {
            "_id": "68af53b8e15753f110efc416",
            "name": "Eduardo Hettinger"
          }
        },
        "hackathon": {
          "_id": "68af53b8e15753f110efc427",
          "name": "DevFest 2025"
        },
        "requirements": [
          {
            "skill": "Go",
            "soft_skill": "Negotiation",
            "gender": "female",
            "sem": 7,
            "branch": "Civil",
            "clg": "Manipal University",
            "_id": "68af53b9e15753f110efcd69"
          },
          {
            "skill": "Java",
            "soft_skill": "Negotiation",
            "gender": "male",
            "sem": 4,
            "branch": "AI/ML",
            "clg": "Delhi University",
            "_id": "68af53b9e15753f110efcd6a"
          }
        ],
        "status": "Cancelled",
        "requests": [
          {
            "user": {
              "_id": "68af53b8e15753f110efc405",
              "name": "Isaac Hahn"
            },
            "note": "hey, wanna join check out my profile",
            "_id": "68afe57d315eeb515d25988c"
          }
        ]
      },
      "status": "pending",
      "_id": "68afe57d315eeb515d25988a"
    }
  ],
  "listed": [
    {
      "skills": {
        "tech": [
          "Docker",
          "Vue.js",
          "Blockchain",
          "Angular",
          "Machine Learning",
          "AWS",
          "Cybersecurity",
          "Rust"
        ],
        "soft": [
          "Negotiation",
          "Creativity",
          "Project Management",
          "Adaptability",
          "Problem Solving"
        ]
      },
      "_id": "68af53b8e15753f110efc4ce",
      "hackathon": [
        {
          "_id": "68af53b8e15753f110efc42c",
          "name": "BuildJam 2025"
        },
        {
          "_id": "68af53b8e15753f110efc427",
          "name": "DevFest 2025"
        },
        {
          "_id": "68af53b8e15753f110efc41f",
          "name": "DevSummit 2025"
        }
      ],
      "sem": 2,
      "branch": "Electronics",
      "clg": "IIT Kanpur",
      "status": "Expired"
    }
  ]
}*/