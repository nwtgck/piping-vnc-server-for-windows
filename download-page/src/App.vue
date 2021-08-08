<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        Piping VNC Server for Windows
      </div>
      <v-spacer></v-spacer>
      <a href="https://github.com/nwtgck/piping-vnc-server-for-windows" target="_blank" style="font-size: 1.4rem">
      </a>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>
          <v-btn @click="download" x-large :loading="downloadInProgress">
            <v-icon left dark>
              {{ icons.mdiDownload }}
            </v-icon>
            Download zip
          </v-btn>
          <div class="grey--text mb-2">
            The zip file contains UltraVNC under <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text">GNU/GPL license </a>.
            <a href="https://github.com/nwtgck/piping-vnc-server-for-windows" target="_blank" class="grey--text mb-2">
              <font-awesome-icon :icon="['fab', 'github']" style="margin-right: 0.3rem" />Source code
            </a>
          </div>
        </p>
        <p>
          <h3>
            <v-icon>{{ icons.mdiLaptop }}</v-icon>
            URL for controller
          </h3>
          <a :href="pipingVncUrl" target="_blank">
            {{ pipingVncUrl }}
            <v-icon color="blue">
              {{ icons.mdiOpenInNew }}
            </v-icon>
          </a>
        </p>

        <v-expansion-panels :elevation="1">
          <v-expansion-panel >
            <v-expansion-panel-header>
              Detail config
              <template v-slot:actions>
                <v-icon>
                  {{ icons.mdiCogOutline }}
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field label="Piping Server" v-model="pipingServerUrl" />
              <v-text-field label="Tunnel path" v-model="tunnelPath" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JSZip from "jszip";
import * as path from "path";
import {mdiDownload, mdiOpenInNew, mdiCogOutline, mdiLaptop} from "@mdi/js";

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

// TODO: download progress in percentage
@Component({
  components: {},
})
export default class App extends Vue {
  pipingServerUrl: string = "https://ppng.io";
  tunnelPathLength = 16;
  tunnelPath: string = generateRandomString(this.tunnelPathLength);
  downloadInProgress = false;
  icons = {
    mdiDownload,
    mdiOpenInNew,
    mdiCogOutline,
    mdiLaptop,
  };

  async download() {
    try {
      this.downloadInProgress = true;
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
    } finally {
      this.downloadInProgress = false;
    }
  }

  get configInitContent(): string {
    return `\
; Path used in piping-tunnel
tunnel_path=${this.tunnelPath}
; Piping Server URL
piping_server_url=${this.pipingServerUrl}
`;
  }

  get pipingVncUrl(): string {
    return `https://piping-vnc.nwtgck.org/vnc.html#?server=${encodeURIComponent(this.pipingServerUrl)}&cs_path=${this.tunnelPath}/cs&sc_path=${this.tunnelPath}/sc`;
  }
}
</script>
