# Giunti szűrőállomás-kínálat lefedettségi auditja — 2026-10-22

## Forrás és ellenőrzés

A Giunti hivatalos angol szűrőállomás-kategóriaoldala 12 találatot sorol fel; az olasz változat ugyanezt a kínálatot közli. A gyártó a szűrést vízmennyiség, vízforrás és nyomásjellemzők alapján választandó megoldásként írja le. A kategória 11 termék-/tartozékbejegyzést és egy referencia-galériát tartalmaz. A termékoldalak egy része részletes leírást, azonosítható kódot, konfigurációs táblát és működési ábrát tartalmaz.

Hivatalos források: [Filtering stations](https://www.giuntispa.com/product-category/filtering-stations/), [FILTROQUARZ 1C](https://www.giuntispa.com/product/filtroquarz-1c/), [FILTROQUARZ 2C](https://www.giuntispa.com/product/filtroquarz-2c/), [FILTROLINE](https://www.giuntispa.com/product/filtroline/), [Fertilizer](https://www.giuntispa.com/product/fertilizer/).

## A hivatalos kategória 12 bejegyzése

| Gyártói bejegyzés | Staging CMS-egyezés | Állapot / következő lépés |
|---|---|---|
| Wire Lock closing system | 133 — Wire Lock gyorsnyitó szűrőfedél | A Giunti hivatalos termékoldaláról átvett, külön tartozékrekord; a szűrőcsaládhoz rendelve. |
| Automatic back-flush FILTROQUARZ 2C | 134 — FILTROQUARZ 2C automatikus visszamosással | Külön termékrekord; automatikus mosótelep, saját gyártói fotók, táblázat és működési ábra. |
| Fertilizer | 97 — Tápoldatozó tartály | Egyezés a hivatalos termékoldal, a `fertilizer.jpg`, konfigurációs tábla és működési ábra alapján. Jelenleg a Tápoldatozás kategóriában, család nélkül szerepel; családbesorolása külön eldöntendő. |
| FILTROQUARZ 1C | 95 — Kvarchomok töltetű közegszűrő | A meglévő, URL-megőrző tartományrekord képekkel, konfigurációkkal és 1C/2C változatleírással fedi le; nem kizárólag 1C-ként címkézett. |
| Manual back-flush FILTROQUARZ 2C | 135 — FILTROQUARZ 2C kézi visszamosással | Külön, gyártói képpel, magyar leírással és felszereltséggel. A saját oldalon tábla nem szerepel. |
| FILTROQUARZ 1C with automatic washing battery | 136 — FILTROQUARZ 1C automatikus mosóteleppel | Saját gyártói összeállításkép, további részletfotók, konfigurációs tábla és működési ábra. A főképként egy 600×525 pixeles gyártói fotó szerepel; a kisebb, 304×211 pixeles bélyegkép nem került a galériába. |
| FILTROQUARZ 2C | 95 — Kvarchomok töltetű közegszűrő | A 95-ös tartományrekord tartalmazza a standard 2C konfigurációt, külön gyártói képet és táblát. Nem hoztam létre duplikált, azonos standard modellrekordot. |
| FILTROFLY | 137 — FILTROFLY hálós szűrő | Saját gyártói termékkép, részletrajz és konfigurációs táblázat. |
| FILTROLINE | 94 — Acélbetétes hálós szűrő | Biztos egyezés: hivatalos kép, 510-es termékkód, termékleírás, táblázat, konfigurációs sorok és működési ábra a CMS-ben. |
| FILTROSFER | 138 — FILTROSFER hálós szűrő | Saját gyártói termékkép, részletrajz, konfigurációs tábla és kapcsolódó kép. |
| Hydrocyclone sand separator | 93 — Homokszűrő-hidrociklon | Biztos egyezés a hivatalos fotó, leírás, konfigurációs tábla és működési ábra alapján. |
| Gallery of filtering stations | Nem termék | Referenciaképek gyűjteménye; nem hozandó létre modellrekordként. |

## Staging CMS-pillanatkép

2026-10-22-i friss staging-visszaolvasás: a családhoz most 10 publikált rekord tartozik, ebből hat új, külön modell/tartozék. A meglévő `FILTROLINE` (94), hidrociklon (93) és tápoldatozó (97) forrásazonosított; a 95-ös kvarchomokos terméktartomány az 1C/2C standard változatokat fogja össze. A 96-os általános automata szűrőállomás továbbra is `specs-missing`, modellje nincs azonosítva.

## Nyitott munka

1. A 96-os generikus automata szűrőállomás konkrét modellje és képe nem azonosított; ezt nem szabad a standard vagy automatikus FILTROQUARZ konfigurációk valamelyikével összekeverni.
2. A 97-es Fertilizer pontos családkapcsolatát a helyi taxonómiához igazítani kell; a kategóriaoldali hivatalos listában szerepel, de külön `Tápoldatozás` alkategórián marad.
3. A Wire Lock, FILTROFLY, FILTROSFER és három mosási konfiguráció adminon belüli, kézi szerkeszthetőségét még vizuálisan ellenőrizni kell.

Ellenőrzés: a Giunti kategória HTML-jét közvetlenül letöltöttem (307 620 bájt), és a 12 termék-/galériakártya-hivatkozást a gyártói oldalból kinyertem; az egyedi termékoldalakról a termékfotók, táblázatok, ábrák és leírások forrását is ellenőriztem. A staging Payload API mind a 10 családterméket visszaadja; mind a 10 SSR-adatlap és valamennyi csatolt média/dokumentum URL HTTP 200. Az 1C automatikus mosótelep főképe vizuálisan felülvizsgálva, a 304×211 pixeles eredeti bélyegképnél nagyobb, 600×525 pixeles gyártói fotóra cserélve. Teljes kézi, mobil és admin QA továbbra is nyitott.

## Import és mentés

Hat termékrekord: `scripts/import-giunti-missing-filters.ts`; alapértelmezett mód előnézet, alkalmazás: `NODE_ENV=production pnpm import:giunti-missing-filters -- --apply`. Alkalmazás előtti adatbázis-/média-mentés: `backups/rm-hungary-20261022-081556.zip`. A script 22 forrásképet, részletábrát, konfigurációs táblát és működési ábrát kezel; csak a kiválasztott modellhez tartozó média kerül az adott termékhez.
