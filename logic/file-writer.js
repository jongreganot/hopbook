import { converBase64ToImage } from "convert-base64-to-image";

export class fileWriter {
  constructor() {}

  writeFileToImageFolder(base64, filename) {
    const pathToSaveImage = `./images/${filename}`;

    converBase64ToImage(base64, pathToSaveImage);
  }
}
