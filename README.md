# RM Hungary — statikus webhely

Ez az ág a jelenlegi RM Hungary projekt statikus HTML/CSS/JavaScript exportját tartalmazza.

- Főoldal: `index.html`
- Aloldalak: azonos útvonalú mappák `index.html` fájljai
- Képek és dokumentumok: `images/`, `uploads/`, `documents/`
- Átirányítási szabályok: `_redirects` (az ezt támogató statikus tárhelyhez)
- Katalógus és keresés adatai: `catalog.json`, `search-index.json`

Helyi előnézethez futtatható például `python3 -m http.server 8080`; majd nyisd meg a `http://127.0.0.1:8080/` címet. A repó feltöltése nem állít be GitHub Pages-t és nem publikálja az oldalt.

A teljes, útvonalankénti tartalmi összehasonlítás részben blokkolva maradt a forráskiszolgáló timeoutjai miatt; részletek: `content-comparison-summary.json` és `PROJEKT_ATTEKINTES.md`.
