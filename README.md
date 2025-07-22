# DICO Frontend

Dit is de frontend voor de DICO (Diabetic Connect) applicatie, een platform voor het beheren van glucose, medicatie en lifestyle. Gebouwd met React en Vite.

## Installatie

1.  **Clone de repository:**
    ```bash
    git clone <jouw-repository-url>
    cd frontend-dico-eindopdracht
    ```

2.  **Installeer de dependencies:**
    ```bash
    npm install
    ```

## Lokale Ontwikkeling

Om de applicatie lokaal te draaien, volg je deze stappen:

1.  **Maak een `.env` bestand aan** in de root van het project en voeg de volgende regel toe. Dit configureert de applicatie om te communiceren met je lokale backend.
    ```
    VITE_API_URL=http://localhost:8000/api
    ```

2.  **Start de development server:**
    ```bash
    npm run dev
    ```

    De applicatie is nu beschikbaar op [http://localhost:5173](http://localhost:5173) (of een andere poort als 5173 bezet is).

## Scripts

-   `npm run dev`: Start de Vite development server.
-   `npm run build`: Bouwt de applicatie voor productie in de `dist` map.
-   `npm run lint`: Draait de ESLint-checker om codekwaliteit te controleren.
-   `npm run preview`: Start een lokale server om de productie-build te bekijken.