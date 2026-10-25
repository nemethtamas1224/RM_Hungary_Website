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

## 2026-10-23 – Aktuális statikus kiadás

- A `main` repó tartalmát a munkamappa friss `site/` könyvtárával szinkronizáltam. A változásban benne van az RM MOP logó Starpower logóknál kisebb megjelenítése (desktop 79×42 px, mobil 68×36 px; a Starpower logók nem változtak), a friss reszponzív termékfotók és a 252 HTML-oldalon használt helyes relatív alapútvonal.
- Helyi böngészős ellenőrzés: 252 útvonal × 3 nézet = 756/756; nincs HTTP-, túlcsordulási, helyi képhiány- vagy JavaScript-hiba. A mobil/desktop MOP-logóméretek és az interakciók (márkasorrend, kategóriaválasztó, menü, galéria, keresés) rendben.
- A statikus forrásmásolat, Next.js projekt és nem Pages éles weboldal változatlan. A teljes tartalmi egyezés továbbra sem igazolt; lásd a fenti összehasonlítási korlátot.
- A statikus frissítés helyi commitja elkészült (`02f3a8b`), a GitHubra nem került fel: a parancssori hitelesítés hiányzik, a GitHub Desktop pedig a zárolt Mac miatt nem volt elérhető. Feltöltés előtt oldd fel a Macet; ezután a kész commit feltölthető. A GitHub Pages ellenőrzése még hátravan.

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
- A frissítés GitHub `main` ágra feltöltve; a vezérlésoldal piros gombja, a pályázati banner és a Rovatti CSS a statikus kiadás része.


## 2026-10-23 – MOP logóméret

- A motoros szivattyúegység kategória RM MOP logója a kártyán 42 px magas/legfeljebb 110 px széles, mobilon 36 px/96 px; a Starpower logók mérete változatlan.
- A helyi módosítás együtt kerül fel a GitHub `main` ágára a pályázati bannerrel, piros CTA-val és Rovatti-zöld kártyakörvonallal.


## 2026-10-23 – Szövegtisztítás és szivattyúlogó

- Az RM MOP logó a dízelmotoros szivattyúegységek oldalán a Starpower logóknál kisebb; a közös Starpower-méretezés változatlan.
- A dohányszárító, dohánytetejező, zölddohány-feldolgozó és magvető oldalakon, valamint az elérhető archív HTML-oldalakon eltávolítottam a korábbi RM-oldalakra utaló megjegyzéseket. A horganyzott gerincvezetéknél is kikerült az ilyen eredetű kínálati hivatkozás.
- Az összes HTML-oldal célzott átvizsgálásakor nem maradt „korábbi RM” vagy a korábbi RM-weboldalra utaló szöveg. A dohányszárító oldal új leírása megőrzi a 12–18 konténeres és fűtési információt, de nem hivatkozik korábbi oldalra.
- Feltöltött commit: `0512284`; a GitHub Pages telepítés sikeres. Az élő dohányszárító-, motoros szivattyúegység-, öntözésvezérlés-oldal és a közös CSS útvonala HTTP 200 választ adott.

## 2026-10-23 – MOP-logó méretkorrekció

- A motoros szivattyúegységek kártyáján az RM MOP logó további kisebbítést kapott: 42 px magas asztali, 36 px mobilnézetben; a Starpower logók mérete változatlan.
- Helyi előnézeti mérés 390/1440 px-en: 2/2 HTTP 200; minden logó betöltött; nincs vízszintes kilógás vagy böngészőhiba. A módosítás és az aktuális statikus kiadás a `main` ágra feltöltésre kerül.

## 2026-10-23 – Egytermékes családok közvetlen hivatkozásai

- A `catalog.json` alapján 13 termékcsaládhoz pontosan egy közzétett termék tartozik. A VODAR körforgó család kártyái már közvetlen termékoldalra mutattak; a további 12 család 22 kártyahivatkozását állítottam át 19 gyártói/kategóriaoldalon. A családoldalak URL-jei továbbra is elérhetők.
- A Da Ros gyártói kártya közvetlenül a Da Ros tálcás magvetőgép oldalára visz. Hasonlóan közvetlenek lettek többek között a De Cloet, Lindsay, Mantovani, Oliveragro, RM, Rovatti, Starpower és Valducci egytermékes kártyái.
- Ellenőrzés: mind a 22 új célútvonal létezik. Helyi böngészőben a Da Ros kártya a termékoldal URL-jét mutatja; a termékoldal HTTP 200-zal és teljes főtartalommal betöltött. `git diff --check` hibát nem jelzett.
- A kártyák szövege, képe és stílusa nem változott. GitHub Desktopból feltöltve a `main` ágra (`793ea063c82154056fc2d3f4cadedcb16cd034a8`); a statikus Pages telepítés és a Pages build/deployment sikeres. Az élő Da Ros gyártói oldalon a közvetlen termékhivatkozást, az élő Da Ros termékoldalt és a Valducci kategória közvetlen kártyáját böngészőben ellenőriztem.

## 2026-10-23 – RM böngészőfül-ikon

- A statikus kiadás 252 HTML-oldalának `<head>` részébe favicon-hivatkozás került. Forrása a meglévő `images/RM_hajdu_monogram_v01.png` kis RM monogram; tartalmat és oldalkinézetet nem módosít.
- Ellenőrzés: mind a 252 oldal azonos ikont hivatkozik; helyben a `/termekek/` oldal 200, az ikon PNG-je 200 és `image/png` típusú. Feltöltés és élő ikonellenőrzés még hátravan.

## 2026-10-23 – Betöltési méret és navigációs javítás

- A lassú vagy csak frissítés után látszó oldalak egyik lehetséges oka a navigációs effektus volt: az előző oldal tartalma teljesen elhalványult, mielőtt a következő statikus HTML betöltött. A közös effektus most rövid, csak mozgást használ, és nem rejti el a tartalmat betöltés alatt. A `static.js` a `<head>`-ben `defer` attribútummal fut.
- 358 megjelenített képre optimalizált WebP változat készült; az eredeti képek megmaradtak. A megjelenített képfájlok összmérete 8 573 679 bájttal csökkent. A tömör plakátképek eredeti JPEG-ként maradtak, mert a WebP változat nagyobb lett volna.
- A kezdőnézeti `/termekek/` CSS, JavaScript és favicon együttes nyers mérete 258 013-ról 90 914 bájtra csökkent (64,8%). A közös CSS 92 459→71 916 bájt, a JavaScript 27 571→17 307 bájt, a `catalog.json` 95 863→75 748 bájt. A keresési index 265 430→258 499 bájt; tartalma szemantikailag azonos.
- Összevetés: 252 HTML-oldal; 0 látható szövegváltozás, 0 hivatkozásváltozás, 0 hiányzó helyi kép-, stílus-, ikon- vagy scriptfájl. Mind a 358 WebP megvan, kisebb az eredetinél, mérete megegyezik a forrásképével; eredeti médiák megmaradtak. `static.js` szintaxisellenőrzése és CSS feldolgozása sikeres, `git diff --check` tiszta.
- Korlát: a futó `127.0.0.1:3180` előnézeti szerver nem volt elérhető, ezért azon nem történt vizuális ellenőrzés. A statikus optimalizálás feltöltve a GitHub `main` ágra; a jelenlegi `2595340` commit és a Pages telepítés ellenőrizve. Nyilvános `/termekek/` oldalon 390 px-es és 320 px-es mobilnézetben a pályázati kép látható, nem okoz vízszintes kilógást, és a link a pályázat oldalára vezet.

## 2026-10-23 – Pályázati lebegő kép mobilon

- Javítottam a mobilos lebegő pályázati elemet: telefonon és összecsukott állapotban is a Széchenyi banner képe látható, 136–150 px szélességű, lekerekített kártyán. A kép 300×79 px-es képarányát megtartja; a CSS cache-verzió 249 HTML-oldalon frissült.
- Ellenőrzés: az `elemek/szechenyi.webp` fájl megvan (300×79 px), a CSS mobil szabálya láthatóvá teszi a képet, az összecsukott stílus sem rejti el, a hivatkozás továbbra is a pályázat oldalra visz. `git diff --check` tiszta. A localhost előnézeti szerver nem érhető el ebben a munkamenetben.
- Feltöltve GitHub Desktopból a `main` ágra; a `2595340` commit Pages buildje és telepítése sikeres. A publikált `/termekek/` oldalon asztali képen és 390/320 px-es telefonos nézetben is ellenőriztem, hogy a banner képe látható marad összecsukott állapotban; a link a `/palyazat/` oldalra nyit.


## 2026-10-23 – Termékoldalak kereskedői megfogalmazása

- Mind a 108 katalógusbeli termékoldal rövid leírását és a 77 részletes bemutatót áttekintettem. Ahol a szöveg gyártói hangon szólt vagy félreérthető volt, kereskedői megfogalmazásra javítottam; a már tárgyszerű termékleírásokat nem láttam el ismétlődő cégnév-előtaggal. A szöveges módosítás 36 termékoldalt érintett.
- A Starpower motoros szivattyúegység részletes leírását kereskedői hangra írtam át: az ajánlat szerinti konfiguráció egyeztetését emeli ki; a Starpower által jelzett gyártói szolgáltatásokat továbbra is külön attribuálja. A termék műszaki tartalma nem változott.
- Ellenőrzés: mind a 108 termékoldal 200-as HTTP-választ ad, a rövid bevezetők mind megmaradtak, a sablonos előtag egyik oldalon sem szerepel. A friss helyi böngészőnézetben a Starpower termékoldal új szövege, műszaki adatai és ajánlatkérő hivatkozása asztali és keskeny mobilnézetben ellenőrizve. A sablonos előtag egyik statikus HTML-oldalon sem szerepel. A 183 termék- és kategóriaútvonal helyi HTTP-ellenőrzése 183/183 sikeres; a változtatások csak szöveges mezőket érintenek, a képek és hivatkozások változatlanok. `git diff --check` tiszta. Feltöltve a GitHub `main` ágra (`a4e6c6e`, az előző helyi commitot is tartalmazza); a Pages automatikus telepítésének ellenőrzése még hátravan.

## 2026-10-23 – Főoldali alkategória-választó pozíciója

- Főkategória kiválasztásakor az oldal finoman az újonnan megjelenő alkategória-választóhoz gördül. A fejléc magasságát figyelembe veszi, így a panel teteje a fejléc alatt marad; a rendszer mozgáscsökkentési beállítását is tiszteletben tartja.
- Ellenőrzés: helyi, 1280×820-as és 390×844-es böngészőnézetben a kiválasztott öntözőgép-kategória után az alkategória-panel a képernyőn látható, 5 választható alkategóriával. A `static.js` szintaxisellenőrzése és `git diff --check` sikeres.
- A változtatást a GitHub Desktopból feltöltöttem a `main` ágra (`b4245e6`); a távoli `main` SHA megegyezik a helyi commit SHA-val.

## 2026-10-23 – Giunti csepegtető és mikroöntöző kategória

- A `/termekek/ontozogepek/csepegteto-mikro/` oldalon megtartottam a meglévő termékcsalád-kártyát, és alatta új, tematikus bemutatót adtam hozzá a csepegtetésről, tápoldatozásról, vezetékekről és idomokról, szűrőkről, csepegtetőcsövekről és mikroelemekről. A felhasználó által megadott műszaki értékeket és szolgáltatási tartalmat gördülékeny, kereskedői megfogalmazásban rendeztem el; a Giunti prospektust a helyi PDF-re linkeltem.
- Forrás: [RM Hungary, `alkat=13`](https://www.rmhungary.hu/index.php?alkat=13). A forrásoldal 34 képét használtam. Mind a 34 eredeti kép SHA-256 lenyomata egyezett a projektben őrzött eredeti fájléval. A megjelenítés meglévő, optimalizált WebP-változatokat használ: 1 089 018 bájt a forrásképek 1 476 222 bájtjához képest, 387 204 bájttal (26,2%) kisebb.
- Ellenőrzés: helyi kategóriaútvonalon 34/34 kép betöltött, a Giunti PDF 200-as választ adott, böngészőhibát és vízszintes kilógást nem találtam. 1440×1000-es nézetben a galériák négy, 390×844-es nézetben két oszloposak. `static.js` változatlan; a CSS-t a böngésző feldolgozta.
- Korlát: az üzemi nyomások, szűrési finomságok, hozamok és vízhasznosulási értékek a megadott, illetve a forrásoldali leírásból származnak; ezeket külön gyártói dokumentummal nem ellenőriztem. A tartalmi módosítást GitHub Desktopból feltöltöttem a `main` ágra (`a6497be`); a távoli `main` egyezett. A GitHub Pages útvonal élő ellenőrzése sikeres: 34/34 kép betöltött, a PDF 200-as választ adott, és 1440/390 px szélességen sem volt kilógás vagy böngészőhiba. A technikai állapotokat külön gyártói prospektussal továbbra sem ellenőriztem.


## 2026-10-25 – SEO-javítás

- Főoldal: egyedi SEO title/meta description, leíró H1, igazolt nyitószöveg és Ajánlatkérés CTA. Organization JSON-LD.
- 12 ismétlődő meta-leírást egyedivé tettem. A hat korábbi belső link nélküli indexelhető URL releváns belső linket kapott. A látható breadcrumbot tartalmazó 212 oldalon JSON-LD BreadcrumbList került a headbe.
- Ellenőrzés: 252 HTML; 229 indexelhető oldal mindegyikén title/description/H1/canonical; 0 duplikált description; 229/229 sitemap URL helyi fájlhoz tartozik; 0 JSON-LD parse/struktúrahiba; a hat céloldalnak van belső bejövő linkje.
- Search Console/backlink/Analytics és végleges domainre történő robots/sitemap/canonical/301 ellenőrzés külső hozzáférést vagy domain-telepítést igényel.
