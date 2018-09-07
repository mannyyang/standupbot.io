import Agenda from 'agenda';

const mongoConnectionString = 'mongodb://mongo:27017/agenda';
const connectionOpts = {
  db: {
    address: mongoConnectionString,
    collection: 'jobs'
  }
};
const agenda = new Agenda(connectionOpts);
const jobTypes = ['slack-message'];

if (jobTypes.length) {
  async function run() {
    // Iterate through each job type
    jobTypes.forEach(type => {
      require(`../jobs/${type}.js`)(agenda);
    });

    // Wait for agenda to connect. Should never fail since connection failures
    // should happen in the `await MongoClient.connect()` call.
    await new Promise(resolve => agenda.once('ready', resolve));

    agenda.start();
  }

  try {
    run();
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
}

export default agenda;
