# piping-vnc-server-for-windows

Remote control Windows machine powered by [UltraVNC](https://www.uvnc.com/) and [Piping Server](https://github.com/nwtgck/piping-server)

## Run

1. Download <https://github.com/nwtgck/piping-vnc-server-for-windows/archive/refs/heads/master.zip>.
2. Extract the zip.
3. Click `run.bat` on your Windows machine. The password is "1234".

The .bat runs VNC server on 5900 port and forwards the port via Piping Server.

## NOTE: Change paths

Please change the paths `XteS20PrNMrjBRk5` and `KPoNbhFpkHAwRD6k` in `run.bat` for security.

```bat
:: run.bat

...

.\piping-tunnel\piping-tunnel server -p 5900 XteS20PrNMrjBRk5 KPoNbhFpkHAwRD6k
```

## OSS Licenses

* UltraVnc_133_dev10: [GNU/GPL](https://github.com/ultravnc/UltraVNC/blob/main/LICENSE)
* [piping-tunnel](https://github.com/nwtgck/go-piping-tunnel): [MIT](https://github.com/nwtgck/go-piping-tunnel/blob/develop/LICENSE)
* The other files: MIT
