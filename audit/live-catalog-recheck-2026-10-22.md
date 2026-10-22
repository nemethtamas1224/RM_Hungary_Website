# Élő katalógus újraellenőrzése — 2026-10-22

Forrás: futó helyi Payload API (`127.0.0.1:3001`), friss API-válaszok, valamint a jelenlegi frontend kép-fallback logikája.

## Aktuális méretek és képlefedettség

- 67 kategóriarekord: 42 aktív katalóguselem (7 gyökér, 35 alkategória), a többi archív.
- 27 publikált termékcsalád; mind a 27-hez van saját vagy termékről öröklődő megjeleníthető kép.
- 125 publikált termékrekordból 105 nem legacy katalógustermék; 96 gyártóhoz kapcsolt, 9 általános vagy még nem gyártóhoz rendelt.
- A 35 alkategóriakártya kép-fallbackje mind feloldható kategória-, család- vagy termékképből. A gyökérkategóriák külön SVG ikonrácsban jelennek meg.
- Az aktív termékek főképhiánya két rekordra korlátozódik: RM Major XJ EVO (112) és Öntözővízágyú (98). A 98-as rekord gyártója/modellje nem azonosított, és a rövid/részletes leírása, képe, műszaki tartalma továbbra is üres. A 112-es modell külön gyártói azonossága és képe nem igazolt; nem kapta meg a hasonló nevű Major EVO képét/adatát.
- A Condor rekord rendelkezik képpel, galériával és rövid összefoglalóval, de részletes leírása, forrásolt szakasza és specifikációja nincs. A felhasználó korábbi jelzése szerint egyelőre nincs több Condor-információ; az RM 2021-es katalógus általános Condor-megjelenése önmagában nem igazol modell- vagy műszaki adatot.

## Friss build és staging URL-ellenőrzés

- `pnpm exec tsc --noEmit`: sikeres.
- Elkülönített production `pnpm build`: sikeres. A korábbi sikertelen próba a `node_modules` symlink külső elérési útja miatt történt; a teljes projektnode_modules-t használó izolált build ezt megoldotta. A futó 3001-es folyamat `.next` könyvtárát a build nem érintette.
- A 3001-es staging sitemap 222/222 útvonala HTTP 200.
- A renderelt HTML-ekből ellenőrzött 5 600 helyi URL (5 279 nem HTML asset: 4 456 JPEG, 776 PNG, 34 PDF, 1 CSS, 12 JavaScript) mind HTTP 200/206.
- A veszteségmentesen újratömörített 19 PNG külön Range-kérése szintén HTTP 206; kép-pixelazonosság, PNG metadata chunkok, eredeti mentések és hash-ek igazolva.

## Média és nyitott QA

- Az ismert azonos képmásolatok és a 93 korábban eltávolított, mentett másolat dry-run ellenőrzése nem talált új törölhető esetet; az előnézet a régi jelölteket már eltávolítottként jelezte. Nem történt új törlés.
- A build, HTTP-lefedettség és API-kapcsolatvizsgálat nem igazolja a vizuális képminőséget vagy a teljes mobil/desktop viselkedést. A staging UI böngészőben nem nyílt meg; a CUA szerint a Mac zárolt, és kézi feloldás szükséges.
- Bejelentkezés utáni admin-szerkesztési és mentési folyamat továbbra sincs igazolva. A teljes külső márkakatalógus-teljesség és a két termékazonosítás is nyitott.
- Éles rendszerhez nem nyúltam.

## Számozott termékek sorrendje – Mantovani javítás

- Az újraolvasott staging API a Mantovani permetezőcsalád IDROJET 125 és 1400 VV rekordjain egyaránt `sortOrder: 0` értéket mutatott. A családoldal kisebb rendezési érték szerint rajzolja ki a kártyákat.
- A többi publikált, számozott termékcsalád aktuális sorrendjének ellenőrzése nem talált további növekvő sorrendi eltérést.
- Mentés után a két rekord `sortOrder` értéke 125, illetve 1400 lett. A Payload API visszaolvasta mindkét értéket; a Mantovani családoldal SSR HTML-jében az IDROJET 125 a 1400 VV előtt szerepel.
- Mentés: `backups/rm-hungary-20261022-071748.zip`. Ismételhető importer: `scripts/fix-mantovani-sprayer-order.ts` (alapértelmezett előnézet, `--apply` módosít).

## Aktuális ismételt ellenőrzés — 2026-10-22

- A 3001-es sitemap 222 útvonalát a helyi staging hostra átirányítva mind a 222 HTTP 200-at adott. A HTML-ekből közvetlenül kigyűjtött 424 külön kép-/dokumentum-URL mind HTTP 200/206; hibás URL nem volt.
- `pnpm exec tsc --noEmit` sikeres az új sorrendi importerrel együtt.
- CUA továbbra is a lokális 3001-es oldal `ERR_CONNECTION_REFUSED` állapotát mutatta, és jelezte, hogy a Mac kézi feloldása szükséges. Ezért kézi vizuális, reszponzív és belépett admin-QA továbbra sem igazolt.


## 2026-10-22 — Forrásellenőrzés alatt álló rekordok és staging frissítése

- A 112-es `RM Major XJ EVO` és a 98-as `Öntözővízágyú` rekord piszkozatba került `source-check` állapotban. A rekordok, slugok, kategóriakapcsolatok és belső megjegyzések megmaradtak; nem töröltem adatot. Az azonosság/kép, illetve a vízágyú tartalma továbbra is nyitott.
- Módosítás előtti adatbázis- és feltöltésmentés: `backups/rm-hungary-20261022-072353.zip`. Ismételhető, előnézetes importer: `scripts/defer-unverified-public-products.ts` (`--apply` módosít).
- Az izolált `pnpm build` sikeres. A friss build először külön previewban, majd a helyi 3001-es stagingen lett ellenőrizve. A sitemap 220 útvonala között egyik piszkozat slugja sem szerepel; a csévélődob, öntözőszárny, motoros szivattyú és `/admin` útvonal HTTP 200.
- Kézi vizuális, reszponzív és bejelentkezett admin QA továbbra sincs igazolva; a Mac zárolt. Éles oldalhoz nem nyúltam.

## 2026-10-22 — Teljes aktív termék- és kártyaszöveg SSR-ellenőrzés

- Az aktuális Payload API 103 publikált, nem legacy terméket adott. Mind a 103 termékhez tartozik fő kép és rövid összefoglaló; mind a 103 termékútvonal HTTP 200, és szerveroldali HTML-jükben a megfelelő termék-összefoglaló, illetve a hozzákapcsolt fő kép szerepel.
- Mind a 27 publikált családkártyát a tényleges kategóriaoldal HTML-jében ellenőriztem: megjelenik a CMS szerinti kártyacím, a rövid szöveg és a családhoz vagy kapcsolódó termékhez igazolt kép.
- Mind a 35 aktív alkategóriának van leírása. A 7 korábban üres mezőt a `scripts/fill-category-card-descriptions.ts` töltötte ki, Payload-visszaolvasással és egyedi kategóriaútvonalon ellenőrizve.
- Egyetlen aktív termék nem rendelkezik részletes leírással vagy egyéb műszaki/strukturált tartalommal: RM Condor (49). Van képe, galériája és rövid összefoglalója; a felhasználó jelezte, hogy egyelőre nincs további információ. Nem egészítettem ki kitalált specifikációval.
- Ez szerveroldali tartalmi és URL-ellenőrzés, nem kézi vizuális, mobil vagy admin-QA. A staging gépi útvonal-QA 220/220 HTTP 200 oldalt mutat; éles rendszerhez nem nyúltam.
