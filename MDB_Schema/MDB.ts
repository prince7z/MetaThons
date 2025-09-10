import mongoose, { ConnectOptions } from 'mongoose';

const URL: string = 'mongodb://localhost:27017/TeamDB';

mongoose.connect(URL, { dbName: "TeamDB" } as ConnectOptions)
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB not connected"));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profile_pic: String,
  gender: { type: String, enum: ['male', 'female'] },
  sem: Number,
  branch: String,
  clg: String,
  tech_SKILLS: [String],
  soft_SKILLS: [String],
  created_at: { type: Date, default: Date.now },
  participated_hack: Number,
  won: [{
    Hackathon_name: String,
    year: Number,
    position: Number
  }],
  notice :[{notice_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Wanted' },    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default:'pendiing' },
 }],
  applied: [{notice_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Wanted' },    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default:'pendiing' },
 }],
  listed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listed' }],
  notifications: [
    {
      type: {
        type: String, 
                 // 'request', 'chat', 'hackathon', etc.
      },
      message: String,         // Text of the notification
      from: {                  // Who triggered it (optional)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      notice_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wanted',
      },
    },
  ],
});

const teamSchema = new mongoose.Schema({
  team_name: String,
  leader: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  Hackathon_name: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skills: [String],
  }],
  approached: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listed' }],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wanted' }],
  status: String,
});

const HackathonSchema = new mongoose.Schema({
  name: String,
  description: String,
  prize_pool: Number,
  Reg_start_date: Date,
  Reg_end_date: Date,
  thumbnail: String,
  location: String,
  rules: String,
  wanted_notices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wanted' }],
  listed_hackers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listed' }],
});

const wantedSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
  requirements: [{
    skill: String,
    soft_skill: String,
    gender: { type: String, enum: ['male', 'female'] },
    sem: Number,
    branch: String,
    clg: String,
  }],
  status: String,
  requests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
  }]
});

const listedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hackathon: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
  skills: { tech: [String], soft: [String] },
  sem: Number,
  branch: String,
  clg: String,
  status: String,
  created_at: { type: Date, default: Date.now },
   requests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default:'pendiing' },
  }]
});

const Listed = mongoose.models.Listed || mongoose.model('Listed', listedSchema);
const Wanted = mongoose.models.Wanted || mongoose.model('Wanted', wantedSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Hackathon = mongoose.models.Hackathon || mongoose.model('Hackathon', HackathonSchema);

export { Listed, Wanted, User, Team, Hackathon };
