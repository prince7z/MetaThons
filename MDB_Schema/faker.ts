import mongoose, { Types } from "mongoose";
import { faker } from "@faker-js/faker";

// Import your models - adjust path as needed
import { User, Team, Hackathon, Listed, Wanted } from "./MDB";

// --- TypeScript Interface Definitions ---

interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profile_pic: string;
    gender: 'male' | 'female';
    sem: number;
    branch: string;
    clg: string;
    tech_SKILLS: string[];
    soft_SKILLS: string[];
    created_at: Date;
    participated_hack: number;
    won: {
        Hackathon_name: string;
        year: number;
        position: number;
    }[];
    listed: Types.ObjectId[];
    notice: { notice_id: Types.ObjectId; status: string }[];
    applied: { notice_id: Types.ObjectId; status: string }[];
    notifications: {
        type: string;
        message: string;
        from: Types.ObjectId;
        created_at: Date;
        notice_id?: Types.ObjectId;
    }[];
}

interface ITeam {
    _id: Types.ObjectId;
    team_name: string;
    leader: Types.ObjectId;
    Hackathon_name: Types.ObjectId;
    members: {
        user: Types.ObjectId;
        skills: string[];
    }[];
    approached: Types.ObjectId[];
    applications: Types.ObjectId[];
    status: string;
}

interface IHackathon {
    _id: Types.ObjectId;
    name: string;
    description: string;
    prize_pool: number;
    Reg_start_date: Date;
    Reg_end_date: Date;
    thumbnail: string;
    location: string;
    rules: string;
    wanted_notices: Types.ObjectId[];
    listed_hackers: Types.ObjectId[];
}

interface IWanted {
    _id: Types.ObjectId;
    team: Types.ObjectId;
    hackathon: Types.ObjectId;
    requirements: {
        skill: string;
        soft_skill: string;
        gender: 'male' | 'female';
        sem: number;
        branch: string;
        clg: string;
    }[];
    status: string;
}

interface IListed {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    hackathon: Types.ObjectId[];
    skills: {
        tech: string[];
        soft: string[];
    };
    sem: number;
    branch: string;
    clg: string;
    status: string;
    created_at: Date;
}

// --- Configuration Constants ---

const MONGO_URI = "mongodb://localhost:27017/TeamDB";

const NUM_USERS = 150;
const NUM_HACKATHONS = 20;
const NUM_TEAMS = 60;
const MAX_MEMBERS_PER_TEAM = 5;
const MAX_HACKATHONS_PER_USER = 3;
const MAX_APPLICATIONS_PER_USER = 8;

// --- Data Pools ---

const TECH_SKILLS = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", "MongoDB", 
    "MySQL", "Flutter", "Swift", "Kotlin", "TensorFlow", "PyTorch", 
    "Docker", "AWS", "Azure", "Git", "HTML/CSS", "TypeScript", "Go",
    "Rust", "Vue.js", "Angular", "Django", "Flask", "Spring Boot",
    "Machine Learning", "Data Science", "Blockchain", "Cybersecurity"
];

const SOFT_SKILLS = [
    "Leadership", "Communication", "Problem Solving", "Teamwork", 
    "Creativity", "Critical Thinking", "Adaptability", "Time Management",
    "Project Management", "Public Speaking", "Negotiation", "Mentoring"
];

const BRANCHES = [
    "Computer Science", "Information Technology", "Electronics", 
    "Mechanical", "Civil", "Electrical", "Chemical", "Aerospace",
    "Data Science", "AI/ML", "Cybersecurity", "Biotechnology"
];

const COLLEGES = [
    "IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Madras", "IIT Kharagpur",
    "BITS Pilani", "NIT Trichy", "NIT Warangal", "IIIT Hyderabad", 
    "Delhi University", "Mumbai University", "VIT Vellore", "Manipal University",
    "SRM University", "Amity University", "Lovely Professional University"
];

const TEAM_STATUSES = ["Active", "Complete", "Looking", "Disbanded"];
const LISTING_STATUSES = ["Active", "Matched", "Expired", "Withdrawn"];
const WANTED_STATUSES = ["Open", "Filled", "Expired", "Cancelled"];

// --- Helper Functions ---

const generateHackathonName = (): string => {
    const prefixes = ["Code", "Hack", "Dev", "Tech", "Innov", "Build", "Create"];
    const suffixes = ["Fest", "Thon", "Quest", "Challenge", "Summit", "Sprint", "Jam"];
    return `${faker.helpers.arrayElement(prefixes)}${faker.helpers.arrayElement(suffixes)} ${faker.date.recent().getFullYear()}`;
};

const generateTeamName = (): string => {
    const adjectives = ["Cyber", "Digital", "Code", "Tech", "Smart", "Quantum", "Neural", "Binary"];
    const nouns = ["Warriors", "Wizards", "Ninjas", "Pirates", "Rebels", "Crushers", "Masters", "Giants"];
    return `${faker.helpers.arrayElement(adjectives)} ${faker.helpers.arrayElement(nouns)}`;
};

// --- Main Seeding Script ---

const seedDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "TeamDB" });
        console.log("✅ Database connected for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Team.deleteMany({});
        await Hackathon.deleteMany({});
        await Listed.deleteMany({});
        await Wanted.deleteMany({});
        console.log("🧹 Cleared existing data.");

        // --- STAGE 1: GENERATE ALL DOCUMENTS IN MEMORY ---

        // 1️⃣ Generate Users
        const users: IUser[] = [];
        for (let i = 0; i < NUM_USERS; i++) {
            const gender = faker.helpers.arrayElement(['male', 'female']);
            const firstName = faker.person.firstName(gender);
            const lastName = faker.person.lastName();
            users.push({
                _id: new mongoose.Types.ObjectId(),
                name: `${firstName} ${lastName}`,
                email: faker.internet.email({ firstName, lastName }).toLowerCase(),
                password: faker.internet.password({ length: 8 }),
                profile_pic: faker.image.avatar(),
                gender,
                sem: faker.number.int({ min: 1, max: 8 }),
                branch: faker.helpers.arrayElement(BRANCHES),
                clg: faker.helpers.arrayElement(COLLEGES),
                tech_SKILLS: faker.helpers.arrayElements(TECH_SKILLS, { min: 3, max: 8 }),
                soft_SKILLS: faker.helpers.arrayElements(SOFT_SKILLS, { min: 2, max: 5 }),
                created_at: faker.date.past({ years: 2 }),
                participated_hack: faker.number.int({ min: 0, max: 15 }),
                won: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
                    Hackathon_name: generateHackathonName(),
                    year: faker.date.past({ years: 3 }).getFullYear(),
                    position: faker.number.int({ min: 1, max: 3 })
                })),
                listed: [],
                notice: [],
                applied: [],
                notifications: [],
            });
        }

        // 2️⃣ Generate Hackathons
        const hackathons: IHackathon[] = [];
        for (let i = 0; i < NUM_HACKATHONS; i++) {
            const regStart = faker.date.future({ years: 0.5 });
            const regEnd = new Date(regStart.getTime() + (faker.number.int({ min: 7, max: 30 }) * 24 * 60 * 60 * 1000));
            
            hackathons.push({
                _id: new mongoose.Types.ObjectId(),
                name: generateHackathonName(),
                description: faker.lorem.paragraphs(2),
                prize_pool: faker.number.int({ min: 10000, max: 500000 }),
                Reg_start_date: regStart,
                Reg_end_date: regEnd,
                thumbnail: faker.image.url({ width: 400, height: 300 }),
                location: faker.location.city(),
                rules: faker.lorem.paragraphs(3),
                wanted_notices: [],
                listed_hackers: [],
            });
        }

        // 3️⃣ Generate Teams
        const teams: ITeam[] = [];
        for (let i = 0; i < NUM_TEAMS; i++) {
            const leader = faker.helpers.arrayElement(users);
            const hackathon = faker.helpers.arrayElement(hackathons);
            const numMembers = faker.number.int({ min: 1, max: MAX_MEMBERS_PER_TEAM });
            
            // Select members (excluding leader to avoid duplicates)
            const availableUsers = users.filter(u => !u._id.equals(leader._id));
            const selectedMembers = faker.helpers.arrayElements(availableUsers, { min: 0, max: numMembers - 1 });
            
            teams.push({
                _id: new mongoose.Types.ObjectId(),
                team_name: generateTeamName(),
                leader: leader._id,
                Hackathon_name: hackathon._id,
                members: [
                    // Leader is always a member
                    {
                        user: leader._id,
                        skills: faker.helpers.arrayElements(leader.tech_SKILLS, { min: 2, max: 4 })
                    },
                    // Other members
                    ...selectedMembers.map(member => ({
                        user: member._id,
                        skills: faker.helpers.arrayElements(member.tech_SKILLS, { min: 2, max: 4 })
                    }))
                ],
                approached: [],
                applications: [],
                status: faker.helpers.arrayElement(TEAM_STATUSES),
            });
        }

        // 4️⃣ Generate Listed entries (Users listing themselves)
        const listed: IListed[] = [];
        users.forEach(user => {
            const participatingHackathons = faker.helpers.arrayElements(hackathons, { 
                min: 0, max: MAX_HACKATHONS_PER_USER 
            });
            
            if (participatingHackathons.length > 0) {
                listed.push({
                    _id: new mongoose.Types.ObjectId(),
                    user: user._id,
                    hackathon: participatingHackathons.map(h => h._id),
                    skills: {
                        tech: user.tech_SKILLS,
                        soft: user.soft_SKILLS
                    },
                    sem: user.sem,
                    branch: user.branch,
                    clg: user.clg,
                    status: faker.helpers.arrayElement(LISTING_STATUSES),
                    created_at: faker.date.recent({ days: 30 }),
                });
            }
        });

        // 5️⃣ Generate Wanted entries (Teams looking for members)
        const wanted: IWanted[] = [];
        teams.forEach(team => {
            // Some teams might have multiple wanted notices
            const numWantedNotices = faker.number.int({ min: 0, max: 3 });
            
            for (let i = 0; i < numWantedNotices; i++) {
                const numRequirements = faker.number.int({ min: 1, max: 3 });
                const requirements = Array.from({ length: numRequirements }, () => ({
                    skill: faker.helpers.arrayElement(TECH_SKILLS),
                    soft_skill: faker.helpers.arrayElement(SOFT_SKILLS),
                    gender: faker.helpers.arrayElement(['male', 'female']),
                    sem: faker.number.int({ min: 1, max: 8 }),
                    branch: faker.helpers.arrayElement(BRANCHES),
                    clg: faker.helpers.arrayElement(COLLEGES),
                }));
                
                wanted.push({
                    _id: new mongoose.Types.ObjectId(),
                    team: team._id,
                    hackathon: team.Hackathon_name,
                    requirements,
                    status: faker.helpers.arrayElement(WANTED_STATUSES),
                });
            }
        });

        console.log("🌱 Generated all documents in memory.");

        // --- STAGE 2: LINK THE DOCUMENTS TOGETHER ---
        
        console.log("🔗 Linking documents...");

        // Create Maps for efficient lookups
        const userMap = new Map(users.map(u => [u._id.toHexString(), u]));
        const hackathonMap = new Map(hackathons.map(h => [h._id.toHexString(), h]));
        const teamMap = new Map(teams.map(t => [t._id.toHexString(), t]));

        // Link Listed entries to users and hackathons
        for (const listEntry of listed) {
            const user = userMap.get(listEntry.user.toHexString());
            if (user) {
                user.listed.push(listEntry._id);
            }
            
            // Add to hackathons
            for (const hackathonId of listEntry.hackathon) {
                const hackathon = hackathonMap.get(hackathonId.toHexString());
                if (hackathon) {
                    hackathon.listed_hackers.push(listEntry._id);
                }
            }
        }

        // Link Wanted entries to teams, hackathons, and create applications/notices
        for (const wantedEntry of wanted) {
            const team = teamMap.get(wantedEntry.team.toHexString());
            const hackathon = hackathonMap.get(wantedEntry.hackathon.toHexString());
            if (team) {
                team.applications.push(wantedEntry._id);
            }
            if (hackathon) {
                hackathon.wanted_notices.push(wantedEntry._id);
            }
            // Some users apply to wanted notices
            const applicants = faker.helpers.arrayElements(users, { min: 0, max: MAX_APPLICATIONS_PER_USER });
            for (const applicant of applicants) {
                // Add to applied array as object with status and notice_id
                applicant.applied.push({ notice_id: wantedEntry._id, status: faker.helpers.arrayElement(['pending', 'accepted', 'rejected']) });
                // Add to notice array as object with status and notice_id (simulate some users being noticed for this wanted)
                if (faker.datatype.boolean()) {
                    applicant.notice.push({ notice_id: wantedEntry._id, status: faker.helpers.arrayElement(['pending', 'accepted', 'rejected']) });
                }
                // Add notification for application, include notice_id
                applicant.notifications.push({
                    type: 'application',
                    message: `Applied to team for hackathon ${hackathon ? hackathon.name : ''}`,
                    from: team ? team.leader : applicant._id,
                    created_at: faker.date.recent({ days: 30 }),
                    notice_id: wantedEntry._id
                });
            }
        }

        // Create some approaches (teams approaching listed users)
        for (const team of teams) {
            const approachedListings = faker.helpers.arrayElements(listed, { min: 0, max: 5 });
            team.approached = approachedListings.map(l => l._id);
            // Notify users who are approached
            for (const listing of approachedListings) {
                const user = userMap.get(listing.user.toHexString());
                if (user) {
                    user.notifications.push({
                        type: 'approach',
                        message: `Team ${team.team_name} approached you for hackathon`,
                        from: team.leader,
                        created_at: faker.date.recent({ days: 30 })
                    });
                }
            }
        }

        // --- STAGE 3: SAVE EVERYTHING TO THE DATABASE ---

        console.log("💾 Saving to database...");

        await User.insertMany(users);
        console.log(`✅ Inserted ${users.length} users`);
        
        await Hackathon.insertMany(hackathons);
        console.log(`✅ Inserted ${hackathons.length} hackathons`);
        
        await Team.insertMany(teams);
        console.log(`✅ Inserted ${teams.length} teams`);
        
        await Listed.insertMany(listed);
        console.log(`✅ Inserted ${listed.length} listed entries`);
        
        await Wanted.insertMany(wanted);
        console.log(`✅ Inserted ${wanted.length} wanted notices`);

        console.log("🚀 Database has been successfully seeded with all relationships!");
        
        // Print summary statistics
        console.log("\n📊 SEEDING SUMMARY:");
        console.log(`👥 Users: ${users.length}`);
        console.log(`🏆 Hackathons: ${hackathons.length}`);
        console.log(`👨‍👩‍👧‍👦 Teams: ${teams.length}`);
        console.log(`📝 Listed entries: ${listed.length}`);
        console.log(`🎯 Wanted notices: ${wanted.length}`);
        console.log(`⚡ Total documents: ${users.length + hackathons.length + teams.length + listed.length + wanted.length}`);

    } catch (error: any) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from database.");
    }
};

// Execute the seeding
seedDatabase();