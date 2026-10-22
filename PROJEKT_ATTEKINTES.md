## 2026-10-22 – A főoldali partnerek teljes listája

- A főoldali „Az általunk forgalmazott márkák” rács most mind a 12, a statikus `/gyartok/` oldalon szereplő gyártót linkeli a saját adatlapjára: Cosmeco, Da Ros, De Cloet, Giunti, Lindsay, Mantovani, Oliveragro, RM, Rovatti, Starpower, Valducci és Vodar.
- A márkarács mind a 12 gyártót megjeleníti. A Lindsay-kártya a felhasználó által megadott helyi logófájlt használja; a logó jelen van a statikus kiadásban.
- Ellenőrzés: helyi böngészőben mind a 12 kártya és belső gyártói hivatkozás megjelent; 11/11 képlogó betöltött. 1280 px-es nézetben 6 oszlop, 390 px-es mobilnézetben 2 oszlop és 390 px-es dokumentumszélesség látszott. A változtatás helyi; a GitHub Pages friss ellenőrzése még hátravan.

# RM Hungary statikus weboldal

- **Cél:** a jelenlegi projekt különálló, statikus, feltölthető változata. A GitHub `main` ága a statikus webhelyet tartalmazza; a GitHub Pages a `main` ágról települ.
- **Munkamappa:** `/Users/nemethtamas/RM/RM_Hungary_Static_2026-10-22/`; statikus kiadás: `site/`; forrásmásolat: `source-snapshot/` (a GitHub statikus kiadásba nem kerül). Célrepo: `nemethtamas1224/RM_Hungary_Website`, alapértelmezett `main` ág.
- **Állapot:** 255 statikus HTML-útvonal, katalógus- és keresési JSON, 49 átirányítás, eredeti médiák/dokumentumok; ajánlatkérő mailto címzettje a forrás adatbázisából: `rmhajduhungary@gmail.com`. A főoldali választóban hibásan megjelenő csévélődob-termékcsalád-logókat a Next Image-megjelenítéshez igazított pozicionálással és lusta betöltéssel javítottam.
- **Ellenőrzés:** 255/255 oldal 200-as választ adott; 1 824 képellenőrzésből nem volt hibás; asztali és mobil szélességen nem volt kilógás. Menü, termékkategória-választás, keresés (2 találat „540 GX”-re) és URL-kódolt mailto mezők ellenőrizve. 19 170 belső hivatkozásból 19 150 közvetlen fájl/útvonal, 20 régi `index.php?alkat=` leképezés pedig az `_redirects` céljával rendelkezik; átirányítási célok és külső URL-ek vizsgálva; a külső PDF-ek helyi projektfájlokra mutatnak.
- **Tartalmi összehasonlítás korlátja:** a 255 útvonalas forrás–másolat szöveg-összevetésből 131 sikeres volt, mind egyezett. A további 124 útvonalon a forrás Next fejlesztői kiszolgálója timeoutolt (74 csak forrásoldali kérés, 50 mindkét oldal); ezek nem bizonyított tartalmi eltérések, tehát a teljes egyezés még nincs igazolva. Lásd `content-comparison-summary.json` és a részletes `content-comparison.json`.
- **Fennmaradó munka:** stabil forráskiszolgálóról vagy előre rögzített HTML-pillanatképből futtasd újra a 124 nem ellenőrizhető útvonal tartalmi összevetését; ezután ismételd az érintett vizuális ellenőrzést. Ez a bizonytalanság dokumentált marad.
- **Főoldali képkorrekció:** a kategória kiválasztásával betöltődő termékcsalád-logók a konténerhez igazodnak, az eredeti képarányt tartják (`contain`), és lusta/dekódolt betöltést használnak. Kézi böngészős ellenőrzés: 5 logó betöltött, mind 237×76 px dobozt töltött ki.

- **GitHub Pages útvonaljavítás (2026-10-22):** a `main` ágon beállított telepítés és a `.nojekyll` fájl mellett a publikus oldalon a CSS, logók, termékképek és navigáció betöltése ellenőrizve.

## 2026-10-22 – Galéria, mobilmenü és átmenetek

- A statikus export 105 HTML-oldalán található termékgalériák eddig csak markupként voltak jelen, működtető kliensoldali kód nélkül. A közös `static.js` most kezeli az előző/következő gombokat, bélyegképeket, körbefordulást, számlálót, billentyűzetet és mobilos lapozást.
- 700 px alatt a Termékek menüpont az áttekintő oldalra navigál; a sok helyet foglaló almenü nem nyílik ki.
- Oldalbetöltéskor és oldalak közötti navigációnál finom áttűnés fut; a horgonyokra görgetés sima, a gombok/képek enyhe visszajelző mozgást kapnak. A `prefers-reduced-motion` beállítást tiszteletben tartja.
- Ellenőrzés: helyi és GitHub Pages nézetben a De Cloet 1TH4 galéria „Következő kép” gombja 2/3-ra váltott. 390 px-es helyi nézetben a hamburger megnyitotta a navigációt, a Termékek almenü rejtve maradt, a Termékek hivatkozás az áttekintő oldalra navigált. A main commit `2db4e59` és a Pages deployment sikeres; az élő galéria képe és számlálója működik.


## 2026-10-22 – Frissített statikus kiadás feltöltése

- A statikus webhely forrása a külön munkapéldány `site/` könyvtára. A `main` repó gyökere változatlanul statikus HTML/CSS/JavaScript kiadás; a Next.js forrásprojektet, adatbázist és `source-snapshot/` mappát nem másoltam a repóba.
- Frissített tartalom: automatikus, közelség alapú térképbetöltés; márkacsaládhoz közvetlen navigáció; a vegyes De Cloet/Mantovani dohánytörő kártya eltávolítása és régi útvonalának átirányítása; mobil nyitókép jobb oldali fókusza; öntözésvezérlés bemutatóoldal és négy kategóriakártya.
- A statikus mappa ellenőrzött állapota: 252 HTML-oldal, 250 keresőbejegyzés, 19 105 helyi hivatkozás, 0 hiányzó fájl; a JavaScript szintaxisellenőrzése sikeres. A teljes forrás-szövegegyezés és a külső linkek teljes elérhetősége továbbra sincs igazolva.
- A `main` ágra történő push elindítja a repó GitHub Pages workflow-ját. A forrásprojekt és az éles, nem GitHub Pages webhely változatlan marad.


## Friss statikus feltöltés előkészítése (2026-10-22)

- A friss külön `site/` kiadást a GitHub `main` legutóbbi statikus állapotából indított, tiszta klón gyökerébe szinkronizáltam. A Next.js alkalmazás forrása, az adatbázis és a `source-snapshot/` nem került át; a `.github/workflows/static.yml` telepítési munkafolyamat megmaradt.
- Az új kiadás 252 HTML-oldalt, 250 keresőbejegyzést, 19 105 helyi URL-hivatkozást tartalmaz; a helyi hivatkozás-ellenőrzés 0 hiányzó fájlt talált. 2 195 statikus forrásfájlt hash alapján összevetettem a szinkronizált tartalommal; mind egyezik. A `static.js` szintaxisellenőrzése és a `git diff --check` sikeres.
- A 255 útvonalas tartalmi összehasonlítás régebbi baseline, nem futott újra az új tartalommal; ezt a `content-comparison-summary.json` jelöli.
- A `main` ágra történő push automatikusan elindítja a GitHub Pages telepítést.


## GitHub-frissítési szokás – 2026-10-23

- A felhasználó kérése szerint a statikus weboldal érdemi frissítéseit ezentúl a GitHub `main` ágára is fel kell tölteni. Az eredeti Next.js projektet és a nem GitHub Pages éles oldalt továbbra sem szabad módosítani.
- A pályázati banner és az öntözésvezérlés oldali piros ajánlatkérő gomb ebben a frissítésben együtt kerül fel.


## 2026-10-23 – Pályázati banner, ajánlatkérés és Rovatti-kártyák

- A felhasználó kérése szerint a statikus webhely frissítéseit rendszeresen fel kell tölteni a GitHub `main` ágára.
- Minden statikus oldalon megjelenik a jobb alsó, lekerekített Széchenyi-pályázati banner, amely a `/palyazat/` oldalra mutat. Az öntözésvezérlés oldal ajánlatkérő gombja piros; célja a kapcsolatoldal.
- A Rovatti-kártyák zöld keretet kapnak `#3A9043` színnel: az érintett Rovatti családkártyák és termékkártyák, a többi márka kártyáinak stílusa nem változik.
- Helyi böngészőben a vezérlésoldal és a pályázati banner jelenléte ellenőrizve. A `main` feltöltés és GitHub Pages visszaellenőrzés a commit után következik.
