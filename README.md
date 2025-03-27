# task-manager-adaa-test
Test de recrutement de Dev Full stack chez ADAA

L'application est divisées en deux principales parties: Le backend qui est une **API RESTful [Laravel](https://laravel.com/)** et le frontend qui est une **application [Next.js](https://nextjs.org/)** qui consomme l'API. Le code du backend se trouve dans le repertoire `./backend` et celui du frontend dans le repertoire `./frontend`

## Réponse aux questions du test

### Quelles ont été les difficultés rencontrées pendant le test ?
Lors du test, les difficultés que j'ai rencontrées comprenaient:

- la gestion des erreurs et le débogage de l'API: L'application renvoyait parfois des erreurs lors de la soumission des tâches, notamment en raison de réponses API incorrectes ou d'en-têtes manquants.

- les problèmes CORS: Les requêtes API initiales rencontraient des erreurs liées à CORS, nécessitant des ajustements du backend.

- Le traitement du téléchargement d'images: La fonctionnalité de téléchargement de fichiers a nécessité un dépannage en raison de configurations manquantes dans le traitement des requêtes multipart/form-data.

- La gestion des états: Certains éléments de l'interface utilisateur ne se mettaient pas à jour immédiatement après la création de la tâche, nécessitant des actualisations manuelles de la page.

### Comment le candidat a-t-il géré son temps ?
Pour ma gestion du temps, j'ai commencé par prioriser les fonctionnalités clés en identifiant rapidement les fonctionnalités clés sur lesquelles me concentrer en premier. J'ai éffectué des débogages efficaces, diagnostiqué et résolu les problèmes survenus en utilisant les journaux de la console et des outils de test d'API comme Postman. J'ai itéré entre la conception et les tests, garantissant une évolution progressive. je me suis concentré pour limiter le périmètre aux fonctionnalités essentielles, évitant ainsi les complexités non nécecssaires.

### Quelles améliorations pourraient être apportées à l'application ?
Quelques améliorations pourraient être apportées à l'application, notamment:

- Une meilleure gestion des erreurs: Messages d'erreur plus précis et retours d'information en temps réel sur l'interface utilisateur en cas d'échec des appels d'API.

- Une optimisation de l'état: Implémentation de React Query pour une gestion plus efficace de la récupération des données API.

- Des améliorations de l'interface utilisateur et de l'expérience utilisateur: Ajout d'indicateurs de chargement et amélioration de la validation des formulaires.

- Des améliorations de la sécurité avec une validation plus stricte des saisies utilisateur et mise en œuvre de la protection CSRF.

- Des ajustements des performances par l'optimisation des requêtes API et réduction des rendus inutiles dans les composants React.

### Quelles sont les connaissances du candidats en matière de sécurité web ?
J'ai une solide compréhension des principes de sécurité web, notamment:

- L'authentification et l'autorisation avec utilisation de jetons pour les requêtes API sécurisées.

- La sensibilisation CORS: Identification et résolution des problèmes CORS.

- La validation des entrées avec la prévention des vulnérabilités courantes telles que les injections SQL et les attaques XSS.

- Le téléchargements sécurisés de fichiers pour s'assurer que les fichiers sont correctement traités pour empêcher les téléchargements malveillants.

- La gestion des sessions par une gestion sécurisée du stockage des jetons dans localStorage.

### Comment le candidat gère t'il les problèmes de performances ?
J'ai résolu efficacement les problèmes de performance en:

- Optimisation des requêtes API pour réduction des appels API et utilisation efficace de useEffect.

- Gérant efficace des états avec prévention des rendus inutiles des composants.

- Appliquant le chargement différé des images par l'utilisation du composant Next.js <Image> avec priorité et chargement différé.

- Réduisant les dépendances inutilisées pour alléger le projet et éviter les bibliothèques tierces inutiles.

- En utilisant des outils de développement du navigateur et des journaux de la console pour diagnostiquer les opérations lentes.

## Comment utiliser l'application

### 1. Installation
Tout d’abord, clonez le référentiel et allez à la racine du projet:

```bash
git clone https://github.com/JuniorTak/task-manager-adaa-test.git
cd task-manager-aada-test
```

Les commandes qui suivent assument que nous partons de la racine du projet.

- Pour le backend, installez les dépendances, générez la clé du backend, éffectuez les migrations:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
npm install
```

Générez les assets pour la production:

```bash
npm run build
```

Ou générez les assets pendant le développement:

```bash
npm run build
```

- Pour le frontend, installez les dépendances:
```bash
cd frontend
npm install
```

### 2. Démarrer le serveur de développement
Lancez le serveur d'API localement:

```bash
cd backend
php artisan serve
```
Pendant que le serveur fonctionne, exécutez l'application localement:

```bash
cd frontend
npm run dev
```

Par défaut, l'application fonctionne sur http://localhost:3000.

### 3. Authentication
L'application nécessite une authentification de l'utilisateur.

Après la connexion, un jeton JWT est stocké dans localStorage.

### 4. Ajout d'une nouvelle tâche
Cliquez sur **Nouvelle tâche**

Renseignez le titre, la description et la date d'échéance, téléchargez une image (facultatif).

Cliquez sur **Ajouter**.

### 5. Affichage et gestion des tâches
Toutes les tâches sont répertoriées dans le tableau de bord.

Cliquez sur une tâche pour en afficher les détails.

### 6. Déconnexion
Pour vous déconnecter, cliquez sur le bouton **Se déconnecter**.

### 7. Points de terminaison ou endpoints de l'API
L'application interagit avec l'API backend sur http://localhost:8000/api.

- **GET /tasks** – Récupérer toutes les tâches

- **GET /tasks/:id** – Récupérer une tâche

- **POST /tasks** – Ajouter une nouvelle tâche

- **PUT /tasks/:id** – Mettre à jour une tâche

- **DELETE /tasks/:id** – Supprimer une tâche

- **PUT /tasks/:id/complete** – Marquer une tâche comme terminée

### 8. Déploiement
Pour la production, compilez l'application avec:

```bash
npm run build
```

Ensuite, démarrez le serveur :

```bash
npm start
```

## Comment executer les tests unitaires de l'API

### Conditions préalables

Assurez-vous d’avoir installé les éléments suivants:
- **PHP 8.2+**
- **Composer**
- **Laravel 12**
- **MySQL or SQLite** for testing
- **PestPHP or PHPUnit** (default testing framework)

### Configuration de l'environnement de test
Note: The testing environment is already configured with PHPUnit and the test database. Ensure your .env.testing file is correctly set up before running tests.

### Exécution des test unitaires de l'API

Rendez-vous dans le backend:
```bash
cd backend
```

#### **1. Exécution des tests**
```bash
php artisan test
```
ou en utilisant PHPUnit:
```bash
vendor/bin/phpunit
```

#### **2. Exécution du fichier de test TaskControllerTest**
```bash
php artisan test --filter=TaskControllerTest
```

#### **3. Exécution d'une méthode de test spécifique**
```bash
php artisan test --filter=test_user_can_view_a_task
```

## Author

- [Hyppolite T.](https://tinyurl.com/htfmystrikingly)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.