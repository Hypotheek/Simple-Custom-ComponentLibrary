// Single source of truth for the AI-geschiktheid concept matrix. Both the scoring program
// (src/analyzers/*) and the printable matrix (bin/print-matrix.mjs) read this file, so the
// theoretical framework and the tool that operationalizes it can never drift apart.

export const DIMENSIONS = [
  {
    id: 'beschikbaarheid',
    label: 'Beschikbaarheid',
    vraag: 'Is dit onderdeel aanwezig en vindbaar — voor een mens én voor een tool?'
  },
  {
    id: 'consistentie',
    label: 'Consistentie',
    vraag: 'Wordt dit onderdeel op een uniforme manier toegepast doorheen de hele bibliotheek?'
  },
  {
    id: 'machineleesbaarheid',
    label: 'Machineleesbaarheid',
    vraag: 'Is dit onderdeel programmatisch te doorzoeken of te parsen, zonder interpretatie van vrije tekst?'
  },
  {
    id: 'actualiteit',
    label: 'Actualiteit',
    vraag: 'Is dit onderdeel actueel en in lijn met de huidige staat van de broncode?'
  }
]

export const SCORE_LABELS = ['Afwezig', 'Beperkt', 'Grotendeels aanwezig', 'Volledig']

export const CRITERIA = [
  {
    id: 'inventaris',
    label: 'Component-inventaris',
    omschrijving: 'Een volledig overzicht van alle componenten die de bibliotheek levert.',
    rubric: {
      beschikbaarheid: [
        'Geen enkele plek somt de componenten op; alleen te achterhalen door de broncode handmatig te doorzoeken.',
        'Een gedeeltelijke lijst bestaat (bv. een stuk van de README), maar niet alle componenten staan erin.',
        'Een lijst van vrijwel alle componenten is te vinden, maar verspreid over meerdere plekken.',
        'Eén centraal, volledig overzicht is direct vindbaar (index-/categoriebestand, gepubliceerde catalogus, Storybook-sidebar).'
      ],
      consistentie: [
        'Componenten worden op wisselende, onvoorspelbare plekken/manieren geregistreerd.',
        'Een registratiepatroon bestaat, maar wordt niet voor elk component gevolgd.',
        'Vrijwel elk component volgt hetzelfde registratiepatroon, met enkele uitzonderingen.',
        'Elk component wordt zonder uitzondering op exact dezelfde manier geregistreerd.'
      ],
      machineleesbaarheid: [
        'Geen enkel bestand somt componenten machinaal op; alleen leesbaar als vrije tekst.',
        'Een lijst bestaat als vrije tekst (Markdown-opsomming) zonder vaste structuur.',
        'Een gestructureerd bestand bestaat, maar mist velden die een tool nodig heeft (categorie, pad).',
        'Een gestructureerd bestand (JSON/JS/TS-object) is programmatisch in te lezen en compleet.'
      ],
      actualiteit: [
        'De lijst is aantoonbaar verouderd: componenten in de broncode ontbreken erin.',
        'De lijst wordt sporadisch bijgewerkt; recente componenten ontbreken vaak.',
        'De lijst is grotendeels actueel, met een enkele gemiste toevoeging.',
        'De lijst wordt (semi-)automatisch gegenereerd of consequent bijgewerkt bij elke toevoeging.'
      ]
    }
  },
  {
    id: 'api-documentatie',
    label: 'API-documentatie per component',
    omschrijving: 'Props, events en slots per component, met type en betekenis.',
    rubric: {
      beschikbaarheid: [
        'Geen documentatie; props zijn alleen af te leiden uit de component-broncode.',
        'Documentatie voor een minderheid van de componenten.',
        'Documentatie voor de meeste componenten, met hiaten.',
        'Documentatie voor elk component, inclusief props, events én slots.'
      ],
      consistentie: [
        'Elk component documenteert zijn API op een andere manier (of helemaal niet).',
        'Een documentatiepatroon bestaat, maar wordt inconsistent toegepast.',
        'Vrijwel alle componenten volgen hetzelfde documentatieformaat.',
        'Alle componenten documenteren props/events/slots in exact dezelfde vorm.'
      ],
      machineleesbaarheid: [
        'Documentatie bestaat alleen als losse tekst in een README of wiki.',
        'Documentatie staat bij de component, maar in ongestructureerd commentaar.',
        'Documentatie is grotendeels af te leiden uit types, met losse aanvullingen in tekst.',
        'Documentatie is volledig af te leiden uit types/JSDoc-tags/een docs-tool zonder tekst te parsen.'
      ],
      actualiteit: [
        'Documentatie is aantoonbaar in tegenspraak met de huidige component-code.',
        'Documentatie loopt merkbaar achter op recente wijzigingen.',
        'Documentatie is grotendeels actueel; kleine afwijkingen komen voor.',
        'Documentatie wordt uit de code zelf gegenereerd of getest, en kan niet verouderen zonder dat het opvalt.'
      ]
    }
  },
  {
    id: 'type-definities',
    label: 'Type-definities',
    omschrijving: 'Statisch typeerbare props/events (TypeScript, PropTypes, of vergelijkbaar).',
    rubric: {
      beschikbaarheid: [
        'Geen type-informatie aanwezig; alles is impliciet.',
        'Types voor een klein deel van de componenten of props.',
        'Types voor de meeste componenten, met losse `any`/ontbrekende gevallen.',
        'Volledige, expliciete typen voor alle props/events van elk component.'
      ],
      consistentie: [
        'Sommige componenten zijn getypeerd, andere niet, zonder duidelijke reden.',
        'Eén typeerstijl overheerst, maar met afwijkingen (bv. mix van interfaces en inline types).',
        'Vrijwel alle componenten gebruiken dezelfde typeerstijl.',
        'Eén uniforme, dwingend afgedwongen typeerstijl (bv. door een lint-regel) doorheen de hele bibliotheek.'
      ],
      machineleesbaarheid: [
        'Geen enkel type is machinaal te extraheren.',
        'Types zijn aanwezig maar niet gebundeld (geen `.d.ts`/gegenereerde declaraties).',
        'Type-declaraties worden gegenereerd, maar dekken niet alle exports.',
        'Volledige `.d.ts`-declaraties (of gelijkwaardig schema) zijn gepubliceerd en dekken de hele publieke API.'
      ],
      actualiteit: [
        'Type-declaraties zijn verouderd of ontbreken voor recente componenten.',
        'Type-declaraties worden handmatig bijgehouden en lopen soms achter.',
        'Type-declaraties worden bij elke build gegenereerd, met een enkele uitzondering.',
        'Type-declaraties worden bij elke build automatisch gegenereerd uit de broncode zelf.'
      ]
    }
  },
  {
    id: 'voorbeelden',
    label: 'Voorbeelden & gebruikspatronen',
    omschrijving: 'Stories, demo\'s of codevoorbeelden die een reëel gebruikspatroon tonen.',
    rubric: {
      beschikbaarheid: [
        'Geen voorbeelden; alleen de kale API-signatuur (indien aanwezig).',
        'Voorbeelden voor een minderheid van de componenten.',
        'Voorbeelden voor de meeste componenten, met hiaten bij complexere componenten.',
        'Minstens één werkend voorbeeld per component, inclusief samengestelde/complexe gevallen.'
      ],
      consistentie: [
        'Voorbeelden staan verspreid over READMEs, issues, en losse snippets zonder vast format.',
        'Een voorbeeldformaat bestaat, maar wordt niet overal gevolgd.',
        'Vrijwel alle voorbeelden volgen hetzelfde format (bv. één stories-bestand per component).',
        'Elk voorbeeld volgt exact hetzelfde, afdwingbare format (bv. een vaste stories-structuur/lint-regel).'
      ],
      machineleesbaarheid: [
        'Voorbeelden bestaan alleen als screenshots of prosatekst.',
        'Voorbeelden staan als code, maar niet als apart, query-baar bestand per component.',
        'Voorbeeldbestanden zijn programmatisch te vinden, maar niet gekoppeld aan hun component.',
        'Voorbeelden staan in gestructureerde, per component query-bare bestanden (bv. `*.stories.*`) met een tool om ze op te vragen.'
      ],
      actualiteit: [
        'Voorbeelden gebruiken een API die niet meer bestaat.',
        'Voorbeelden zijn deels verouderd ten opzichte van de huidige props.',
        'Voorbeelden zijn grotendeels actueel; enkele lopen achter.',
        'Voorbeelden worden automatisch getest tegen de huidige component-API (bv. via een testrunner op de stories).'
      ]
    }
  },
  {
    id: 'naamgeving',
    label: 'Naamgevingsconventies',
    omschrijving: 'Voorspelbare prefixing, casing en prop-/event-naamgeving.',
    rubric: {
      beschikbaarheid: [
        'Geen erkenbaar patroon in namen; elk component/prop lijkt willekeurig genoemd.',
        'Een patroon is te herkennen, maar nergens beschreven.',
        'Een patroon is grotendeels te herkennen en op enkele plekken toegelicht.',
        'Het naamgevingspatroon is expliciet gedocumenteerd (bv. in bijdrage-richtlijnen).'
      ],
      consistentie: [
        'Namen wisselen willekeurig van stijl (casing, prefix, synoniemen voor hetzelfde concept).',
        'Een basispatroon (bv. een gedeeld prefix) wordt gevolgd, maar prop-/event-namen wisselen per component.',
        'Component- én de meeste prop-/event-namen volgen hetzelfde patroon, met uitzonderingen.',
        'Component-, prop- en event-namen zijn zonder uitzondering consistent (bv. altijd `modelValue`, altijd hetzelfde prefix).'
      ],
      machineleesbaarheid: [
        'Naamgeving is niet af te leiden zonder de conventie te kennen; geen enkele regel is programmatisch te controleren.',
        'Een deel van de conventie (bv. het prefix) is met een simpele regex te herkennen.',
        'De conventie is grotendeels met eenvoudige regels/lint-configuratie te controleren.',
        'De conventie wordt afgedwongen door een lint-regel of generator, dus 100% programmatisch te verifiëren.'
      ],
      actualiteit: [
        'Recente componenten wijken al af van het patroon dat oudere componenten volgen.',
        'Het patroon verschuift merkbaar tussen oudere en nieuwere componenten.',
        'Het patroon is stabiel, met een enkele recente uitzondering.',
        'Het patroon is aantoonbaar stabiel over de volledige commit-geschiedenis.'
      ]
    }
  },
  {
    id: 'design-tokens',
    label: 'Ontwerptokens (design tokens)',
    omschrijving: 'Kleur, spacing, typografie en andere designwaarden als herbruikbare, benoemde waarden.',
    rubric: {
      beschikbaarheid: [
        'Geen tokens; waarden staan hardcoded verspreid in componenten.',
        'Enkele waarden zijn als variabele gedefinieerd, de meeste niet.',
        'De meeste designwaarden lopen via tokens, met losse hardcoded uitzonderingen.',
        'Alle designwaarden (kleur, spacing, typografie, ...) lopen via een tokenlaag.'
      ],
      consistentie: [
        'Tokens (waar aanwezig) worden niet consequent hergebruikt; componenten wijken zelfstandig af.',
        'Tokens bestaan, maar meerdere componenten definiëren alsnog hun eigen variant.',
        'Vrijwel alle componenten hergebruiken dezelfde tokenset.',
        'Alle componenten putten uit exact dezelfde, centrale tokenset zonder lokale afwijkingen.'
      ],
      machineleesbaarheid: [
        'Tokens staan (als ze bestaan) verspreid in CSS zonder gestructureerd brondocument.',
        'Tokens staan in code (bv. CSS-variabelen), maar niet in een apart, doorzoekbaar bestand.',
        'Tokens staan in een gestructureerd bestand (JSON/JS), maar dekken niet elke categorie.',
        'Een compleet, gestructureerd tokenbestand (JSON/JS/YAML) is machinaal in te lezen en te herleiden naar elk gebruik.'
      ],
      actualiteit: [
        'Componenten gebruiken zichtbaar verouderde of niet meer bestaande tokens.',
        'Tokens en daadwerkelijk gebruik lopen op onderdelen uiteen.',
        'Tokens en gebruik komen grotendeels overeen, met kleine afwijkingen.',
        'Tokens worden centraal beheerd en zijn aantoonbaar de enige bron van designwaarden.'
      ]
    }
  },
  {
    id: 'compositiepatroon',
    label: 'Architectuur- & compositiepatroon',
    omschrijving: 'Hoe componenten samengesteld worden: slots, layout-primitieven, samenstelbaarheid.',
    rubric: {
      beschikbaarheid: [
        'Geen herkenbaar compositiepatroon; elk component regelt zijn eigen layout/opmaak intern.',
        'Een enkel samenstelbaar patroon (bv. slots) bestaat, maar wordt zelden gebruikt.',
        'Samenstelbare bouwstenen (layout-primitieven, slots) bestaan voor de meeste gevallen.',
        'Een compleet stelsel van samenstelbare bouwstenen dekt vrijwel elke structurele behoefte.'
      ],
      consistentie: [
        'Compositie verschilt sterk per component; geen gedeeld idioom.',
        'Een compositie-idioom bestaat, maar wordt naast eigen, incidentele oplossingen gebruikt.',
        'Het compositie-idioom wordt in de meeste gevallen gevolgd.',
        'Het compositie-idioom is de enige manier waarop structuur wordt opgebouwd, zonder uitzondering.'
      ],
      machineleesbaarheid: [
        'Het compositiepatroon is alleen te begrijpen door voorbeeldcode te lezen; nergens benoemd.',
        'Het patroon is benoemd in tekst, maar niet als een op te vragen lijst van bouwstenen.',
        'De bouwstenen zijn op te vragen (bv. via een categorie-/indexbestand), maar hun onderlinge relatie niet.',
        'De bouwstenen én hun samenhang (welke waar past) zijn machinaal op te vragen.'
      ],
      actualiteit: [
        'Nieuwere componenten breken zichtbaar met het gangbare compositiepatroon.',
        'Het patroon verschuift merkbaar tussen oudere en nieuwere delen van de bibliotheek.',
        'Het patroon is stabiel, met een enkele recente afwijking.',
        'Het patroon is aantoonbaar stabiel en wordt actief gehandhaafd bij nieuwe toevoegingen.'
      ]
    }
  },
  {
    id: 'versiebeheer',
    label: 'Versiebeheer & wijzigingslog',
    omschrijving: 'Semantische versienummering en een leesbare changelog van wat er wijzigt.',
    rubric: {
      beschikbaarheid: [
        'Geen versienummer met betekenis en geen wijzigingslog.',
        'Een versienummer bestaat, maar geen wijzigingslog (of andersom).',
        'Beide bestaan, maar de changelog is onvolledig.',
        'Een semantisch versienummer én een volledige, leesbare changelog zijn beide aanwezig.'
      ],
      consistentie: [
        'Versienummers volgen geen herkenbaar schema (geen semver of vergelijkbaar).',
        'Semver wordt losjes gevolgd, met incidentele afwijkingen.',
        'Semver wordt vrijwel altijd correct toegepast (major/minor/patch kloppen met de wijziging).',
        'Semver wordt zonder uitzondering correct toegepast, aantoonbaar over de hele geschiedenis.'
      ],
      machineleesbaarheid: [
        'Geen enkel gestructureerd bestand bevat versie-informatie.',
        'Het versienummer staat in `package.json`, maar de changelog is vrije tekst zonder vaste structuur.',
        'De changelog volgt een herkenbaar, maar niet machinaal afdwingbaar format.',
        'Versie en changelog zijn beide machinaal te parsen (bv. `package.json` + een gestructureerd `CHANGELOG.md`/conventional commits).'
      ],
      actualiteit: [
        'De changelog is duidelijk niet bijgewerkt sinds meerdere releases.',
        'De changelog loopt regelmatig een release achter.',
        'De changelog is grotendeels actueel, met een enkele gemiste vermelding.',
        'De changelog wordt bij elke release automatisch of consequent bijgewerkt.'
      ]
    }
  },
  {
    id: 'tooling-integratie',
    label: 'Tooling- & AI-integratie',
    omschrijving: 'Machineleesbare aanknopingspunten voor tools/AI: MCP-servers, CLI\'s, IDE-manifesten (bv. web-types.json, custom-elements.json).',
    rubric: {
      beschikbaarheid: [
        'Geen enkele vorm van tooling-integratie aanwezig.',
        'Eén losse integratie bestaat (bv. alleen IDE-autocomplete), verder niets.',
        'Meerdere integraties bestaan, maar niet uitgewerkt of gedeeltelijk werkend.',
        'Meerdere, werkende integraties zijn aanwezig (bv. IDE-manifest én een live doorzoekbare docs-tool/MCP-server).'
      ],
      consistentie: [
        'Integraties dekken maar een deel van de componenten, willekeurig.',
        'Eén integratie dekt de meeste componenten, andere ontbreken.',
        'Alle beschikbare integraties dekken vrijwel de volledige componentenset.',
        'Alle integraties dekken zonder uitzondering de volledige, actuele componentenset.'
      ],
      machineleesbaarheid: [
        'Geen van de integraties levert gestructureerde data; alles moet uit tekst worden afgeleid.',
        'Eén integratie levert gestructureerde data, maar met een beperkt schema.',
        'Meerdere integraties leveren gestructureerde, programmatisch bevraagbare data.',
        'Een volwaardig protocol/schema (bv. MCP, web-types.json) ontsluit de volledige API programmatisch, inclusief voorbeelden.'
      ],
      actualiteit: [
        'De integratie is merkbaar niet meer gekoppeld aan de huidige componenten (verouderd/kapot).',
        'De integratie wordt handmatig en onregelmatig bijgewerkt.',
        'De integratie wordt bij de meeste releases bijgewerkt.',
        'De integratie wordt automatisch gegenereerd/gesynchroniseerd bij elke build of release.'
      ]
    }
  },
  {
    id: 'broncode-toegankelijkheid',
    label: 'Toegankelijkheid van broncode & installatie',
    omschrijving: 'Hoe eenvoudig de bibliotheek te installeren, te openen en te doorzoeken is (door een mens of een tool).',
    rubric: {
      beschikbaarheid: [
        'Broncode is niet te installeren of te raadplegen zonder handmatige, niet-gedocumenteerde stappen.',
        'Installatie is mogelijk, maar vereist ongedocumenteerde handmatige stappen.',
        'Installatie is gedocumenteerd en werkt in de meeste gevallen direct.',
        'Installatie is gedocumenteerd, geautomatiseerd (bv. één commando) en werkt zonder uitzondering.'
      ],
      consistentie: [
        'De installatie-/exportmethode verschilt per omgeving zonder duidelijke reden.',
        'Eén methode is de standaard, maar met losse, ongedocumenteerde uitzonderingen.',
        'Eén methode wordt vrijwel overal consequent aangehouden.',
        'Eén enkele, gedocumenteerde methode is de enige ondersteunde weg, zonder uitzondering.'
      ],
      machineleesbaarheid: [
        'Pakketmetadata (exports, entry points) ontbreekt of is onvolledig.',
        'Basismetadata (bv. `main`) is aanwezig, maar mist een volledig `exports`-veld of vergelijkbaar.',
        'Metadata is grotendeels compleet en door standaardtools (bv. package managers) te lezen.',
        'Metadata is volledig, standaard-conform en door elke gangbare tool automatisch te verwerken.'
      ],
      actualiteit: [
        'De gedocumenteerde installatiestappen werken niet meer met de huidige staat van het project.',
        'Installatie werkt, maar de documentatie ervan is deels verouderd.',
        'Installatie en documentatie zijn grotendeels op elkaar afgestemd.',
        'Installatie is geautomatiseerd getest, dus kan niet stilzwijgend verouderen.'
      ]
    }
  },
  {
    id: 'testdekking',
    label: 'Testdekking & validatie',
    omschrijving: 'Geautomatiseerde tests (unit, toegankelijkheid, visuele regressie) die aantonen dat componenten werken zoals gedocumenteerd.',
    rubric: {
      beschikbaarheid: [
        'Geen geautomatiseerde tests aanwezig.',
        'Tests voor een klein deel van de componenten.',
        'Tests voor de meeste componenten, met hiaten.',
        'Tests voor elk component, inclusief toegankelijkheids- en/of visuele controles.'
      ],
      consistentie: [
        'Testaanpak verschilt sterk per component (of ontbreekt grotendeels).',
        'Eén testpatroon bestaat, maar wordt niet overal toegepast.',
        'Vrijwel alle componenten volgen hetzelfde testpatroon.',
        'Elk component wordt op exact dezelfde manier en met dezelfde dekking getest.'
      ],
      machineleesbaarheid: [
        'Testresultaten zijn niet programmatisch op te vragen per component.',
        'Tests draaien, maar resultaten zijn alleen als algehele pass/fail-log beschikbaar.',
        'Testresultaten zijn per bestand op te vragen, maar niet altijd per component.',
        'Testresultaten zijn per component programmatisch op te vragen (bv. via een testrunner-tool/API).'
      ],
      actualiteit: [
        'Tests zijn merkbaar verouderd of falen tegen de huidige code.',
        'Tests worden onregelmatig bijgewerkt; sommige zijn uitgeschakeld.',
        'Tests zijn grotendeels actueel en slagen.',
        'Tests draaien automatisch bij elke wijziging (CI) en zijn aantoonbaar altijd actueel.'
      ]
    }
  },
  {
    id: 'onderhoudsactiviteit',
    label: 'Onderhoudsactiviteit',
    omschrijving: 'Commit-frequentie, release-cadans en of het project actief bijgehouden wordt.',
    rubric: {
      beschikbaarheid: [
        'Geen zichtbare geschiedenis (geen versiebeheer, of geschiedenis ontoegankelijk).',
        'Geschiedenis is aanwezig maar zeer beperkt (bv. één initiële commit).',
        'Een redelijke geschiedenis van wijzigingen is aanwezig.',
        'Een volledige, gedetailleerde geschiedenis van wijzigingen is aanwezig en te doorzoeken.'
      ],
      consistentie: [
        'Onderhoud gebeurt zeer onregelmatig, met lange, onverklaarde stiltes.',
        'Onderhoud gebeurt met wisselende tussenpozen.',
        'Onderhoud gebeurt met een herkenbare, redelijk regelmatige cadans.',
        'Onderhoud gebeurt met een aantoonbaar voorspelbare, regelmatige cadans.'
      ],
      machineleesbaarheid: [
        'Geschiedenis is niet programmatisch te bevragen (bv. geen git of vergelijkbaar).',
        'Geschiedenis is technisch bevraagbaar, maar commit-berichten zijn ongestructureerd.',
        'Commit-berichten volgen grotendeels een herkenbaar format (bv. conventional commits).',
        'Geschiedenis is volledig programmatisch te bevragen mét gestructureerde, geautomatiseerd afgedwongen commit-berichten.'
      ],
      actualiteit: [
        'De laatste wijziging dateert van lang geleden (project lijkt verlaten).',
        'Recente activiteit is beperkt of sporadisch.',
        'Recente activiteit is aanwezig, met een redelijke frequentie.',
        'Recente, frequente activiteit toont aan dat het project actief onderhouden wordt.'
      ]
    }
  }
]

export const MAX_SCORE_PER_CELL = 3
export const MAX_SCORE_PER_CRITERION = MAX_SCORE_PER_CELL * DIMENSIONS.length
export const MAX_SCORE_PER_DIMENSION = MAX_SCORE_PER_CELL * CRITERIA.length
export const MAX_TOTAL_SCORE = MAX_SCORE_PER_CELL * CRITERIA.length * DIMENSIONS.length

export function grade(score, max) {
  const pct = max > 0 ? score / max : 0
  if (pct < 0.34) return 'Laag AI-geschikt'
  if (pct < 0.67) return 'Gedeeltelijk AI-geschikt'
  return 'Hoog AI-geschikt'
}
