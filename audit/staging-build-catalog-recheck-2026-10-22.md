# Elkülönített staging build és katalógus-audit — 2026-10-22

## Build

A jelenlegi munkamappa forrásfájljairól, adatbázisáról és médiafájljairól elkülönített buildmásolat készült `/tmp/rm-catalog-goal.QvbAq1` alatt. A futó 3001-es szolgáltatást a build nem módosította. Az izolált `pnpm build` sikeres: Payload importmap-generálás, Next.js optimalizált production build, TypeScript és route-gyűjtés mind hiba nélkül lefutott. A friss preview a 3004-es porton indult.

## Katalógus és hierarchia

A friss build saját Payload API-visszaolvasása:

- 131 termékrekord, ebből 111 publikált és nem legacy.
- 32 publikált termékcsalád, 42 aktív kategória, 12 publikált gyártó.
- A 111 aktív termék mindegyikén van rövid összefoglaló, fő kép és alkategória-kapcsolat.
- Termék–család alkategória- vagy márkakapcsolat-eltérés, illetve hiányzó családkapcsolat: 0.
- A 1100 GX forrásolt modelladat-táblázata után a felülvizsgálati állapotok: 54 ready, 39 specs-missing, 15 identified, 3 source-check. Ezek a tartalmi bizonytalanságot jelzik, nem lezárt forrásellenőrzést.

## Útvonalak és média

- A friss build sitemapje 233 URL-t tartalmaz; mind a 233 HTTP 200.
- A 233 renderelt oldalból kinyert 46 egyedi helyi médi URL mind HTTP 200/206.
- De Cloet családoldal és 1TH4, 2TH-II, 2TTH termékoldalak HTTP 200; a hozzájuk tartozó olasz/angol PDF-kapcsolatok a megfelelő modelloldalakon szerepelnek. A két meglévő YouTube-embed megmaradt.
- Admin útvonala HTTP 200. Bejelentkezés nélküli `/api/users` lekérés 403, tehát az adminfelhasználó-lista nem nyilvános.

## Nyitott QA és korlátozások

- A teljes böngészős kézi vizuális, desktop/mobil és belépett admin-QA nincs igazolva: a CUA képernyőfelülete a zárolt Mac miatt nem érhető el, és helyi Chrome/Playwright bináris sem áll rendelkezésre. A HTTP/SSR és a route-ellenőrzés nem helyettesíti a vizuális vizsgálatot.
- 39 aktív termék specs-missing, 16 identified és 3 source-check állapotú; ezek műszaki és modellazonossági forrásellenőrzése folytatandó.
- A Giunti HydroG és egyéb, korábban auditban felsorolt kép-/azonossági rések nyitottak; bizonytalan modellspecifikus adat nem került be.
- Ezt a buildet és auditot nem szabad teljes projekt-QA-ként vagy végleges katalóguslefedettségként értelmezni. Éles publikálás nem történt.
