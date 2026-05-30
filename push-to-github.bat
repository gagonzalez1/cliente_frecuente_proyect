@echo off
REM ──────────────────────────────────────────────────────────────
REM  CoffeeLoyalty - Crear repo privado en GitHub y pushear
REM  Requiere: git + gh CLI logueado (gh auth login)
REM ──────────────────────────────────────────────────────────────

setlocal
cd /d "%~dp0"

set REPO_NAME=cliente-frecuente-proyect
set COMMIT_MSG=feat: MVP inicial CoffeeLoyalty (frontend Next.js + backend Express/Prisma)

echo.
echo === Verificando dependencias ===
where git >nul 2>&1 || (echo [ERROR] git no esta en PATH & exit /b 1)
where gh  >nul 2>&1 || (echo [ERROR] gh CLI no esta en PATH. Instala desde https://cli.github.com/ & exit /b 1)

gh auth status >nul 2>&1
if errorlevel 1 (
  echo [ERROR] gh no esta autenticado. Corre: gh auth login
  exit /b 1
)

echo.
echo === Inicializando repositorio local ===
if not exist .git (
  git init -b main
) else (
  echo .git ya existe, omitiendo init.
)

REM Config minima si no esta seteada globalmente
git config user.name  >nul 2>&1 || git config user.name  "Gabriel Gonzalez"
git config user.email >nul 2>&1 || git config user.email "gagonzalez@frba.utn.edu.ar"

echo.
echo === Agregando archivos y commiteando ===
git add -A
git commit -m "%COMMIT_MSG%" || echo (Sin cambios para commitear)

echo.
echo === Creando repo PRIVADO en GitHub y pusheando ===
gh repo create %REPO_NAME% --private --source=. --remote=origin --push
if errorlevel 1 (
  echo.
  echo [INFO] Si el repo ya existe en GitHub, intento solo agregar el remote y pushear...
  for /f "tokens=*" %%i in ('gh api user --jq .login') do set GH_USER=%%i
  git remote add origin https://github.com/%GH_USER%/%REPO_NAME%.git 2>nul
  git branch -M main
  git push -u origin main
)

echo.
echo === Listo ===
gh repo view %REPO_NAME% --web
endlocal
pause
