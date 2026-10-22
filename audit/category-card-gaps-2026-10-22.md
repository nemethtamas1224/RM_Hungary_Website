# Kategóriakártya-képhiányok lezárása — 2026-10-22

Az aktív, 35 alkategóriás katalógusban három kártyán nem volt sem kép, sem rövid szöveg. A képek a kategória szintjére kerültek; egyik képet sem kapcsoltam az azonosítatlan `Öntözővízágyú` termékhez.

| Kategória | Kapcsolt kép | Forrás és indoklás |
|---|---|---|
| Öntözőfejek és vízágyúk (`ontozofejek-vizagyuk`, ID 54) | Giunti Tornado F1 szórófej-kocsival | [Giunti Tornado F1/F2 hivatalos termékoldala](https://www.giuntispa.com/product/tornado-f1-and-f2/) felsorolja a sprinkler-kocsit és az F1 modell K1 szórófejét. Kategóriaillusztráció, nem modellazonosítás. A helyi 600×400 px kép 34 KB. |
| Öntözési automatika és szerelvények (`ontozesi-automatika`, ID 55) | RM RainMaster 2.6 elektronikus vezérlő | A meglévő gyártói GX kép (`media id 448`, 550×519 px) a konkrét RainMaster vezérlőt mutatja. Forrás: https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/forg%C3%B3-torony-szerkezet%C5%B1/. A régi `My Irrigation` hírfotó médiarekordja megmaradt. |
| Áramfejlesztő kivitelek (`aramfejleszto-kivitelek`, ID 48) | Starpower dízelmotoros áramfejlesztő | Meglévő Starpower gyártói termékfotó (`media id 584`, 600×450 px); a kategóriakártya illusztrálja a kiviteleket, nem állít kizárólagos dízelbesorolást. |

Mindhárom kategória magyar egysoros leírást is kapott. Ismételhető, előnézetes importer: `pnpm import:category-card-gaps`; adatbázis- és médiamentés az alkalmazás előtt: `backups/rm-hungary-20261022-041512.zip`. Az új Giunti kép feltöltése Payload Médiaeszközök rekordként rögzítette a forrás URL-jét, alt-szövegét és jóváírását.

Ellenőrzés: a kategóriakártya-ellenőrző mind a 35/35 aktív alkategória-kártyán képet talált; az érintett kategóriaoldalak HTTP 200-at adtak; az új kép és két meglévő kép Payload-adatkapcsolata visszaolvasva. A teljes sitemap 211/211 oldala HTTP 200, mind a 429 egyedi kép-/dokumentum-URL GET vagy Range GET módszerrel elérhető. `pnpm exec tsc --noEmit` és izolált `pnpm build` sikeres. Vizuális képernyőellenőrzés és mobil QA a zárolt Mac miatt továbbra sem igazolt.
