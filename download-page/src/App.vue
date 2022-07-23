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
          {{ strings?.source_code }}
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
          <div style="margin: 1rem 0" :class="isSomeFragmentQueryFilled ? 'blue--text' : 'grey--text text--darken-2'">
            {{ pipingCsPath }} {{ pipingScPath }}
          </div>
          <v-btn @click="download" x-large :loading="downloadAndModifyInProgress" style="margin-bottom: 0.5rem; margin-right: 2rem; font-weight: bold;" color="blue lighten-2">
            <v-icon left dark>
              {{ mdiDownload }}
            </v-icon>
            {{ strings?.download_zip }}
          </v-btn>
          <v-btn @click="copyDownloadLink" x-large style="margin-bottom: 0.5rem">
            <v-icon left dark>
              {{ mdiContentCopy }}
            </v-icon>
            {{ strings?.copy_download_link }}
          </v-btn>
          <v-progress-linear :value="downloadAndModifyProgress" :style="{ visibility: downloadAndModifyInProgress ? null : 'hidden' }"/>
          <div class="grey--text text--darken-2 mb-2">
            <v-icon>{{ mdiHeartOutline }}</v-icon> {{ strings?.zip_in_local }}
          </div>
          <div class="grey--text text--darken-2 mb-2" v-html="strings?.gpl_notice_html" />
        </p>

        <div>
          <v-checkbox v-model="encryptsOpensslAesCtr">
            <template v-slot:label>
              {{ strings?.e2e_encryption }}
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon right v-bind="attrs" v-on="on">{{ mdiInformation }}</v-icon>
                </template>
                <pre>{{ strings?.e2ee_info }}</pre>
              </v-tooltip>
            </template>
          </v-checkbox>
          <v-text-field v-if="encryptsOpensslAesCtr"
                        :label="strings?.e2ee_passphrase"
                        v-model="e2eePassphrase"
                        :type="showsE2eePassphrase ? 'text' : 'password'"
                        :append-icon="showsE2eePassphrase ? mdiEye : mdiEyeOff"
                        @click:append="showsE2eePassphrase = !showsE2eePassphrase"
          />
        </div>

        <v-expansion-panels :elevation="1" style="margin-bottom: 3rem">
          <v-expansion-panel >
            <v-expansion-panel-header>
              <span>
                <v-icon>{{ mdiCogOutline }}</v-icon>
                {{ strings?.detail_config }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field label="Piping Server" v-model="pipingServerUrl" />
              <v-text-field label="Tunnel client-to-server path" v-model="pipingCsPath" />
              <v-text-field label="Tunnel server-to-client path" v-model="pipingScPath" />
              <h3>
                config.ini
                <v-icon v-if="encryptsOpensslAesCtr" @click="showsE2eePassphrase = !showsE2eePassphrase">
                  {{ showsE2eePassphrase ? mdiEye : mdiEyeOff }}
                </v-icon>
              </h3>
              <pre>{{ !encryptsOpensslAesCtr || showsE2eePassphrase ?
                  configInitContent :
                  configInitContent.replace(`e2ee_passphrase=${e2eePassphrase}`, `e2ee_passphrase=${"*".repeat(e2eePassphrase.length)}`)
              }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>


        <h3 class="grey--text text--darken-2">
          <v-icon>{{ mdiLaptop }}</v-icon>
          {{ strings?.remote_control }}
        </h3>
        <div class="grey--text text--darken-2" style="margin-bottom: 1rem">{{ strings?.remote_control_description }}</div>

        <p style="margin-bottom: 2rem">
          <a :href="pipingVncUrl" target="_blank">
            <v-icon>{{ mdiWeb }}</v-icon>
            {{ strings?.control_from_web_browser }}
            <v-icon color="blue">
              {{ mdiOpenInNew }}
            </v-icon>
          </a>
        </p>

        <v-expansion-panels :elevation="1">
          <v-expansion-panel >
            <v-expansion-panel-header>
              <span>
                <v-icon>{{ mdiCodeGreaterThan }}</v-icon>
                {{ strings?.detail_command }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field :label="'Port'" v-model="clientHostPort" type="number" />
              <div class="grey--text text--darken-2" style="margin-bottom: 1rem">{{ strings?.detail_command_description(clientHostPort) }}</div>
              <div v-if="encryptsOpensslAesCtr" class="grey--text text--darken-2" style="margin-bottom: 1rem; font-size: 0.85rem;">
                {{ strings?.commands_contain_password }}
                <v-icon v-if="encryptsOpensslAesCtr" @click="showsE2eePassphrase = !showsE2eePassphrase">
                  {{ showsE2eePassphrase ? mdiEye : mdiEyeOff }}
                </v-icon>
              </div>
              <textarea-with-copy :label="'GNU nc'" :value="generateClientHostCommand('nc -lp')" :masks-value="encryptsOpensslAesCtr && !showsE2eePassphrase"/>
              <div style="font-size: 0.8rem; margin-bottom: 0.5rem">OR</div>
              <textarea-with-copy :label="'BSD nc'" :value="generateClientHostCommand('nc -l')" :masks-value="encryptsOpensslAesCtr && !showsE2eePassphrase"/>
              <div style="font-size: 0.8rem; margin-bottom: 0.5rem">OR</div>
              <textarea-with-copy :label="'socat'" :value="generateClientHostCommand('socat')" :masks-value="encryptsOpensslAesCtr && !showsE2eePassphrase"/>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" :timeout="2000" top color="blue">
      <v-icon left dark>
        {{ mdiContentCopy }}
      </v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import JSZip from "jszip";
import * as path from "path";
import {mdiCogOutline, mdiContentCopy, mdiDownload, mdiEye, mdiEyeOff, mdiLaptop, mdiOpenInNew, mdiInformation, mdiHeartOutline, mdiCodeGreaterThan, mdiWeb} from "@mdi/js";
import {BASE_ZIP_BYTE_LENGTH} from "@/base-zip";
import clipboardCopy from "clipboard-copy";
import { z } from "zod";
import {language} from "@/language";
import {strings} from "@/strings/strings";
import TextareaWithCopy from "@/components/TextareaWithCopy.vue";
import urlJoin from "url-join";

const baseZipUrl = "./piping-vnc-server-for-windows.zip";

// NOTE: Should not use this for piping-vnc-web parameter.
const e2eeParamSchema = z.object({
  cipher_type: z.literal("openssl-aes-256-ctr"),
  pass: z.string(),
  // NOTE: openssl-aes-256-ctr, pbkdf2 iter and hash are hard coded
  pbkdf2: z.object({
    iter: z.literal(100000),
    hash: z.literal("sha256"),
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

const pbkdf2Iter = 100000;
// NOTE: This string is embed
const pbkdf2Hash = "sha256";

const pipingServerUrl = ref(parseHashAsQuery().get("server") ?? "https://ppng.io");
const tunnelPathLength = ref(16);
const pipingCsPath = ref(parseHashAsQuery().get("cs_path") ?? generateRandomString(tunnelPathLength.value));
const pipingScPath = ref(parseHashAsQuery().get("sc_path") ?? generateRandomString(tunnelPathLength.value));
const encryptsOpensslAesCtr = ref(false);
const e2eePassphrase = ref(generateRandomString(64));
const showsE2eePassphrase = ref(false);
const downloadAndModifyInProgress = ref(false);
// 0 ~ 100
const baseZipProgress = ref(0);
// 0 ~ 100
const zippingProgress = ref(0);
const snackbar = ref(false);
const snackbarText = ref("");
const availableLanguages = ref<readonly {lang: Language, str: string}[]>([
  {lang: 'en', str: 'English'},
  {lang: 'ja', str: '日本語'},
]);
const clientHostPort = ref(5901);

onMounted(() => {
  const e2eeRaw = parseHashAsQuery().get("e2ee");
  if (e2eeRaw !== null) {
    const e2eeParamParsed = e2eeParamSchema.safeParse(JSON.parse(e2eeRaw));
    if (!e2eeParamParsed.success) {
      console.error("invalid e2ee param format", e2eeParamParsed.error);
      return;
    }
    encryptsOpensslAesCtr.value = true;
    e2eePassphrase.value = e2eeParamParsed.data.pass;
  }
});

const downloadAndModifyProgress = computed<number>(() => baseZipProgress.value * 0.7 + zippingProgress.value * 0.3);

async function downloadBaseZip() {
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
    baseZipProgress.value = readLength / BASE_ZIP_BYTE_LENGTH * 100;
  }
  return new Blob(chunks, {
    type: zipRes.headers.get("Content-Type") ?? undefined
  });
}

async function download() {
  try {
    downloadAndModifyInProgress.value = true;
    const zipBlob: Blob = await downloadBaseZip();
    const zip = await JSZip.loadAsync(zipBlob);
    const foundResult = findConfigIniPath(zip);
    console.debug("config.ini path:", foundResult);
    if (foundResult !== undefined) {
      // remove config.ini
      zip.remove(foundResult.configInitPath);
      // add config.ini
      zip.file(foundResult.configInitPath, configInitContent.value);
      // add usage for controller
      zip.file(path.join(foundResult.rootDirPath, "help_for_controller.txt"), helpForControllerContent.value);
    }
    const modifiedZipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    }, (metadata) => {
      zippingProgress.value = metadata.percent;
    });
    console.log(modifiedZipBlob);
    downloadBlob(modifiedZipBlob, "piping-vnc-server-for-windows.zip");
  } finally {
    downloadAndModifyInProgress.value = false;
    await new Promise(resolve => setTimeout(resolve, 2000));
    baseZipProgress.value = 0;
    zippingProgress.value = 0;
  }
}

function copyDownloadLink() {
  clipboardCopy(downloadLink.value);
  snackbar.value = true;
  snackbarText.value = "Coped link";
}

const downloadLink = computed<string>(() => {
  const url = new URL(location.href);
  const e2ee: z.infer<typeof e2eeParamSchema> = {
    cipher_type: "openssl-aes-256-ctr",
    pass: e2eePassphrase.value,
    pbkdf2: { iter: 100000, hash: "sha256" },
  };
  const params = new URLSearchParams({
    "server": pipingServerUrl.value,
    "cs_path": pipingCsPath.value,
    "sc_path": pipingScPath.value,
    ...( encryptsOpensslAesCtr.value ? {
      "e2ee": JSON.stringify(e2ee),
    } : {}),
  });
  url.hash = `?${params.toString()}`;
  return url.href;
});

const isSomeFragmentQueryFilled = computed<boolean>(() => {
  const parsed = parseHashAsQuery();
  return parsed.get("cs_path") !== null || parsed.get("sc_path") !== null || parsed.get("server") !== null;
});

const configInitContent = computed<string>(() => {
  return `\
; Path used in piping-tunnel
piping_cs_path=${pipingCsPath.value}
piping_sc_path=${pipingScPath.value}
; Piping Server URL
piping_server_url=${pipingServerUrl.value}
${ encryptsOpensslAesCtr.value ? `\
; Passphrase for end-to-end encryption
e2ee_passphrase=${e2eePassphrase.value}
` : ""}`;
});

const helpForControllerContent = computed<string>(() => {
  return `\
# On Web browser
${pipingVncUrl.value}
`;
});

const pipingVncUrl = computed<string>(() => {
  const url = new URL("https://piping-vnc.nwtgck.org/vnc.html");
  const params = new URLSearchParams({
    "server": pipingServerUrl.value,
    "cs_path": pipingCsPath.value,
    "sc_path": pipingScPath.value,
    ...( encryptsOpensslAesCtr.value ? {
      // NOTE: openssl-aes-256-ctr, pbkdf2 iter and hash are hard coded
      "e2ee": JSON.stringify({
        cipher_type: "openssl-aes-256-ctr",
        pass: e2eePassphrase.value,
        pbkdf2: { iter: pbkdf2Iter, hash: pbkdf2Hash },
      }),
    } : {}),
  });
  url.hash = `?${params.toString()}`;
  return url.href;
});

function generateClientHostCommand(clientHostServe: 'nc -l' | 'nc -lp' | 'socat'): string {
  const serveCommand = (() => {
    switch (clientHostServe) {
      case 'nc -l':
      case 'nc -lp':
        return `${clientHostServe} ${clientHostPort.value}`;
      case 'socat':
        return `socat TCP-LISTEN:${clientHostPort.value},reuseaddr -`;
    }
  })();
  // TODO: hide password properly
  const encryptIfNeed = (() => {
    if (encryptsOpensslAesCtr.value) {
      return [ `stdbuf -i0 -o0 openssl aes-256-ctr -pass "pass:${e2eePassphrase.value}" -bufsize 1 -pbkdf2 -iter ${pbkdf2Iter} -md ${pbkdf2Hash}` ];
    } else {
      return [];
    }
  })();
  const decryptIfNeed = (() => {
    if (encryptsOpensslAesCtr.value) {
      return [ `stdbuf -i0 -o0 openssl aes-256-ctr -d -pass "pass:${e2eePassphrase.value}" -bufsize 1 -pbkdf2 -iter ${pbkdf2Iter} -md ${pbkdf2Hash}` ];
    } else {
      return [];
    }
  })();
  const clientHostCommand = [
    `curl -sSN ${urlJoin(pipingServerUrl.value, pipingScPath.value)}`,
    ...decryptIfNeed,
    serveCommand,
    ...encryptIfNeed,
    `curl -sSNT - ${urlJoin(pipingServerUrl.value, pipingCsPath.value)}`
  ].join(' | ');
  return clientHostCommand;
}

function goTop() {
  location.hash = "#";
  // Reload for regenerating paths
  location.reload();
}
</script>
