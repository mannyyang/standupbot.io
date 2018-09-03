import express from "express";
import bodyParser from "body-parser";
import { CronJob } from "cron";
import axios from "axios";
import db from "./database";

const app = express();

/**
 * Express configurations
 */
app.use(bodyParser.json());

/**
 * Root Route
 */
app.get("/", (req, res) => {
  return res.json({
    payload: "the home index page"
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
app.post("/schedule", (req, res) => {
  console.log(`Request Body: ${JSON.stringify(req.body)}`);
  const {
    cronStr,
    laterSchedule,
    scheduleStr,
    channel,
    user,
    command
  } = req.body;

  const job = new CronJob(
    cronStr,
    onComplete => {
      console.log("cron job executed");
      sendMessage();
    },
    onComplete
  );
  job.start();

  /**
   * Add new schedule to data base and add job
   * to in-memory cache.
   */
  db.addNewJob(req.body, job)
    .then(data => {
      return res.sendStatus(200);
    })
    .catch(err => {
      res.statusCode = 500;
      return res.send(err);
    });
});

function sendMessage(text) {
  axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: "Schedule executed done"
    }
  );
}

function onComplete() {}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
