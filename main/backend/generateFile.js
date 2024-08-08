//generateFile.js
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

// Ensure the "codes" directory exists
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

// Asynchronous function to generate a file with unique ID
const generateFile = async (format, content) => {
  const jobId = uuid(); // Generate a unique ID
  const filename = `${jobId}.${format}`; // Create filename with format
  const filepath = path.join(dirCodes, filename); // Full path to the file

  // Write file asynchronously
  await fs.promises.writeFile(filepath, content);

  return filepath; // Return the path to the generated file
};

module.exports = {
  generateFile,
};
