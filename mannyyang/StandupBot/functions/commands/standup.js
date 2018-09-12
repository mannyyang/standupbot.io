const lib = require('lib')({ token: process.env.STDLIB_TOKEN });
const later = require('later');
const axios = require('axios');

function schedulePost(data) {
  return axios.post('http://84371dcd.ngrok.io/schedule', data);
}

/**
 * /standup
 *
 *  Root command for scheduling a stand up.
 *
 *   See https://api.slack.com/slash-commands for more details.
 *
 * @param {string} user The user id of the user that invoked this command (name is usable as well)
 * @param {string} channel The channel id the command was executed in (name is usable as well)
 * @param {string} text The text contents of the command
 * @param {object} command The full Slack command object
 * @param {string} botToken The bot token for the Slack bot you have activated
 * @returns {object}
 */
module.exports = (
  user,
  channel,
  text = '',
  command = {},
  botToken = null,
  callback
) => {
  const [action, ...scheduleArr] = text.split(' ');
  const scheduleStr = scheduleArr.join(' ');
  const laterSchedule = later.parse.text(scheduleStr);
  const schedule = laterSchedule.schedules[0];

  let seconds = '*';
  let minutes = '*';
  let hours = '*';
  let daysCron = '*';

  if (schedule) {
    if (schedule.hasOwnProperty('d')) {
      const days = laterSchedule.schedules[0].d.join(',');
      daysCron = days.length > 0 ? days : '1-5';
    }

    if (schedule.hasOwnProperty('t')) {
      const time = schedule.t[0];
      hours = Math.floor(time / 3600);
      minutes = (time/60) % 60;
      seconds = time % 60;
    } else {
      hours = schedule.h ? schedule.h.join(',') : '*';
      minutes = schedule.m ? schedule.m.join(',') : '*';
      seconds = schedule.s ? schedule.s.join(',') : '*';
    }
  }

  const cron = `${minutes} ${hours} ${daysCron} * *`;

  console.log(cron);

  schedulePost({
    command,
    channel,
    user,
    scheduleStr,
    laterSchedule,
    cronStr: cron
  })
    .then(res => {
      callback(null, {
        text: `Action: ${action}
        Schedule Text: ${scheduleStr}`,
        attachments: [
          // You can customize your messages with attachments.
          // See https://api.slack.com/docs/message-attachments for more info.
        ],
        command: command
      });
    })
    .catch(err => {
      callback(err, null);
    });
};
