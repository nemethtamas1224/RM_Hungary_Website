# CMS-tartalom központosítás — 2026-10-22

## Elvégzett
- A Cosmeco egyrotoros CMB és kétrotoros CB hivatalos oldalán az iframe YouTube-azonosító közvetlenül ellenőrizve: `c13vYRrC0po`, `lBoRkUE_eZo`.
- A videók Payload `products.videos` mezőbe kerültek. Újra futtatható migráció: `scripts/migrate-cms-content-cleanup.ts`; előnézet alapértelmezett, `--apply` alkalmaz.
- Az RM öntözőszárny-család korábban útvonal szerint kódolt bevezetője Payload `overviewTitle` és `overviewIntro` mezőbe került.
- A termékcsalád H1 címe most a szerkeszthető `cardTitle` mezőt használja, ennek hiányában a család nevét.
- Az RM MOP termék főképe most elsőként a Payload `image` mezőből jön; a korábban slughoz rögzített kép csak az admin képtartalom beállításán keresztül kezelhető.
- A Cosmeco videó megjelenítését a közös CMS-videó-renderer végzi; a termékoldali kivételek törölve.

## Biztonság, ellenőrzés
- Apply előtti mentés: `backups/rm-hungary-20261022-044243.zip`.
- SQLite lekérdezés igazolta a két videórekordot, az RM öntözőszárny-család CMS-bevezetőjét és az MOP CMS-kép relációját.
- `pnpm exec tsc --noEmit` sikeres.
- Elszigetelt `pnpm build` sikeres. A futó 3001-es preview buildjét nem írtam felül; az új build 3003-as izolált preview-ján a két Cosmeco termékoldal és az RM öntözőszárny-családoldal HTTP 200. A két videó embedazonosítója és az intro HTML-ben ellenőrizve.
- CUA visszaigazolta, hogy a Mac zárolt; teljes vizuális, mobil és belépett admin-QA továbbra sem történt.
- Éles oldalhoz nem nyúltam.

## Nyitott
- Teljes gyártói márka-/termékportfólió egyeztetés, teljes publikus vizuális és mobil QA, valamint belépett adminfelület QA.
- Két korábbi katalógushiány változatlan: RM Major XJ EVO gépfotó és az azonosítatlan Öntözővízágyú termékazonosítása/képe/tartalma.

## További központosítás és RM 540 GX — 2026-10-22
- Az RM GX, XJ, XJM és FX családbemutatóinak adminban már tárolt adataihoz a publikus oldal eddig külön React tartalmi fallbackot is tartott. A frontend most közvetlenül Payloadból rendereli a négy család valamennyi szakaszát; a felül ismétlődő bevezető megjelenítését megszüntettem. A családoldalak a CMS-kártyacímet használják.
- A RM 540 GX hivatalos modelloldalának felszereltsége, egy gyártói technikai táblázata és a beágyazott videó Payload `technicalSections`, `technicalTables`, `videos` mezőibe került. A termékoldalon korábban meglévő képek, méretrajzok, PDF, dimenziók és felhasználó által megadott tömlőméret-sorok megmaradtak. A user size listában szereplő 50/160-at nem írtam át, mert az külön, felhasználói katalógusadat; a gyártói táblázat külön mutatja a 50/250 és 63/190 értékeket.
- Ellenőrzött gyártói források: [RM 540 GX hivatalos modelloldal](https://www.rmirrigation.com/nl/modellen/professionele-irrigatiemachines/draaibare-bovenbouw/540-gx.html), [RM 540 GX modellkatalógus](https://www.rmirrigation.com/public/Cataloghi/Catalogo-GX-Inglese/540gx.pdf), [RM GX 2021 magyar katalógus](https://www.rmirrigation.com/public/cataloghi2021/Gx2021_Ungherese_Cod213.pdf).
- Mentés az alkalmazás előtt: `backups/rm-hungary-20261022-044935.zip`.
- `pnpm exec tsc --noEmit` és elszigetelt `pnpm build` sikeres. Friss, 3003-as elkülönített production preview: 216/216 sitemap útvonal HTTP 200; a renderelt 433 kép-/dokumentum-URL mind HTTP 200/206. Az RM családok mindegyike és az RM 540 oldal tartalmilag ellenőrizve. Teljes kézi vizuális/reszponzív és belépett admin QA továbbra sincs; produkció érintetlen.

## Gyártói oldali kategóriák központosítása — 2026-10-22
- Az RM gyártói oldal kézzel megadott kategóriafeliratai helyett most az adott gyártóhoz rendelt aktív termékek kategóriáiból képzi a kártyákat, a nevek Payloadból jönnek. A külön kódolt RM modellfelsorolást eltávolítottam, így a felület nem tart fenn a CMS-től független modellszöveget.
- TypeScript és friss elszigetelt production build sikeres. A 3003-as preview-n `/gyartok/rm` a három CMS-kategóriakártyát mutatja, a régi statikus modelllista nem jelenik meg; a 540 GX videó/táblázat/felszerelés ellenőrzött. A friss sitemap 216/216 oldal és HTML-ből talált 433/433 helyi média-/dokumentum-URL HTTP 200/206.
