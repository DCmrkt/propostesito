# Direct Channel — dieci proposte fundraising

Aprire `proposte/index.html` per confrontare tutte le direzioni. Ogni proposta ha una pagina di presentazione nella propria cartella e sei pagine di contenuto: Fundraising, Mentor CRM, Moduli, Integrazioni, DirectSense e Analisi Predittive.

## Direzioni visive

| Versione | Direzione |
| --- | --- |
| sito (1) | Calore e semplicità: cream, viola, superfici morbide |
| sito2 | Evoluzione del brand: identità Direct Channel e pannelli pastello |
| sito3 | Storie che connettono: capitoli cinematici e colori espressivi |
| sito4 | Continuità istituzionale: Oswald/Raleway, rosso e cyan |
| sito5 | Brand vicino alle persone: mongolfiere, mascotte, pagine riparate |
| sito6 | Studio editoriale: carattere serif, carta calda, griglie aperte |
| sito7 | Product intelligence: navy/lime, percorso dei dati e dei processi |
| sito8 | Relazioni al centro: lavanda, fotografia community, forme organiche |
| sito9 | Enterprise clarity: blu/bianco, architettura di prodotto ordinata |
| sito10 | Missione in movimento: rosso, titoli ampi, composizione centrale |

Le prime cinque versioni mantengono i propri layout. Le versioni 6–10 introducono nuove composizioni. I componenti condivisi si adattano a font, colori, geometrie e contrasti della singola proposta.

## Esperienza comune

- Ecosistema: Mentor ↔ DirectSense, quattro categorie, 32 elementi, ricerca globale e schede espandibili. La categoria Moduli mostra inizialmente sei elementi; il comando “Mostra tutti” rende disponibile l'intero elenco. Le integrazioni hanno lo stesso meccanismo.
- Clienti: tutti i 27 loghi unici del carosello pubblicato sulla pagina fundraising Direct Channel. Navigazione manuale, scorrimento touch/nativo, tastiera, avvio/pausa espliciti e visualizzazione completa. Nessun autoplay iniziale; le animazioni rispettano la preferenza di movimento ridotto.
- Richiesta demo: CTA coerenti, interesse selezionato dalla scheda, etichette associate ai campi, validazione e riepilogo in una finestra modale nativa con Escape e ritorno del focus.
- Navigazione: menu mobile, sottomenù a pulsante, stato espanso, chiusura con Escape, selezione di un link o uscita dal menu.
- I testi e i loghi principali restano nell'HTML; l'esplorazione delle schede e lo scorrimento manuale dei loghi sono disponibili anche senza JavaScript. I form dimostrativi restano disabilitati senza JavaScript.

## Stato dei form e pubblicazione

I form sono **anteprime locali**: non inviano, salvano o registrano dati. La nota è visibile prima del pulsante e nel riepilogo. La finestra offre un collegamento al sito ufficiale senza trasferire i dati compilati. Non vengono simulati messaggi di invio riuscito.

Prima di un lancio pubblico occorre collegare il form al servizio di raccolta lead scelto, aggiungere gestione server di validazione/errori/spam e verificare l'effettiva consegna. Gli eventi locali `dc:interaction` consentono di collegare successivamente un sistema di misurazione; non includono nomi, email o messaggi e attualmente non trasmettono nulla. Eventi disponibili: `category_select`, `solution_open`, `clients_navigate`, `clients_expand`, `demo_click`, `demo_preview`. Non conteggiare `demo_preview` come lead acquisito.

Tutte le pagine dimostrative hanno `noindex,nofollow`. Per l'eventuale produzione, scegliere la proposta finale, verificare testi e flussi di integrazione con i responsabili di prodotto, collegare il form, configurare la misurazione e adeguare i metadati della versione pubblica.

## Provenienza

- Loghi: https://www.directchannel.it/fundraising-soluzioni-per-il-terzo-settore/ — acquisizione del 9 settembre 2026. `fundraising-shared/clients.json` conserva nome, file e URL originale di ciascuno dei 27 clienti.
- Ecosistema: diagramma allegato dall'utente, organizzato in 16 moduli, 7 integrazioni, 5 pagamenti e 4 servizi API/web. Il termine SDD segue le pagine esistenti; il disegno mostrava “SSD”. `fundraising-shared/catalog.json` è il catalogo modificabile.
- Descrizioni: contenuti del sito/prototipi esistenti e perimetro del diagramma. Non sono stati aggiunti risultati numerici, testimonianze o promesse di tempi di risposta.
- Immagini: asset già presenti nel workspace. Il diagramma illustrativo della proposta 7 descrive un processo, non è una schermata del software.

## Manutenzione e controlli

Da questa cartella di progetto:

```powershell
python tools/prepare_fundraising_assets.py
python tools/build_fundraising_proposals.py
python tools/check_fundraising_proposals.py
python -m http.server 8765 --bind 127.0.0.1
```

Il generatore aggiorna i componenti sulle versioni 1–5 e rigenera interamente le versioni 6–10, i dieci indici e la gallery. Modificare i template nel generatore per cambiamenti persistenti alle versioni nuove; il catalogo, gli stili e le interazioni sono separati in `fundraising-shared`.

Verifiche eseguite: 71 pagine con percorsi/anchor locali, ID unici, H1, nomi dei campi, etichette e copertura del catalogo; apertura browser delle 60 pagine di contenuto a larghezza mobile 320 px, senza overflow orizzontale o immagini caricate mancanti; revisione visiva desktop delle dieci landing e prove di ricerca, tab da tastiera, menu mobile, selezione interesse, validazione e dialogo demo. I risultati statici sono in `fundraising-shared/validation.json`.

Per presentare al responsabile, confrontare prima la stessa pagina Fundraising, poi provare lo stesso percorso: cerca “MailUp”, apri la scheda, seleziona “Parliamone in demo” e verifica il riepilogo. In produzione misurare richieste qualificate e appuntamenti, insieme all'abbandono del form; il numero di clic sulle schede è solo un indicatore di interesse.
