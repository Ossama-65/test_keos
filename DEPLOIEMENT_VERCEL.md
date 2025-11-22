# Dashboard Prospection - Guide de Déploiement Vercel

## Prérequis

- Compte Vercel (gratuit) : https://vercel.com
- Git repository configuré

## Étape 1 : Préparer le projet

```bash
cd /Users/ossama/Documents/ossama_site_ia/prospect-dashboard

# Vérifier que tout fonctionne localement
npm run build

# Tester le build
npm run start
```

## Étape 2 : Push sur GitHub

```bash
# Initialiser git si pas déjà fait
git init
git add .
git commit -m "Initial commit: Dashboard prospection"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/prospect-dashboard.git
git branch -M main
git push -u origin main
```

## Étape 3 : Déployer sur Vercel

### Option A : Via l'interface web

1. Aller sur https://vercel.com
2. Cliquer sur "New Project"
3. Importer votre repository GitHub
4. Configurer les variables d'environnement :
   - `AUTH_PASSWORD` : Votre mot de passe sécurisé
5. Cliquer sur "Deploy"

### Option B : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

## Étape 4 : Configurer les variables d'environnement

Dans le dashboard Vercel :
1. Aller dans Settings → Environment Variables
2. Ajouter :
   - `AUTH_PASSWORD` = votre_mot_de_passe_securise

## Étape 5 : Accéder à votre dashboard

Une fois déployé, vous recevrez une URL :
- `https://prospect-dashboard.vercel.app` (exemple)

## Configuration Domaine Personnalisé (Optionnel)

1. Dans Vercel → Settings → Domains
2. Ajouter votre domaine
3. Configurer les DNS selon les instructions

## Scripts Python sur Vercel

⚠️ **Important** : Les scripts Python ne fonctionneront pas directement sur Vercel (serverless).

### Solutions :

#### Option 1 : Désactiver les features Python
Les features de génération et enrichissement nécessitent Python. Sur Vercel, elles ne fonctionneront pas.

#### Option 2 : Utiliser un service externe
- Héberger les scripts Python sur un serveur dédié (VPS, Railway.app, etc.)
- Appeler ces scripts via API depuis Vercel

#### Option 3 : Réécrire en Node.js
- Réécrire les scripts Python en Node.js/TypeScript
- Plus de maintenance mais compatible Vercel

### Pour ce MVP, recommandation :
Déployer le dashboard sur Vercel mais exécuter les scripts Python **localement** quand nécessaire.

## Commandes Utiles

```bash
# Déployer en preview
vercel

# Déployer en production
vercel --prod

# Voir les logs
vercel logs

# Voir les deployments
vercel ls
```

## Dépannage

### Build Error
```bash
# Tester localement
npm run build

# Vérifier les logs Vercel
# Settings → Deployments → Logs
```

### Variables d'environnement non définies
- Vérifier dans Settings → Environment Variables
- Redéployer après ajout de variables

### 500 Error au runtime
- Vérifier les logs Vercel
- Souvent lié aux scripts Python qui ne peuvent pas s'exécuter

## Coûts

**Vercel Free Tier** inclut :
- Déploiements illimités
- 100GB de bande passante/mois
- Domaines personnalisés
- SSL automatique

**Largement suffisant pour ce projet !**

## Sécurité

1. **Ne jamais commit** les fichiers `.env.local`
2. Utiliser des **mots de passe forts** pour AUTH_PASSWORD
3. Activer **2FA** sur votre compte Vercel
4. Monitorer les **logs d'accès**

## Prochaines Étapes

Une fois déployé :
1. ✅ Tester la connexion
2. ✅ Vérifier que les prospects s'affichent
3. ✅ Tester le CRUD des prospects
4. ❌ Les features Python (génération/enrichissement) ne fonctionneront pas sur Vercel

**Pour utiliser les scripts Python, gardez une instance locale ou migrez vers un VPS.**

