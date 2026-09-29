# architecture-analyzer

Een framework-onafhankelijk hulpmiddel dat een component-/designbibliotheek beoordeelt op geschiktheid voor AI-gestuurde front-end ontwikkeling. Gebouwd voor deelvraag 2 ("Hoe zijn de huidige design- en componentenbibliotheek en Vue 3 architectuur ingericht?"), maar werkt op elke bibliotheek — Vue, React, web components, of onbekend — niet alleen op `simple-vue-components`.

## De conceptmatrix

`src/rubric.mjs` is de enige bron van waarheid voor het beoordelingskader: 12 architectuur-onderdelen (rijen) × 4 dimensies (kolommen: **Beschikbaarheid**, **Consistentie**, **Machineleesbaarheid**, **Actualiteit**), elk met een expliciete 0–3-rubric. Dit bestand ís de conceptmatrix — de rest van dit programma operationaliseert alleen wat hierin staat, zodat het theoretisch kader en het meetinstrument nooit uit elkaar kunnen lopen.

Print de matrix zonder een bibliotheek te scannen (de kale, theoretische versie voor in het verslag):

```bash
node bin/print-matrix.mjs                 # Markdown
node bin/print-matrix.mjs --json          # ruwe data
```

## De bibliotheek scannen en beoordelen

```bash
node bin/analyze.mjs <pad-naar-bibliotheek>              # Markdown naar stdout
node bin/analyze.mjs <pad-naar-bibliotheek> --html --out ./rapport
node bin/analyze.mjs <pad-naar-bibliotheek> --json --md --html --out ./rapport
```

`<pad-naar-bibliotheek>` is een lokale map (al gekloond/geïnstalleerd) met een `package.json` — bijvoorbeeld de root van dit repository zelf:

```bash
node bin/analyze.mjs "../.."
```

## Hoe het werkt

1. `src/context.mjs` scant de doelmap één keer (bestandsstructuur, `package.json`, README, changelog, git-geschiedenis, gedetecteerd framework) tot een gedeeld `RepoContext`-object.
2. Vier onafhankelijke analyzers in `src/analyzers/` — één per dimensie — lezen alleen uit die context (met incidentele gerichte bestandsreads voor eigen steekproeven) en scoren alle 12 onderdelen 0–3 met bewijs en een oordeel in het Nederlands.
3. `src/aggregate.mjs` combineert de vier resultaten tot één 12×4-matrix met subtotalen per rij, per kolom en een totaalscore/-oordeel.
4. `src/report/*.mjs` rendert die matrix als Markdown, JSON of een standalone HTML-rapport.

Geen externe npm-dependencies — alleen Node.js core-modules, zodat het tegen elke willekeurige bibliotheek te draaien is zonder eerst iets te installeren.

## Beperkingen

Dit is statische analyse van bestandsstructuur en metadata, geen inhoudelijke code-review. Sommige oordelen (met name bij Consistentie en Actualiteit) zijn gebaseerd op steekproeven of indirecte signalen — dat staat expliciet vermeld in het `evidence`-veld van elke cel. Gebruik de uitkomst als onderbouwd startpunt voor deelvraag 2/3, niet als absoluut eindoordeel.
