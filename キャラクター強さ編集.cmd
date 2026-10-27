@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" character-editor-server.cjs
) else (
  node character-editor-server.cjs
)
pause
