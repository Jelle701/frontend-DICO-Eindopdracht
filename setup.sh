#CODEX

#!/usr/bin/env bash
set -e

echo "🔧 Update systeem en installeer Node.js en npm"
# Voor Debian/Ubuntu; pas aan indien je een andere distro gebruikt
apt-get update -qq
apt-get install -y curl ca-certificates

# Installeer Node.js LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "✅ Node $(node -v) en npm $(npm -v) geïnstalleerd"

echo "📦 Installeren van project-dependencies"
# Ga ervan uit dat je in de root van je Vite-React project zit
npm install

echo "🚀 Devserver starten"
# Start de Vite devserver (poort 5173)
npm run dev
