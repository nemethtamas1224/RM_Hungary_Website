# Starpower-kínálat hiányzó családjai — 2026-10-22

## Forrásellenőrzés

- Elektromos szivattyúegységek: [hivatalos Starpower oldal](https://www.starpower.it/gruppi_elettropompe.asp). A gyártó öntözési és ipari alkalmazást, 600–6500 l/perc közötti szállítási tartományt és két termékfotót közöl.
- Motoros kuplungegységek: [hivatalos Starpower oldal](https://www.starpower.it/gruppi_motofrizione.asp). Egyedi, hálózati energia nélkül alkalmazható gépcsoport; példák: függőleges szivattyús öntözés, szénaszárítás, recirkulációs ventilátor, motorra szerelt generátor és szivattyú. A gyártó több motor-, vezérlő-, kuplung-, keret- és burkolatváltozatot sorol fel.
- Apollo: [hivatalos Starpower oldal](https://www.starpower.it/apollo.asp). A meglévő Apollo termékrekordot az új családhoz kapcsoltam; nem készítettem második példányt.

## Helyi módosítások

- Létrejött az elektromos szivattyúegységek család és hozzá egy családszintű termékoldal a meglévő „Egyéb centrifugál- és nagynyomású szivattyúk” alkategóriában.
- Létrejött a motoros kuplungegységek család és hozzá egy családszintű termékoldal a meglévő dízelmotoros szivattyúegységek alkategóriában.
- Létrejött az Apollo családkártya; a korábbi 84-es termék rekordja és slugja megmaradt, a családhoz kapcsolódik.
- Az öt hivatalos Starpower kép a `public/images/starpower/` mappába került. A fájlok 600×431 vagy 600×450 pixelesek, és a gyártói oldalak termékképeiként ellenőriztem őket.
- Ismételhető, alapértelmezésben csak előnézetet végző import: `pnpm import:starpower-missing-ranges`; végrehajtás: `--apply`. CMS-mentés az apply előtt: `backups/rm-hungary-20261022-074536.zip`.

## Ellenőrzés és korlátok

- Payload CMS: a Starpower márkához 6 publikált termékcsalád tartozik (motoros szivattyú, elektromos szivattyú, motoros kuplung, dízelgenerátor, kardánhajtású generátor, Apollo).
- A három új/hozzárendelt családoldal és mindhárom megfelelő termékoldal HTTP 200; a kért tartalmi szöveg megjelenik. Hat oldalból 37 képoptimalizálási kérés hibamentes (200/206).
- `pnpm exec tsc --noEmit` sikeres; az importer ismételt előnézete mindhárom családnál/terméknél UPDATE-t mutat, új duplikátumot nem jelez.
- A Starpower elektromos szivattyúcsalád oldalán szereplő 600–6500 l/perc tartomány a gyártó oldalán található; modellszintű típusok vagy további adatlapok a megvizsgált oldalon nem szerepelnek, ezért nem kerültek kitalálásra.
- A kategória kártyái, a termékoldalak és a médiakérések gépi ellenőrzése megtörtént. Kézi asztali/mobil és belépett admin QA továbbra is nyitott; éles oldal nem módosult.
