
export function strings(language: string): typeof defaultStr {
  if(language.startsWith("en")) {
    return en;
  } else if(language.startsWith("ja")) {
    return ja;
  } else {
    return defaultStr;
  }
}

const en = {
  source_code: "Source code",
  download_zip: "Download Zip",
  copy_download_link: "Copy download link",
  gpl_notice_html: `The zip file contains UltraVNC under <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text">GNU/GPL license</a>.`,
  open_piping_vnc_to_control_remotely: "Open Piping VNC to control remotely",
  e2e_encryption: "E2E encryption",
  e2ee_info: `\
OpenSSL-compatible AES-CTR-256
PBKDF2 iterations: 100000, PBKDF2 hash: SHA-256
`,
  e2ee_passphrase: "E2EE passphrase",
  detail_config: "Detail config",
};
const defaultStr = en;

const ja: typeof defaultStr = {
  source_code: "ソースコード",
  download_zip: "ZIPをダウンロード",
  copy_download_link: "ダウンロードリンクをコピー",
  gpl_notice_html: `ZIPファイルは <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text">GNU/GPL ライセンス</a>の UltraVNC を含んでいます。`,
  open_piping_vnc_to_control_remotely: "Piping VNCを開いて制御する",
  e2e_encryption: "E2E 暗号化",
  e2ee_info: en.e2ee_info,
  e2ee_passphrase: "E2EE パスフレーズ",
  detail_config: "詳細設定",
};
