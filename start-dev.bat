@echo off
REM ──────────────────────────────────────────────────────────────
REM  CoffeeLoyalty - Arranque del entorno de desarrollo (Windows)
REM ──────────────────────────────────────────────────────────────
REM  Frontend Next.js  -> http://localhost:3000
REM  Backend Express   -> http://localhost:4000  (si esta presente)
REM ──────────────────────────────────────────────────────────────

cd /d "%~dp0"

echo.
echo === CoffeeLoyalty: arrancando servicios ===
echo.

REM Frontend
if exist node_modules\ (
  start "CoffeeLoyalty Frontend" cmd /k "npm run dev"
) else (
  start "CoffeeLoyalty Frontend" cmd /k "npm install && npm run dev"
)

REM Backend (opcional)
if exist backend\package.json (
  cd backend
  if exist node_modules\ (
    start "CoffeeLoyalty Backend" cmd /k "npm run dev"
  ) else (
    start "CoffeeLoyalty Backend" cmd /k "npm install && npx prisma generate && npm run dev"
  )
  cd ..
)

echo.
echo Frontend:  http://localhost:3000
echo Backend :  http://localhost:4000  (si esta levantado)
echo.
echo Cierra las ventanas para detener los servicios.
echo.
pause
