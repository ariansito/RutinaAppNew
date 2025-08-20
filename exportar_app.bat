@echo off
echo ========================================
echo    EXPORTADOR DE RUTINA APP
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [2/6] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas

echo.
echo [3/6] Instalando Capacitor CLI...
npm install -g @capacitor/cli
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar Capacitor CLI
    pause
    exit /b 1
)
echo ✓ Capacitor CLI instalado

echo.
echo [4/6] Inicializando Capacitor...
npx cap init "Rutina App" "com.rutinaapp.app" --web-dir="./"
if %errorlevel% neq 0 (
    echo ERROR: Fallo al inicializar Capacitor
    pause
    exit /b 1
)
echo ✓ Capacitor inicializado

echo.
echo [5/6] Agregando plataforma Android...
npx cap add android
if %errorlevel% neq 0 (
    echo ERROR: Fallo al agregar Android
    pause
    exit /b 1
)
echo ✓ Plataforma Android agregada

echo.
echo [6/6] Sincronizando proyecto...
npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Fallo al sincronizar
    pause
    exit /b 1
)
echo ✓ Proyecto sincronizado

echo.
echo ========================================
echo    EXPORTACION COMPLETADA
echo ========================================
echo.
echo Para continuar con la exportacion:
echo.
echo ANDROID:
echo 1. Ejecuta: npx cap open android
echo 2. En Android Studio: Build → Build APK(s)
echo 3. El APK estara en: android/app/build/outputs/apk/debug/
echo.
echo iOS (requiere Mac):
echo 1. Ejecuta: npx cap add ios
echo 2. Ejecuta: npx cap open ios
echo 3. En Xcode: Product → Archive
echo.
echo ========================================
pause
