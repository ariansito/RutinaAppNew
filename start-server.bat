@echo off
echo Iniciando servidor local para RutinaApp...
echo.
echo Si tienes Python instalado, se usará Python
echo Si no, se usará Node.js
echo.
echo La app estara disponible en: http://localhost:8000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Intentar usar Python primero
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Python...
    python -m http.server 8000
    goto :eof
)

REM Si Python no esta disponible, usar Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Node.js...
    npx http-server -p 8000
    goto :eof
)

REM Si ninguno esta disponible
echo Error: No se encontro Python ni Node.js
echo.
echo Instala Python desde: https://www.python.org/downloads/
echo O Node.js desde: https://nodejs.org/
echo.
pause
