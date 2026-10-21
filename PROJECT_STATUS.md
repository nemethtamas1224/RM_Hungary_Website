# RM Hungary website rebuild — status (2026-10-21)

## Külön GitHub-előkészítő másolat (2026-10-21)

- A friss forrásmappa másolata: `/Users/nemethtamas/RM/RM_Hungary_Website/`.
- `.env.local`, adatbázisok, mentések, `node_modules`, `.next` és auditfájlok kihagyva. A helyi `.gitignore` tiltja a környezet- és adatbázisfájlok verziókezelését.
- A projekt Next.js/Payload szerveroldali funkciókat használ, ezért GitHub Pages nem tudja közvetlenül futtatni. A forrás a felhasználó jóváhagyásával nyilvános GitHub-repóban van; Pages workflow nincs.
- A következő lépéshez választani kell: statikus CMS nélküli export, vagy szerveroldali tárhely a Payload megőrzésére. Részletek: `GITHUB_PAGES_ELŐKÉSZÍTÉS.md`.

- **Goal:** Rebuild the Hungarian RM website and migrate its full product catalog into editable records without losing the original content. Production remains untouched.
- **Workspace:** `work/rm-hungary-website/`. The parent project's `sources/` mirror and `/Users/nemethtamas/Projects/RM/` remain read-only.
- **Source and audit:** User-approved taxonomy in `audit/catalog-structure-user-2026-10-21.md`; original crawl in `audit/site-crawl.json`; itemized migration in `audit/catalog-migration-report.md`. A recoverable database backup was made before migration under `backups/`.
- **Catalog:** 7 root categories, 35 subcategories, 11 manufacturers, 14 families, 90 new product records, 20 legacy URL mappings. The original 25 category and 20 product records are preserved. Sixteen new records remain draft pending source verification; 41 new records have source-matched images. All 20 old category pages retain their source text, available image galleries and documents in noindex source-archive routes.
- **Frontend:** Nested category → family → model routes, manufacturer and used-machine pages, category navigation, search, sitemap, legacy redirects and an inquiry form. Homepage About scroll, CMS category selector/carousel, animated hover menu and click-open search remain in place. Brand colors: `#C5212E`, `#FBD809`, accent `#529A62`, white.
- **Inquiry handling:** Valid requests save into the authenticated Payload `inquiries` collection; anonymous API reads return 403. A synthetic local request was saved and then deleted. There is no configured email notification or external delivery.
- **Verified:** Production build succeeds. All 35 subcategory, 14 family, 74 published model, 11 manufacturer and 20 source-archive pages returned 200 locally; the main pages and inquiry route did too. All 20 old `index.php?alkat=` keys have local 301 mappings. The report found only two unavailable original images (`540-gx_1_2.png`, `1000gx_1_1.png`). The production-mode local preview is running at `http://127.0.0.1:3000`.
- **Open:** Model specifications, some image-to-model links, and documents need editorial verification before production. No verified individual used-machine listings exist. Hosting, SMTP, production credentials and publication approval remain outstanding. First admin user must be created by the site owner; no credentials are stored here.
- **Next:** Review the 16 draft models and `specs-missing` records against manufacturer documents; supply verified used-machine listings; configure notification/delivery and hosting; complete editorial and legal review before any production release.

## Homepage design update (2026-10-21)

- The catalog selector now starts with only the seven icon-and-text root cards. Selecting one reveals its subcategories; selecting a subcategory reveals only its own product carousel. This was inspected in the local browser in mobile view.
- The hero includes five linked, source-transparent logo cards: RM, Rovatti, Starpower, Giunti and De Cloet. The About section uses the user-supplied Tépe site photo in a floating frame, three structured introductory paragraphs from the CMS, and Bartalis Levente's portrait from the original RM website. The full text stays on `/rolunk`.
- The homepage Contact strip uses yellow `#FBD809` and a red button. Both assets added for this change are in `public/images/`.

## RM hose reel size catalog (2026-10-21)

- User-provided catalog imported under Products → Öntözőgépek és öntözőrendszerek → RM csévélődobok → GX, XJ, Magnum, XJM. The original category slug stays stable; the former large-machine family route redirects to Magnum.
- There are 23 published model records with 234 individually editable `hoseSizes` rows (9/97, 6/86, 3/23, 5/28 by family). Two models were added, 21 updated, three older nonmatching records archived and retained. Images and source relations were preserved.
- The public model page shows a floating size panel with mm/m legend and a catalog-only availability caveat. Source is the user's table in this chat, stored in `scripts/rm-hose-size-data.ts`, not an independently verified current factory availability list.
- SQLite/media backup: `backups/rm-hungary-20261021-150414.zip`. Types and production build were generated successfully. The local preview is running at `http://127.0.0.1:3000`; production is unchanged.

## Homepage adjustment (2026-10-21)

- The seven root choices and progressive subcategory selector remain on the homepage. Only the RM csévélődobok selection now reveals four linked series cards (GX, XJ, Magnum/FX, XJM) instead of the 23-model carousel; other subcategories retain their carousel.
- The user-provided Google Maps embed sits beneath the site photo inside the same floating white-card treatment. Public buttons and linked cards have no decorative arrow glyphs; carousel controls use words.
- Production build completed successfully. No production deployment.


## Weboldal-frissítés befejezve (2026-10-21)

- **Gyártói oldalak:** Minden gyártó oldala kategóriakártyákkal csoportosít, nem sorolja fel egyenként a gépeket. Az RM oldalon külön szerepel a Csévélődobok, Öntözőszárnyak és Motoros szivattyú gépegység; a szárnyas modellek és a motoros szivattyúegység neve a kategóriák alatt látható.
- **Kezdőlap és katalógus:** A főcím „Forgalmazott termékeink”; a `/termekek` oldalon a kezdőlapi főkategóriaikonok jelennek meg. A Rólunk rész teljes szöveget tartalmaz, egységes betűmérettel; `/rolunk` a kezdőlap `#rolunk` szakaszára irányít. A felső keskeny sor és a lábléc admin link kikerült.
- **Márkajelzés és lábléc:** A felhasználó által küldött vízszintes logó került asztali fejlécre és láblécre, a monogram kisméretű kijelzőre. A lábléc külön listázza a termékkategóriákat, hasznos linkeket, a meglévő cégkapcsolatokat és a három megadott közösségi profilt ikonokkal.
- **Szolgáltatások és kapcsolat:** A szolgáltatások rendezett felsorolást kaptak a meglévő szolgáltatásleírás alapján. A kezdőoldali Kapcsolat blokk megjeleníti a rendszerben rögzített cégnevet, mindkét címet, telefonszámot és e-mailt, valamint az ajánlatkérő űrlapot. A külön Kapcsolat oldalon a térkép is megmarad.
- **Hírek és referenciák:** A hírek listája kép-, dátum-, cím- és előnézetkártyákból áll; a hír teljes adatlapra nyitható. A referenciák kép nélküli, kattintható dobozok és külön adatlapok. A régi bevezető képet egyik listában sem jelenítjük meg. A szennyezett forrásvégződéseket a kártyaelőnézetből levágjuk.
- **Admin:** A feltöltések a Payload Médiaeszközök gyűjteményében böngészhetők. A menü- és lábléc-hivatkozásmezők magyarázó súgószöveget kaptak (`label`, `href`). A publikus oldalak sarkából az admin hivatkozás eltávolítva; az admin továbbra is közvetlen `/admin` útvonalon érhető el, meglévő jogosultságvédelemmel.
- **Forrásszövegek:** A katalógusoldalakról eltűntek az „Eredeti oldalak tartalma” blokkok és a rájuk mutató felületi linkek; az elkülönített archív rekordok és régi URL-megfeleltetések megmaradnak.
- **Ellenőrzés:** A `pnpm build` sikeres a rendelkezésre álló beépített Node.js futtatókörnyezettel. Böngészőben ellenőrizve a kezdőlap, az RM gyártói oldal, a hír- és referencialista, a kapcsolat űrlap, valamint a `/rolunk` szakaszra irányítás. Helyi előnézet: `http://127.0.0.1:3000`. Éles publikálás nem történt.
- **Nyitott korlátozás:** Nincs beállítva e-mailes ajánlatkérés-értesítés; az űrlap az admin rendszerbe ment.

## Lábléc és gyártói logók (2026-10-21)

- A lábléc „Hasznos hivatkozások” oszlopa megszűnt. Középen a „Cégünkről” oszlop szerepel Rólunk, Szolgáltatások és a két adatkezelési PDF linkjével; a Kapcsolat a jobb szélen maradt.
- A `/gyartok` oldalon 9 csatolt márkalogó került egységes, fehér, azonos méretű kártyákba. Az RM meglévő logóját használtuk. A Vodar csatolt `IMG_1888.PNG` képe egyszínű piros téglalap, ezért ott névfelirat a tartalék.
- **Ellenőrzött:** produkciós build sikeres; a `/gyartok` oldal és a lábléc helyi böngészőben vizuálisan ellenőrizve. Éles publikálás nem történt.

## VODAR, ragadós fejléc és adminfelület (2026-10-21)

- A láblécbe visszakerült a hét termék-főkategória. A Cégünkről és Kapcsolat oszlopok megtartották a kért sorrendet és helyet.
- A felhasználó által küldött VODAR logó bekerült a gyártói oldal közös méretű logókártyájára.
- A fejléc görgetés közben a képernyő tetején marad. A publikus oldal CSS-e külön útvonalcsoportban töltődik, így nem ütközik az adminéval.
- Az admin Payload stílusbetöltése és oldalsáv-elrendezése javítva; világos téma, olvasható navigáció, kártyarács és mezőközök. Az angol gyűjteménycímkék magyar megfelelőket kaptak.
- **Ellenőrzött:** produkciós build sikeres; admin felület böngészőben megjelenik. Éles publikálás nem történt.

## Fejléc finomítása (2026-10-21)

- A publikus fejléc teljes szélességű, fehér, enyhén áttetsző sáv lett visszafogott árnyékkal és vékony piros alsó elválasztóval. Továbbra is a képernyő tetején marad görgetéskor.
- Az asztali navigáció elemei kompaktabban igazodnak a logóhoz és a keresőhöz. 1080 px alatt a menü összecsukható, így a hosszú menüpontok nem szorulnak össze; kis képernyőn megmarad a monogram.
- **Ellenőrzött:** `pnpm build` sikeres. Az asztali kezdőlap, a 390×844 mobilnézet és a kinyitott mobilmenü helyi böngészőben ellenőrizve. Helyi előnézet `http://127.0.0.1:3000`; éles publikálás nincs.

## Élesítés előkészítése (2026-10-21)

- Külön feltöltési mappa: `/Users/nemethtamas/RM/RM_Hungary_Website/`; forrása megegyezik a helyi szerkesztett projekttel. A `.env.local`, adatbázis és mentések Git-ignorálva maradnak.
- A szerver a Railway/Render által megadott portot és `0.0.0.0` címet használja.
- Friss SQLite adatbázis külön, Git-ignorált `data/rm-hungary.db` másolatban van; a publikus feltöltések a `public/uploads/` mappában maradnak.
- Tiszta `pnpm install --frozen-lockfile` és `pnpm build` sikeres, a helyi adatbázismásolattal.
- A Railway 2026-10-21-én üzemzavar miatt nem volt használható; helyette a felhasználó Render web service-t indított.
- A Render már megkapja a `PAYLOAD_SECRET`-et. Az adatbázis nélküli production build miatt a gyökérlayout dinamikus szerveroldali renderelésre váltott; a production build hiányzó tesztadatbázissal sikeres.
- A javítás GitHubra került, Render automatikusan új buildet indít. A szolgáltatás Free csomagú; tartós lemez, adatbázis/média átvitele és éles URL-ellenőrzés még hátravan.
- Ajánlatkérési e-mail értesítés nincs beállítva; az űrlap a CMS-be ment.

## Render runtime (2026-10-21)

- A production build sikeres, a szolgáltatás elindult. Az éles oldalkérés hiányzó SQLite adatbázis miatt hibázik (`./data/rm-hungary.db`).
- Tartós lemez nélkül a Render fájlrendszere ideiglenes. Fizetős szolgáltatás/lemez, adatbázis és feltöltések átvitele, majd URL-ellenőrzés szükséges. A fizetős bővítés még nem történt meg.
