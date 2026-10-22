# CMS-központosítási felülvizsgálat — 2026-10-22

## Adatbázis-ellenőrzés

- 120 termékrekord: 117 publikált, köztük 20 megőrzött legacy rekord és 100 publikált aktív katalógustermék.
- A `products.slug` mezőn nincs duplikáció.
- A publikált, nem legacy termékek között nincs kategória nélküli rekord, kategóriától eltérő családhozzárendelés vagy érvénytelen márkakapcsolat.

## Igazolt, kódban rögzített publikus tartalom

- A termékcsaládok CMS-sémájában csak név, slug, kategória, sorrend, rövid leírás, kártyakép/logó és forrásmezők vannak. Nincs családoldali részletes szöveg-/képszöveg-szekció.
- A családoldalak bevezetői és összefoglalói a `src/app/(frontend)/termekek/[...segments]/page.tsx` komponensben családslughoz kötött JSX-ként szerepelnek.
- A GX, XJ, XJM és FX családbemutatók a `gx-family-overview.tsx`, `xj-family-overview.tsx`, `xjm-family-overview.tsx` és `fx-family-overview.tsx` fájlokban tartalmazzák a szöveget és statikus képfájlneveket.
- A GX, XJ/XJM/FX termékoldali táblázatok, közös felszerelés-listák, dimenzióképek és egyes videók a `gx-model-technical.tsx` és `rm-series-technical.tsx` fájlokban slughoz kötött kódból származnak. A termék-adatlap már rendelkezik szerkeszthető `specifications`, `configurations`, `gallery`, `documents`, `hoseSizes` és `description` mezőkkel, de ezek jelenleg nem tartalmazzák vagy nem vezérlik e blokkok egészét.
- Az Albatros/Falcon/Boom/Liquò oldalak tartalma, szárnyhosszai, képgalériája, videói és PDF-jei a `rm-wings-content.tsx` fájlban vannak kódolva; a termék CMS-rekord mezői csak részben vezérlik ezeket.
- Az RM MOP bemutató (`rm-mop-overview.tsx`), valamint az Oliveragro Rotosark videóblokk (`oliveragro-rotosark-videos.tsx`) szintén kódhoz kötött.

## Következő szükséges munka

1. A családbemutató szövegeit, képeit és videóit szerkeszthető Payload-mezőkbe kell költöztetni; a CMS-adat legyen a családoldal egyetlen publikus forrása.
2. A modelloldali táblázatokat, felszereltségeket, méretrajzokat, galériákat, PDF-eket és videókat a termék adatmezőiből kell kirenderelni. A `gxTechnical` mező jelenlegi használatát felül kell vizsgálni, mert a route slugtérképpel kapcsolja be a blokkot.
3. A jelenlegi tartalmat csak adatbázis-mentés után, idempotens migrációval kell átemelni; utána vizuálisan ellenőrizni kell a megfelelő család- és modelloldalakat.
4. Payload-séma-módosítást csak akkor alkalmazz, ha a 3001-es fejlesztői folyamat biztonságosan leállítható. Az aktuális folyamat él, ezért e vizsgálati szakaszban nem módosítottam sémát vagy aktív rekordokat.

A fenti kódhivatkozások nem tekintendők végleges készültségi igazolásnak; az adminból szerkeszthetőség a meződefiníciók és az élő szerkesztőfelület működési ellenőrzése után tekinthető teljesítettnek.

## Frissítés — RM családbemutatók központosítása (2026-10-22)

- A `product-families` CMS-gyűjtemény szerkeszthető mezőket kapott: bemutatócím, bevezető, sorrendezhető bemutatószakaszok (cím, szöveg, első/második médiakép és alternatív szöveg), valamint videólista.
- A `products` CMS-gyűjtemény szerkeszthető kiegészítő műszaki szakasz- és videómezőkkel bővült. A publikus modelloldal ezeket jeleníti meg, ha vannak; a régi, slughoz kötött adatkomponensek addig tartalék megjelenítők maradnak.
- RM GX (14 szakasz), XJ (4), XJM (4) és FX/Magnum (4) bemutatók, címsorok és bevezetők importálva a Payloadba. A kártyákban használt 4 XJM ábra médiatárba került, a többi ábra már médiarekordhoz tartozott. Sem a publikus URL, sem a termék/família kapcsolat nem változott.
- Importer: `scripts/migrate-rm-family-overviews.ts`; `pnpm import:rm-family-overviews` előnézetet ad, `NODE_ENV=production pnpm import:rm-family-overviews -- --apply` idempotens módon importál. Sémafrissítés előtt mentés: `backups/rm-hungary-20261022-030759.zip`.
- Ellenőrzés: a dry-run 4/4 családot már egyezőként jelzett; adatbázisban 26 bemutatószakasz és mind a 25 szakaszhoz tartozó kép-kapcsolat megvan. A 4 családoldal és az admin 111 termék útvonala HTTP 200; 5 médiakép-URL HTTP 200. `pnpm exec tsc --noEmit` és `pnpm build` sikeres.
- Nem ellenőrzött: zárolt Mac és böngésző-hozzáférési korlátozás miatt vizuális böngésző-QA és bejelentkezés utáni adminmező-megjelenés/mentés. A videók, GX/XJ/XJM/FX termékszintű táblázatok, szárny-, MOP- és Oliveragro-blokkok továbbra is részben vagy teljesen kódban vannak.

## Frissítés — RM modelladatok CMS-mezői (2026-10-22)

- A `products` adminban a műszaki kép-/szövegszakaszok, 6 oszlopig szerkeszthető táblázatok és táblázatsorok, valamint videólista használható. A frontend CMS-szekciókból rendereli ezeket; a korábbi slugkód csak tartalék marad olyan modelleknél, ahol nincs CMS-tartalom.
- 22 RM GX/XJ/XJM/FX modell CMS-be költözött: 99 műszaki szakasz, 7 natív reszponzív tömlő-/teljesítménytábla 33 sorral, 23 beágyazott videó 17 modellhez. A 540 GX korábbi külön mezői változatlanok maradtak; a 1100 GX-hez nem került kitalált teljesítménytábla.
- Importer: `scripts/migrate-rm-product-technical-content.ts`; `pnpm import:rm-technical-content` előnézet, `NODE_ENV=production pnpm import:rm-technical-content -- --apply` alkalmazás. A próbaimport a 22 rekordot már egyezőként ismerte fel. Az új táblázatmező sémamódosítása előtti mentés: `backups/rm-hungary-20261022-031420.zip`.
- Build sikeres. Éles jellegű helyi szerveren a 22 termékútvonal HTTP 200; mindegyiken a standard felszerelés blokk renderelődik. A 7 natív táblázat és a 17 videós termék, továbbá mind a 4 CMS családbemutató HTTP/HTML tartalma ellenőrizve.
- A vizuális oldalkép és a bejelentkezett adminon végzett mezőszerkesztés/mentés továbbra sem ellenőrizhető a zárolt Mac és elutasított IAB-hozzáférés miatt. A szárnyak, MOP, Oliveragro, egyéb márkák teljes műszaki blokkja és a teljes webhely vizuális QA nyitott.

## Frissítés — teljes helyi URL- és médiatár-ellenőrzés

- Az új production build után a sitemap mind a 211 útvonala helyi HTTP 200-at adott; a Payload 634 médiabejegyzéséhez 0 hiányzó `public/uploads/` fájl tartozik. Ez az útvonal- és fájllétezési vizsgálat nem helyettesíti a vizuális minőségellenőrzést.
- Az admin útvonal HTTP 200-zal betölt, de zárolt Mac/IAB policy miatt bejelentkezett mezőszerkesztést és vizuális jóváhagyást nem tudtam végezni.

## 2026-10-22 frissítés – Öntözőszárny termékek

Az Albatros/Falcon/Boom/Liquò termékek leírásai, specifikációi, galériaképei, videói és PDF-jei már CMS mezőkben vannak; a termékoldalak közös renderert használnak. A korábbi `rm-wings-content.tsx` statikus megjelenítő eltávolítva az útvonalról. Importer: `scripts/migrate-rm-wings-to-cms.ts`; előnézet 4/4 egyező. Build/TypeScript és a négy útvonal ellenőrzése sikeres. Hátralévő kódolt tartalom: MOP overview és Oliveragro videóblokk.

## 2026-10-22 frissítés – RM MOP

Az MOP termékoldal műszaki/bemutató szakaszai, RM APS táblázata, hőcserélő- és szivattyúábrája, 10 képe, PDF-je és gyártói videócsatorna-hivatkozása CMS mezőkre került; a régi statikus blokkot az útvonal már nem használja. Importer: `scripts/migrate-rm-mop-to-cms.ts`; az ismételt előnézet a CMS-tartalmat egyezőnek találta. `pnpm exec tsc --noEmit` és build sikeres, helyi MOP-termékoldal HTTP 200. Hátralevő kódolt tartalom: Oliveragro Rotosark videóblokk. MOP/szárny médiaduplikáció- és admin/vizuális QA nyitott.


## 2026-10-22 frissítés – Oliveragro

A Rotosark termékoldal 31 videója, 11 csoport megnevezésével a CMS-be került. A statikus komponens kikerült az útvonalból. `pnpm import:oliveragro-videos-cms` újrafuttatási előnézet egyező; `pnpm exec tsc --noEmit`, `pnpm build` és a termékútvonal ellenőrzése sikeres. A családkártyák és képek teljes CMS-centralizációja, valamint az admin- és vizuális QA még ellenőrzendő.

## 2026-10-22 frissítés – RM modelloldalak CMS-adatok kizárólagos megjelenítése

- A termékoldali útvonal többé nem importálja és nem jeleníti meg a GX/XJ/XJM/FX régi React technikai blokkjait tartalék tartalomként; kizárólag a termék CMS-mezői adják a publikus műszaki szakaszokat, táblázatokat és videókat. A korábbi JSX-adatmodulok megmaradtak az idempotens CMS-importerek adatforrásaként.
- A 3001-es Payload API-ból újraolvasott 22, korábban kódolt RM GX/XJ/XJM/FX modell mindegyikén legalább egy CMS-műszaki szakasz, táblázat vagy videó létezik; a forrásblokkok 22/22 termékhez illeszkednek.
- A `NODE_ENV=production` alatt futtatott RM-technical importer dry-runja 0 változtatást és 22 egyező terméket jelzett. Fejlesztői környezetben a preview sémapush-indexütközés miatt hibázott; adatbázis-adatot nem módosított.
- `pnpm exec tsc --noEmit` sikeres. Az izolált production build az adatbázis külön másolatának hozzáadása után sikeres. A vizuális és belépett admin QA továbbra is nyitott; éles publikálás nem történt.
- Az izolált production preview szerveroldali HTML-ében a 540 GX, 840 XJ, 840 XJM és 900 FX termékoldalak HTTP 200-at adtak, és a megfelelő CMS terméknév, illetve standard felszerelés megjelent.

## 2026-10-22 teljes publikus útvonal- és képellenőrzés

A sitemap 211 helyi útvonalából 211 HTTP 200; a HTML-ekből kinyert 350 helyi képkérés közül mind HTTP 200. Eredmény csak szerveroldali elérhetőséget bizonyít; vizuális és belépett admin QA továbbra is szükséges.

## 2026-10-22 MOP képduplikátum-ellenőrzés

A `SistemaCWM.jpg` / `SistemaCWM-1.jpg` és `Pompe.png` / `Pompe-1.png` feltöltések SHA-256 egyezését ellenőriztem. A régebbi párhuzamos médiarekordoknak nem volt adatbázis-hivatkozása; a hivatkozott példányok maradtak. Mentés: `backups/rm-hungary-20261022-032759.zip`. A deduplikáló script most az RM technikai szakaszok és családképek közvetlen média-FK-it is figyelembe veszi. MOP oldal, két kép és build HTTP ellenőrzése sikeres.
## 2026-10-22 – RM öntözőszárny CMS-galéria kapcsolatok helyreállítva

- A `products.gallery` jelenlegi DB-kapcsolatainak összevetése az RM gyártói galériaforrás-listáival azt mutatta, hogy az Albatros, Falcon, Boom és Liquò oldalon csak az egyedi kártyafőfotó szerepelt; a korábban Payloadba importált gyártói galériafotók nem voltak a termékekhez kapcsolva.
- A `scripts/migrate-rm-wings-to-cms.ts` most meglévő galéria esetén is egyesíti a forrásképeket, megtartja a már kapcsolt fotókat, elhagyja az azonos SHA-256 tartalmú ismétlődő galériaképeket, és nem írja felül az eltérő CMS-szöveget. Mentés alkalmazás előtt: `backups/rm-hungary-20261022-033051.zip`.
- Az Albatros/Boom/Falcon/Liquò termékgaléria 8/16/16/16 képet tartalmaz. Az új production build és `pnpm exec tsc --noEmit` sikeres; mind a négy termékútvonal HTTP 200, a hozzájuk renderelt 8/16/16/16 kép-URL mind HTTP 200.
- A helyi böngészős vizuális QA-t nem sikerült elvégezni: a CUA visszajelzése szerint a Mac zárolt és kézi feloldást igényel. A teljes asztali/mobil/admin QA továbbra is nyitott.

## 2026-10-22 – Öntözőszárnyak főképei a CMS-ből

- Az Albatros, Falcon, Boom és Liquò termékoldalon korábban a Payload `image` mező a keskeny logófájlt tartalmazta, míg a tényleges főfotó kódolt fájlútvonalról jelent meg. A négy modell saját galériájának első, 1095×746 px-es gyártói fotóját beállítottam CMS-főképként. A Condor a saját, 587×387 px-es kártyafotóját kapta főképként.
- Az RM öntözőszárny-család kártyája a galéria első, 1095×746 px-es Albatros-fotóját kapta. A termékoldal most a CMS-képet részesíti előnyben; a statikus fájlútvonal csak tartalék.
- Előzetes DB-mentés: `backups/rm-hungary-20261022-034334.zip`. Az importer előnézete 5 termékmódosítást és 1 családképet jelzett; az alkalmazást követő újra-előnézet 0 termékmódosítást mutatott.
- `pnpm exec tsc --noEmit` és `pnpm build` sikeres. A család- és öt termékútvonal HTTP 200; a szerveroldali HTML-ben a megfelelő CMS-főképek URL-jei ellenőrizve. Vizuális böngészős QA még nincs.

## Giunti szűrőtermékek családmezője — 2026-10-22

- A négy meglévő Giunti vízszűrő rekord ugyanahhoz a gyártóhoz és alkategóriához tartozott, de külön családkapcsolat nélkül szerepelt. Létrejött a CMS-ben szerkeszthető `Giunti szűrőrendszerek` család; a négy termék családkapcsolatot kapott.
- A családleírás, kártyaszöveg, bemutatószakasz és kép a `product-families` mezőiben van; a publikus családoldal az aktuális család- és termékrekordokból renderel.
- Importer: `scripts/group-giunti-filter-products.ts`; alkalmazás előtti mentés: `backups/rm-hungary-20261022-080736.zip`. API, kategória-/családoldali SSR, kanonikus termékútvonal, kép HTTP 200 és TypeScript ellenőrzött.
- A Giunti hivatalos kategória 12 terméket sorol fel; négy jelenlegi helyi rekord került e család alá. A teljes forrásportfólió termékazonosítását és további egyezéseit folytatni kell.
