# Giunti gyorscsatlakozók termékcsalád — 2026-10-22

## Gyártói ellenőrzés

A Giunti hivatalos [horganyzott acélcsövek kategóriája](https://www.giuntispa.com/product-category/tubazioni-in-acciaio-zincato/) öt változatot sorol fel: hidraulikus, Anfor, Robur, Ferrari és Bauer csatlakozású csöveket. A kategórialeírás szerint a csővezetékek tűzihorganyzottak, gyorscsatlakozósak, és a választást a felhasználás, illetve üzemi nyomás befolyásolja. A hivatalos [Robur termékoldal](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-robur/) dokumentálja, hogy a Giunti által megszerzett korábbi Mellini csatlakozást Robur néven viszik tovább. A [Ferrari](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-sferici-ferrari/) és [Bauer](https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-tipo-bauer/) egyedi gyártói oldalak a megfelelő csatlakozóváltozatokat azonosítják.

## Staging változás

- A `Giunti gyorscsatlakozók` család a `Gyorscsatlakozók és idomok` alkategóriába került.
- A négy már létező helyi terméket kapcsoltam hozzá: Bauer fejes idom (87), Mellini fejes idom (88), Anfor fejes idom (89), Ferrari gömbcsatlakozó (90).
- A terméknevek, képek, leírások, ID-k és slugok nem változtak. A családkép a már korábban hitelesített, 600×600-as `pipe-robur.jpg` gyártói kép; a családoldali szöveg a csatlakozástípusokat és a Mellini/Robur névváltást írja le.
- A gyártói oldalak komplett horganyzott csöveket ismertetnek, míg a helyi rekordok idomként/gyorscsatlakozóként vannak megnevezve. Emiatt a csőadatok, átmérők, táblázatok és felszereltségek nem kerültek át a helyi termékoldalakra.

## Ismételhető import és ellenőrzés

- Importer: `scripts/group-giunti-quick-couplings.ts`; alapmód előnézet, alkalmazás: `NODE_ENV=production pnpm group:giunti-quick-couplings -- --apply`.
- Módosítás előtti mentés: `backups/rm-hungary-20261022-084024.zip`.
- A Payload API visszaolvasta a családot és a négy termék-családkapcsolatot. A kategória- és családoldal, mind a négy új kanonikus termékútvonal HTTP 200; a család alatti termékútvonalakra a régi, család nélküli URL-ek 308-cal átirányítanak.
- A kategória HTML-je megjeleníti a családkártya címét, rövid leírását és képét; a családoldal HTML-je tartalmazza a négy csatlakozástípust és a Mellini/Robur magyarázatot. A családkép HTTP 200. `pnpm exec tsc --noEmit` sikeres; az importer ismételt előnézete módosítás nélkül fut.
- Éles weboldal nem változott.
