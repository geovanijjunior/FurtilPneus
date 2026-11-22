#!/usr/bin/env sh
# Inicia o Chrome DevTools MCP. Nas sessões em nuvem do Claude Code o Chromium
# vem em /opt/pw-browsers; em outras máquinas usa o Chrome instalado.
if [ -x /opt/pw-browsers/chromium ]; then
  exec npx -y chrome-devtools-mcp@1.12.0 --headless --isolated --executablePath /opt/pw-browsers/chromium "$@"
fi
exec npx -y chrome-devtools-mcp@1.12.0 --isolated "$@"
