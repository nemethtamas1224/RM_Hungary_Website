# Rovatti Midy prospektus hozzáadása — 2026-10-22

- Forrás: [Rovatti hivatalos Midy prospektus](https://www.rovatti.it/download_file.php?id_ref_maggiorato=734), 12 oldal. A PDF T0-50, T0F-50 és önfelszívó A-változatokat, teljesítménygörbéket, méretrajzokat, tömegeket, anyagjegyzéket, valamint a csatlakozókat és szelepet tartalmazó rendelhető csomagot mutatja.
- A prospektus az eddigi T0A műszaki katalógus megtartása mellett letölthető dokumentumként bekerült a Rovatti Midy termékhez (Payload media ID 785). A termék leírását, konfigurációit és teljesítményadatait nem módosítottam; a prospektusban szereplő változatok helyi forgalmazása nincs igazolva.
- Ismételhető importer: `pnpm attach:rovatti-midy-brochure`; előnézet az alapmód, alkalmazás `NODE_ENV=production pnpm attach:rovatti-midy-brochure -- --apply`.
- Módosítás előtti mentés: `backups/rm-hungary-20261022-082933.zip`.
- Ellenőrzés: Payload API visszaolvassa mindkét PDF-et és az új forrásbizonyítékot; a Midy termékoldal és az új PDF HTTP 200. A fájl mérete 2 150 372 bájt, oldalszáma 12. `pnpm exec tsc --noEmit` sikeres. Éles oldal nem változott.
