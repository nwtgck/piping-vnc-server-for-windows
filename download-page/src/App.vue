<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn @click="goTop" text class="text-none">
          Piping VNC Server for Windows
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-btn href="https://github.com/nwtgck/piping-vnc-server-for-windows" text class="text-none" target="_blank">
          <font-awesome-icon :icon="['fab', 'github']" style="margin-right: 0.3rem" />
          {{ strings.source_code }}
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <v-select v-model="language"
                  :items="availableLanguages"
                  label="Language"
                  item-text="str"
                  item-value="lang"
                  style="margin-top: 1.5rem"
        />
      </div>
    </v-app-bar>

    <v-main>
      <v-container style="padding-top: 2rem">
        <p>
          <div style="margin: 1rem 0" :class="isSomeFragmentQueryFilled ? 'blue--text' : 'grey--text'">
            {{ pipingCsPath }} {{ pipingScPath }}
          </div>
          <v-btn @click="download" x-large :loading="downloadAndModifyInProgress" style="margin-bottom: 0.5rem; margin-right: 2rem" color="blue lighten-2">
            <v-icon left dark>
              {{ icons.mdiDownload }}
            </v-icon>
            {{ strings.download_zip }}
          </v-btn>
          <v-btn @click="copyDownloadLink" x-large style="margin-bottom: 0.5rem">
            <v-icon left dark>
              {{ icons.mdiContentCopy }}
            </v-icon>
            {{ strings.copy_download_link }}
          </v-btn>
          <v-progress-linear :value="downloadAndModifyProgress" :style="{ visibility: downloadAndModifyInProgress ? null : 'hidden' }"/>
          <div class="grey--text mb-2" v-html="strings.gpl_notice_html" />
        </p>
        <p style="margin-bottom: 2rem">
          <a :href="pipingVncUrl" target="_blank">
            <v-icon>{{ icons.mdiLaptop }}</v-icon>
            {{ strings.open_piping_vnc_to_control_remotely }}
            <v-icon color="blue">
              {{ icons.mdiOpenInNew }}
            </v-icon>
          </a>
        </p>

        <div>
          <v-checkbox v-model="encryptsOpensslAesCtr">
            <template v-slot:label>
              {{ strings.e2e_encryption }}
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon right v-bind="attrs" v-on="on">{{ icons.mdiInformation }}</v-icon>
                </template>
                <pre>{{ strings.e2ee_info }}</pre>
              </v-tooltip>
            </template>
          </v-checkbox>
          <v-text-field v-if="encryptsOpensslAesCtr"
                        :label="strings.e2ee_passphrase"
                        v-model="e2eePassphrase"
                        :type="showsE2eePassphrase ? 'text' : 'password'"
                        :append-icon="showsE2eePassphrase ? icons.mdiEye : icons.mdiEyeOff"
                        @click:append="showsE2eePassphrase = !showsE2eePassphrase"
          />
        </div>

        <v-expansion-panels :elevation="1">
          <v-expansion-panel >
            <v-expansion-panel-header>
              {{ strings.detail_config }}
              <template v-slot:actions>
                <v-icon>
                  {{ icons.mdiCogOutline }}
                </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field label="Piping Server" v-model="pipingServerUrl" />
              <v-text-field label="Tunnel client-to-server path" v-model="pipingCsPath" />
              <v-text-field label="Tunnel server-to-client path" v-model="pipingScPath" />
              <h3>
                config.ini
                <v-icon v-if="encryptsOpensslAesCtr" @click="showsE2eePassphrase = !showsE2eePassphrase">
                  {{ showsE2eePassphrase ? icons.mdiEye : icons.mdiEyeOff }}
                </v-icon>
              </h3>
              <pre>{{ !encryptsOpensslAesCtr || showsE2eePassphrase ?
                  configInitContent :
                  configInitContent.replace(`e2ee_passphrase=${e2eePassphrase}`, `e2ee_passphrase=${"*".repeat(e2eePassphrase.length)}`)
              }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" :timeout="2000" top color="blue">
      <v-icon left dark>
        {{ icons.mdiContentCopy }}
      </v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import JSZip from "jszip";
import * as path from "path";
import {mdiCogOutline, mdiContentCopy, mdiDownload, mdiEye, mdiEyeOff, mdiLaptop, mdiOpenInNew, mdiInformation} from "@mdi/js";
import {BASE_ZIP_BYTE_LENGTH} from "@/base-zip";
import clipboardCopy from "clipboard-copy";
import * as t from "io-ts";
import {globalStore} from "@/vue-global";
import {strings} from "@/strings";
import {keys} from "@/local-storage-keys";

const baseZipUrl = "./piping-vnc-server-for-windows.zip";

// NOTE: Should not use this for piping-vnc-web parameter.
const e2eeParamType = t.type({
  cipher_type: t.literal("openssl-aes-256-ctr"),
  pass: t.string,
  // NOTE: openssl-aes-256-ctr, pbkdf2 iter and hash are hard coded
  pbkdf2: t.type({
    iter: t.literal(100000),
    hash: t.literal("sha256")
  }),
});

// Find config.ini path
function findConfigIniPath(zip: JSZip): { rootDirPath: string, configInitPath: string } | undefined {
  for (const [zipPath, ] of Object.entries(zip.files)) {
    const isRootFile = !path.dirname(zipPath).includes("/");
    const fileName = path.basename(zipPath);
    if (isRootFile && fileName === "config.ini") {
      return { rootDirPath: path.dirname(zipPath), configInitPath: zipPath };
    }
  }
  return undefined;
}

function parseHashAsQuery(): URLSearchParams {
  const url = new URL(`a://a${location.hash.substring(1)}`);
  return url.searchParams;
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

type Language = 'en' | 'ja';

@Component({
  components: {},
})
export default class App extends Vue {
  pipingServerUrl: string = parseHashAsQuery().get("server") ?? "https://ppng.io";
  tunnelPathLength = 16;
  pipingCsPath: string = parseHashAsQuery().get("cs_path") ?? generateRandomString(this.tunnelPathLength);
  pipingScPath: string = parseHashAsQuery().get("sc_path") ?? generateRandomString(this.tunnelPathLength);
  encryptsOpensslAesCtr: boolean = false;
  e2eePassphrase: string = generateRandomString(64);
  showsE2eePassphrase: boolean = false;
  downloadAndModifyInProgress = false;
  icons = {
    mdiDownload,
    mdiOpenInNew,
    mdiCogOutline,
    mdiLaptop,
    mdiContentCopy,
    mdiEye,
    mdiEyeOff,
    mdiInformation,
  };
  // 0 ~ 100
  baseZipProgress: number = 0;
  // 0 ~ 100
  zippingProgress: number = 0;
  snackbar = false;
  snackbarText = "";
  availableLanguages: readonly {lang: Language, str: string}[] = [
    {lang: 'en', str: 'English'},
    {lang: 'ja', str: '日本語'},
  ];

  set language(l: string){
    globalStore.language = l;
    // Store to Local Storage
    window.localStorage.setItem(keys.language, l);
  }
  get language(): string {
    return globalStore.language;
  }

  mounted() {
    const e2eeRaw = parseHashAsQuery().get("e2ee");
    if (e2eeRaw !== null) {
      const e2eeParamEither = e2eeParamType.decode(JSON.parse(e2eeRaw));
      if (e2eeParamEither._tag === "Left") {
        console.error("invalid e2ee param format", e2eeParamEither.left);
        return;
      }
      this.encryptsOpensslAesCtr = true;
      this.e2eePassphrase = e2eeParamEither.right.pass;
    }
  }

  // for language support
  private get strings() {
    return strings(globalStore.language);
  }

  get downloadAndModifyProgress() {
    return this.baseZipProgress * 0.5 + this.zippingProgress * 0.5;
  }

  async downloadBaseZip() {
    const zipRes = await fetch(baseZipUrl);
    if (zipRes.body === null) {
      throw new Error("body is null unexpectedly");
    }
    const chunks: Uint8Array[] = [];
    const reader = zipRes.body.getReader();
    let readLength = 0;
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      chunks.push(result.value);
      readLength += result.value.byteLength;
      this.baseZipProgress = readLength / BASE_ZIP_BYTE_LENGTH * 100;
    }
    return new Blob(chunks, {
      type: zipRes.headers.get("Content-Type") ?? undefined
    });
  }

  async download() {
    try {
      this.downloadAndModifyInProgress = true;
      const zipBlob: Blob = await this.downloadBaseZip();
      const zip = await JSZip.loadAsync(zipBlob);
      const foundResult = findConfigIniPath(zip);
      console.debug("config.ini path:", foundResult);
      if (foundResult !== undefined) {
        // remove config.ini
        zip.remove(foundResult.configInitPath);
        // add config.ini
        zip.file(foundResult.configInitPath, this.configInitContent);
        // add usage for controller
        zip.file(path.join(foundResult.rootDirPath, "help_for_controller.txt"), this.helpForControllerContent);
      }
      const modifiedZipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      }, (metadata) => {
        this.zippingProgress = metadata.percent;
      });
      console.log(modifiedZipBlob);
      downloadBlob(modifiedZipBlob, "piping-vnc-server-for-windows.zip");
    } finally {
      this.downloadAndModifyInProgress = false;
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.baseZipProgress = 0;
      this.zippingProgress = 0;
    }
  }

  copyDownloadLink() {
    clipboardCopy(this.downloadLink);
    this.snackbar = true;
    this.snackbarText = "Coped link";
  }

  get downloadLink(): string {
    const url = new URL(location.href);
    const e2ee: t.TypeOf<typeof e2eeParamType> = {
      cipher_type: "openssl-aes-256-ctr",
      pass: this.e2eePassphrase,
      pbkdf2: { iter: 100000, hash: "sha256" },
    };
    const params = new URLSearchParams({
      "server": this.pipingServerUrl,
      "cs_path": this.pipingCsPath,
      "sc_path": this.pipingScPath,
      ...( this.encryptsOpensslAesCtr ? {
        "e2ee": JSON.stringify(e2ee),
      } : {}),
    });
    url.hash = `?${params.toString()}`;
    return url.href;
  }

  get isSomeFragmentQueryFilled(): boolean {
    const parsed = parseHashAsQuery();
    return parsed.get("cs_path") !== null || parsed.get("sc_path") !== null || parsed.get("server") !== null;
  }

  get configInitContent(): string {
    return `\
; Path used in piping-tunnel
piping_cs_path=${this.pipingCsPath}
piping_sc_path=${this.pipingScPath}
; Piping Server URL
piping_server_url=${this.pipingServerUrl}
${ this.encryptsOpensslAesCtr ? `\
; Passphrase for end-to-end encryption
e2ee_passphrase=${this.e2eePassphrase}
` : ""}`;
  }

  get helpForControllerContent(): string {
    return `\
# On Web browser
${this.pipingVncUrl}
`;
  }

  get pipingVncUrl(): string {
    const url = new URL("https://piping-vnc.nwtgck.org/vnc.html");
    const params = new URLSearchParams({
      "server": this.pipingServerUrl,
      "cs_path": this.pipingCsPath,
      "sc_path": this.pipingScPath,
      ...( this.encryptsOpensslAesCtr ? {
        // NOTE: openssl-aes-256-ctr, pbkdf2 iter and hash are hard coded
        "e2ee": JSON.stringify({
          cipher_type: "openssl-aes-256-ctr",
          pass: this.e2eePassphrase,
          pbkdf2: { iter: 100000, hash: "sha256" },
        }),
      } : {}),
    });
    url.hash = `?${params.toString()}`;
    return url.href;
  }

  goTop() {
    location.hash = "#";
    // Reload for regenerating paths
    location.reload();
  }
}
</script>
