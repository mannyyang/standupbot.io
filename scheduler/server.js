import express from 'express';
import bodyParser from 'body-parser';
import Agendash from 'agendash';
import agenda from './lib/agenda';

/**
 * Express app
 */
const app = express();

/**
 * Express configurations
 */
app.use(bodyParser.json());

/**
 * Agenda Dashboard Route
 */
app.use('/agenda-dash', Agendash(agenda));

/**
 * Root Route
 */
app.get('/', (req, res) => {
  return res.json({
    payload: 'the home index page'
  });
});

/**
 * Request body structure sent from the stdlib
 * service - the slack middleware.
 *
 * {
 *   command: {},
 *   channel: "general",
 *   user: "mannyyang",
 *   scheduleStr: "every weekday at 11:30 am",
 *   laterSchedule: {
 *      schedules: [{ d: [2, 3, 4, 5, 6], t: [41400] }],
 *      exceptions: [],
 *      error: -1
 *   },
 *   cronStr: '* * * * * *'
 * }
 */
app.post('/schedule', (req, res) => {
  const {
    cronStr,
    laterSchedule,
    scheduleStr,
    channel,
    user,
    command
  } = req.body;

  const job = agenda.create('slack/send-channel-message', { data: 'data' });

  job.repeatEvery(cronStr, {
    timezone: 'America/Los_Angeles'
  });

  job.save();

  return res.json({
    job
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
