
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
  zip_in_local: "Configured zip will be safely generated in local.",
  gpl_notice_html: `The zip file contains UltraVNC under <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text text--darken-2">GNU/GPL license</a>.`,
  control_on_web_browser: "Control on Web browser",
  e2e_encryption: "E2E encryption",
  e2ee_info: `\
End-to-end encryption is conducted using the same way as openssl command does.
The cipher type is AES-256-CTR and the key is derived by PBKDF2 with iterations = 100000 and hash = SHA-256.
`,
  e2ee_passphrase: "E2EE passphrase",
  detail_config: "Detail config",
};
const defaultStr = en;

const ja: typeof defaultStr = {
  source_code: "ソースコード",
  download_zip: "ZIPをダウンロード",
  copy_download_link: "ダウンロードリンクをコピー",
  zip_in_local: "設定されたZIPはローカルで生成されます。",
  gpl_notice_html: `ZIPファイルは <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text text--darken-2">GNU/GPL ライセンス</a>の UltraVNC を含んでいます。`,
  control_on_web_browser: "Webブラウザ上で制御する",
  e2e_encryption: "E2E 暗号化",
  e2ee_info: `\
opensslコマンドと同様の暗号化方法でエンドツーエンド暗号化を行います。
暗号タイプはAES-256-CTRで、鍵導出はPBKDF2（ストレッチング回数＝100000、ハッシュ＝SHA-256）を使用します。
`,
  e2ee_passphrase: "E2EE パスフレーズ",
  detail_config: "詳細設定",
};