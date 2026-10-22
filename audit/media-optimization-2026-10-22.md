# Veszteségmentes PNG-optimalizálás — 2026-10-22

- A `public/uploads` 112 PNG-jéből 19-nél talált a próba veszteségmentes tömörítési lehetőséget.
- A `scripts/optimize-png-losslessly.cjs --apply` kizárólag az IDAT képadat-chunkokat cserélte: az eredeti PNG-metaadat-chunkok bájtról bájtra megmaradtak, a dekódolt pixeladat és méret változatlan.
- Összes megtakarítás: 1 385 823 bájt. Minden eredeti fájl a `backups/png-lossless-20261022050723/` mentésben van; az ellenőrző `manifest.json` eredeti/optimalizált SHA-256-okat és méreteket rögzít.
- Utólag mind a 19 eredeti mentés- és új fájlhash-e egyezik a manifesztummal; a megismételt előnézet 0 további jelöltet talált. A hét dekódolási/illesztési hibát adó fájlt kihagytam, ezek változatlanok.
- Staging ellenőrzés: a 19 fájl közvetlen HTTP Range kérése HTTP 206 `image/png` választ adott.
- A `package.json` tartalmazza az `optimize:png-losslessly` parancsot; a script előnézetet futtat alapértelmezetten, és csak `--apply` esetén ír, előtte ellenőrzött mentést készít.
- `pnpm exec tsc --noEmit` sikeres. Az elkülönített új build próbája a `node_modules` külső szimbolikus hivatkozása miatt bukott: a Turbopack nem engedte a projektgyökéren kívülre mutató Next.js csomag feloldását. A staging meglévő buildjét nem írtam felül.
- A 3001-es staging és az éles oldal adatbázisa nem változott; a publikus oldalak vizuális ellenőrzése külön nyitott.
