import ImageKit from "imagekit";
import { envConfig } from "./env.config";

export const imagekitInstance = new ImageKit({
  publicKey: envConfig.imagekit.publicKey,
  privateKey: envConfig.imagekit.privateKey,
  urlEndpoint: envConfig.imagekit.urlEndpoint,
});
