const fetch = require('node-fetch');
const fs = require("fs");

(async () => {
  console.log("downloading base zip...");
  const res = await fetch("https://github.com/nwtgck/piping-vnc-server-for-windows/archive/refs/heads/master.zip");
  const zipBytes = new Uint8Array(await res.arrayBuffer());
  fs.writeFileSync("./public/piping-vnc-server-for-windows.zip", zipBytes);
  // NOTE: "Content-Length" of zip could not be get in some environment (Netlify + Cloudflare)
  fs.writeFileSync("./src/base-zip.ts", `\
export const BASE_ZIP_BYTE_LENGTH = ${zipBytes.byteLength};
`);
})();
