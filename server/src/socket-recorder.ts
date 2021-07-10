import * as fs from "fs/promises";

export default class SocketRecorder {
  private socket;
  private directoryName: string;

  constructor(socket) {
    this.socket = socket;
    console.log("A user is connected");

    this.socket.on("capture", this.capture.bind(this));
    this.socket.on("stop-capture", this.stopCapture.bind(this));
  }

  private get recordDirectoryPath(): string {
    return this.directoryName ? `./records/${this.directoryName}` : "";
  }

  private async capture(imageDataUrl: string, frameId: number) {
    // Create the directory where we will store every capture
    if (!this.directoryName) {
      console.log("Start recording");
      this.directoryName = new Date().getTime().toString();

      try {
        await fs.mkdir(this.recordDirectoryPath);
        console.log(
          `New directory '${this.directoryName}' successfully created.`
        );
      } catch (e) {
        console.log(e);
      }
    }

    try {
      await fs.writeFile(
        `${this.recordDirectoryPath}/screenshot-${frameId}.png`,
        Buffer.from(imageDataUrl.split(",")[1], "base64")
      );
    } catch (e) {
      console.log(e);
    }
  }

  private async stopCapture() {
    const nbFiles = await this.countFiles(this.recordDirectoryPath);
    const msg = `Stop recording with '${nbFiles}' files stored in '${this.directoryName}'.`;
    console.log(msg);
    this.socket.emit("record-stopped", { nbFiles });
    this.directoryName = null;
  }

  async countFiles(directoryPath): Promise<number> {
    try {
      const files = await fs.readdir(directoryPath);
      return files.length;
    } catch (e) {
      console.log(e);
    }
  }
}
