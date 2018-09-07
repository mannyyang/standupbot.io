import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: String,
  jobId: String
});
const teamModel = mongoose.model('Team', teamSchema);

// let msg = new teamModel({
//   email: 'ada.lovelace@gmail.com'
// });

export default teamModel;
