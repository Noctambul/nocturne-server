import express from "express";
import cors from "cors";
import multer from "multer";
// import * as fs from "fs/promises";
import fs from "fs";

const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const app = express();

app.use(cors());

//start app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

app.post("/upload", upload.none(), async (req, res) => {
  const frameId = req.body.frameId;
  const sessionName = req.body.sessionName;
  const frameDataUrl = req.body.frameDataUrl;
  const directoryPath = recordDirectoryPath(sessionName);

  // Check if the record directory already exists
  if (!fs.existsSync(directoryPath)) {
    console.log(`Create record directory path at ${directoryPath}`);
    fs.mkdirSync(directoryPath);
  }

  try {
    fs.writeFileSync(
      `${directoryPath}/screenshot-${frameId}.png`,
      Buffer.from(frameDataUrl.split(",")[1], "base64")
    );
  } catch (e) {
    console.error(e);
  }

  console.log(`frameId: ${frameId} | sessionName: ${sessionName}`);
});

function recordDirectoryPath(directoryName): string {
  return `./records/${directoryName}`;
}
