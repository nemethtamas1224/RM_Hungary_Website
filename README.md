# RM Hajdú Hungary weboldal

Ez a mappa az RM weboldal Next.js és Payload CMS forrásprojektjének külön munkapéldánya.

## Helyi futtatás

1. Telepíts Node.js-t és pnpm-et.
2. Másold az `.env.example` fájlt `.env.local` néven, majd állítsd be a helyi adatbázist és az admin titkos kulcsot.
3. Futtasd: `pnpm install`, majd `pnpm dev`.

Az adatbázis és a feltöltött CMS-adatok külön kerülnek átadásra; titkos vagy helyi fájlokat ne tölts fel a GitHubra.

## Publikálás

A GitHub Pages csak statikus fájlokat szolgál ki. Ez az alkalmazás Payload CMS-t, adatbázist, szerveroldali Next.js útvonalakat és API-kat használ, ezért a GitHub Pages önmagában nem tudja futtatni. A javasolt hoszt Railway; a beállítási állapotot és az adatátvitel követelményeit a [GITHUB_PAGES_ELŐKÉSZÍTÉS.md](GITHUB_PAGES_ELŐKÉSZÍTÉS.md) tartalmazza.

Az éles webhelyre nem történt publikálás.
