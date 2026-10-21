# GitHub Pages és Render élesítési állapot

- **Forrásmásolat:** `~/RM/RM_Hungary_Website/`.
- **A kódbázis:** Next.js 16 + Payload CMS 3; a publikus oldalak a CMS adatbázisból olvasnak. Admin, szerveroldali útvonalak és ajánlatkérő API is része az alkalmazásnak.
- **GitHub Pages-korlát:** Pages statikus tárhely. Nem futtat Next.js szervert vagy Payload CMS-t, nem szolgál ki adatbázist, és nem kezeli a POST API-t. Egy egyszerű Next.js statikus export a mostani `force-dynamic` oldalakon és API-route-okon elbukna.
- **Előkészített állapot:** a projektforrás és publikus médiatár külön mappába másolva; helyi adatbázisok, mentések, `.env.local`, `node_modules`, `.next` és belső auditanyagok kihagyva. A `.gitignore` tiltja a helyi titkok és adatbázisok feltöltését.
- **Nincs** Pages workflow vagy statikus export konfiguráció hozzáadva, mert a jelenlegi alkalmazást nem tudná szabályosan buildelni és működtetni.
- **Következő műszaki döntés:** (1) statikus weboldal készítése külön, exportált tartalommal és külső űrlapmegoldással; vagy (2) a Payload/Next alkalmazás olyan hoszton fut, amely szerveroldali kódot támogat, és a domain arra mutat. A CMS-admin és az ajánlatkérések megőrzéséhez a 2. út kell.
- A forrás GitHubon található: `https://github.com/nemethtamas1224/RM_Hungary_Website` (a felhasználó jóváhagyásával nyilvános repository).

## Render élesítési előkészítése

- A Render megfelelő Next.js web service-t és tartós lemezt támogat. Az alkalmazás `start` parancsa a `0.0.0.0` címen, a hoszt által megadott `$PORT` porton indul.
- A Render-lemez javasolt csatolási útja `/var/data`; ugyanoda kerül az SQLite adatbázis (`DATABASE_URL=file:/var/data/rm-hungary.db`) és a CMS-média (`MEDIA_UPLOAD_DIR=/var/data/uploads`).
- Változók: `DATABASE_ADAPTER=sqlite`, `DATABASE_URL=file:/var/data/rm-hungary.db`, `MEDIA_UPLOAD_DIR=/var/data/uploads`, `PAYLOAD_SECRET` (titokként).
- Az alkalmazás szerveroldali; az oldalak kéréskor olvassák a Payload-adatbázist. A root layout dinamikus renderelésével a production build adatbázis nélkül is lefuthat, de az élő szervernek futáskor elérhető adatbázis és médiatár szükséges.
- Az adatátviteli csomag helyben található: `/Users/nemethtamas/RM/deploy-staging/RM_Hungary_Website_DATA.tar.gz`. A fájl csak a Render-lemezre kerülhet, ne GitHubra.
- Render SSH/SCP segítségével a csomagot fel kell másolni a futó szolgáltatásra, kicsomagolni `/var/data` alá, majd ellenőrizni a médiaútvonalat és adatbázist.
- A GitHub-ág automatikus Render újratelepítést indít. Leállítás/újratelepítés az adatlemezt nem üríti; az egyetlen szolgáltatáspéldányos korlát elfogadható ennél a kis tartalomkezelő oldalnál.
- Első élesítés előtt ellenőrizendő az admin belépés, oldaltartalom, képfeltöltés és űrlap. E-mailes ajánlatkérés-értesítés nincs konfigurálva.

## Render build állapota

- 2026-10-21-én az első Render build a hiányzó `PAYLOAD_SECRET` miatt állt le. A tulajdonos jelzése szerint a titkot már a Render Environment felületén beállította; értéke nem került a repóba.
- A Render-kompatibilis kód a `MEDIA_UPLOAD_DIR` változóval tartós lemezre irányíthatja a feltöltéseket; a root layout dinamikus, így build közben nem igényel adatbázist.
- A Render build a `PAYLOAD_SECRET`-et már elfogadta, majd megbukott hiányzó SQLite fájlon. A root layout javítása helyben sikeresen buildelt szándékosan nem létező adatbázis-útvonallal.
- A forrás commit/push és az új Render build ellenőrzése következik. Tartós lemez és adatcsomag átvitele szükséges az élő tartalomhoz; Render csomagváltás vagy fizetős tárhely nincs engedélyezve.

## Render futási ellenőrzés (2026-10-21)

- A javított build sikeres és a Next.js szerver elindult, de a weboldal első kérésénél hiányzó `./data/rm-hungary.db` miatt hibázik.
- A Render fájlrendszere tartós lemez nélkül ideiglenes. Éles adatbázishoz és képfeltöltésekhez fizetős web service és `/var/data` lemez szükséges.
- Ellenőrzött díjszabás: a web service legkisebb fizetős csomagja $7/hó; lemez $0.25/GB/hó. A bővítés és adatcsomag átvitel még nincs elvégezve.
