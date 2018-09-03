import axios from "axios";

export function sendChannelMessage(text) {
  return axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: "Schedule executed done"
    }
  );
}
