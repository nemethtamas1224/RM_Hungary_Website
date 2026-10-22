# Katalóguskártyák admin központú adatai — 2026-10-22

## Kezdőlapi partnerlogó-fallbackek eltávolítása — 2026-10-22

A kezdőlap kiemelt partnerkártyáihoz a Manufacturers `logo` kapcsolat volt az elsődleges adatforrás, de megmaradt egy slug→statikus fájlútvonal tartaléklista is. Mivel a ténylegesen kiemelt öt márka logója a CMS-ben megvan (staging API ellenőrizte), a tartaléklista kikerült. Így az adminban cserélt logó a kezdőlapon is közvetlenül érvényesül, második képfájl-forrás karbantartása nélkül. Ellenőrzés: TypeScript és production build sikeres; külön, 3002-es helyi previewban kezdőlap HTTP 200, az öt logó forrása Payload média-URL. A kézzel kiválasztott kiemelt márkák köre továbbra is a kezdőlap kódjában van meghatározva; CMS mezővé emelése későbbi fejlesztési lehetőség.

### A kiemelt márkalista admin kezelése — 2026-10-22

A Gyártók mezői közé került `featuredOnHomepage` és `homepageSortOrder`; az öt meglévő márka értékei RM, Rovatti, Starpower, Giunti, De Cloet sorrendben mentve. A kezdőlap CMS-kérdezése ezekre a mezőkre szűr és rendez, megszűnt a sluglista a frontendben. SQLite-mentés: `backups/rm-hungary-20261022-065238.zip`. Payload types újragenerálva; TypeScript/build sikeres; API és külön helyi production preview ellenőrizte a mezőket és a kezdőlapi sorrendet. A 3001 staging régi buildje nem lett lecserélve; frissítése és kézi admin QA függőben.

## Elkészült

- A termékcsaládok adminlapján szerkeszthető `cardLogo`, `cardTitle`, `cardDescription`, `image` és `sortOrder` mezők vezérlik a családkártyákat. A főoldali RM GX/JX/XJM/FX választó ugyanezekből a családrekordokból olvas.
- A termékadminban `cardImage`, `cardLogo`, `cardDescription`, `cardHoseSizes`, `sortOrder` és `showInFamily` állítja a kártyaképet, emblémát, rövid szöveget, kártyaméreteket, sorrendet és megjelenítést.
- Az RM GX, JX, XJM és FX kártyák médiaadatait Payloadba importáltam. Az RM öntözőszárnyak és a két motorosszivattyú-család kártyaképei, logói és leírásai is CMS-adatként szerepelnek.
- A csévélődob családok sorrendje: GX, JX, XJM, FX. A modellek számozás szerint növekvő sorrendben jelennek meg; a korábbi XJM és FX rejtett modellrekordjai megmaradnak, de `showInFamily=false` állapotúak. A Major XJ EVO is külön rekord, nem keveredik a Major EVO-val.
- A családkártyák a saját kép hiányában a család rendezett termékei közül az első elérhető `cardImage` vagy `image` fotót veszik át. Ez tölti ki a három Rovatti-családkártya képi hiányt a már meglévő termékfotókkal.
- XJ/XJM/FX kategóriakártya-méretek külön adminmezőbe kerültek; a GX kártyaméretek az admin `hoseSizes` értékeiből másolt, szerkeszthető kártyamezők. A publikus kód többé nem tartalmaz ezekhez ismétlődő méretlistát.
- Ismételhető import: `pnpm import:catalog-card-data`. A mezőbővítéseket tartalmazó helyi sémát az admin indulása szinkronizálta. Importok előtti mentések: `backups/rm-hungary-20261022-013822.zip`, `013905.zip`, `014024.zip`, `014109.zip`.

## Ellenőrzés

- `pnpm build`: sikeres a végleges alkalmazáskódon.
- Helyi, éles módú előnézetben ellenőriztem a csévélődob családkártyák sorrendjét és logóit, az XJ/XJM modellkártyákat és méretlistákat, az RM/Starpower szivattyúk logóit és termékképeit, valamint az öntözőszárnyak képeit és szövegeit.
- A Payload admin belépést kér; adminmezőket adatbázisséma és gyűjtemény-konfiguráció alapján ellenőriztem, de belépés utáni kezelőfelületi QA nem történt.
- Négy RM XJM/FX modell gyártókapcsolata a család rekordján levő RM gyártó alapján javítva. A teljesen üres 117-es draft termékrekord a `backups/rm-hungary-20261022-020045.zip` mentés után eltávolítva; a többi rekordhoz nem nyúltam.
- A `pnpm dev` Payload SQLite fejlesztői séma-push ismételt index-létrehozási hibával áll le (`products_name_idx` már létezik). A friss build `pnpm start` módban helyben működik. A fejlesztői séma-push eltérés javítandó külön lépésben.

## Teljes katalógusauditból fennmaradt tételek

A korábbi 42-es szám az összes kategóriát összeadta, beleértve a hét gyökérkategóriát is, amelyek külön ikonos választóként jelennek meg. Az aktuális adatbázisban 35 alkategória van; ebből 2 saját kategóriaképet használ, további 10 a hozzá kapcsolt termékcsalád hiteles képét veszi át automatikusan, 23-nál pedig jelenleg nincs közvetlenül hozzárendelt kategória-, család- vagy termékkép. A család- és termékkép-fallback bekerült a kategóriakártyák megjelenítésébe; kategóriakép elsőbbséget élvez, a leírás pedig a kategória, majd a kapcsolódó család és termék leírásából jön. Helyi energiaellátás oldalon a három kapcsolt generátor/napenergia-kártyán vizuálisan igazolt a kép és az egysoros szöveg.

A korábbi 117-es termékszám és hiányértékek egy korábbi adatbázis-pillanatfelvételből származtak. A 2026-10-22-i újramérés szerint 97 nem legacy termék publikált; közülük 2 főképhiányos (Öntözővízágyú, RM Major XJ EVO), 1 rövid összefoglaló hiányzik (Giunti Öntözővízágyú), 8-nál nincs `sourceDetails` mező. A három korábban hiányos RM XJM rekord megkapta az igazolt családszintű leírás adminban szerkeszthető változatát. A 35 aktív alkategóriából 27-nek nincs saját kategóriaképe; család-/termék-fallback működése külön marad. Teljes oldalszintű és mobil QA, valamennyi márka teljessége, tárhely-optimalizálás és admin belépés utáni ellenőrzés továbbra is hátravan.

## Frissített katalóguskép-lefedettség és örökölt géptípusok — 2026-10-22

- Friss, `data/rm-hungary.db`-ből végzett lekérdezés a 35 aktív alkategórián: 2 saját kategóriakép, 10 családkép-fallback, 15 termékkép-fallback, 8 kép nélkül. A korábbi 23-as hiányérték a termékkép-fallback megjelenítési logika és a későbbi médiafeltöltések előtti pillanatfelvétel volt.
- A `Bakháthúzó gépek` (101) rekord 6, az azonos nevű régi RM alkategóriaoldalon közölt képet; a `Palántaültető gépek` (102) rekord 2, a saját régi RM oldalán közölt képet kapott. A kategóriaoldalakon megjelenő rövid leírás és termékoldali szöveg a régi RM magyar bemutató alapján készült; a tényszerű tartalmon kívüli forrásmegjegyzések a CMS belső mezőiben maradnak.
- Import: `pnpm import:legacy-category-machines` (alapértelmezésben csak előnézet; alkalmazás `-- --apply` kapcsolóval). Mentések az alkalmazás előtt: `backups/rm-hungary-20261022-020720.zip` és az átdolgozott, látogatói szövegezés alkalmazása előtt `backups/rm-hungary-20261022-020836.zip`.
- Mindkét helyi termékoldal megnyílt a 3001-es production preview-ban; cím, egysoros bevezető, főfotó, leírás és galéria hozzáférhetőségi nézetben ellenőrizve. A publikus leírásból eltávolítottam a forrásra utaló szerkesztői fordulatokat.
- Az aktuális adatbázisban további 9 publikált termék főképe hiányzik: HydroG csepegtetőszalag, Öntözővízágyú, általános Permetezőgépek, Dohánytetejező gépek, Dohánytörő kombájnok, Dohányszárító kamrák, Zölddohány-feldolgozó gépek, Mezőgazdasági ívsátor és RM Major XJ EVO. Ezek közül képet csak pontos forrásazonosítás után szabad társítani.

## Hozzáadott családbesorolás és ismétlődés megszüntetése

- A Valducci Hidránsfej a hivatalos Valducci márka- és Giunti termékoldal alapján a `Valducci hidránsfejek` család alá került; a kapcsolódó gyártói leírás és logó Payloadban van. Import: `pnpm import:valducci-family`; mentés: `backups/rm-hungary-20261022-014255.zip`.
- A kategóriaoldali terméklista most csak család nélküli termékeket mutat; családbesorolt rekord nem ismétlődik a kategóriaszinten és családszinten egyszerre. A Valducci kategória, család és termék production preview-ban ellenőrizve; build sikeres.

## Kezdőlapi márkalogók CMS-kapcsolata — 2026-10-22

Az RM, Rovatti, Starpower, Giunti és De Cloet meglévő `media` rekordjai beállítva a megfelelő gyártói rekord `logo` mezőjébe. A kezdőlap `depth: 1` kapcsolattal tölti be és CMS-képet jelenít meg; csak hiányzó logómezőnél használja a korábbi helyi fallbacket. Ismételhető import `scripts/link-featured-brand-logos.ts`, előnézet az alapértelmezett, alkalmazás `-- --apply` kapcsolóval. Backup: `backups/rm-hungary-20261022-054827.zip`. Staging API és SSR HTML igazolja mind az öt képet; TypeScript sikeres. Friss isolated build még folyamatban.

A kártyaközpontosítás utáni elkülönített production build sikeres; TypeScript-ellenőrzés is sikeres.

## Gyártóoldali emblémák központosítása — 2026-10-22

A 10 projektbeli, márkanév szerint vizuálisan ellenőrzött embléma Payload Media-be került vagy meglévő médiatételként újrahasználva, majd a megfelelő Manufacturers `logo` mezőhöz kapcsolva. A kezdőlapi kiemelt partnerek és a `/gyartok` indexoldal ugyanazt a CMS-logókapcsolatot használja. Lindsayhez nem volt logófájl, ezért márkanév-szöveges tartalék jelenik meg. Import: `scripts/sync-manufacturer-logos.ts`; előnézet alapértelmezett, apply `-- --apply`; backup `backups/rm-hungary-20261022-055109.zip`. CMS API mind a 10 logót igazolta; `/gyartok` oldal desktopon böngészőben megtekintve, TypeScript sikeres. Aktuális production build még fut.
Az aktuális CMS-logóadatokkal és gyártólista-kóddal végzett elkülönített production build sikeres.
