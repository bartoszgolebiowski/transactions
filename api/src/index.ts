import express from "express";

const app = express();
const port = 5000;

app.use("/", (req, res, next) => {
  res.status(200).send({ data: "Hello from Ornio AS" });
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
