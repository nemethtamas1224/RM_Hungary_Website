# GitHub Pages előkészítési állapot

- **Forrásmásolat:** `~/RM/RM_Hungary_Website/`.
- **A kódbázis:** Next.js 16 + Payload CMS 3; a publikus oldalak a CMS adatbázisból olvasnak. Admin, szerveroldali útvonalak és ajánlatkérő API is része az alkalmazásnak.
- **GitHub Pages-korlát:** Pages statikus tárhely. Nem futtat Next.js szervert vagy Payload CMS-t, nem szolgál ki adatbázist, és nem kezeli a POST API-t. Egy egyszerű Next.js statikus export a mostani `force-dynamic` oldalakon és API-route-okon elbukna.
- **Előkészített állapot:** a projektforrás és publikus médiatár külön mappába másolva; helyi adatbázisok, mentések, `.env.local`, `node_modules`, `.next` és belső auditanyagok kihagyva. A `.gitignore` tiltja a helyi titkok és adatbázisok feltöltését.
- **Nincs** Pages workflow vagy statikus export konfiguráció hozzáadva, mert a jelenlegi alkalmazást nem tudná szabályosan buildelni és működtetni.
- **Következő műszaki döntés:** (1) statikus weboldal készítése külön, exportált tartalommal és külső űrlapmegoldással; vagy (2) a Payload/Next alkalmazás olyan hoszton fut, amely szerveroldali kódot támogat, és a domain arra mutat. A CMS-admin és az ajánlatkérések megőrzéséhez a 2. út kell.
- **GitHubra feltöltés nem történt.**

## Railway élesítés előkészítése

- A `start` parancsot a Railway által megadott `$PORT` porton és `0.0.0.0` címen indítjuk.
- Az éles adatbázis és a Payload-feltöltések tartós Railway-kötetre kerüljenek; ezeket soha ne commitoljuk.
- A meglevő `data/rm-hungary.db` adatbázist és `public/uploads/` fájlokat külön, biztonságos úton kell a kötetre másolni.
- Szükséges Railway-változók: `PAYLOAD_SECRET` (Railway-ben tárolt titok), `DATABASE_ADAPTER=sqlite`, `DATABASE_URL=file:./data/rm-hungary.db`.
- Első élesítés előtt ellenőrizni kell az admin belépést, tartalmat, képfeltöltést és az űrlapot; automatikus e-mail értesítés nincs konfigurálva.
