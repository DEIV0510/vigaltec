@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   VIGALTEC - Subir cambios a GitHub
echo ============================================
echo.
git add -A
git commit -m "Actualizacion %date% %time%"
echo.
echo Subiendo a GitHub...
git push origin main
echo.
echo ============================================
echo   Listo. Puedes cerrar esta ventana.
echo ============================================
pause >nul
