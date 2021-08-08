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
    start .\UltraVnc_133_dev10\x64\winvnc.exe
    set vnc_started=1==1
  )
) else (
  goto vnc_running
)

timeout /t 2 > nul
goto loop

:vnc_running

:: Start tunneling
.\piping-tunnel\piping-tunnel -s %piping_server_url% server -p 5900 %tunnel_path%

pause
