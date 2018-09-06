import axios from "axios";

function sendChannelMessage(text) {
  return axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: "Schedule executed done"
    }
  );
}

module.exports = function(agenda) {
  agenda.define("slack/send-channel-message", (job, done) => {
    console.log('sent message');
    done();
  });

  // agenda.define("slack/", (job, done) => {
  //   // Etc
  // });
};
