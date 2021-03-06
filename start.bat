setlocal

:: Read config
for /F "tokens=*" %%v in (.\config.ini) do set %%v

:: Whether winvnc started or not
set vnc_started=1==2

:: Loop until VNC server is running
:loop

set vnc_status=NOT_RUNNING
for /f "usebackq" %%a in (`netstat -an ^| find "LISTENING" ^| find "127.0.0.1:5900"`) do @set vnc_status=%%a

:: If VNC server is not running yet
if %vnc_status% == NOT_RUNNING (
  if not %vnc_started% (
    if %PROCESSOR_ARCHITECTURE%==x86 (
      start .\tools\UltraVnc_1342\x86\winvnc.exe
    ) else if %PROCESSOR_ARCHITECTURE%==AMD64 (
      start .\tools\UltraVnc_1342\x64\winvnc.exe
    ) else (
      echo "Error: Unexpected processor architecture"
    )
    set vnc_started=1==1
  )
) else (
  goto vnc_running
)

timeout /t 2 > nul
goto loop

:vnc_running

if defined e2ee_passphrase (
  :: NOTE: openssl-aes-256-ctr, pbkdf2 iter and hash are hard coded
  set e2ee_flags=--symmetric --cipher-type=openssl-aes-256-ctr --pbkdf2 {\"iter\":100000,\"hash\":\"sha256\"} --pass %e2ee_passphrase%
) else (
  set e2ee_flags=
)

:: Start tunneling
if %PROCESSOR_ARCHITECTURE%==x86 (
  .\tools\piping-tunnel-0.10.1-windows-386\piping-tunnel -s %piping_server_url% server -p 5900 %e2ee_flags% %piping_cs_path% %piping_sc_path%
) else if %PROCESSOR_ARCHITECTURE%==AMD64 (
  .\tools\piping-tunnel-0.10.1-windows-amd64\piping-tunnel -s %piping_server_url% server -p 5900 %e2ee_flags% %piping_cs_path% %piping_sc_path%
) else (
  echo "Error: Unexpected processor architecture"
)

pause
