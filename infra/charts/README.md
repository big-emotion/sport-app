# charts/sport-app/README.md

## 📦 Helm Chart - sport-app

Ce chart Helm déploie l'application sport-app, composée de :

- Un **frontend** (Next.js)
- Un **backend** (Java Spring Boot)
- Une **base de données PostgreSQL** (via Bitnami)
- Un **Ingress** configurable (IP publique ou domaine)

---

## 🚀 Déploiement manuel

### 1. Prérequis
- Un cluster Kubernetes (ex: K3s, Minikube, DigitalOcean...)
- Helm installé (`helm version`)
- Accès au cluster via `kubectl`

### 2. Ajouter le repo Bitnami
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 3. Déploiement en environnement de test (IP publique)
```bash
helm upgrade --install sport-app ./charts/sport-app \
  -f charts/sport-app/values.yaml \
  -f charts/sport-app/values-dev.yaml
```

### 4. Déploiement en production (nom de domaine)
```bash
helm upgrade --install sport-app ./charts/sport-app \
  -f charts/sport-app/values.yaml \
  -f charts/sport-app/values-prod.yaml
```

### 5. Mise à jour d'une image
```bash
helm upgrade sport-app ./charts/sport-app \
  --set backend.image=ghcr.io/ton-user/sport-backend:abc123 \
  --set frontend.image=ghcr.io/ton-user/sport-frontend:abc123
```

---

## 🌍 Configuration de l'Ingress

Dans `values.yaml`, tu peux définir :
```yaml
ingress:
  enabled: true
  hosts:
    - host: "192.168.1.100.nip.io" # ou plus tard : "app.monsite.fr"
      paths:
        - path: /
          service: frontend
        - path: /api
          service: backend
```

> Astuce : utilise un service comme [nip.io](https://nip.io) pour tester avec ton IP publique sans domaine.

---

## 📂 Structure du chart

```
charts/sport-app/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
├── templates/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml
│   └── ...
└── charts/
    └── postgresql/  # Chart Bitnami intégré
```

---

## 🛠 Pour aller plus loin
- Ajouter `cert-manager` pour le HTTPS Let's Encrypt
- Déployer via ArgoCD (GitOps)
- Ajouter des probes + autoscaling dans les templates YAML

---