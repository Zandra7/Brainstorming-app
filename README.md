# Brainstorming-app

## Oversikt over Applikasjonen 
Brainstorming er en kreativ plattform som gir deg og dine venner muligheten til å visualisere og samarbeide om deres ideer. I appen kan du velge å lage et nytt rom eller bli med i et nåværende rom. Når dere er i samme rom kan dere skrive og dele deres ideer gjennom post-it lapper som vises anonymt.

## Servermiljø og databaseopsett
### Installasjonsveiledning
1. **Klon Repositoriet**: Start med å klone repositoriet til din lokale maskin.
2. **Installer Avhengigheter**: Naviger til prosjektmappen i terminalen og kjør `npm install` for å installere alle nødvendige avhengigheter.
3. **Set opp servermiljøet**: 
    * Appen bruker Node.js som servermiljø, med versjonen spesifisert i `package.json`.
    * Express.js brukes som serverrammeverk.
    * Sørg for at Node.js er installert på systemet ditt. Dette kan du verifisere med kommandoen `node -v`.
4. **Databasekonfigurasjon**:
    * Appen bruker Node.js som servermiljø, med versjonen spesifisert i package.json.
    * En SQLite-databasefil, `database.db`, er inkludert i repositoriet.
    * Databasen interagerer med serveren gjennom `sqlite3`-biblioteket i Node.js, som er definert i `package.json`.
5. **Start Serveren**: Kjør kommandoen `node index.js` for å starte serveren. Serveren vil kjøre på port 3000, slik at du kan få tilgang til appen via `http://localhost:3000` i nettleseren.


### Teknologibruk og Avhengigheter
* **Node.js**: En JavaScript runtime for å bygge server-siden av applikasjonen.
* **Express.js**: Et minimalistisk web-rammeverk for Node.js, brukt for å håndtere HTTP-forespørsler og middleware.
* **SQLite**: En lettvekts database brukt til å lagre applikasjonsdata.
* **sqlite3**: Node.js-biblioteket for å integrere SQLite-databasen med serveren.

#### Avhengigheter fra `package.json`:
* `body-parser`: ^1.20.2
* `express`: ^4.18.2
* `node`: ^21.2.0
* `sqlite3`: ^5.1.7

#### Kildekodefiler:
* `index.js`: Hovedserverfilen som håndterer HTTP-forespørsler og konfigurerer serveren.
* `script.js` og `home.js`: Frontend JavaScript-filer for interaksjon med brukergrensesnittet.
* `Style.css` og `home.css`: Stilark for appens brukergrensesnitt.
* `Index.html`, `Signup.html`, `home.html`: HTML-filene som utgjør brukergrensesnittet for appen.

## Feilsøking
* `SQLITE_READONLY: attempt to write a readonly database`: Feil i databasen. Kan løses ved å kjøre index.js filen med `node index.js`.
* `Home` knappen funker ikke. Fjern `id` og `session` fra URL-en for å gå til samme sted.

## Lenker og andre ressurser
### Brukermanual:
[Link til skriftlig brukermanual](Brukermanual%20Nettside%20for%20Medieproduksjon%20med%20Alf%20Johannesen.pdf)

### Figma design/prototype:
[Link til Figma skisse](https://www.figma.com/file/wdplyE8l2h5unyyiRWoFnT/ideer-nettside?type=design&node-id=0%3A1&mode=design&t=KIxz6pRvEIpDR2Aw-1)

### Trello: 
[Link til trello tavle](https://trello.com/b/GXQsQAbw/brainstorming-app)

### Entity relation diagram: 
[Entity relation diagram (må åpnes på draw.io)](er.drawio)
