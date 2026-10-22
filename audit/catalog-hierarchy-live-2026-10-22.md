# Élő CMS-katalógus hierarchiaellenőrzése — 2026-10-22

Forrás: helyi, futó Payload API (`127.0.0.1:3001`), 500-as lapméret, 2-es kapcsolati mélység. Ez adatbázis- és kapcsolatellenőrzés, nem kézi admin UI-vizuális QA.

| Elem | Rekordszám |
|---|---:|
| Kategóriák összesen | 67 |
| Aktív katalóguskategóriák | 42 |
| Aktív termékcsaládok | 26 |
| Aktív termékek | 120 |

Ellenőrzések: nincs ismétlődő aktív termék- vagy családslug; egyik család kategóriája sem tér el a hozzá kapcsolt termék kategóriájától; egyetlen aktív terméknél vagy családnál sem hiányzik a kategória-kapcsolat.

Két aktív termék főképe hiányzik:

- `112` RM Major XJ EVO — külön gyártói modellként való azonosítása és képe nem igazolt.
- `98` Öntözővízágyú — konkrét Giunti modell és képe nem azonosított; `originalUrl` mezőjének régi RM `alkat=13` oldala a csepegtető/mikroöntözési kategóriát mutatja, nem ezt a modellt. Részletek: `remaining-brand-content-audit-2026-10-21.md`.

Ez az ellenőrzés nem igazolja a teljes admin szerkesztési folyamatot, a márkakötések helyességét, a képek vizuális minőségét vagy a mobilnézetet.

## Besorolási korrekció — 2026-10-22

A termék 98 `Giunti` gyártókapcsolata a hibás `alkat=13` forrásazonosító miatt megszűnt. Az élő Payload API újraolvasása szerint a `manufacturer` és `brand` üres, a kategória `ontozofejek-vizagyuk`, az állapot `published`, a felülvizsgálat `source-check`. Kép és leírás továbbra sincs; a gyártó és termékmodell ismeretlen. Apply előtti mentés: `backups/rm-hungary-20261022-042110.zip`.

## Tartalmi lefedettség friss mérése — 2026-10-22

A helyi Payload API `products?limit=200&depth=1` lekérdezéséből: 120 rekord, ebből 100 az aktív katalóguskategóriákban és 20 örökölt/archív kategóriában. Az aktív, publikált termékek közül kettőnek nincs főképe: `RM Major XJ EVO` (112) és azonosítatlan `Öntözővízágyú` (98). Érdemi leíró tartalom (rövid/részletes leírás, szöveges műszaki szakasz, műszaki táblázat vagy specifikáció) csak a 98-as rekordból hiányzik. 27 rekord üres rich-text `description` mezőt használ, de tartalmuk szerkeszthető, szöveges műszaki szakaszban szerepel, ezért nem tekintem őket tartalomhiánynak.

## Gyártó–család kapcsolat szerveroldali ellenőrzése — 2026-10-22

A `Products` CMS collection termékűrlapján a `family` kapcsolat szűrőfeltétele most a kiválasztott `category` mellett a kiválasztott `manufacturer` értéket is figyelembe veszi. A `beforeValidate` hook a már meglévő kategória–család ellenőrzés mellett elutasítja a gyártó–család eltérést is. A 3001-es Payload API termékadataiból újraellenőrizve egyik aktív terméknél sem volt eltérés. Egy szándékosan más gyártóhoz kötött, ideiglenes CMS-létrehozási kísérletet a hook elutasított a várt magyar hibaüzenettel; az API utólagos lekérdezése 0 ilyen rekordot mutatott. TypeScript ellenőrzés sikeres. A belépett admin vizuális UI-próba továbbra is nyitott.

## Termékoldali mezőlefedettség – friss staging API-mérés, 2026-10-22

A `products?limit=200&depth=2` API lekérdezés 103 publikált, nem legacy terméket adott. Két főképhiány: RM Major XJ EVO (112) és azonosítatlan Öntözővízágyú (98). Összesen 32 rekord nem használ gazdag szöveges leírást; a vizsgált 103-ból az érdemi termékoldali tartalomkontroll szerint csak a 98-as terméknél hiányzik minden leíró/műszaki tartalom. További mezőlefedettség: 6 galéria nélküli rekord; 27 rekord külön specifikáció, technikai táblázat, konfiguráció vagy tömlőméret nélkül; 63 dokumentumkapcsolat nélkül; 76 videókapcsolat nélkül. Ezek nem automatikus tartalmi hiányok: a forrásoldali modelladatokat és elérhető médiát termékenként kell egyeztetni. A `rm-ontozoszarnyak` termékcsalád rövid kártyaleírása 2026-10-22-én CMS mezőbe került; a staging HTML-ben ellenőrizve.

## Friss teljes staging-útvonal- és kapcsolatellenőrzés — 2026-10-22

- A 3001-es staging sitemap aktuális 211 útvonalából mind a 211 HTTP 200.
- A sitemapoldalak szerveroldali HTML-jéből feltárt 5 267 helyi kép-, dokumentum- és egyéb tartalmi URL-ből 5 267 HTTP 200 vagy 206; hibás helyi hivatkozást nem találtam (4 927 kép MIME-típusú URL).
- A Payload API aktuális állapota: 125 termékrekord, ebből 105 aktív publikált nem-legacy; 27 család; 67 kategória. A 105 aktív termék között 0 slugduplikáció, 0 hiányzó kategóriakapcsolat, 0 család–kategória eltérés és 0 igazolt család–gyártó eltérés.
- Két aktív termék főképe továbbra sem igazolható: RM Major XJ EVO (112) és azonosítatlan Öntözővízágyú (98). Hasonló nevű modellek vagy generikus kategóriafotók hozzárendelését nem használtam bizonyítékként.
- Az `/admin` belépési felület HTTP 200-zal elérhető; ez nem igazolja a belépés utáni mezőszerkesztést. A CUA állapota szerint a Mac zárolt, ezért vizuális desktop/mobil és belépett admin QA nem végezhető ebben a munkakörnyezetben.
