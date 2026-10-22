# Márkák tartalmi lefedettsége — élő staging API, 2026-10-22

Frissített adat: a futó Payload API (`127.0.0.1:3001`), 500-as lapméret, 2-es kapcsolati mélység, 2026-10-22. A katalógusban 125 termékrekord található: 105 publikált aktív rekord és 20 legacy rekord. Az aktívakból 96 kötődik 12 gyártóhoz, 9 általános terméktípus gyártó nélkül marad. A kategóriahierarchia 42 aktív kategóriát (7 fő- és 35 alkategóriát) és 30 publikált termékcsaládot tartalmaz.

| Márka | Aktív termék | Publikált család | Hiányzó fő kép | Hiányzó érdemi tartalom |
|---|---:|---:|---|---|
| Cosmeco | 2 | 0 | – | – |
| Da Ros | 1 | 1 | – | – |
| De Cloet | 4 | 2 | – | – |
| Giunti | 16 | 1 | – | – |
| Lindsay | 4 | 2 | – | – |
| Mantovani | 3 | 2 | – | – |
| Oliveragro | 1 | 1 | – | – |
| RM | 33 | 6 | Major XJ EVO (112, piszkozat) | – |
| Rovatti | 19 | 4 | – | – |
| Starpower | 9 | 6 | – | – |
| Valducci | 4 | 3 | – | – |
| Vodar | 1 | 2 | – | – |
| Márka nélkül | 8 | 0 | Öntözővízágyú (98, piszkozat) | Öntözővízágyú (98, piszkozat) |

Az API-pillanatkép szerint mind a 105 publikált, aktív terméknek van főképe. A `Major XJ EVO` (112) és az `Öntözővízágyú` (98) forrásellenőrzés alatt álló piszkozatok; az utóbbinak továbbra sincs igazolt kép vagy terméktartalom. A nyolc általános, márka nélküli termék aktív. Az üres Rich Text mező önmagában nem jelez tartalmi hiányt: az adatok szerkeszthető műszaki szakaszokban, táblázatokban, konfigurációkban vagy méretlistákban jelenhetnek meg.

Megjelenítési tartalékokkal ellenőrizve mind a 35 alkategóriakártya és mind a 30 publikált termékcsaládkártya képet kap; három Rovatti család a hozzá tartozó termékképet örökli. Ez CMS-mezőlefedettség- és szerveroldali megjelenítési ellenőrzés, nem vizuális minőség- vagy mobil-QA.

## Elkészült ezen a munkameneten

Az API-pillanatkép és a családkártya-megjelenítés felülvizsgálva a Starpower hiányzó családjainak pótlása után. A 105 aktív termékből 0-nak hiányzik a főképe; a kapcsolati audit a termékcsalád/kategória/gyártó viszonyoknál 0 hibát, az aktív termékslugoknál 0 duplikátumot talált. A 30 család mindegyike publikált.

A Cosmeco helyi két terméktípusához a gyártó hivatalos egyrotoros és kétrotoros standard árokmaró-adatlapjai alapján magyar ismertető, műszaki jellemzők, modellváltozatok, képgaléria-kép és videó került. A Cosmeco gyártói bemutatkozása és a két helyi alkategória leírása is frissült. A termékoldalakon a konfigurációs adatblokk „Elérhető modellek” címmel jelenik meg.

- Egyrotoros: https://www.cosmeco.it/prodotti/scavafossi-monobiruota/42/scavafossi-monobiruota-standard
- Kétrotoros: https://www.cosmeco.it/prodotti/scavafossi-biruota/44/scavafossi-biruota-standard
- Gyártó: https://www.cosmeco.it/azienda
- Helyi médiák: `public/images/cosmeco/monobiruota-standard.png` és `public/images/cosmeco/biruota-standard.jpg`; mindkettő 800×600 px.
- Ismételhető CMS-import: `pnpm import:cosmeco-ditch-pages`.

A gyártó hivatalos oldala a kétrotoros képet 800×600-ban szolgáltatja; a fájl fókuszált méretben lágyabb. Nagyobb felbontású, ezzel a kategóriával biztosan egyező hivatalos változatot nem találtunk. A meglévő helyi kínálat forrásrekordjai csak ezt a két Cosmeco árokmaró/csatornatisztító típust támasztják alá; további hivatalos Cosmeco gépcsaládokat nem vettünk fel találgatásból.

## Következő munka

1. Zárd le vagy dokumentáld a két forráskorlátot: RM Major XJ EVO modellazonossága/fotója és az Öntözővízágyú pontos gyártója/típusa/fotója.
2. A márkák hivatalos kínálatát vesd össze a helyi kategória- és családlistával, hogy a forrással azonosítható, helyileg forgalmazott családok ne maradjanak ki.
3. Folytasd a teljes admin, képkivágás-, asztali/mobil- és oldalszintű vizuális QA-t; a CUA jelenleg nem éri el a staging nézetet, és a Mac feloldását jelzi szükségesnek.
4. Folytasd a képduplikátumok, fájlméretek és hivatkozások biztonságos felülvizsgálatát; csak mentés és használati ellenőrzés után távolíts el médiát.

Éles publikálás nem történt. A táblázat újraolvasott Payload API-adat; a márkák hivatalos portfólióinak teljességét és a képek vizuális minőségét önmagában nem bizonyítja.

## Aktuális CMS- és forrásellenőrzés — 2026-10-22, 05:20

- Friss Payload API-lekérdezés: 125 termékrekordból 105 publikált, aktív kategóriába sorolt, nem legacy termék; ezek közül 96 márkához rendelt és 9 általános terméktípus. A márkák közötti bontás: Cosmeco 2, Da Ros 1, De Cloet 4, Giunti 16, Lindsay 4, Mantovani 3, Oliveragro 1, RM 34, Rovatti 19, Starpower 7, Valducci 4, Vodar 1.
- A 42 aktív kategóriából 35 alkategória; a megjelenítési tartalékokkal számolt API-audit mind a 35-nek talált kategória-, család- vagy termékképet. A 27 publikált családból 3 Rovatti család örökli a saját termékképét. A termék–család–kategória kapcsolatok között nem találtam eltérést.
- Két aktív termék főképe hiányzik: RM Major XJ EVO (112) és az azonosítatlan Öntözővízágyú (98). Érdemi terméktartalom csak a 98-as vízágyú-rekordból hiányzik. A 33 család nélküli termék közt vannak szándékosan önálló terméktípusok; ez önmagában nem hibás besorolás.
- Az RM hivatalos XJ terméklapja és XJ katalógusa a gépet `Major EVO` néven sorolja, a `Major XJ EVO` név külön nem igazolódott. Mivel a helyi `RM Major EVO` (41) és `RM Major XJ EVO` (112) rekordokat a projektinstrukció külön tartandónak írja elő, nem vontam össze és nem rendeltem át az előbbi fotóit a 112-es rekordhoz. Források: [RM Major EVO](https://www.rmirrigation.com/en/models/professional-hose-reel-irrigators/structure-that-can-be-hydraulically-lowered/major-evo.html), [RM XJ katalógus](https://www.rmirrigation.com/public/cataloghi2021/XJ2021_Inglese_Cod202.pdf), [RM sitemap](https://www.rmirrigation.com/en/sitemap.html).
- A Mantovani főoldal továbbra is három kapcsolódó mezőgazdasági hírt listáz (IDROJET 125, tabakra és más kultúrákra készült permetező, FM 156/C), de mindhárom részletes cikk URL-je 404. A helyi három termékrekord meglévő képekkel azonosítható; a nem elérhető cikkekből további adatot vagy új modellt nem következtettem. Forrás: [Mantovani](https://www.mantovanisrl.it/).
- A média API 689 képfájlt jelez összesen 87,2 MiB CMS-képadattal. A legnagyobb két kép 3,90 MB (RM field hero, 1672×941) és 3,77 MB (RM MOP, 4032×3024). A Next képkiszolgáló korábbi ellenőrzése WebP-változatot igazolt; az eredeti feltöltések változatlanul megmaradtak. A többi méretoptimalizálás és a teljes megjelenési QA továbbra is nyitott.
- Böngészős megnyitáskor a staging host nem volt elérhető a CUA számára (a helyi IAB `127.0.0.1` kapcsolatmegtagadást mutatott; a Mac feloldása szükséges). Ezért az új admin UI, az asztali/mobil vizuális megjelenés és a belépett szerkesztési folyamat ezen az ellenőrzésen nem minősíthető.

## Giunti képlefedettség frissítése — 2026-10-22

- A `Automata szűrőállomás` (96) főképe a korábbi RM Hungary Giunti kategóriaoldal „Szűrőkamra” feliratú, 459×424 px-es képére frissült. A fotó a termékcsoporthoz tartozik, de nem azonosít konkrét modellt; az adatlap továbbra is `specs-missing`.
- A nyilvános leírásból eltávolítottam a belső megjegyzést arról, hogy a helyi rekord nem jelöl meg konkrét modellt. A helyén a szűrési megoldás kiválasztását segítő, gyártói kategóriából szerkesztett szöveg szerepel.
- Friss ellenőrzés szerint 17 Giunti termékrekordból 7-nek nincs főképe; 1 rövid és 1 termékleírás hiányzik (az `Öntözővízágyú` rekordnál). Az üres képek: HydroG, szétszerelhető csepegtetőgomba, Bauer/Mellini/Anfor/Ferrari csatlakozók és Öntözővízágyú. A generikus csatlakozófotók pontos modellhez rendelése továbbra sem igazolt.
- Import: `pnpm import:giunti-filter-station`; adatbázis-backup: `backups/rm-hungary-20261022-012138.zip`. Build sikeres; a termékoldal böngészőben a fotóval és javított leírással megjelenik, az új média HTTP 200. Éles publikálás nem történt.
- A Giunti aktuális hivatalos szűrőállomás-kategóriája 12 tételt sorol fel: https://www.giuntispa.com/product-category/stazioni-di-filtraggio/. Ez nem azonosít konkrét modellt a helyi általános rekordhoz.

## Starpower gyártói oldalak — 2026-10-22

- Frissült a gyártói profil, négy kategórialeírás, két termékcsalád és hat termékoldal: motoros szivattyúegység, általános dízel áramfejlesztő, ECO, GTS, GTE és Apollo.
- A termékképek a hivatalos oldalról származnak: [motoros szivattyúk](https://starpower.it/gruppi_motopompa.asp), [áramfejlesztők](https://starpower.it/gruppi_elettrogeni.asp), [kardánhajtású generátorok](https://starpower.it/gruppi_cardano.asp), [Apollo](https://starpower.it/apollo.asp). Helyi fájlok a `public/images/starpower/` mappában, egységes 600×450 px méretben.
- A GTS/GTE közös gyártói oldaláról származó családszintű teljesítménytartomány nem lett modellként kettéosztva; a sorozatok közötti igazolt generátorkülönbségeket külön feltüntettem. Konkrét konfigurációs teljesítmény és szivattyúadat nincs kitalálva.
- Ismételhető import: `pnpm import:starpower-content`; adatbázis-mentés előtte: `backups/rm-hungary-20261022-001448.zip`; `pnpm build` sikeres.
- Nyitott: az MPI 350 vezérlőegység pontos gyártói termékoldala és megfelelő képe nem volt azonosítható; a termékmezők kitöltetlenek maradtak.
- Frissítés: az MPI 350 (79) magyar rövid és részletes leírást, négy forrás szerinti felügyeleti adatot, GSM-opciót és belső forrásjegyzetet kapott. A régi RM Hungary oldalon szereplő riasztási/leállítási működést használtam; fotót nem rendeltem hozzá. Importer: `pnpm import:starpower-mpi350`; mentés: `backups/rm-hungary-20261022-004152.zip`. A termékútvonal HTTP 200, build sikeres.
- Frissítés: az MPI 350 (79) főképet kapott a korábbi RM Hungary termékoldalról. A 817×633 px-es fotón maga a panel „MPI350” felirata látszik; a kép az MPI 350 leírása alatt szerepelt. Importer: `pnpm import:starpower-mpi350`; mentés: `backups/rm-hungary-20261022-011120.zip`. A kanonikus termékútvonal HTTP 200, az elavult útvonal 308-as átirányítással működik, a kép HTTP 200, build sikeres. Aktuális MPI 350 képhiány nincs.
- Frissítés: a Giunti `Horganyzott gerincvezeték` rekord a pontosan kapcsolt korábbi RM-kategória fotóival és gyártói gyorscsatlakozós csőforrásokkal kapott tartalmat; a `Tolózár` feliratozott termékfotót és rövid leírást kapott. Specifikációt nem adtam meg, mert nem volt igazolható. Import: `pnpm import:giunti-mainline-valve`; backup: `backups/rm-hungary-20261022-004417.zip`. A Giunti aktuális hiány: 17 aktív rekordból 9 képhiány és 7 rövid/részletes leíráshiány; mindkét útvonal és három média HTTP 200, build sikeres.
- Frissítés: a `Csepegtető csövek` adatlap egy, közvetlenül a régi RM kategória megfelelő termékblokkja mellett szereplő labirintusábrát kapott. A kép illusztráció, nem konkrét modellméret-adatlap. Import: `pnpm import:giunti-drip-tube-image`; backup: `backups/rm-hungary-20261022-004653.zip`. A termék régi útvonala 308-as kanonikus átirányítással működik; a kanonikus útvonal és kép HTTP 200, build sikeres. Giunti: 8 kép és 7 leíráshiány maradt.

## Rovatti gyártói termékáttekintő — 2026-10-22

- A hivatalos Rovatti termékáttekintő alapján mind a 18 aktív helyi szivattyúrekord családszintű leírást és specifikációt kapott: 4ES, ERC/ERCX/EC/ECX, E, V, MEKV Europa, MEK Europa, SNE, SK/SK Europa/SKD Europa, FK/FK Europa, TK/TK Europa és T.
- Az adatlapok a gyártói áttekintőben közölt családszintű felső térfogatáramot, emelőmagasságot és teljesítményt jelzik; ezeket nem tüntetik fel egyedi modell munkapontjaként. A már meglévő 18 termékképet nem cseréltem le.
- A három Rovatti termékcsalád kártyája rövid leírást kapott; frissült a Rovatti profil és a kapcsolódó szivattyúkategóriák bemutatója.
- Ismételhető import: `pnpm import:rovatti-content`; adatbázismentés előtte: `backups/rm-hungary-20261022-001836.zip`. Build sikeres; a 18 termékútvonal és kapcsolt képek HTTP 200 válasszal ellenőrizve.
- Hivatalos forrás: [Rovatti általános termékáttekintő](https://www.rovatti.it/General-Overview-Rovatti.pdf), [4ES termékcsalád](https://www.rovatti.it/prodotti/pompe-da-pozzo/1199/elettropompe-sommerse-radiali-e-semiassiali-da-4), [Rovatti öntözési megoldások](https://www.rovatti.it/market-area/agricoltura-e-irrigazione/1121/sistemi-di-irrigazione).

## VODAR gyártói kategóriaoldalak — 2026-10-22

- A VODAR hivatalos [Center Pivot](https://www.vodarirrigations.com/center_pivot_irrigation_system/center_pivot_irrigation_system.html) és [Linear Irrigation](https://www.vodarirrigations.com/linear_irrigation_system/linear_irrigation_system.html) oldala alapján frissült a `korforgo` és `linearis` kategória, valamint a `vodar-korforgo` és `vodar-linearis` családkártya rövid leírása.
- A `Vodar Center Pivot` (51) termékre magyar gyártói ismertető és családszintű konfigurációs adatok kerültek. `review_state=specs-missing` marad, mert a helyi rekord nem meghatározott egyedi konfiguráció; az aktuális hivatalos Center Pivot termékoldalról már megfelelő főképet és négyképes galériát sikerült betölteni.
- A régi RM-oldalhoz korábban VODAR-ként sorolt `9500P` (52) és `9510PL Omega` (53) gyártói besorolása ellenőrizve és javítva: a Lindsay/Zimmatic hivatalos 9500P oldala, valamint a Lindsay Europe OMEGA 9510PL kézikönyve alátámasztja a Lindsay gyártói családot. Mindkét termék saját Lindsay termékcsaládba került, a régi termék-URL-ek 308-as átirányítással az új kanonikus útvonalra visznek.
- A Zimmatic 9500P 960×640-as hivatalos termékfotót és gyártói ismertetőt/specifikációkat kapott. Az OMEGA 9510PL megőrizte az RM-oldalról származó, vizuálisan megfelelő képet; leírása, kézikönyve és forrás szerinti adatai bekerültek. Az OMEGA `source-check` státuszú, mert a kézikönyv 2015-ös.
- Lindsay-oldalak: [Zimmatic 9500P](https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots/9500p-center-pivot), [termékútmutató](https://www.lindsay.com/DownloadFile.ashx?id=0d5066f8-21fa-4421-869b-186da08ec736), [OMEGA kézikönyv](https://hydro-air.de/wp-content/uploads/2023/02/Bedienungsaleitung-OMEGA2v3_GER-NEU-komprimiert.pdf). Importer: `pnpm import:lindsay-zimmatic-content`; adatbázis-backup: `backups/rm-hungary-20261022-002621.zip`. `pnpm build` sikeres; mindkét termékútvonal, a régi 9500P útvonal átirányítása, fotó és PDF helyben ellenőrizve.
- A két VODAR termékcsalád-kártya képe és a `Vodar Center Pivot` főképe/galériája a hivatalos Vodar képekkel kitöltve. A 9500P/9510PL már nem VODAR-rekord. Nyitott: az egyedi Center Pivot konfiguráció nincs meghatározva; ezt a termékoldal `specs-missing` állapota jelzi.

### VODAR fotók frissítése — 2026-10-22

- A hivatalos kínai [Center Pivot termékoldal](https://www.vodar.cn/ProductDetail/11137301.html) négy 800×600 px-es fotója a helyi termék főképe és galériája lett. A [lineáris öntözőgép kategóriaoldal](https://www.vodar.cn/Product/663969.html) 800×600 px-es képe a VODAR lineáris családkártyára került.
- Helyi fájlok: `public/images/vodar/center-pivot-main.jpg`, `center-pivot-field.jpg`, `center-pivot-crop.jpg`, `center-pivot-nozzles.jpg`, `linear-system.jpg`. A termékoldal böngészőben a címet, leírást, hét adatot és négyképes galériát mutat; kanonikus útvonala és az öt kép HTTP 200, a build sikeres. A korábbi VODAR családoldali fotó-URL hozzáférési hibáját a gyártó másik hivatalos doménjén szereplő fotók oldják fel.

## Giunti hivatalos forrásainak egyeztetése — 2026-10-22

- A 2026-10-22-i adatbázis-lekérdezés 17 aktív, nem legacy Giunti-terméket talált; 7-nél van főképe és gyártói forrású magyar rövid/részletes leírása (Hydroplus, csepegtető csövek, Layflat szalagcső, hidrociklon, FILTROLINE, FILTROQUARZ, tápoldatozó). Egy további termék, a szétszerelhető csepegtetőgomba régi RM katalógusszöveget kapott, gyártói oldala és termékfotója nem igazolt. A hidránsfej helyi rekordját Valducci márkához javítottam. Jelenleg 11 Giunti főképet és 9 Giunti termékoldali leírást kell még pótolni.
- Ellenőrzött hivatalos kategóriaoldalak: [drip tapes](https://www.giuntispa.com/product-category/drip-tapes/), [horganyzott csövek](https://www.giuntispa.com/product-category/tubazioni-in-acciaio-zincato/), [szűrőállomások](https://www.giuntispa.com/product-category/stazioni-di-filtraggio/), [hidránsok](https://www.giuntispa.com/product-category/hydrants-and-accessories/).
- A csepegtetőszalag-kategórián a jelenlegi termék HydroG2 néven szerepel; a helyi `HydroG csepegtetőszalag` rekord nem azonosítható automatikusan vele. A szétszerelhető csepegtetőgomba termékhez nem találtam azonosítható hivatalos termékoldalt.
- A horganyzott csövek oldalán öt csatlakozórendszer szerepel (hidraulikus, Anfor, Robur/Mellini, Ferrari, Bauer). A helyi rekordok „fejes idom” néven szerepelnek, miközben a gyártói oldalak horganyzott csöveket ismertetnek; a tartalom és képek hozzárendelése előtt az elem azonosságát tisztázni kell. A generikus horganyzott gerincvezetékhez nincs azonosított önálló modelloldal.
- A hidránsfej-terméket a Giunti hivatalos Valducci márkaoldala és mindkét hivatalos fejváltozat-oldala alapján Valducci márkához rendeltem, megőrizve a helyi termék URL-jét. Az adatlap mindkét igazolt változatot bemutatja; a Giunti szűrőoldal 12 külön tételt mutat, így a helyi „Automata szűrőállomás” nem azonosítható egyetlen típussal.
- Hivatkozott oldalak: [Giunti Anfor cső](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-anfor/), [Robur cső (korábban Mellini)](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-robur/), [Ferrari gyorscsatlakozós cső](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-sferici-ferrari/), [Bauer cső](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-tipo-bauer/).
- A Ferrari-oldal műszaki táblázatát (`public/images/giunti/ferrari-coupling-table.png`, 427×172 px) lementettem. A táblázat csőátmérőt, megengedett statikus üzemi nyomást és csőfal-vastagságot mutat, ezért nem rendeltem önmagában a helyi „Ferrari gömbcsatlakozó” rekordhoz; előbb a helyi rekord termékkörét kell egyeztetni.
- A helyi kategóriaoldal archivált szövege alapján feltöltöttem a „Szétszerelhető csepegtetőgomba” magyar összefoglalóját és az ott kifejezetten ehhez a termékhez közölt 2 l/óra, 0,8–2,0 bar, 2 mm-es lyukasztó, tisztíthatóság és anyagellenállósági adatokat. Az importer `scripts/import-giunti-dripper.ts`; az adatbázis-frissítés előtti mentés: `backups/rm-hungary-20261022-000552.zip`. Mivel jelenlegi Giunti gyártói adatlap/fotó nem igazolt, a rekord `source-check` maradt, főképet nem rendeltem hozzá.
- A helyi „Hidránsfej” rekord gyártói azonosítása Valducciként megerősítést kapott. Az adatlapot a Valducci márkához rendeltem, megőrizve a `/termekek/ontozesi-tartozekok/szelepek-hidranok/hidransfej` URL-t; hozzáadtam a két hivatalos változat képét, közös magyar műszaki leírását és a gyártói kompatibilitási táblázatot. Adatbázis-mentés előtte: `backups/rm-hungary-20261022-000856.zip`; importer: `pnpm import:valducci-hydrant-head`. A Valducci gyártói profil source URL-je a hivatalos Valducci márkaoldalra frissült.

## Giunti Mellini–Robur kapcsolat — 2026-10-22

- A Giunti hivatalos Robur csőoldala igazolja, hogy a Giunti megszerezte a Mellini gyorscsatlakozó jogait, és Robur néven viszi tovább; a Robur rendszert öntözőgépes csőrendszerekkel kapcsolja össze.
- A helyi `Mellini fejes idom` rekord rövid és részletes magyar leírást, valamint forrásjegyzeteket kapott. Mivel a gyártói oldal komplett horganyzott csövet ábrázol, különálló idomfotó vagy műszaki adat nem került a rekordhoz; státusza `source-check` maradt.
- Importer: `pnpm import:giunti-mellini`; mentés előtte: `backups/rm-hungary-20261022-010016.zip`. Build sikeres; termékútvonal HTTP 200 és a szöveg megjelenése ellenőrizve.
- Aktuális Giunti hiány: 8 főképhiány, 5 rövid és részletes leíráshiány. A csatlakozótípusok önálló termékként való pontos megfeleltetése továbbra is nyitott.

## Giunti csatlakozók és szűrőállomás — 2026-10-22

- A Bauer, Anfor és Ferrari helyi rekordok forrásolt magyar leírást kaptak a Giunti horganyzottcső-oldalai alapján. A gyártói oldalak a csatlakozótípusokkal szerelt komplett csöveket mutatják; önálló idomképet vagy pontos idomspecifikációt nem társítottam.
- Az általános `Automata szűrőállomás` rekord a gyártói szűrőállomás-kategória családszintű magyar leírását kapta. A Giunti 12 külön terméket listáz, ezért konkrét termékképet vagy konfigurációt nem rendeltem hozzá.
- Importerek: `pnpm import:giunti-couplings` és `pnpm import:giunti-filter-station`; mentések: `backups/rm-hungary-20261022-010312.zip` és `backups/rm-hungary-20261022-010430.zip`. `pnpm build` sikeres; a Bauer, Anfor, Ferrari és automata szűrőállomás termékútvonal HTTP 200, tartalmuk böngészőben ellenőrizve.
- Friss Giunti-állapot: 17 rekordból 8 képhiány, 1 rövid leírás és 1 termékleírás hiányzik; az utóbbiak az öntözővízágyú rekordhoz tartoznak.

## Giunti öntözővízágyú forrás-ellenőrzése — 2026-10-22

- A hivatalos [önjáró öntözőgépek kategória](https://www.giuntispa.com/product-category/macchine-irrigatrici-semoventi/) 15 gépet sorol fel, köztük RollcarT és Tornado modelleket; a leírások PE-tömlő-átmérőket és -hosszakat adnak meg.
- A kategória gördülődobos gépekről szól, nem igazolja a helyi általános `Öntözővízágyú` tartozék rekord modellazonosságát. A szórófej/ágyú pontos típusa külön nem azonosítható a jelenlegi hivatalos termékkategóriából, ezért nem rendeltem hozzá Tornado/RollcarT adatot, képet vagy specifikációt.
- Nyitott Giunti-hiány: az `Öntözővízágyú` (98) rövid és részletes leírása, illetve a rekord pontos termékazonossága. A megadott hivatkozás jelenleg nem elég a termék tartalmának biztonságos kitöltéséhez.

## Giunti csepegtetőgomba főképe és látogatói szövege — 2026-10-22

- A 57-es „Szétszerelhető csepegtetőgomba” rekord megkapta a korábbi RM Hungary oldalon közvetlenül a hozzá tartozó leírás után szereplő 274×184 px-es használati fotót (`public/images/giunti/dripper-in-use.jpeg`; eredeti: https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image32.jpeg). Alacsony felbontása miatt természetes méretben jelenik meg, nagyítás és vágás nélkül; a galériából kikerült, így nem duplikálódik.
- A publikus termékleírásból eltávolítottam a szerkesztői megjegyzést. Az archivált RM-oldalhoz kötött leírás és az ott közölt műszaki adatok megmaradtak; a rekord `source-check` állapotú.
- Import: `pnpm import:giunti-dripper`, majd `pnpm import:giunti-dripper-photo`; mentések: `backups/rm-hungary-20261022-012652.zip` és `backups/rm-hungary-20261022-012722.zip`. `pnpm build` sikeres, a 3001-es előnézetben a termékfotó, szöveg és adatok böngészőben ellenőrizve. Éles publikálás nem történt.
- Aktuális Giunti-mérleg: 17 aktív termék, 6 főképhiány, 1 hiányzó rövid leírás és 1 hiányzó termékleírás; utóbbi kettő a 98-as „Öntözővízágyú” rekordhoz tartozik.
- A vízágyú ellenőrzéséhez a Giunti [mezőgazdasági termékoldalát](https://www.giuntispa.com/products-for-agriculture/) és [önjáró gép tartozék-kategóriáját](https://www.giuntispa.com/product-category/accessori-macchine-irrigatrici-semoventi/) is átnéztem. Utóbbin 16 tartozék szerepel, de a helyi általános vízágyú rekord pontos megfelelője nem azonosítható; egy konkrét Tornado szórófejjel vagy tartozékkal sem egyeztethető össze bizonyíték nélkül.


## Da Ros tálcás magvetőgépek — 2026-10-22

- A Da Ros hivatalos faiskolai vetőgép- és vetősor-kategóriaoldala alapján frissült a gyártói bemutató, a `Magvető gépek` kategória leírása és a `Da Ros tálcás magvetőgépek` családkártya. A családkártya a gyártó hivatalos SEM 100 gépfotóját használja egyértelműen családpéldaként.
- A helyi termékrekord megőrizte az általános „Da Ros tálcás magvetőgép” nevet. Főképe és galériája az RM Hungary korábbi kategóriaoldalán ehhez a terméktípushoz közvetlenül kapcsolt két képből áll. Magyar család- és termékleírás került fel.
- A Da Ros oldal külön SEM 100, LR803, LS7-2/LS7-3 modellt és LR650/LR800/LR1200 vetősort is felsorol, de a helyi általános rekord nem azonosítható egyik konkrét modellel sem; ezért modellszintű adatot, dokumentumot és videót nem rendeltünk hozzá. A termék státusza `specs-missing`.
- Ismételhető import: `pnpm import:da-ros-seeders`; előzetes DB-mentés: `backups/rm-hungary-20261022-003019.zip`. Build sikeres. A kategória, család és termék útvonala HTTP 200; a családkép és a termék két képe HTTP 200. Termékoldal tartalma és kétképes galériája böngészőben ellenőrizve.
- Hivatalos források: https://da-ros.com/en/products/seeders-and-seeding-lines/ és https://da-ros.com/en/product/seeder-sem-100/; a helyi termékazonosítást és két képet az RM Hungary korábbi oldala támasztja alá: https://www.rmhungary.hu/index.php?alkat=9.
- Következő feldolgozandó márka: Oliveragro.


## Oliver Agro Rotosark — 2026-10-22

- Frissült az Oliver Agro gyártói bemutató és a növényápoló/sorközművelő kategória leírása. Létrejött az `Oliver Agro Rotosark` család, a termék a család alá került, a korábbi publikus termékútvonal megmaradt.
- A helyi RM kategória Rotosark név szerinti azonosítást ad; ezt egyeztettem a [gyártói Rotosark adatlap](https://www.oliveragro.it/prodotto/sarchiatura/rotosark/) leírásával, mérettáblázatával, konfigurációival, opcióival, képeivel, videóival és kétoldalas katalógusával. A gyártó [vállalati oldala](https://www.oliveragro.it/azienda/) alapján a márkabemutató is frissült.
- A termékoldal 13 képet, a gyártó által linkelt Rotosark-katalógust, 11 Rotoblizz/váz műszaki adatot, öt konfigurációs összefoglalót és 31 kultúránként csoportosított YouTube-videót tartalmaz. A termékazonosítás és műszaki tartalom ellenőrzött; a rekord `ready`.
- Import: `pnpm import:oliveragro-rotosark`; backup: `backups/rm-hungary-20261022-003619.zip`. `pnpm build` sikeres. A kategória-, család- és termékútvonal HTTP 200; a főfotó és a PDF HTTP 200; a böngészős termékoldal a leírást, adatokat, opciókat, 31 videót, 13 képes slideshow-t és brosúrát mutatja. Éles publikálás nem történt.
- De Cloet: a Sprayer család és az összevont Sprayer 1500/2000/2500 adatlap elkészült a hivatalos gyártói oldal és a régi RM permetezőkategória alapján. A családoldal hat fotót, a termékoldal leírást, műszaki adatokat, tartályváltozatokat, további öt képet és kétnyelvű PDF-katalógust tartalmaz. Az adatlap gyártói forrása: https://www.decloet.it/en/products/sprayer.html; a helyi márkakötést a https://www.rmhungary.hu/index.php?alkat=7 oldal támasztja alá.
- Mantovani: a régi RM oldal permetezőket, tetejezőgépet és dohánytörő kombájnokat sorol fel, de a gyártó mai hivatalos azonosítása és modelladatai bizonytalanok. A „Mantovani” keresés több más, nem dohánygépgyártó céget ad; modellt vagy tartalmat nem rendeltem hozzá.
- 2026-10-22-i újraellenőrzés: az RM által forgalmazott dohánygépek gyártója a hivatalos [Mantovani Srl](https://www.mantovanisrl.it/) Bovolone-i oldala. A dohánygépek áttekintője kézi és automatizált dohánybetakarítókat, préselő- és csomagolóberendezéseket említ. A nyitóoldal termékajánlója az IDROJET 125-öt, a 1400 VV permetezőt és az FM 156/C automata sorvezetős vontatott betakarítót névvel és fotóval azonosítja. Az egyedi cikkek jelenleg 404-et adnak; a nyitóoldali megnevezéseken túli adatot nem társítottunk.

## Mantovani családok és azonosított gépek — 2026-10-22

- Létrejött a `Mantovani permetezőgépek` család a `Permetezőgépek` kategóriában, két gyártói oldalon egyértelműen azonosított termékkel: IDROJET 125 és 1400 VV. Mindkét rekord a gyártó nyitóoldalán szereplő névvel, rövid leírással és közvetlenül társított fotóval került be.
- Létrejött a `Mantovani dohánybetakarító gépek` család a `Dohánybetakarító gépek` kategóriában, benne a vontatott, automatikus sorvezetős FM 156/C termékkel és hivatalos gyártói fotóval.
- Az egyedi termékcikkek 404-esek; ezért nincs méret, teljesítmény, felszereltség, PDF vagy videó társítva. A rövid magyar termékbemutatók csak a hivatalos oldalon olvasható azonosítást fordítják. Forrás: [Mantovani Srl](https://www.mantovanisrl.it/).
- Ismételhető importer: `pnpm import:mantovani-products`; adatbázismentések: `backups/rm-hungary-20261022-011622.zip`, `011708.zip`, `011748.zip`. A három termékútvonal HTTP 200, mindhárom kép HTTP 200, az FM 156/C terméket és permetező családoldalt böngészőben ellenőriztem; build sikeres. Éles publikálás nem történt.

## Mantovani frissítés — 2026-10-22

A gyártói bemutató és a hivatalos dohánygépes forrás-URL bekerült a helyi gyártórekordba. Ismételhető import: `pnpm import:mantovani-profile`; mentés: `backups/rm-hungary-20261022-005210.zip`; `/gyartok/mantovani` HTTP 200. A helyi termékkör és családok még hiányoznak. A hivatalos régi áttekintőben megnevezett gépek egyedi adatlapjai jelenleg 404-esek, a régi RM fotók pedig De Cloet és Mantovani modelleket vegyesen mutatnak, így modellhez illő képet nem rendeltünk.

## Giunti FILTROLINE galériakép — 2026-10-22

A FILTROLINE termékoldal galériájába bekerült az RM Hungary korábbi Giunti kategóriaoldalán „Acélbetétes hálós szűrő” megnevezés alatt szereplő termékfotó. A gyártói FILTROLINE fotó és vázlat megmaradt. Import: `pnpm import:giunti-filtroline-photo`; backup: `backups/rm-hungary-20261022-005430.zip`. A termékoldal és 3 képes galéria böngészőben ellenőrizve, a fotó és termék HTTP 200, build sikeres.

## Giunti HydroG tartalmi frissítés — 2026-10-22

A HydroG terméknév a korábbi RM Giunti kategóriában szerepel; a gyártó aktuális [csepegtetőszalag-kategóriája](https://www.giuntispa.com/product-category/manichetta-gocciolante/) HydroG2-t mutat. A helyi rekord rövid és általános leírást kapott, de kép és modellspecifikus adat nélkül, `source-check` státuszban. A névazonosságot nem állítottam. Import: `pnpm import:giunti-hydrog-copy`; végső adatbázismentés: `backups/rm-hungary-20261022-005741.zip`. A böngészős oldal HTTP 200 és a végleges szöveg megjelenik; build sikeres.

## Giunti csepegtetőgomba galériafotó — 2026-10-22

- A régi RM Hungary oldalon a „Szétszerelhető csepegtető gomba” leírás után közvetlenül szereplő két fotó egyikét ellenőriztem: a 90×90 px-es bélyegkép helyett a jobb minőségű, használat közbeni 274×184 px-es képet adtam hozzá a helyi termék galériájához. Főképként továbbra sincs használható felbontású, egyértelmű kép.
- Forrás: https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image32.jpeg. Helyi fájl: `public/images/giunti/dripper-in-use.jpeg`.
- Import: `pnpm import:giunti-dripper-photo`; mentés: `backups/rm-hungary-20261022-010653.zip`. Build sikeres; helyi útvonal és kép HTTP 200, a böngészőben a galériaelem ellenőrizve.

## Giunti gyorscsatlakozó-képek — 2026-10-22

- A hivatalos Giunti Bauer, Anfor, Ferrari és Robur termékoldalairól megfelelő típusú képek kerültek a Bauer, Anfor, Ferrari és Mellini termékadatlapokra. A Mellini rekord Robur-képet kapott, mert a Giunti hivatalos oldala szerint a korábbi Mellini gyorscsatlakozó mai neve Robur; ez a kapcsolat a belső forrásjegyzetben szerepel.
- Bauer és Anfor főképe a típusazonos gyorscsatlakozó gyártói ábrája; Ferrari és Mellini/Robur főképe a gyártó által közölt 600×600-as csőfotó. A helyi termékrekordok nem azonosítanak további csőméretet vagy konfigurációt, ezért a gyártói táblázatok nem kerültek önálló idom-specifikációként feltöltésre.
- Ismételhető importer: `pnpm import:giunti-coupling-images`; előzetes mentés: `backups/rm-hungary-20261022-014708.zip`. A négy termékoldalon képek, magyar leírások és galériák böngészőben láthatók; `pnpm build` sikeres.
- A négy korábbi főképhiány megszűnt. A Giunti 17 aktív rekordjából jelenleg 2-nek nincs főképe (`HydroG csepegtetőszalag`, `Öntözővízágyú`); a vízágyú rövid és részletes leírása továbbra is hiányzik. Éles publikálás nem történt.

## Valducci hidránsfej-család — 2026-10-22

- A hivatalos [Valducci márkaoldal](https://www.giuntispa.com/valducci-brand/) szerint a Valducci kínálata öntözőgépeket, szűrőegységeket, rögzített rendszerek vezérlőelemeit, hidránsfejeket és hozzájuk tartozó görbéket tartalmaz. A hidránsfej hivatalos [szigonyos kivitelű termékoldala](https://www.giuntispa.com/en/product/hydrant-heads-harpoon-2/) ismerteti az anyagot, tömítést, Johnson-elvű működést, kulcsos nyitást és a gyártói próbát.
- A helyi Valducci gyártóleírás magyarra szerkesztve frissült, a hivatalos márkaoldal logója a `public/images/valducci/valducci-giunti-logo.jpg` fájlba került. A Szelepek és hidránsok kategóriában létrejött a `Valducci hidránsfejek` termékcsalád; a meglévő Hidránsfej rekord család alá került. A korábbi termékkép, műszaki leírás, két változat, galéria, kompatibilitási táblázat és publikus URL megmaradt.
- Importer: `pnpm import:valducci-family`; előzetes mentés: `backups/rm-hungary-20261022-014255.zip`. Build sikeres; a Valducci gyártói oldal, kategóriacsalád és családhoz kanonizált termékoldal production preview-ban böngészőben ellenőrizve.
- A kategóriaoldalról kivettem a családhoz sorolt termékeket, így azok csak a családoldalon jelennek meg; család nélküli termékek közvetlenül a kategóriában maradnak. Build és Valducci kategória ellenőrzés sikeres.
- A márkaoldal a Valducci teljes helyi termékkörének feltérképezéséhez vezető hivatalos belépőpont. Irromotor gépek és szűrők léteznek, de ezek helyi rekordokhoz történő megfeleltetése és további termékcsaládok feltöltése még hátravan.

## HydroG képforrás-ellenőrzés — 2026-10-22

- Újra ellenőriztem a hivatalos Giunti csepegtetőszalag-kategóriát: jelenleg HydroG2 szerepel, HydroG nem. A korábbi RM Hungary kategória a HydroG és Hydroplus neveket említi, de az archivált képek között a HydroG2 feliratú kép nem bizonyítja, hogy azonos a helyi HydroG rekorddal.
- A régi RM oldal képei között találtam 228×152 px-es, szántóföldi csepegtetést mutató fotót. Ez csak általános alkalmazási illusztráció, felbontása gyenge, a HydroG modellhez nincs közvetlen képi hozzárendelése; ebben az ellenőrzési lépésben még nem kapcsoltam a termékhez. A későbbi döntést és CMS-importot lásd az alábbi frissítésben. A Hydroflex- és HydroG2-feliratú képeket sem használtam HydroG-ként.
- Az RM gyártói [Major EVO adatlapja](https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/appoggiati-a-terra-mod.-xj/major-evo.html) az XJ család alatt, de `Major EVO` néven szerepel. A helyi adatbázisban ettől külön létezik a publikált `RM Major EVO` (id 41) és `RM Major XJ EVO` (id 112); az utóbbihoz a helyi forrásanyag nem ad további, egyedi azonosító adatot. Projektutasítás szerint e rekordok nem vonhatók össze, ezért a Major EVO gyártói fényképeit, táblázatát, videóit és katalógusát nem kapcsoltam a Major XJ EVO-hoz. Az XJ EVO pontos képe és modellazonosítása továbbra is nyitott.
- Következő lépés ezeknél: további pontos gyártói vagy forgalmazói modellazonosítás, illetve jobb minőségű, egyértelmű fotó keresése; adat és kép csak egyezés után tölthető fel.


## Rovatti Midy család és terméklap — 2026-10-22

- A korábbi RM Hungary „Kistermelőknek midi szivattyú” rekordot a Rovatti hivatalos MIDY-CENT termékképével és a T0-50/T0F-50 hivatalos termékoldalával egyeztettem. Az aktív `Rovatti Midy szivattyú` a Kistermelői szivattyúk kategóriába került az új `Rovatti Midy szivattyúk` család alá; a meglévő `midi-szivattyu` slug változatlan.
- A termékoldalra felkerült a gyártói leírás magyar szerkesztése, T0-50/T0F-50 hajtásváltozatok, sorozatszintű felső értékek (33 m³/óra, 50 m, 9,2 HP), a 767×462 px-es hivatalos fotó és a T0 műszaki PDF. A PDF a kapcsolódó önfelszívó A-változatokat is tartalmazza, ezért a helyi oldalon nem soroltam ezeket a T0-50/T0F-50 változatok közé.
- Importer: `pnpm import:rovatti-midy`; adatbázis-mentés előtte: `backups/rm-hungary-20261022-022737.zip`. SQLite-visszaolvasás igazolja a termék/család/kategória/márka kapcsolatot, képet, PDF-et, konfigurációkat és forrásokat. `pnpm build` sikeres; a termékkép vizuálisan ellenőrizve, böngészős termékoldal-QA ebben a szakaszban nem történt.
- Friss adatbázis-lefedettség a publikált márkarekordoknál: mind a 19 Rovatti terméknek van képe, rövid és részletes leírása. Giuntinál 17-ből 1 terméknek nincs még főképe, rövid és részletes leírása — az Öntözővízágyú rekordnak.

## Giunti öntözővízágyú-kép újraellenőrzése — 2026-10-22

- A régi `alkat=13` oldal 34 képéről kontaktlap készült és vizuálisan átnéztem. A `image17(1).jpeg` a helyi tolózáras idom rekordhoz van forrásolva, ezért nem használható az önálló Öntözővízágyú termékképeként. A többi kontaktlapi kép sem azonosítja egyértelműen ezt a terméket.
- A Giunti hivatalos mezőgazdasági oldalai dinamikus szórófejes öntözést említenek, a Tornado termékoldalak szerint a szórófej a csévélődobos gép része, a tartozékkategória pedig a géphez kapcsolódó kiegészítőket sorolja. Ezek nem igazolják, hogy a helyi általános Öntözővízágyú rekord konkrétan melyik önálló szórófej vagy modell.
- Források: https://www.giuntispa.com/products-for-agriculture/ ; https://www.giuntispa.com/product-category/accessori-macchine-irrigatrici-semoventi/ ; https://www.giuntispa.com/product/tornado-hm/ . A rekord képe, leírása és műszaki megfeleltetése nyitott marad; más termék fotóját nem társítottam hozzá.

## Öntözővízágyú — hivatalos Giunti-forrás újraellenőrzése — 2026-10-22

A Giunti hivatalos [mezőgazdasági termékáttekintője](https://www.giuntispa.com/products-for-agriculture/), [termékboltjának kategórialistája](https://www.giuntispa.com/negozio/), valamint az önjáró gépek és tartozékok kategóriái alapján a gyártó csévélődobos öntözőgépeket, szórófejeket és gépkiegészítőket kínál. Találtam a Tornado csévélődobos modellekhez kapcsolódó gyártói adatlapokat, de ezek nem bizonyítják, hogy a helyi, különálló „Öntözővízágyú” rekord ugyanezt a modellt jelenti. Egyedi termékazonosság vagy megfelelő kép nem került elő; a főképet és a leírást nem töltöttem ki feltételezésből. Források: [Tornado F1/F2 gyártói adatlap](https://www.giuntispa.com/product/tornado-f1-and-f2/), [Tornado modellek adatlapja](https://www.giuntispa.com/wp-content/uploads/2017/11/Tornado-HL-HH-HL-ITUK-specs.pdf).

### Újraellenőrzés — 2026-10-22

Az új hivatalos keresés a Giunti Tornado F1/F2, HI, TF/TFS, HH/HL és kapcsolódó gépadatlapjain több szórófej-típust és gép–szórófej párosítást talált (például K1, Ambo, Senior, Reflex/Twin és Explorer/Twin). Ezek a szórófejek az adott csévélődobos gépek felszerelésében szerepelnek; önálló helyi vízágyú rekordot, annak típusát vagy saját fotóját továbbra sem azonosítják. A Tornado F1/F2 nyitóképe ezért kizárólag kategóriaillusztráció marad, nem kerül a 98-as termékhez.

Az RM „Major XJ EVO” ellenőrzésénél a projekt forrásmappájában talált `rmhungary__major-evo_1_1.png` 204×49 px-es, átlátszó embléma, nem termékfotó. A gyártói XJ oldal `Major EVO` megnevezése és az elkülönült helyi `RM Major EVO`/`RM Major XJ EVO` rekordok miatt ebből a fájlból, illetve a Major EVO modell médiáiból nem következtetünk az XJ EVO képére. A két modellhez kapcsolódó kép- és specifikációs hiány nyitva marad.

Ellenőrzött hivatalos oldalak: [Giunti Tornado F1/F2](https://www.giuntispa.com/product/tornado-f1-and-f2/), [Giunti Tornado HI](https://www.giuntispa.com/product/tornado-hi/), [Giunti Tornado TF/TFS](https://www.giuntispa.com/product/tornado-tf-tfs/), [RM Major EVO](https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/appoggiati-a-terra-mod.-xj/major-evo.html).

### CMS-besorolás korrekció — 2026-10-22

A `Giunti` márkakötést levettem a helyi `Öntözővízágyú` rekordról, mert az egyetlen `alkat=13` hivatkozás csepegtető/mikroöntözési forrás, és nem igazolja sem a termék azonosságát, sem a gyártóját. A `Öntözőfejek és vízágyúk` kategória, a publikált termékútvonal és a régi forrás-URL megmaradt; a belső `reviewState` `source-check` lett. A seed-adat is javítva, így egy későbbi újraimport nem hozza vissza a téves Giunti-kötést.

Ismételhető előnézet/apply: `pnpm review:unverified-water-cannon`. Apply előtti adatbázis- és médiamentés: `backups/rm-hungary-20261022-042110.zip`. Payload API visszaolvasás: nincs gyártó vagy márkaszöveg, kategória és `published` állapot változatlan, a termékoldal HTTP 200. A termék saját képe, leírása és pontos azonosítása továbbra is hiányzik; ezeket nem pótoltam feltételezéssel.

## Valducci termékkör további hivatalos ágai — 2026-10-22

- A [Giunti hivatalos Valducci márkaoldala](https://www.giuntispa.com/valducci-brand/) a hidránsfejek mellett három további termékcsoportot nevez meg: Irromotor önjáró öntözőgépek (140-nél több modell), kavics-, háló- és tárcsaszűrők/hidrociklonok/tápoldatozók, valamint hidránsfejek és idomok. Az oldal Irromotor, szűrőállomás és hidránsfej képeket is ad.
- A Giunti [önjáró öntözőgép termékkategóriája](https://www.giuntispa.com/product-category/macchine-irrigatrici-semoventi/) 15 termékcsaládot listáz, többek között Tornado TA–TG és HH–HM/Irrimotor sorozatokat; az egyedi termékoldalak közül például a [Tornado F1/F2](https://www.giuntispa.com/product/tornado-f1-and-f2/) és a [Tornado HJ](https://www.giuntispa.com/product/tornado-hj/) specifikációt és konkrét változattáblázatot is közöl. Ezeket a terméksorokat még össze kell vetni a helyi RM kínálattal és Valducci márkakapcsolattal, mielőtt rekordokat hozunk létre.
- Nyitott Valducci-kör: jelenleg a hidránsfej-család és -termék van helyben; a hivatalos Irromotor- és szűrőcsaládok, képek, termékváltozatok és kapcsolódó eredeti PDF-ek feltérképezése/betöltése még hátravan. A Giunti termékeket nem szabad automatikusan Valduccihoz kötni csak azért, mert a Valducci márkaoldal említi az adott terméktípust.

## RM Major XJ EVO névütközés — 2026-10-22, újraellenőrzés

- Az RM 2021-es XJ katalógusa és termékoldalai az XJ családon belül „Major EVO” nevet használnak; a gyártói családoldal a kettős lánchajtást is a „MAJOR EVO” jellemzőjeként írja le. A katalógus külön „900 XJ EVO” gépet is tartalmaz.
- Az RM-viszonteladó Javelin 2022–24-es katalógusa a méret-/felszereltségi táblában külön oszlopként sorolja a „900 XJ EVO” és „MAJOR XJ” gépet. Ez megerősíti, hogy ezek külön megnevezések, de nem igazolja a helyi „RM Major XJ EVO” rekord azonosságát egyik modellel sem.
- A helyi 112-es rekordnak nincs főképe, termékforrás-jegyzete vagy egyedi leírása; külön rekordként megmarad. Nem rendeltem hozzá másik Major modellhez tartozó képet vagy adatot.
- Források: [RM XJ 2021 katalógus](https://www.rmirrigation.com/public/cataloghi2021/XJ2021_Inglese_Cod202.pdf), [RM XJ családoldal](https://www.rmirrigation.com/en/models/professional-hose-reel-irrigators/structure-that-can-be-hydraulically-lowered/), [Javelin RM Product Guide](https://javelinirrigation.co.uk/wp-content/uploads/2024/12/Javelin-Irrigation-Product-Guide.pdf).
- Feloldáshoz a helyi rekord eredeti adatlapja, SKU-ja vagy a forgalmazói kínálat egyértelmű modellmegjelölése szükséges; addig a képhiány nyitott.

## 2026-10-22 – Aktuális terméktartalom-hiányok, CMS API alapján

- A helyi Payload API-n keresztül ellenőrzött 97 publikált, nem legacy termékből 95-nek van főképe és tartalmi leírása. Két főképhiány maradt: a Giunti `Öntözővízágyú` (98) és az RM `Major XJ EVO` (112); az Öntözővízágyúnak ezenfelül rövid összefoglalója és részletes, pontosan azonosított gyártói tartalma sincs.
- A Major XJ EVO újraellenőrzéséhez megnyitott hivatalos [RM XJ 2021 katalógus](https://www.rmirrigation.com/public/cataloghi2021/XJ2021_Inglese_Cod202.pdf) `MAJOR EVO` néven tartalmaz XJ modellt. Ez nem bizonyítja, hogy azonos a külön helyi `Major XJ EVO` termékkel; nem került hozzá kép vagy adat a külön `Major EVO` rekordból.
- A publikált 24 termékcsalád mindegyikének van közvetlen képe/logója vagy a saját termékei közül örökölt képe. Három alkategória-kártya maradt kép nélkül: `Áramfejlesztő kivitelek` (nincs modell, kategóriaadat szerint csak kivitelek), `Öntözési automatika és szerelvények` (nincs még forrással azonosított konkrét termék), valamint `Öntözőfejek és vízágyúk` (a Giunti vízágyú modellje nem azonosítható). Ezekhez más termék fotót nem társítottam.

## Friss termékadat-audit és RM Magnum kiegészítés — 2026-10-22, 06:46

- A 3001-es Payload API `products?limit=200&depth=1` válasza ismét 125 rekordot adott: 105 publikált, nem legacy terméket és 20 megőrzött legacy rekordot. Az aktív katalógusban 12 márkához 96 termék, valamint 9 márka nélküli terméktípust/tartozékot sorol a CMS.
- Az aktív 105 termékből 103-nak van főképe. A két főképhiány változatlanul az RM Major XJ EVO (112) és a gyártó/típus szerint nem azonosított Öntözővízágyú (98). A vízágyú egyetlen üres rövid leírású és tartalmi rekord; az RM Major XJ EVO-hoz továbbra sincs megbízható, külön modellazonosító forrás.
- A korábbi HydroG-képhiány-megjegyzés elavult: a rekord jelenleg a régi RM Hungary oldal 228×152 px-es általános csepegtetőszalagos fotóját használja. Ez nem HydroG-modellfotó; a HydroG és a mai Giunti HydroG2 azonossága továbbra sem bizonyított. A vízágyú- és HydroG-képet nem szabad azonosítatlan konkrét modell bizonyítékaként kezelni.
- Az RM `Magnum` (ID 42) termékoldal korábban részletes műszaki szakasz nélkül jelent meg. Az RM XJ 2021 katalógusa közvetlenül állítja, hogy a Magnum dobjának hajtóláncai mindkét oldalon vannak, és a 900-as kivitelnél ez opció. Ezt az egy igazolt jellemzőt magyar szakaszként a termék CMS-mezőjébe tettem, és csatoltam a hivatalos XJ családoldalt, illetve katalógust forrásbizonyítékként. A `sourceEvidence` visszaolvasása és a kanonikus termékoldal szerveroldali HTML-ellenőrzése sikeres; a termék ID-je, slugja, családja, képe és régi URL-je változatlan.
- Apply előtti teljes adatbázis- és médiamentés: `backups/rm-hungary-20261022-064528.zip`. Ismételhető importer: `scripts/import-rm-magnum-catalog-feature.ts`; előnézet alapértelmezett, alkalmazás `-- --apply` kapcsolóval. Forrás: [RM XJ családoldal](https://www.rmirrigation.com/en/models/professional-hose-reel-irrigators/structure-that-can-be-hydraulically-lowered/) és [RM XJ 2021 katalógus](https://www.rmirrigation.com/public/cataloghi2021/XJ2021_Inglese_Cod202.pdf).
- Nyitva marad a két azonosítatlan/kép nélküli termék, az összes márka hivatalos portfóliója és helyi katalógusa közötti teljes lefedettségi összevetés, továbbá a teljes manuális vizuális és bejelentkezett admin QA. A CUA szerint a Mac zárolt, ezért natív böngészős QA ebben a körben sem volt elérhető. Produkció változatlan.


## Giunti szórófejek és a vízágyú rekord modellazonossága — 2026-10-22

A hivatalos Giunti [Tornado F1/F2 termékoldal](https://www.giuntispa.com/product/tornado-f1-and-f2/) és [Tornado TF/TFS termékoldal](https://www.giuntispa.com/product/tornado-tf-tfs/) a csévélődobhoz tartozó szórófejet és több modell–szórófej párosítást nevez meg (például K1, Ambo, Senior, Reflex/Twin és Explorer/Twin). Ez alátámasztja, hogy a szórófej a kínálat valós része, de nem azonosítja a helyi különálló `Öntözővízágyú` rekordot egyik megnevezett típussal sem. A rekordra ezért továbbra sem került modellfotó, specifikáció vagy típusleírás; ehhez pontos termékazonosító vagy a helyi rekordhoz köthető gyártói adat szükséges.

Az aktív termékrekord URL-jeként megadott régi RM `index.php?alkat=13` oldal élő tartalma a Giunti csepegtető és mikroöntözési kategóriát mutatja; a szövegben nincs öntözővízágyú- vagy szórófejmodell. Ez az URL tehát nem igazolja a külön termék rekordhoz rendelését. Az értékesítési kapcsolat/termékazonosság tisztázásáig a rekord márka-, kép- és modell-hozzárendelése ellenőrizendő; sem a `Tornado` oldalakról, sem az alkat=13 oldal más képeiből nem szabad képet vagy műszaki adatot átemelni.


## Valducci Irromotor és szűrőrendszerek — 2026-10-22

- Az Irromotor családoldal és három szerkeszthető modellcsoport a `csevelodobos` kategóriába került. A New Mini, V és Vi csoportok katalógusváltozatait, táblázatait, gyártói képeit és PDF-katalógusát külön termékoldalakon jelenítettük meg. Forrás: [Giunti / Valducci márkaoldal](https://www.giuntispa.com/valducci-brand/) és [Irromotor prospektus](https://www.giuntispa.com/wp-content/uploads/2017/12/Irromotor_depliant.pdf).
- A hivatalos márkaoldal kvarchomokágyas, hálós és tárcsás szűrőket, hidrociklonokat, tápoldatozó tartályokat és egyedi szűrőállomásokat sorol fel, és szűrőtelep-fotót mutat. A „Download Valducci filtering brochure” felirat mellett nincs fájlhivatkozás; a `Valducci szűrőrendszerek` családoldal ezért általános gyártói bemutatót és képet kapott, konkrét, nem igazolt modell- vagy méretadat nélkül. A Giunti márkájú termékeket nem rendeltük át Valduccihoz.
- Importok: `pnpm import:valducci-irromotor`, `pnpm import:valducci-filters`. A szűrőcsalád módosítása előtti mentés: `backups/rm-hungary-20261022-040113.zip`. Az Irromotor családoldal, három modellcsoport és a szűrőcsalád helyi útvonalai HTTP 200 választ adtak; a három termékoldalon a katalógustáblázatok megjelentek.

## Többmárkás, azonosított terméktípusok — 2026-10-22

- A terméktípus rekordok 105 (`Dohánytörő kombájnok`), 104 (`Dohánytetejező gépek`), 103 (`Permetezőgépek`) és 101 (`Bakháthúzó gépek`) régi RM Hungary forrásbizonyítéka több gyártót nevez meg. A CMS külön `brand` szövegmezője lehetővé teszi a több márkanév egyértelmű megjelenítését anélkül, hogy hamis egygyártós kapcsolatot hoznánk létre.
- A forrás alapján kitöltött márkaszövegek: De Cloet, Mantovani; Mantovani, De Cloet; De Cloet, Mantovani; De Cloet, Oliver Agro, Mantovani. Nem hoztunk létre ismétlődő, modellnek látszó termékrekordokat, mert konkrét modellt egyik rekord sem nevez meg.
- A 110 (`Mezőgazdasági ívsátor`), 107 (`Zölddohány-feldolgozó gépek`), 106 (`Dohányszárító kamrák`) és 102 (`Palántaültető gépek`) márkamezője üres maradt; az adott régi RM forrásrekord nem nevez meg gyártót. Importer: `pnpm assign:multibrand-type-brands` (előnézet alapértelmezett, alkalmazás `-- --apply` kapcsolóval). Mentés alkalmazás előtt: `backups/rm-hungary-20261022-040440.zip`.
- Ellenőrzés: mind a négy termékoldal HTTP 200; szerveroldali HTML-ben megjelennek a márkaszövegek. `pnpm exec tsc --noEmit` és `pnpm build` sikeres. A friss preview teljes útvonalellenőrzése 216/216 oldal és 430/430 renderelt média-URL HTTP 200.

## További hivatalos forrásellenőrzés — 2026-10-22

Az RM hivatalos angol modelloldala és sitemapje a modellt `Major EVO` néven, az XJ család alatt sorolja; az XJ család bemutatója is ezt a nevet használja. Nem találtam hivatalos RM oldalt vagy katalógusjelölést `Major XJ EVO` névvel. Ez nem elég bizonyíték a külön helyi `RM Major XJ EVO` rekord összevonására a `RM Major EVO` termékkel, ezért a két rekord továbbra is külön marad, a Major XJ EVO kép- és azonosságellenőrzése nyitott.

A Giunti hivatalos önjáró öntözőgépkategóriája 15 gépmodellt/családot, a külön tartozékkategória pedig 16 gépkiegészítőt sorol fel. A Tornado F1/F2 és TF/TFS termékoldal konkrét sprinklerneveket és gép–szórófej párosításokat közöl. Ezek a gyártói adatok azt igazolják, hogy a „vízágyú” lehet önjáró öntözőgéphez tartozó szórófej, de nem azonosítják a helyi, önálló `Öntözővízágyú` rekord modellszámát vagy főfotóját. Nem kapcsoltam hozzá egyik Tornado-gép képét vagy adatát sem.

Források: [RM hivatalos XJ családoldal](https://www.rmirrigation.com/en/models/professional-hose-reel-irrigators/structure-that-can-be-hydraulically-lowered/), [RM hivatalos sitemap](https://www.rmirrigation.com/en/sitemap.html), [Giunti önjáró gépek](https://www.giuntispa.com/product-category/macchine-irrigatrici-semoventi/), [Giunti géptartozékok](https://www.giuntispa.com/product-category/accessori-macchine-irrigatrici-semoventi/), [Tornado F1/F2](https://www.giuntispa.com/product/tornado-f1-and-f2/), [Tornado TF/TFS](https://www.giuntispa.com/product/tornado-tf-tfs/).

## De Cloet dohánybetakarítók — hivatalos adatlapok újraellenőrzése, 2026-10-22

- A De Cloet hivatalos oldalain négy modellazonosítás szerepel a korábban RM Hungary által De Cloet/Mantovani márkához kapcsolt dohánytörő és tetejező terméktípusok körében: 1TH-I, 2TH-II, 1TH4 és 2TTH. Források: [1 Row Machine](https://www.decloet.it/en/products/1_row_harvester.html), [1-2 Rows Machine](https://www.decloet.it/en/products/1-2_rows_harvester.html), [Apical](https://www.decloet.it/en/products/apical.html).
- Az 1 Row / 1-2 Rows adatlap közös, hárommodell-oszlopos táblázata szöveges kivonatban több üres cellát elveszít, de az eredeti [gyártói PDF](https://www.decloet.it/pdf/depliant_raccoglitrice_ita.pdf) táblázatának vizuális ellenőrzése alapján az 1TH-I és 1TH4 adatai biztonsággal kioszthatók. A 2TH-II külön modellhez tartozó teljesítménytábla-cellája üres; a gyártó közli az 85–115 LE motorválasztékot, de nem rendeli azt egyértelműen a két modellhez. A 2TTH oldal külön műszaki adatokat és felszereléslistát közöl.
- A helyi régi RM képek a `Dohánytörő kombájnok` és `Dohánytetejező gépek` gyűjtőoldalakról származnak; De Cloet és Mantovani gépeket vegyesen ábrázolnak, és nem azonosítják a fenti konkrét modelleket. Ezekből nem állítottam be modellspecifikus főképet vagy galériát. A hivatalos oldalak képfeliratai azonosítják a bemutatott modelleket, de az elérhető HTML-kivonat nem tárta fel a képfájlok URL-jeit.
- A forrásoldal képei és PDF/videóhivatkozásai feltárhatók; az 1TH-I-hez azonban nem találtam külön hivatalos fotót. Az 1TH-I rekord ezért piszkozat maradt, és nem használtam hozzá más modell képeit.
- A 2TTH gyártói PDF-brosúrája: [depliant_2TTH_eng.pdf](https://www.decloet.it/pdf/depliant_2TTH_eng.pdf). A brosúra 115 LE John Deere vagy 126 LE Iveco motort említ; a gyártóoldal a 115 LE-s John Deere változatot részletezi. A PDF további közölt adatai: három hidraulikus, teleszkópos hajtott kerék, 0–24 km/h munkasebesség, két tárcsás szártörő és legfeljebb 3,5 m ürítési magasság. A 2TTH videója: https://www.youtube.com/watch?v=oh12HHukEKU; az 1-2 Rows Machine videója: https://www.youtube.com/watch?v=WrLMXnfLh0E.

## De Cloet dohánybetakarítók importja — 2026-10-22

- A De Cloet dohánybetakarító család bekerült a `Dohánybetakarító gépek` alkategóriába. Publikált termékoldal készült az **1TH4**, **2TH-II** és **2TTH** modellekhez; mindegyiken a gyártóhoz köthető főfotó és galéria, magyar leírás és igazolt műszaki adatok szerepelnek. A 2TH-II és 2TTH oldal gyártói videót, mindkét oldalhoz tartozó brosúra pedig közvetlen gyártói PDF-hivatkozást tartalmaz.
+- A közös 1TH-I/2TH-II/1TH4 táblázatból az egyértelműen párosítható sorok kerültek a modellekhez; a 2TH-II teljesítményértéket nem kapott, mert a gyártói táblázat ezt nem rendeli hozzá külön. Az **1TH-I** termékrekord a CMS-ben azonosított, de piszkozat és rejtett a családkártyákról, mert sem hivatalos modellfotót, sem biztosan hozzárendelhető helyi RM-fotót nem találtam.
+- Gyártói fotók forrásoldalai: [1TH4](https://www.decloet.it/en/products/1_row_harvester.html), [2TH-II](https://www.decloet.it/en/products/1-2_rows_harvester.html), [2TTH](https://www.decloet.it/en/products/apical.html). A fényképek 618–800 px szélességű eredeti JPG-k; 16 képfájl töltődött be, mind 800×822 px alatti, 103 kB alatti fájlméretű. A képeket a CMS/Next reszponzív képkiszolgálója adja.
+- Gyártói PDF-ek: [1TH-I/2TH-II/1TH4 brosúra](https://www.decloet.it/pdf/depliant_raccoglitrice_ita.pdf), [2TTH brosúra](https://www.decloet.it/pdf/depliant_2TTH_eng.pdf). A 2TTH PDF-leírás 115 LE John Deere- és 126 LE Iveco-motorváltozatot is említ; a brosúrákat külső gyártói linkként hagytam, mert a De Cloet tárhely az automatizált fájlletöltést elutasította.
+- Ismételhető importer: `pnpm import:decloet-harvesters` (előnézet alapértelmezett, alkalmazás: `-- --apply`). Mentések az import előtt: `backups/rm-hungary-20261022-051019.zip`; brosúralink-frissítés előtt: `backups/rm-hungary-20261022-051248.zip`.
+- Ellenőrzés: TypeScript-ellenőrzés és production build sikeres. Az új család és 3 publikált termékútvonal friss preview-n HTTP 200; a 16 új De Cloet termékfotó és mind a 3 termékoldal megjelenése ellenőrizve. A családkártyák növekvő modelljelölés szerint jelennek meg: 1TH4, 2TH-II, 2TTH. A belépett admin és kézi asztali/mobil vizuális ellenőrzés továbbra sem érhető el, mert a CUA a zárolt Mac munkamenethez nem tud csatlakozni.
- Friss teljes staging crawl a De Cloet-import után: 220/220 sitemap-útvonal HTTP 200, 395/395 renderelt helyi média-URL HTTP 200/206. Ez az útvonal- és fájlkiszolgálást igazolja, nem a kézi vizuális, mobil vagy admin felületi működést.

## Staging megjelenési QA kiegészítés — 2026-10-22

- RM GX családbemutató „tanúsított tanúsított” ismétlése a forrásmező és az admin CMS-adat pontos egyezésének ellenőrzése után javítva „tanúsított alapanyagokat” szövegre. Előnézet, apply és CMS-visszaolvasás ellenőrizte; teljes DB/feltöltés mentés készült előtte: `backups/rm-hungary-20261022-052138.zip`. A publikus staging böngészőben a javított szöveget mutatja.
- RM 540 GX oldalt 390×844 mobilnézetben vizuálisan és hozzáférhető oldalszerkezetben ellenőriztem: főfotó, méretváltozatok, felszerelés, táblázat, videó, specifikációk, galéria és PDF-link látható/elérhető. RM öntözőszárny-családi oldalon Albatros, Falcon, Boom, Liquò, Condor kártyák képpel és rövid szöveggel szerepelnek.
- TypeScript-ellenőrzés sikeres; a mobil teszt viewportját visszaállítottam; a böngészőkonzol nem jelzett hibát. Ez a két oldal célzott QA-ja, nem teljes portfólió- vagy belépett adminellenőrzés.

## Teljes production preview útvonalellenőrzés — 2026-10-22

- Elkülönített másolaton production build sikeres; a localhost:3005 preview sitemapjén 220/220 oldal HTTP 200. Az oldalak HTML-jéből kivont 5 117 kép-/képkiszolgáló-/dokumentum URL mind HTTP 200/206.
- 3001 staging preview-n a frissebb, ekkor 211 URL-es sitemap mind hibamentes; a szerveroldali oldalakból kivont 4 832 média/dokumentum URL mind elérhető.
- Ezek elérhetőségi QA eredmények, nem teljes vizuális vagy adminfelületi minőségbizonyítékok. A gyártói termékkörök teljes lefedettsége, a belépett admin és a teljes desktop/mobile vizuális QA még nyitott.

### Normál Turbopack production build — 2026-10-22

Az izolált másolatban a normál `pnpm build` is sikerült, miután a pnpm virtuális `node_modules` a másolaton belül újraépült; a korábbi Turbopack-feloldási hiba a kívülre mutató symlink eltávolításával megszűnt. A friss production preview 220/220 sitemap oldala HTTP 200, a HTML-ből kiolvasott 5 110 egyedi média/dokumentum URL HTTP 200/206. Az ideiglenes szervert a crawl után leállítottam. Belépett admin QA és teljes vizuális lefedettség továbbra is hiányzik.


## Friss, gépi hierarchia-audit — 2026-10-22

A futó 3001-es Payload API jelenlegi állapotában 123 termékrekordból 103 publikált, nem legacy; 94 rekord 12 gyártóhoz tartozik, 9 általános. 42 aktív kategória és 27 publikált család van. 103 aktív termék és minden család/kategória kapcsolatán végigfuttatott ellenőrzés 0 szülőkategória-szintű besorolási hibát, 0 család–alkategória eltérést, 0 család–gyártó eltérést és 0 publikált termék slugduplikációt talált. Két főképhiány igazolódott: RM Major XJ EVO (112), amelynek hivatalos azonosítása a külön Major EVO rekorddal nem oldható fel, valamint az azonosítatlan Öntözővízágyú (98). Csak a vízágyú rövid leírása is hiányzik; a Major XJ EVO meglévő summary mezője üres ugyan, de más forrásból a modell tartalmát nem szabad átvenni.

## RM Major XJ EVO név- és képforrás újraellenőrzése — 2026-10-22

- A keresési újraellenőrzés hivatalos RM oldalakon továbbra is `Major EVO` nevet talál az XJ családban; a gyártói XJ családleírás ezt a gépet említi, de külön `Major XJ EVO` terméknevet nem azonosít. [RM XJ családoldal](https://www.rmirrigation.com/en/models/professional-hose-reel-irrigators/structure-that-can-be-hydraulically-lowered/), [RM Major EVO adatlap](https://www.rmirrigation.com/nl/modellen/professionele-irrigatiemachines/leunend-op-de-grond/major-evo.html)
- A Javelin Irrigation 2022-es és 2024-ben közzétett RM útmutatója külön oszlopban sorolja a `900 XJ EVO` és `MAJOR XJ` neveket; ez megerősíti, hogy hasonló, de eltérő modellnevek léteznek. A kézikönyv nem azonosítja a helyi `Major XJ EVO` rekordot, ezért abból sem rendeltem képet vagy adatot. [Javelin 2022/2024 RM Product Guide](https://javelinirrigation.co.uk/wp-content/uploads/2024/12/Javelin-Irrigation-Product-Guide.pdf)
- A régi RM Hungary számozott `alkat` hivatkozásai idővel más tartalmat mutathatnak: az `index.php?alkat=5` jelenleg bakháthúzó kategóriát ad. Történeti termékazonosságot csak a helyi megőrzött export, médiakapcsolat vagy gyártói modellbizonyíték alapján szabad megállapítani; az élő régi ID-k önmagukban nem elegendők. [RM Hungary régi kategória-URL](https://www.rmhungary.hu/index.php?alkat=5)
- Döntés változatlan: a külön `RM Major EVO` fotóját és tartalmát nem másoljuk át a `RM Major XJ EVO` rekordhoz. A helyi termékkép és az egyedi modellazonosság nyitott.

### Forrásmappa-ellenőrzés — 2026-10-22

- Újra átnéztem a projekt régi `public/uploads` és `public/source-media` médiamappáját, valamint a read-only `/Users/nemethtamas/Projects/RM/kepek/` fájllista modellnév alapján. Található `major-evo` és `major-xjm` kép, de nincs `major-xj-evo` vagy `major-xj` nevű termékfotó. Az `rmhungary__major-evo_1_1.png` fájl a külön Major EVO modellhez tartozik; nem társítottam a Major XJ EVO rekordhoz.
- A keresés nem bizonyítja, hogy más néven vagy nem strukturált fájlnév alatt sehol nincs megfelelő kép; ezért a képhiányt nem tekintem feloldottnak. A 98-as Öntözővízágyúra sem találtam a két helyi médiatárban egyértelműen azonosítható fájlt.
- Nem módosítottam a projektet vagy a CMS-t; az eredeti RM képmappát csak olvastam.
- Az RM hivatalos sitemapjének új webes ellenőrzése az XJ családnál `Major EVO` nevet mutat, külön `Major XJ EVO` terméket nem. Ez összhangban van a korábbi forrásellenőrzéssel, de a helyi külön rekord történeti azonosságát nem oldja fel. Hivatkozás: [RM hivatalos sitemap](https://www.rmirrigation.com/en/sitemap.html).


## Lindsay/Zimmatic körforgó modellek bővítése — 2026-10-22

- Az eredeti RM Hungary Vodar oldal archivált képanyagában szerepelt egy 8500P megnevezésű külső képforrás és egy `7500ppetites.jpg` fájl. A 7500P fájl alacsony, 171×119 px-es felbontású, ezért csak helyi termékazonosítási nyomként vettem figyelembe; publikus kártya- és termékképeknek a Lindsay hivatalos 7500P/8500P termékoldalainak képeit használtam.
- A Zimmatic körforgó család jelenleg a 7500P, 8500P és korábban rögzített 9500P modelleket sorolja fel, növekvő sorrendben. A family slug és a 9500P régi product slug/URL megmaradt; a család megjelenített neve általánosabb lett. Új aktív termékoldalak: `lindsay-zimmatic-7500p`, `lindsay-zimmatic-8500p`.
- A két új modell magyar leírást, gyártói specifikációkat, három-három hivatalos termékfotót és forrásadatokat kapott. A fotók 1200 px szélesek, 153–421 kB közötti eredeti JPEG-ek; az oldal reszponzív képkiszolgálója optimalizált változatot ad. A 7500P-nél a legfeljebb 60 acre/24 ha táblaméret, 4,5 hüvelykes cső, 5 hüvelykes pivot és 10,5 láb szabadmagasság; a 8500P-nél 12-es gauge fővezeték, három szabadmagasság-opció, 9500CC-kompatibilitás és az útmutatóban szereplő max. 30%-os lejtés jelenik meg.
- Hivatalos források: [Zimmatic körforgó rendszerek](https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots), [7500P](https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots/7500p-center-pivot), [8500P](https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots/8500p-center-pivot), [Zimmatic termékútmutató](https://www.lindsay.com/uploads/files/resources/317-Zimmatic_Product_Guide_US_Web_Final_1123.pdf). A 2025-ös útmutató letöltése a staging eszközzel nem sikerült, ezért nem töltöttem fel helyi PDF-ként; a forrás URL-je adminisztratív bizonyítékként szerepel.
- Importer: `pnpm import:lindsay-zimmatic-content`; a család és modellrögzítés előtti mentések: `backups/rm-hungary-20261022-055631.zip`, `backups/rm-hungary-20261022-055707.zip`. A staging API 125 rekordból 105 aktívat és 20 legacy rekordot mutat; Lindsayhez 4 aktív modell tartozik. A két új modell, a családoldal és a régi 9500P útvonal HTTP 200-at adott; a családoldal HTML-jében a kártyák sorrendje 7500P → 8500P → 9500P. A TypeScript-ellenőrzés és elkülönített `pnpm build` sikeres.
- A teljes Lindsay-portfólió és magyarországi helyi kínálat azonossága továbbra sincs teljességgel bizonyítva; a 9500HS, mobil forgáspontok és lineáris gépek nem kerültek fel, mert ezekre az eredeti RM Hungary anyagban nem találtam egyértelmű helyi termékazonosító nyomot. Vizuális desktop/mobil és admin QA nyitott, mert a CUA natív felületét a zárolt Mac miatt nem lehetett megnyitni. Éles publikálás nem történt.


## RM MOP galéria hivatalos fotókkal — 2026-10-22

- A médiatárban találtam nyolc, a hivatalos RM MOP termékoldalról származó, addig termékhez nem kapcsolt fotót: `MOP-1095-1/3/4/5/6.jpg`, `mop2.jpg`, `mop3.jpg`, `mop4.jpg`. A képek MOP motoros szivattyúegységeket és részleteket mutatnak.
- A képeket az RM MOP termék galériájához kötöttem; a korábbi RM MOP 700 fotó maradt a fő kép, a galériában nincs megismételve. Ezzel a terméklap képgalériája nyolc valódi termékfotóra bővült.
- Importer: `pnpm attach:rm-mop-gallery`, preview az alapértelmezett; apply `-- --apply`. Mentés: `backups/rm-hungary-20261022-060302.zip`. A staging API, termékoldal és mind a nyolc médi URL ellenőrizve, HTTP 200. A teljes asset-tárolóduplikátum-audit még nincs lezárva; ebben a körben fájlt nem töröltem.


## Reszponzív útvonal-QA és Da Ros SEM 100 azonosítási határ — 2026-10-22

A 222 staging útvonal Playwright-ellenőrzése eredetileg 31 mobil kilógást jelzett, jellemzően a CMS műszaki illusztrációinak fix képszélessége miatt. A közös CSS-javítás után az elkülönített production builden és az új 3001-es stagingen 222/222 útvonal HTTP 200; mind a 222 oldal asztali (1440 px) és mobil (390 px) ellenőrzésén 0 vízszintes kilógás, 0 hibás kép és 0 klienshiba. Bejelentkezett admin és teljes kézi vizuális ellenőrzés továbbra sincs igazolva.

A Da Ros hivatalos [SEM 100 termékoldala](https://da-ros.com/en/product/seeder-sem-100/) 70 kg tömeget, 50–150 l/perc levegőfogyasztást, 40 sor/perc (100 tálca/óra) teljesítményt, legfeljebb 600×400×130 mm-es tálcaméretet, méretrajzot és YouTube-videót közöl. A helyi RM Hungary-fotó ugyan vetőgép-típust mutat, de a gyártói SEM 100 látványképével és rajzával való hasonlóság nem bizonyít konkrét modellazonosságot. Ezért a 99-es általános Da Ros termék rekord nem kapott SEM 100 nevet, adatot, rajzot vagy videót. A SEM 100 hivatalos képe kizárólag a családkártya illusztrációja marad.

## Kategória- és családkártyák képöröklésének újraellenőrzése — 2026-10-22

A friss 3001-es staging Payload API alapján 42 aktív kategória a 7 gyökérből és 35 alkategóriából áll. A gyökérválasztó mind a hét kategóriánál beépített kategóriaikont rajzol. A saját `image` mező nélküli alkategóriák kártyája a meglévő megjelenítési logika szerint a hozzárendelt publikált család vagy termék képét örökli; a teljes 35-ös alkategória-listában nem találtam kép nélküli kártyát. A 27 publikált család mindegyikének van saját családképe/logója vagy hozzátartozó termékből örökölhető képe. Ez API-adat és a frontend fallback logikájának ellenőrzése; vizuális képminőségi QA-nak nem helyettesítője.

A 105 aktív termék közül továbbra is két rekordnak nincs főképe: RM Major XJ EVO (112) és az azonosítatlan Öntözővízágyú (98). Ezeknél a forrás- és azonossági korlátokat fentebb dokumentáltam; bizonytalan fotó nem került hozzájuk.

## Rovatti TK és TK Europa fotófrissítés — 2026-10-22

- A gyártó hivatalos [TK/TK Europa termékcsalád-oldalán](https://www.rovatti.it/prodotti/pompe-di-superficie/1239/pompe-multistadio-con-moltiplicatore) szereplő `cr_TK-Web-9026.jpg` sorozatfotó 515×515 px-es, míg a két helyi modell korábbi képe 369×369 px-es volt. A fotó közvetlenül ehhez a modellcsaládhoz kapcsolódik.
- A 73-as `Rovatti TK` és 74-es `Rovatti TK Europa` termék főképe frissült erre a gyártói sorozatfotóra. A régi, kisebb felbontású képet ismétlő egyetlen galériaelem kikerült; a többi műszaki adat és termékkapcsolat változatlan.
- Ismételhető import: `scripts/upgrade-rovatti-tk-images.ts` (alapértelmezetten előnézet, `--apply` szükséges). Előzetes mentés: `backups/rm-hungary-20261022-065748.zip`. A CMS API mindkét képet 515×515-ként adja vissza; a két termékoldal és a média-URL HTTP 200. TypeScript és production build sikeres; frissített 3001-es stagingen mindkét terméklap képe SSR HTML-ben szerepel.

## RM Major XJ EVO — gyártói modellnév-ütközés friss újraellenőrzése (2026-10-22)

- A gyártó hivatalos [XJ családoldal-térképe](https://www.rmirrigation.com/en/sitemap.html) az XJ csoportban `Major EVO` néven sorolja a modellt; külön `Major XJ EVO` megnevezést nem tartalmaz.
- Az RM [XJ 2021 katalógusában](https://www.rmirrigation.com/public/cataloghi2021/XJ2021_Inglese_Cod202.pdf) a felszereltségi táblázat `Major XJ` oszlopot nevez meg; ez sem azonosítja a helyi `Major XJ EVO` rekordot.
- A gyártó [Major EVO adatlapja](https://www.rmirrigation.com/nl/modellen/professionele-irrigatiemachines/leunend-op-de-grond/major-evo.html) képeket, műszaki rajzot, felszereltséget és videókat ad, de a helyi `RM Major EVO` (41) rekordhoz tartozik. Az elkülönített `RM Major XJ EVO` (112) rekordot az `RM Major EVO` adataival nem vontam össze és nem töltöttem fel.
- A 112-es rekord `reviewState` értékét `specs-missing` helyett `source-check` állapotra állítottam, belső megjegyzésben rögzítve az elnevezési eltérést és a szükséges bizonyítékot. A publikus név, slug, kategória, URL és termékadatok nem változtak; kép továbbra sincs.
- Mentés: `backups/rm-hungary-20261022-072224.zip`; előnézetes, újrafuttatható adatjavítás: `scripts/review-rm-major-xj-evo.ts` (`--apply` módosít). A Payload API visszaolvasta a 112-es rekord új felülvizsgálati állapotát.

## Katalógusállapot frissítése — 2026-10-22

A 98-as `Öntözővízágyú` és 112-es `RM Major XJ EVO` forrásazonosításig piszkozat státuszú. A márka-, modell- és képi megfeleltetés továbbra sem igazolt; a hiányzó tartalom nincs kitalálva. A rekordok, kategóriakapcsolatok, slugok és belső megjegyzések megmaradtak. A publikus katalógus 103 aktív, nem legacy terméket tartalmaz; az összes aktív termékhez kategória és családi kapcsolat ellenőrizve, ahol releváns. A staging új buildjén 220 sitemap útvonal van, mindegyik HTTP 200; mindkét piszkozat útvonala hiányzik a sitemapből. Részletes mentés/build/ellenőrzési napló: `audit/live-catalog-recheck-2026-10-22.md`.

## Kategóriakártyák hiányzó rövid szövegei — 2026-10-22

A CMS-ellenőrzés hét aktív alkategórián nem talált leírást: kistermelői szivattyúk, szivattyúvezérlés, gyorscsatlakozók és idomok, szelepek és hidránsok, talajelőkészítés, palántaültetők, mezőgazdasági ívsátrak. A kapcsolt, már forrásolt család-/termékszövegekből rövid, pontos összefoglalót töltöttem ki; teljesítményt vagy új kompatibilitási állítást nem adtam hozzá.

- Újrahasználható importer: `scripts/fill-category-card-descriptions.ts` (alapból előnézet, `--apply` frissít; meglévő leírást nem ír felül).
- Módosítás előtti mentés: `backups/rm-hungary-20261022-073050.zip`.
- Payload-visszaolvasás, mind a hét kategóriaoldal szerveroldali szövegellenőrzése és `pnpm exec tsc --noEmit` sikeres. A 3001-es staging jelenlegi sitemapje 220 útvonalú; a már futó, előzőleg sikeresen buildelt production kódot ez a CMS-adatmódosítás nem változtatta meg. Éles oldal érintetlen.

## Dohánybetakarító kategóriakép minőségi frissítése — 2026-10-22

A Dohánybetakarító gépek kártyáján a korábbi RM Hungary fotó (400×261) helyett az adott kategóriába sorolt De Cloet 1TH4 termék eredeti gyártói fotója (790×531) szerepel. A kép közvetlenül a publikált 1TH4 termék `cardImage` mezőjéből származik; a termékazonosságot és a gyártói képet a [De Cloet 1TH4 oldala](https://www.decloet.it/en/products/1_row_harvester.html) támasztja alá. Az eredeti kategóriakép médiarekordja megmaradt, csak a kategória képkapcsolata frissült.

- Importer: `scripts/upgrade-tobacco-harvest-category-image.ts` (előnézet az alapmód, `--apply` alkalmazza).
- Módosítás előtti mentés: `backups/rm-hungary-20261022-073426.zip`.
- A kategóriát megjelenítő `/termekek/dohanytermesztes` oldal HTTP 200; SSR HTML-ben az új fotó, gyártói alt szövege és 790×531 mérete szerepel. Az eredeti Payload fájl és a 640 px-es Next optimalizált változat is HTTP 200. TypeScript sikeres.

## Rövid termékcsalád-kártyaszövegek külön CMS-mezőben — 2026-10-22

A 27 publikált termékcsaládból 13 eddig csak az általános `summary` mezőből örökölte a kategória-/főoldali kártyaszöveget. Ezekhez rövid, kártyára szánt `cardDescription` került, a hosszabb összefoglaló és a részletes családtartalom módosítása nélkül. Az egy soros leírások meglévő forrásolt összefoglalókra és a termékcsaládok hivatalos forrásmezőire támaszkodnak. Érintett márkák: De Cloet, Mantovani, Oliver Agro, Da Ros, Lindsay, Rovatti, Giunti és VODAR.

- Módosítás előtti mentés: `backups/rm-hungary-20261022-073810.zip`.
- Újrafuttatható importer: `scripts/fill-family-card-descriptions.ts` (`pnpm import:family-card-descriptions`; `-- --apply` alkalmazza, csak üres mezőket tölt).
- A Payload API 27/27 publikált családnál talál `cardDescription` mezőt. A kategóriaoldalak SSR HTML-jében mind a 27 kártyaszöveg megjelenik; 13 új szöveg 12 kategóriaoldalt érint.
- `pnpm exec tsc --noEmit` sikeres; az importer ismételt előnézete 0 módosítást jelez.
- A kézi vizuális és belépett admin QA továbbra is nyitott; éles weboldal nem változott.


## Kategóriaképek minőségi frissítése — talajelőkészítés (2026-10-22)

A korábbi 300×188-as Bakháthúzó termékfőképet lecseréltem a termék galériájában már szereplő, azonos gépet mutató 598×374-es RM Hungary fotóra. A `Talajelőkészítő és bakhátművelő gépek` alkategória saját képmezője is ezt a fotót használja, így a kategória-, kártya- és termékoldal központilag ugyanarra a médiára hivatkozik. Régi médiafájl törlése nem történt. Előzetes mentés `backups/rm-hungary-20261022-075139.zip`; útvonalak és média HTTP 200, SSR tartalom és TypeScript ellenőrizve.


## Palántaültető kategóriakép és De Cloet-forrásellenőrzés — 2026-10-22

- A kategória saját képmezőjébe került a [MADOSZ De Cloet dohánytermesztési képriportjában](https://madosz.hu/article/view?id=257) megjelent 700×500 px-es négy soros palántaültető-fotó. A kép látható De Cloet gépet mutat, és a kategória illusztrációja; a forrás/jóváírás a Payload médiatárban szerepel. Helyi fájl: `public/images/madosz/decloet-transplanter-category.jpg`.
- A helyi 102-es termék a korábbi RM Hungary oldal alapján négy soros, víz- és műtrágya-adagolós palántaültető-típust jelent, de gyártó- és modellszinten nincs azonosítva. A gyártó [TCD-sorozat oldala](https://www.decloet.it/en/products/transplanting.html) 1–6 soros változatokat, állítható sortávolságot és opcionális tartozékokat ír le; ez nem bizonyítja, hogy a helyi rekord konkrét TCD modell. Ezért az új fotó csak a kategóriához került, a termék képe és műszaki adatai változatlanok.
- Mentés: `backups/rm-hungary-20261022-075640.zip`; ismételhető előnézetes importer: `scripts/upgrade-transplanter-category-photo.ts`. Root/alkategória/termék útvonalak és kép HTTP 200; a root kategória SSR HTML-je az új képet hivatkozza; TypeScript sikeres.


## Zölddohány- és dohányszárítás-kategóriaképek — 2026-10-22

- A 250×103 px-es zölddohány-kategóriaképet a MADOSZ De Cloet dohánytermesztési képriportjának `new-20.jpg` fotója váltja (700×500 px); a képen zöld dohánylevelek gépi feldolgozása/anyagmozgatása látható. A 250×188 px-es dohányszárító-kategóriaképet a `new-22.jpg` váltja (700×500 px), amely dohánylevelek szárítókamrába berakodását mutatja. Forrás és jóváírás a médiatárban: [MADOSZ képriport](https://madosz.hu/article/view?id=257).
- A két helyi termékrekord továbbra is általános típus; a pontos gyártó és modell nem azonosított. Ezért a gyenge termékfőképeket/galériákat nem cseréltem le és a kategóriaillusztrációkat nem kötöttem hozzájuk.
- Helyi fájlok: `public/images/madosz/green-tobacco-handling.jpg`, `public/images/madosz/tobacco-drying.jpg`. Ismételhető előnézetes importer: `scripts/upgrade-tobacco-category-photos.ts`; mentés: `backups/rm-hungary-20261022-075926.zip`. A dohánytermesztés főkategória, a két alkategória és mindkét média HTTP 200; SSR HTML az új képeket hivatkozza.


## Öntözési automatika kategóriakép — 2026-10-22

Az Öntözési automatika és szerelvények kategória 233×220 px-es RM My Irrigation hírfotóját a Payload médiatárban már szereplő, 550×519 px-es `programmatore.png` váltja; a kép egy RM RainMaster 2.6 vezérlőt ábrázol. A hivatalos [RM GX termékcsaládoldal](https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/forg%C3%B3-torony-szerkezet%C5%B1/) ezt a programozót ismerteti, az [RM GX gyártói katalógus](https://www.rmirrigation.com/public/cataloghi2021/Gx2021_Inglese_Cod203.pdf) pedig külön feliratozza a RainMaster 2.6 vezérlőt. A kategória médiarekord alt szövege és forrása frissült; a régi média megmaradt. Kategória-/gyökéroldalak és kép HTTP 200, SSR HTML friss, TypeScript sikeres. Mentés `backups/rm-hungary-20261022-080107.zip`; importer `scripts/upgrade-irrigation-automation-category-photo.ts`.


## Öntözési automatika kategóriakép minőségi frissítése — 2026-10-22

A 55-ös Öntözési automatika és szerelvények kategória 233×220 px-es `My Irrigation` cikkfotóját a már a Payloadban lévő, 550×519 px-es RM RainMaster 2.6 vezérlőfotó váltja. A [hivatalos RM GX családoldal](https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/forg%C3%B3-torony-szerkezet%C5%B1/) és a [gyártói GX katalógus](https://www.rmirrigation.com/public/cataloghi2021/Gx2021_Inglese_Cod203.pdf) alátámasztja a termékazonosságot. A média alt szövegét, forrását és jóváírását is javítottam, a régi médiafájl megmaradt. Mentés: `backups/rm-hungary-20261022-080107.zip`; importer: `scripts/upgrade-irrigation-automation-category-photo.ts`. Gyökér-/alkategóriaoldal, média és TypeScript ellenőrizve. Kézi vizuális/admin QA nyitva a helyi IAB kapcsolatmegtagadása és a CUA zárolt Mac állapota miatt.

## Giunti szűrőrendszerek családbesorolása — 2026-10-22

- A négy helyi Giunti vízszűrő-termék közös, szerkeszthető `Giunti szűrőrendszerek` család alá került: automata szűrőállomás, kvarchomok töltetű közegszűrő, acélbetétes hálós szűrő és homokszűrő-hidrociklon. A terméknevek, képek, leírások, azonosítók és publikus slugok nem változtak.
- A családkártya és családbemutató a már megfelelő, 600×600 px-es `filtroquarz-1c.jpg` médiát használja. A magyar szöveg a hivatalos [Giunti szűrőállomás-kategória](https://www.giuntispa.com/product-category/filtering-stations/) általános leírását szerkeszti; konkrét modellt nem állít.
- A hivatalos kategóriaoldal jelenleg 12 terméket sorol fel. Ez a családbesorolás a négy meglévő helyi rekordot rendezi; a teljes gyártói kínálat és a további helyi termékmegfeleltetések auditja nyitott.
- Ismételhető előnézetes importer: `scripts/group-giunti-filter-products.ts` (`pnpm group:giunti-filter-products`; alkalmazás `-- --apply`). Mentés az alkalmazás előtt: `backups/rm-hungary-20261022-080736.zip`.
- Ellenőrzés: Payload-visszaolvasás igazolja a 4/4 termék család-, kategória- és márkakapcsolatát; a kategória- és családoldal HTTP 200, a kanonikus termékútvonal HTTP 200, a korábbi közvetlen termékútvonal 308-cal a család alatti útvonalra irányít; a képfájl HTTP 200; TypeScript-ellenőrzés sikeres. Éles oldal nem változott.
