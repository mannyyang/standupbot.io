const lib = require("lib")({ token: process.env.STDLIB_TOKEN });
const later = require("later");
const axios = require("axios");

function sendMessage(text) {
  axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: 'Schedule executed done'
    }
  );
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
  text = "",
  command = {},
  botToken = null,
  callback
) => {
  const [action, ...scheduleArr] = text.split(" ");
  const schedule = scheduleArr.join(" ");
  const laterSchedule = later.parse.text(schedule);
  let count = 0;

  // Use UTC as timezone limiation.
  later.date.UTC();
  
  // Send startup message from the inputted schedule.
  const schedulerTimer = later.setInterval(sendMessage, laterSchedule);
  
  setTimeout(() => {
    schedulerTimer.clear();
    callback(null, {
    text: `Action: ${action}
    Schedule Text: ${schedule}`,
      attachments: [
        // You can customize your messages with attachments.
        // See https://api.slack.com/docs/message-attachments for more info.
      ],
      command: command
    });
  }, 5000);
};
