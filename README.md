# piping-vnc-server-for-windows

Remote control Windows machine from anywhere powered by [UltraVNC Server](https://www.uvnc.com/) and [Piping Server](https://github.com/nwtgck/piping-server)

## How to use

Suppose that Windows machine A is remotely controlled by another machine B.

### Step 1

In machine A, download <https://github.com/nwtgck/piping-vnc-server-for-windows/archive/refs/heads/master.zip> and extract it.

### Step 2

In machine A, click `run.bat` on your Windows machine to run VNC server.

### Step 3

In machine B, open <https://piping-vnc.nwtgck.org/vnc.html#?cs_path=please_change_me/cs&sc_path=please_change_me/sc> to control the machine A on Chrome 85 or above. The VNC password is "1234".

OR

In machine B, run `piping-tunnel client -p 5901 please_change_me` to forward 5900 port in machine A to 5901 port in machine B. You can use other VNC client to access localhost:5901 in machine B. To install `piping-tunnel` in machine B, visit <https://github.com/nwtgck/go-piping-tunnel>.

## NOTE: Change path for security

In `config.ini`, please change the path `please_change_me` to a complex string for security.

```ini
; Path used in piping-tunnel
tunnel_path=please_change_me
```

## OSS Licenses

* UltraVnc_133_dev10: [GNU/GPL](https://github.com/ultravnc/UltraVNC/blob/main/LICENSE)
* [piping-tunnel](https://github.com/nwtgck/go-piping-tunnel): [MIT](https://github.com/nwtgck/go-piping-tunnel/blob/develop/LICENSE)
* The other files: MIT
