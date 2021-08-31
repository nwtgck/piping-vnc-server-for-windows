const fs = require("fs").promises;
const path = require("path");
const JSZip = require("jszip");

const zip = new JSZip();

(async () => {
  console.log("generating base zip...");
  const dirPaths = [".."];
  while (dirPaths.length !== 0) {
    const dirPath = dirPaths.pop();
    const fileNames = await fs.readdir(dirPath);
    for (const fileName of fileNames) {
      const filePath = path.join(dirPath, fileName);
      // Not include zip and not add to search scope
      if (filePath === "../.DS_Store" ||
          filePath === "../.git" ||
          filePath === "../download-page" ||
          filePath === "../.gitattributes" ||
          filePath === "../.github"
      ) {
        continue;
      }
      const stat = await fs.lstat(filePath);
      // If directory
      if (stat.isDirectory()) {
        // Add this directory to search scope
        dirPaths.push(filePath);
      }
      if (!stat.isDirectory()) {
        const replacedPath = filePath.replace(/^..\//, "");
        console.log("zipping: ", replacedPath);
        zip.file(replacedPath, await fs.readFile(filePath));
      }
    }
  }
  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });
  await fs.writeFile("./public/piping-vnc-server-for-windows.zip", zipBuffer);
  await fs.writeFile("./src/base-zip.ts", `\
export const BASE_ZIP_BYTE_LENGTH = ${zipBuffer.byteLength};
`);
})();
