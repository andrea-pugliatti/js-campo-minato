# Campo Minato

[Provalo qui!](https://js-campo-minato.vercel.app/) :)

## Esercizio

### Milestone 1

Creiamo una griglia 10x10 composta da 100 celle numerate progressivamente da 1 a 100.

### Milestone 2

Generiamo un set di bombe (numeri casuali compresi tra 1 e 100).
- Le bombe devono essere tutte diverse tra loro
- Il numero totale di bombe è a vostra scelta (es. 16)

Nota: le bombe non devono essere visibili all’utente all’inizio del gioco

### Milestone 3

Per ogni cella senza bomba, calcoliamo il numero di bombe adiacenti, come nel classico Campo Minato / Campo Fiorito.
- Una bomba è considerata adiacente se si trova: sopra, sotto, a destra, a sinistra o in diagonale
- Ogni cella deve “conoscere” quante bombe ha intorno
- Il numero di bombe adiacenti verrà mostrato solo al click sulla cella

### Milestone 4

Gestiamo il click sulle celle.

Se l’utente clicca su una cella senza bomba:
- la cella cambia stile
- viene mostrato il numero di bombe adiacenti

Se l’utente clicca su una cella con bomba:
- il gioco termina
- viene mostrato un messaggio di Game Over

### Milestone 5

Calcoliamo e mostriamo il punteggio, ovvero il numero di celle cliccate correttamente prima di colpire una bomba.

## Bonus
- Disabilitare i click dopo il Game Over
- Mostrare tutte le bombe al termine della partita
- Aggiungere un bottone per ricominciare il gioco
- (Extra) Usare colori diversi per i numeri in base alla quantità di bombe adiacenti
