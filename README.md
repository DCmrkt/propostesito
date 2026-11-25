# Direct Channel · proposta sito

Proposta statica multipagina in HTML, CSS e JavaScript. La home comune presenta le divisioni **Editoria** e **Fundraising**.

## Percorsi

- `/sito/` — ingresso comune.
- `/sito/editoria/` — panoramica Editoria, con sei approfondimenti: Gestione abbonamenti, Periodici e collezioni, Direct Reader, Abbonamenti.it, Data Analysis e Consulenza Marketing, Abbonamenti B2B.
- `/sito/non-profit/` — divisione Fundraising, con Mentor CRM, moduli, integrazioni, ecosistema, DirectSense e analisi predittive.
- I vecchi indirizzi reindirizzano alle nuove pagine conservando parametri e ancore.

La navigazione tra le divisioni e i contenuti Editoria sono disponibili anche senza JavaScript. La divisione Fundraising include una mappa interattiva, un carosello clienti e una richiesta demo dimostrativa. I contatti Editoria aprono il sito ufficiale.

Testi dei servizi e dati numerici dalla proposta «Riorganizzazione sito Direct Channel».

## Anteprima locale

```powershell
python -m http.server 8768 --bind 127.0.0.1
```

Apri `http://127.0.0.1:8768/sito/`. Non servono build o dipendenze JavaScript.

## Verifica

```powershell
python -m unittest discover -s tests -v
node --check fundraising-shared/experience.js
```

I controlli verificano percorsi, pagine dei servizi, collegamenti e ancore locali, asset e reindirizzamenti.
