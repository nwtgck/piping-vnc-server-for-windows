<template>
  <div id="app">
    <input type="text" v-model="tunnelPath">
    <button @click="download">Download</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import JSZip from "jszip";
import * as path from "path";

// Find config.ini path
function findConfigIniPath(zip: JSZip): string | undefined {
  for (const [zipPath, ] of Object.entries(zip.files)) {
    const isRootFile = !path.dirname(zipPath).includes("/");
    const fileName = path.basename(zipPath);
    if (isRootFile && fileName === "config.ini") {
      return zipPath;
    }
  }
  return undefined;
}

function downloadBlob(blob: Blob, name: string) {
  const aTag = document.createElement("a");
  aTag.href = URL.createObjectURL(blob);
  aTag.download = name;
  aTag.click();
}

function generateRandomString(length: number): string {
  const alphas  = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const chars   = [...alphas, ...numbers];

  const randomArr = window.crypto.getRandomValues(new Uint32Array(length));
  return Array.from(randomArr).map(n => chars[n % chars.length]).join('');
}

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  tunnelPathLength = 16;
  tunnelPath: string = generateRandomString(this.tunnelPathLength);

  async download() {
    const zipRes = await fetch("./piping-vnc-server-for-windows.zip");
    const zip = await JSZip.loadAsync(await zipRes.blob());
    const configIniPath = findConfigIniPath(zip);
    console.debug("config.ini path:", configIniPath);
    if (configIniPath !== undefined) {
      zip.remove(configIniPath);
      zip.file(configIniPath, this.configInitContent);
    }
    const modifiedZipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    });
    console.log(modifiedZipBlob);
    downloadBlob(modifiedZipBlob, "piping-vnc-server-for-windows.zip");
  }

  get configInitContent(): string {
    return `\
; Path used in piping-tunnel
tunnel_path=${this.tunnelPath}
; Piping Server URL
piping_server_url=https://ppng.io
`;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
