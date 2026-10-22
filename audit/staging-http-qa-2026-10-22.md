# Helyi staging HTTP-lefedettség — 2026-10-22

## Mérés

- A `http://127.0.0.1:3001/sitemap.xml` aktuális sitemapje 222 oldalt sorol fel.
- Mind a 222 URL HTTP 200 választ adott.
- Az oldalak HTML-jéből 5 266 egyedi, helyi kép-, dokumentum- és optimalizált Next-kép URL került kiolvasásra; mindegyik 200 vagy 206 választ adott.
- MIME szerinti számlálás: 4 456 JPEG, 776 PNG, 34 PDF. A változatos optimalizált kép-URL-eket is külön ellenőriztem.
- A mérés forráskódja a futó projekt-route-ok sitemapjét helyi hostra irányította, a hivatkozott asseteket GET/Range GET kéréssel ellenőrizte; a részletes gépi eredmény a futás idején `/tmp/rm-qa-3001-current.json` fájlba készült.

## Katalógusrelációk

- A friss Payload API 105 aktív, publikált, nem legacy terméket, 67 kategóriarekordot és 27 családot ad vissza.
- Az aktív termékek között nem találtam ismétlődő slugot, hiányzó alkategória-kapcsolatot vagy olyan terméket, amelynek családja más gyártóhoz/kategóriához tartozik; a családok kategóriakapcsolata is érvényes.
- Az aktív termékkép-hiány továbbra is két eset: RM Major XJ EVO (112) és azonosítatlan Öntözővízágyú (98). Rövid és részletes leírás csak a vízágyúnál hiányzik; a Major XJ EVO-hoz nincs forrásbizonyíték.
- A családkártyák `cardDescription` mezője ahol üres, ott szerkeszthető család-`summary` mezőből kapja a rövid szöveget; a frontend fallback logika is visszaolvasva.

## Korlát

Ez HTTP-elérhetőségi mérés: nem igazolja a képfájlok vizuális minőségét, vágását, színhelyességét, tényleges viewport-elrendezését, kliensoldali interakcióit vagy adminban történő mentését. E körben a böngészős megjelenítés nem volt engedélyezhető, ezért vizuális/admin QA-t nem állítok késznek. Éles oldal nem változott.
