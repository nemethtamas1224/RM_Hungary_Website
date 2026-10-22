# Oliver Agro márkanév-egyeztetés — 2026-10-22

- A gyártó hivatalos bemutatkozó oldala a vállalatot „OLIVER AGRO S.r.l.” néven azonosítja: https://www.oliveragro.it/azienda/.
- A CMS gyártórekordja ugyanazt a céget tárolta `oliveragro` stabil slug alatt, de megjelenített neve `Oliveragro` volt. A kapcsolódó Rotosark termék és a logófájl már a „Oliver Agro” nevet használta.
- A staging gyártórekord megjelenített nevét „Oliver Agro”-ra egységesítettem. Az azonosító, slug, logókapcsolat, család- és termékkapcsolat, valamint az URL nem változott.
- A jövőbeli katalógusmigráció seedjét is javítottam. Ismételhető javító: `scripts/fix-oliveragro-manufacturer-name.ts`; alapértelmezett módja előnézet, alkalmazás `-- --apply` kapcsolóval.
- Alkalmazás előtti elkülönített adatbázis- és médiamentés: `backups/rm-hungary-20261022-092948.zip`.
- Ellenőrzés: az újraolvasott staging API „Oliver Agro” nevet ad; a `/gyartok/oliveragro` oldalon a cím és gyártóleírás e névvel jelenik meg. `pnpm exec tsc --noEmit` sikeres.
- Production változatlan. A maradék, gyártókapcsolat nélküli általános terméktípusokat külön márkabesorolási és hierarchia-auditban kell rendezni; ez a korrekció nem zárja le a 2. pontot.
