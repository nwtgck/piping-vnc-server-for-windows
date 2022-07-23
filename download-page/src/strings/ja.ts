import { type Strings } from "./en";

const ja: Strings = {
  source_code: "ソースコード",
  download_zip: "ZIPをダウンロード",
  copy_download_link: "ダウンロードリンクをコピー",
  zip_in_local: "設定されたZIPはローカルで生成されます。",
  gpl_notice_html: `ZIPファイルは <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text text--darken-2">GNU/GPL ライセンス</a>の UltraVNC を含んでいます。`,
  e2e_encryption: "E2E 暗号化",
  e2ee_info: `\
opensslコマンドと同様の暗号化方法でエンドツーエンド暗号化を行います。
暗号タイプはAES-256-CTRで、鍵導出はPBKDF2（ストレッチング回数＝100000、ハッシュ＝SHA-256）を使用します。
`,
  e2ee_passphrase: "E2EE パスフレーズ",
  detail_config: "詳細設定",
  remote_control: "リモート制御",
  remote_control_description: "リモート制御にはWebブラウザからとコマンドからの2つの方法があります。",
  control_from_web_browser: "Webブラウザ上で制御する",
  detail_command: "コマンド",
  detail_command_description(clientHostPort: number) {
    return `以下のいずれかのコマンドを実行して、転送されたVNCポートを${clientHostPort}でサーブします。任意のVNC viewerを使って vnc://localhost:${clientHostPort} にアクセス可能です。`;
  },
  commands_contain_password: "以下のコマンドはE2EEパスワードを含んでいます。",
};
export default ja;
