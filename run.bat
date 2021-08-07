:: Whether winvnc started or not
set vnc_started=1==2

:: Loop until VNC server is running
:loop

set vnc_status=NOT_RUNNING
for /f "usebackq" %%a in (`netstat -ano ^| find "127.0.0.1:5900"`) do @set vnc_status=%%a

:: If VNC server is not running yet
if %vnc_status% == NOT_RUNNING (
  if not %vnc_started% (
    start .\UltraVnc_133_dev10\x64\winvnc.exe
    vnc_started=1==1
  )
) else (
  goto vnc_running
)

timeout /t 2
goto loop

:vnc_running

:: Start tunneling
.\piping-tunnel\piping-tunnel server -p 5900 XteS20PrNMrjBRk5 KPoNbhFpkHAwRD6k
