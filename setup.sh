#!/bin/bash

# 🚀 Script d'initialisation Apex Coaching
# Ce script vous aide à configurer rapidement votre environnement de développement

set -e

echo "🎓 Bienvenue dans Apex Coaching !"
echo "=================================="
echo ""

# Vérifier Node.js
echo "📦 Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 20+ depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Votre version de Node.js ($NODE_VERSION) est trop ancienne. Version 18+ requise."
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"
echo ""

# Vérifier npm
echo "📦 Vérification de npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm $(npm -v) détecté"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install
echo "✅ Dépendances installées"
echo ""

# Vérifier .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  Fichier .env.local non trouvé"
    echo "📝 Création depuis .env.example..."
    cp .env.example .env.local
    echo "✅ Fichier .env.local créé"
    echo ""
    echo "⚠️  IMPORTANT : Vous devez maintenant configurer vos clés Supabase dans .env.local"
    echo ""
    echo "Pour obtenir vos clés :"
    echo "1. Allez sur https://supabase.com"
    echo "2. Créez un projet"
    echo "3. Allez dans Settings → API"
    echo "4. Copiez Project URL et anon key"
    echo "5. Éditez .env.local avec ces valeurs"
    echo ""
    echo "Puis relancez ce script."
    exit 0
fi

echo "✅ Fichier .env.local trouvé"
echo ""

# Vérifier les variables d'environnement
source .env.local 2>/dev/null || true

if [[ "$NEXT_PUBLIC_SUPABASE_URL" == *"example"* ]] || [[ "$NEXT_PUBLIC_SUPABASE_URL" == *"your_"* ]]; then
    echo "⚠️  Les variables Supabase ne sont pas configurées"
    echo ""
    echo "Pour configurer Supabase :"
    echo "1. Créez un compte sur https://supabase.com"
    echo "2. Créez un nouveau projet"
    echo "3. Suivez le guide dans SUPABASE_SETUP.md"
    echo "4. Éditez .env.local avec vos vraies clés"
    echo ""
    echo "Vous pouvez quand même continuer pour tester le build..."
    echo ""
fi

# Type check
echo "🔍 Vérification TypeScript..."
npm run type-check
echo "✅ TypeScript OK"
echo ""

# Build
echo "🏗️  Build de production..."
npm run build
echo "✅ Build réussi"
echo ""

# Résumé
echo "🎉 Configuration terminée !"
echo "=========================="
echo ""
echo "Prochaines étapes :"
echo ""
echo "1. 📖 Lisez QUICKSTART.md pour démarrer rapidement"
echo "2. 🔧 Configurez Supabase (voir SUPABASE_SETUP.md)"
echo "3. 🚀 Lancez l'app avec : npm run dev"
echo "4. 🌐 Ouvrez http://localhost:3000"
echo ""
echo "Documentation :"
echo "- README.md : Documentation principale"
echo "- QUICKSTART.md : Guide rapide (5 min)"
echo "- INDEX.md : Index de toute la documentation"
echo ""
echo "Bon développement ! 🎓✨"
