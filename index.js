import fs from "fs";
import { delay, initClient, removeDirectory, sendText, sendImageWithText } from "./wa.js";

/**
 * Make session command
 *
 * @param {string} sessionId
 * @returns {Promise<void>}
 **/
const makeSessionCommand = async (sessionId) => {
  if (!sessionId) {
    console.error("Invalid session id!");
    process.exit(1);
  }

  try {
    await initClient(sessionId);
    console.info(`Session id (${sessionId}) created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating session: ", error);
  }
};

/**
 * Delete session command
 *
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
const deleteSessionCommand = async (sessionId) => {
  if (!sessionId) {
    console.error("Invalid session id!");
    process.exit(1);
  }

  try {
    const path = process.cwd() + `/tokens/${sessionId}`;

    if (!fs.existsSync(path)) {
      console.error("Session id not found!");
      process.exit(1);
    }

    removeDirectory(path);
    console.info(`Session id (${sessionId}) deleted successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error deleting session: ", error);
  }
};

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max - min + 1))
}

/**
 * Send message blast command
 *
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
const sendMessageBlastCommand = async (sessionId, file) => {
  if (!sessionId) {
    console.error("Invalid session id!");
    process.exit(1);
  }

  if (!fs.existsSync("blast.txt")) {
    console.error("File blast.txt is not found!");
    process.exit(1);
  }

  if (!fs.existsSync(file)) {
    console.error("File blast.json is not found!");
    process.exit(1);
  }

  const blast = fs.readFileSync("blast.txt", "utf8");
  const blastNumbers = JSON.parse(fs.readFileSync(file, "utf8"));

  const client = await initClient(sessionId);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < blastNumbers.length; i++) {
    const number = blastNumbers[i]["nomor_hp"];
    const nama_sekolah = blastNumbers[i]["nama_peserta"];
    let dynamicBlast = blast.replaceAll("{nama_peserta}", nama_sekolah);
    try {
      const validNumber = `${number}@c.us`;

      await sendImageWithText(
        client,
        validNumber,
        "./image.png",
        dynamicBlast
      )
      console.info(`Message successfully sent to: ${validNumber}`);
      success++;
    } catch (error) {
      console.error("Error sending message to: ", number);
      failed++;
    }

    await delay(generateRandomInteger(10000, 15000));
  }

  console.info(`Success: ${success}, Failed: ${failed}`);
  process.exit(0);
};


const sendMessage = async (sessionId, number, blast) => {
  if (!sessionId) {
    console.error("Invalid session id!");
    process.exit(1);
  }
  const client = await initClient(sessionId);

  try {
    const validNumber = `${number}@c.us`;

    await sendText(client, validNumber, blast);
    console.info(`Message successfully sent to: ${validNumber}`);
  } catch (error) {
    console.error("Error sending message to: ", number);
  }

  process.exit(0);
};


/**
 * Execute command
 */
(() => {
  const [state, input, file] = process.argv.slice(2);

  switch (state) {
    case "session":
      makeSessionCommand(input);
      break;
    case "delete-session":
      deleteSessionCommand(input);
      break;
    case "send-message-blast":
      sendMessageBlastCommand(input, file);
      break;
    case "send-message":
      let inputArray = input.split('_');
      sendMessage(inputArray[0], inputArray[1], inputArray[2]);
      break;
    default:
      console.info("Invalid command!");
  }
})();
