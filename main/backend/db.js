// db.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { MONGO_URI } = require('./config');

mongoose.connect(MONGO_URI);


// Define the User schema
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Define the Project schema
const ProjectSchema = new Schema({
  projectName: { type: String, required: true },
  data: { type: String }, 
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: Schema.Types.String, default: null } 
});

// Create the models
const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

module.exports = { User, Project };