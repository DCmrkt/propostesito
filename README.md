# Direct Channel · proposta sito

Proposta statica multipagina in HTML, CSS e JavaScript. La home comune presenta le divisioni **Editoria** e **Non profit**.

## Percorsi

- `/sito/` — ingresso comune.
- `/sito/editoria/` — panoramica Editoria, con otto approfondimenti: Abbonamenti e servizi, E-commerce, Periodici e quotidiani, Collezioni, Analisi, Consulenza marketing, Abbonamenti B2B, Direct Reader.
- `/sito/non-profit/` — proposta fundraising esistente, con Mentor CRM, moduli, integrazioni, ecosistema, DirectSense e analisi predittive.
- I vecchi indirizzi reindirizzano alle nuove pagine conservando parametri e ancore.

Navigazione tra le divisioni e contenuti Editoria disponibili anche senza JavaScript. Non profit conserva mappa interattiva, carosello clienti e richiesta demo dimostrativa. I contatti Editoria aprono il sito ufficiale.

Testi dei servizi e dati numerici dal [documento fornito](https://docs.google.com/document/d/1p4U11OLWsnxlw2h089gRxX0wd3d4w1eCxVmwkx9x9EI/edit). Escluse le note di lavorazione; i numeri sono quelli della proposta, senza attribuirvi un ulteriore periodo di misurazione.

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
