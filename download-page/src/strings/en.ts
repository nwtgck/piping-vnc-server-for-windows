const en = {
  source_code: "Source code",
  download_zip: "Download Zip",
  copy_download_link: "Copy download link",
  zip_in_local: "Configured zip will be safely generated in local.",
  gpl_notice_html: `The zip file contains UltraVNC under <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="grey--text text--darken-2">GNU/GPL license</a>.`,
  e2e_encryption: "E2E encryption",
  e2ee_info: `\
End-to-end encryption is conducted using the same way as openssl command does.
The cipher type is AES-256-CTR and the key is derived by PBKDF2 with iterations = 100000 and hash = SHA-256.
`,
  e2ee_passphrase: "E2EE passphrase",
  detail_config: "Detail config",
  remote_control: "Remote control",
  remote_control_description: "You have two ways to control remotely, which are from Web browser or command.",
  control_from_web_browser: "Control from Web browser",
  detail_command: "Command",
  detail_command_description(clientHostPort: number){
    return `Run either of commands to serve forwarded VNC port on ${clientHostPort}. You can access vnc://localhost:${clientHostPort} using a VNC viewer.`;
  },
  commands_contain_password: "The commands below contain E2EE password.",
};
export default en;

export type Strings = typeof en;
