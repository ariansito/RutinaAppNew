@echo off
echo ========================================
echo    SUBIDA A GITHUB - RUTINA APP
echo ========================================
echo.

echo [1/7] Verificando Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git no esta instalado
    echo Por favor instala Git desde: https://git-scm.com/
    pause
    exit /b 1
)
echo ✓ Git encontrado

echo.
echo [2/7] Inicializando repositorio Git...
if not exist ".git" (
    git init
    echo ✓ Repositorio Git inicializado
) else (
    echo ✓ Repositorio Git ya existe
)

echo.
echo [3/7] Agregando archivos al staging...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Fallo al agregar archivos
    pause
    exit /b 1
)
echo ✓ Archivos agregados al staging

echo.
echo [4/7] Verificando estado de Git...
git status
echo.

echo [5/7] Realizando commit inicial...
git commit -m "🚀 Commit inicial: Rutina App - Aplicación PWA completa"
if %errorlevel% neq 0 (
    echo ERROR: Fallo al hacer commit
    pause
    exit /b 1
)
echo ✓ Commit realizado exitosamente

echo.
echo [6/7] Configurando rama principal...
git branch -M main
echo ✓ Rama principal configurada como 'main'

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Ahora necesitas:
echo.
echo 1. Crear un repositorio en GitHub:
echo    - Ve a https://github.com/new
echo    - Nombre: rutina-app (o el que prefieras)
echo    - Descripcion: Aplicación PWA para organizar rutinas
echo    - NO inicialices con README, .gitignore o licencia
echo.
echo 2. Conectar tu repositorio local:
echo    git remote add origin https://github.com/TU-USUARIO/rutina-app.git
echo.
echo 3. Subir a GitHub:
echo    git push -u origin main
echo.
echo ========================================
echo.
echo ¿Quieres que te ayude con los siguientes pasos?
echo (Presiona cualquier tecla para continuar...)
pause

echo.
echo [7/7] Configurando GitHub Pages...
echo.
echo Para activar GitHub Pages:
echo 1. Ve a tu repositorio en GitHub
echo 2. Settings → Pages
echo 3. Source: Deploy from a branch
echo 4. Branch: main
echo 5. Folder: / (root)
echo 6. Save
echo.
echo Tu app estará disponible en:
echo https://TU-USUARIO.github.io/rutina-app
echo.
echo ========================================
echo    ¡PROCESO COMPLETADO!
echo ========================================
pause
