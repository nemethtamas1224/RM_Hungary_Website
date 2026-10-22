# De Cloet dohánybetakarítók – családbemutató és gyártói brosúrák

## Módosítás

- A `De Cloet dohánybetakarító gépek` család adatlapja magyar bevezetőt és három képes bemutató szakaszt kapott: 1TH4, 2TH-II és 2TTH. A szakaszképek már meglévő, a modellekhez rendelt gyártói fotók.
- A hivatalos olasz nyelvű, 2 oldalas dohánybetakarító-katalógust a 1TH4 és 2TH-II termékek dokumentumai közé csatoltam. A hivatalos angol nyelvű 2TTH-katalógus kizárólag a 2TTH termékhez kapcsolódik.
- Az importert URL alapján külön PDF-médiakapcsolatra javítottam; korábban csak a 2TTH brosúrát kereste, így a 2TH-II brosúrája hibásan nem kerülhetett be. Az ismételt import nem cseréli fel a két katalógust.
- Helyi PDF-példányok: `public/documents/decloet/decloet-harvesters-ita.pdf` (18,560,884 bájt) és `public/documents/decloet/decloet-2tth-eng.pdf` (888,654 bájt). Mindkettőt közvetlenül a De Cloet hivatalos PDF URL-jéről származó fájlként ellenőriztem; az olasz katalógus 2 oldalas, az angol 2TTH katalógus 2 oldalas.
- A termékképek, műszaki adatok, modellek és meglévő videók nem változtak. Az 1TH-I továbbra is piszkozat; külön gyártói fotója nem igazolt.

## Források

- Család/terméklista: https://www.decloet.it/en/products.html
- 1TH4: https://www.decloet.it/en/products/1_row_harvester.html
- 2TH-II: https://www.decloet.it/en/products/1-2_rows_harvester.html
- 2TTH: https://www.decloet.it/en/products/apical.html
- Olasz betakarítógép-brosúra: https://www.decloet.it/pdf/depliant_raccoglitrice_ita.pdf
- Angol 2TTH brosúra: https://www.decloet.it/pdf/depliant_2TTH_eng.pdf

## Ellenőrzés

- Módosítás előtti adatbázis/média mentés: `backups/rm-hungary-20261022-084727.zip`.
- Payload API-visszaolvasás: családon a három szakasz és a megfelelő három kép; 1TH4 és 2TH-II az olasz PDF-et, 2TTH az angol PDF-et kapta. A 2TH-II és 2TTH meglévő gyártói YouTube videója megmaradt.
- Család- és három termékoldal HTTP 200. A családoldal HTML-je mindhárom szakasz címét tartalmazza; termékoldalak a megfelelő PDF-linket renderelik; két videó embedje megjelenik. Mindkét PDF URL HTTP 200 `application/pdf`.
- `pnpm exec tsc --noEmit` sikeres. A kézi vizuális és mobil QA, valamint az elkülönített teljes production build még hátravan.
- Helyi/staging változtatás; éles weboldal érintetlen.
