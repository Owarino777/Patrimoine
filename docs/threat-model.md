# Threat Model initial

## Données sensibles

- identité utilisateur ;
- valeur du patrimoine ;
- composition du portefeuille ;
- décisions d’investissement ;
- historique des transactions manuelles.

## Menaces principales

1. Accès horizontal aux données d’un autre utilisateur.
2. Compromission de session.
3. Exposition de secrets.
4. Injection ou entrée malveillante.
5. Export de données non autorisé.
6. Logs contenant des données financières.
7. Mauvaise configuration Supabase/RLS.
8. Dépendance compromise.
9. Suppression ou altération accidentelle.

## Mesures MVP

- deny by default ;
- RLS et contrôles serveur ;
- validation de schéma ;
- cookies sécurisés ;
- TLS ;
- CSP ;
- rate limiting ;
- journaux structurés sans données financières détaillées ;
- sauvegardes ;
- audit des dépendances ;
- séparation dev/test/prod ;
- export et suppression authentifiés ;
- tests d’isolation entre utilisateurs.
