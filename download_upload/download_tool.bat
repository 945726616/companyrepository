@echo off
::set   root_dir=%cd%\..\..\..\..\..
set   root_dir= E:\project\src
set   win32_x86_bin_path=%root_dir%\platforms\win32-x86\bin
set   cmd_minised=%win32_x86_bin_path%\minised.exe
set   cmd_7z=%win32_x86_bin_path%\7z.exe
set   compiler_jar_path=%win32_x86_bin_path%\compiler.jar
set   yuicompressor_jar_path=%win32_x86_bin_path%\yuicompressor-2.4.2.jar
set   sys_src_path=%root_dir%\apps\app\sys
set   path_relative_src_http=project\src\apps\app\ipc\data\http
set   path_relative_src_sys=project\src\apps\app\sys
set   mipc_ver_file=mipc_ver.txt
set   css=''
:main

set file_path=%1
set ver_tmp=%2
set all=%3
set webv=%4
set pack=%5

:: check the parm
if "%file_path%" == "help" (
  call:Help %0
)
if "%file_path%" == "" (
  call:Help %0
)
if "%ver_tmp%" == "" (
 echo ver can't be null
 call:Help %0
)
if "%all%" == "" (
  echo all can't be null
  call:Help %0
)
if "%webv%" == "" (
  echo web can't be null
  call:Help %0
)

:: prepare mipc_ver as date
set mipc_ver=
if exist %mipc_ver_file% (
  echo !!!---------------%mipc_ver_file% exist.---------------!!!
  echo !!!-------do you need a new version for mipc,----------!!!
  echo !!!if need please delete %mipc_ver_file% then continue,!!!
  echo !!!------------else continue directly.-----------------!!!
  pause
)
if exist %mipc_ver_file% (
 for /F "" %%i IN ('type %mipc_ver_file%') do (set mipc_ver=%%i)
)
if "%mipc_ver%" == "" (
  if "%time:~0,1%" == " " (
    set mipc_ver=%date:~2,2%%date:~5,2%%date:~8,2%0%time:~1,1%%time:~3,2%
  ) else (
    set mipc_ver=%date:~2,2%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%
  )
)

:: 设置参数
set ver=%ver_tmp%.%mipc_ver%
set temp_path=%file_path%\tmp
set log=%file_path%\log.txt

:: Prepare src
if exist %temp_path% (
  rd/s/Q %temp_path%
)


md "%temp_path%\download"

xcopy download %temp_path%\download /e
::copy scripts\mlib.core.evt.js %temp_path%\download\js
::copy scripts\mlib.core.codec.js %temp_path%\download\js
::copy scripts\mlib.core.rpc.js %temp_path%\download\js
::copy scripts\mlib.crypt.dh.js %temp_path%\download\js
::copy scripts\mlib.crypt.md5.js %temp_path%\download\js
::copy scripts\mlib.cloud.account.js %temp_path%\download\js
::copy scripts\mlib.cloud.agent.js %temp_path%\download\js
::copy scripts\cryptojs_md5.js %temp_path%\download\js
::copy scripts\cryptojs_tripledes.js %temp_path%\download\js
::copy scripts\cryptojs_pad-nopadding-min.js %temp_path%\download\js

cd %temp_path%\download

%cmd_minised% "s/\.js[?v]*[0-9.]*/\.js?%ver%/g" download.htm > download.htm.tmp
del download.htm
rename download.htm.tmp download.htm
%cmd_minised% "s/download_version=\"[v]*[0-9.]*\"/download_version=\"%ver%\"/g" index.htm > index.htm.tmp
del index.htm
rename index.htm.tmp index.htm
%cmd_7z% a download.htm.gz download.htm -mx=9 -mfb=255
%cmd_7z% a index.htm.gz index.htm -mx=9 -mfb=255



:: Update web.js
cd %temp_path%\download\js
copy jquery.js + mlib.core.evt.js + mlib.core.codec.js + mlib.core.rpc.js + mlib.crypt.dh.js + mlib.crypt.md5.js + mlib.cloud.account.js + mlib.cloud.agent.js + cryptojs_md5.js +  cryptojs_tripledes.js + cryptojs_pad-nopadding-min.js + index.js /B download.tmp.js

java -jar %compiler_jar_path% --js download.tmp.js --js_output_file download.min.js
del download.tmp.js
%cmd_7z% a download.min.js.gz download.min.js -mx=9 -mfb=255 >%log%
cd %temp_path%\download\css
%cmd_7z% a index_mobile.css.gz index_mobile.css -mx=9 -mfb=255 >%log%
%cmd_7z% a index_pc.css.gz index_pc.css -mx=9 -mfb=255 >%log%


call:Package

goto :EOF

:Help
echo Usage:%1 [options]
echo Available options:
echo     path   path to store the packect(x:....)
echo     ver    packect version(vx.x.x)
echo     all    packect all (0 or 1)
echo     web    web version (v1 or v2o or v2n or v3 or test or all)
echo     pack   if pack the test js  ( only for test )
pause
exit
goto :EOF



:Package
cd %file_path%
%cmd_7z% a download.zip %temp_path%\download -mx=9 -mfb=255 
::%cmd_7z% a download.zip download.tar -mx=9 -mfb=255 
::del download.tar
rd/s/Q %temp_path%
goto :EOF

::打包命令download_tool.bat E:\download_packing v7.11.1 1 all

