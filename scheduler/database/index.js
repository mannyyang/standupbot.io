import path from "path";
import Datastore from "nedb";

const db = new Datastore({
  filename: path.resolve(__dirname, "db.json"),
  autoload: true
});

// db.ensureIndex({ fieldName: "_id", unique: true }, function(err) {
//   console.error(err);
//   throw err;
// });

let memCached = {};

/**
 * Add new cron job
 * @param {*} job Cron Job
 */
db.addNewJob = (body, job) => {
  const {
    team_id,
    team_domain,
    channel_id,
    channel_name,
    user_id,
    user_name,
    token,
    response_url,
    text
  } = body.command;
  const id = `${body.command.team_id}_${body.command.channel_id}`;
  const doc = {
    _id: id,
    team_id,
    team_domain,
    channel_id,
    channel_name,
    user_id,
    user_name,
    token,
    response_url,
    text,
    enabled: true
  };

  return new Promise((resolve, reject) => {
    db.insert(doc, (err, newDoc) => {
      if (err) return reject(err);

      memCached[id] = job;
      resolve(newDoc);
    });
  });
};

// db.remove({ fruits: 'orange' }, { multi: true }, function (err, numRemoved) {
//   // numRemoved = 3
//   // All planets from the solar system were removed
// });

export default db;
