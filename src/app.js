// import { createServer} from "https";
import { createServer } from "http";
import { app } from "./appsub.js";

const httpServer = createServer(app);

const port = process.env.PORT || 3050;

httpServer.listen(port, async () => {
  console.log("Server listening on port " + port);
});


app.post('/job', async (req, res) => {
  const jobId = await createJob(req.body.data);
  res.json({ jobId });
});

app.get('/jobs/:id', async (req, res) => {
  const jobId = req.params.id;
  const jobStatus = await getJobStatus(jobId);
  res.json(jobStatus);
});







