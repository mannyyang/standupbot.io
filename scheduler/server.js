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

  console.log(`channel: ${channel}`);
  console.log(`user: ${user}`);
  console.log(`laterSchedule: ${JSON.stringify(laterSchedule)}`);
  console.log(`scheduleStr: ${scheduleStr}`);
  console.log(`command: ${JSON.stringify(command)}`);

  /**
   * channel: CCJJ4RYH2
   * user: UCJQN5150
   * command: {
      token: 'xHJq6SH868mmsop0X4Rv2A0X',
      team_id: 'TCKRSS1QX',
      team_domain: 'standup-bot-io',
      channel_id: 'CCJJ4RYH2',
      channel_name: 'general',
      user_id: 'UCJQN5150',
      user_name: 'me1',
      command: '/standup',
      text: 'schedule every minute',
      response_url:
        'https://hooks.slack.com/commands/TCKRSS1QX/433984345125/hb0kAhO1gszAmatzxxPbx9ie',
      trigger_id: '433614489012.427876885847.56ec38efdb0b686a9c9989e1cb4c0562'
    };
   * 
   */

  const teamDomain = command.team_domain || 'standup-bot-io';
  const channelName = command.channel_name || 'general';
  const job = agenda.create(`slack/message/${teamDomain}/${channelName}`, {
    data: 'data'
  });

  job.repeatEvery(scheduleStr, {
    skipImmediate: true,
    timezone: 'America/Los_Angeles'
  });

  job.save();

  return res.json({
    job
  });
});

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
