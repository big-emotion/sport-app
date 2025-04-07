# Contribuer au projet sport-app

Bienvenue dans le projet **sport-app** ! Voici les règles et bonnes pratiques à suivre pour collaborer efficacement en équipe.

---

## 🔧 Branches principales

- `main` : branche stable (production ou préproduction)
- `dev` : branche de développement (base de travail principale)

---

## 🌿 Branches secondaires

### Fonctionnalités
- Prefix : `feature/`
- Exemple : `feature/login-page`

### Corrections de bugs
- Prefix : `bugfix/`
- Exemple : `bugfix/form-validation`

### Hotfix (bugs urgents en production)
- Prefix : `hotfix/`
- Exemple : `hotfix/fix-login-crash`

---

## 📌 Règles de travail

1. **Créer une branche à partir de `dev`**
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/nom-de-la-tâche


2. **Commits clairs et concis**
   - Utilise le format : `feat:`, `fix:`, `chore:`, `docs:`...

3. **Pousser ta branche sur GitHub**
   ```bash
   git push origin feature/nom-de-la-tâche


4. **Créer une Pull Request vers `dev`**
   - Donne un titre explicite à ta PR
   - Ajoute une description claire avec les changements faits
   - Assure-toi que la PR passe les tests

5. **Demander une review**
   - Attends la validation avant de merge
   - Intègre les remarques s’il y en a

---

## ✅ Quand merge dans `main` ?

Uniquement lorsqu’une version stable est prête à être testée ou déployée.
Cela se fait par un **merge de `dev` vers `main`**, suivi d’un **tag de version**.

---

## 🙌 Merci !

Ce fichier est là pour faciliter le travail d’équipe, n’hésite pas à le lire à chaque début de mission ou avant de commencer un développement.
