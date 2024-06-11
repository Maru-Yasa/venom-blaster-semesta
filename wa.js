import fs from "fs";
import path from "path";
import venom, { Whatsapp } from "venom-bot";

/**
 * Initialize client
 *
 * @param {string} sessionName
 * @returns {Promise<Whatsapp>}
 */
export const initClient = async (sessionName) => {
  const client = await venom.create({
    session: sessionName,
  });

  return client;
};

/**
 * Send text message
 *
 * @param {Whatsapp} client
 * @param {string} to
 * @param {string} message
 * @returns {Promise<void>}
 */
export const sendText = async (client, to, message) => {
  // Send text message
  try {
    return await client.sendTfext(to, message);
  } catch (error) {
    console.log("Error sending message: ", error);
  }
};

export const sendImageWithText = async (client, to, image, message) => {
  try {
    return await client.sendImage(
      to,
      image,
      'image-name',
      message
    )
  } catch (error) {
    console.log("Error sending message: ", error);
  }
}

/**
 * Remove directory
 *
 * @param {string} dirPath
 * @returns {void}
 */
export const removeDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  fs.readdirSync(dirPath).forEach((file) => {
    const curPath = path.join(dirPath, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      removeDirectory(curPath);

      return;
    }

    fs.unlinkSync(curPath);
  });

  fs.rmdirSync(dirPath);
};

/**
 * Delay function
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
