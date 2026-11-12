'use strict';
/* UI strings in English, Italian and German. */
const I18N = {
  en: {
    language: 'Language', subtitle: 'Italian card game',
    copy: 'Copy', copied: 'Link copied',
    dealer: 'Dealer', myPile: 'Your cards', pileEmpty: 'No cards taken yet', releaseToClose: 'Release to close',
    holdPile: 'Hold to see the cards you took', rotate: 'Please turn your phone upright 📱',
    skin: 'Cards', skin_originale: 'Original', skin_milanese: 'Milanese (French)', skin_alternative: 'Alternative',
    variant: 'Game', classic: 'Scopa', fifteen: 'Scopa a 15',
    players: 'Players', target: 'Points to win', napola: 'Napola (Asso, 2, 3 of Denari)',
    seats: 'Seats', team: 'Team',
    local: 'This device', remote: 'Remote player', bot: 'Bot',
    easy: 'easy', normal: 'normal', hard: 'hard',
    player: 'Player', botName: 'Bot', yourName: 'Your name',
    waitingRemote: 'waiting for player…', online: 'online', offline: 'offline',
    joinHint: 'Other players: join the same Wi-Fi or this phone\'s hotspot and open in a browser:',
    noNetwork: 'No network found. Turn on Wi-Fi or the mobile hotspot so others can join.',
    localOnly: 'Only needed for browser players.',
    start: 'Start game', startNeedsSeats: 'Waiting for remote players to join',
    you: 'You', sitHere: 'Sit here', leave: 'Leave',
    waitingHost: 'Waiting for the host to start the game…',
    noSeats: 'The host has no free seats for remote players right now.',
    hostDevice: 'host device',
    yourTurn: 'Your turn — tap a card', turnOf: '{name} is playing…',
    deck: 'Deck', scopa: 'Scopa!', settebello: 'Settebello',
    tapAgain: 'Tap again to play', takes: 'takes', toTable: 'goes to the table',
    chooseCapture: 'Choose what to take:',
    round: 'Round', roundOver: 'Round {n} finished',
    cards: 'Cards', denari: 'Denari', primiera: 'Primiera', scope: 'Scope', napolaPts: 'Napola',
    roundPts: 'This round', total: 'Total',
    nextRound: 'Next round', waitingNext: 'Waiting for the host…',
    gameOver: 'Game over', wins: '{name} wins!', backToLobby: 'New game',
    rules: 'Rules', close: 'Close', menu: 'Menu', endGame: 'End game',
    cancel: 'Cancel',
    btOffHint: 'Players with the Scopa app can also join over Bluetooth, without Wi-Fi.',
    btAllow: 'Allow Bluetooth',
    btOnHint: 'Bluetooth is on. On the other phone open Scopa, tap “Join via Bluetooth” and pick “{name}”.',
    btOff: 'Turn off',
    btJoin: 'Join via Bluetooth',
    btGuest: 'Playing via Bluetooth on {name}.',
    btLeave: 'Leave Bluetooth game',
    btNoAdapter: 'This device has no Bluetooth.',
    btTurnOn: 'Please turn on Bluetooth.',
    btNoPerm: 'Bluetooth play needs the “Nearby devices” permission. You can allow it in the app settings.',
    btAppSettings: 'App settings',
    btHostFailed: 'Could not start Bluetooth.',
    btPick: 'Join which phone?',
    btNone: 'No paired phones yet. Pair the two phones once in the Bluetooth settings, then try again.',
    btPair: 'Bluetooth settings',
    btConnecting: 'Connecting to {name}…',
    btFailed: 'Could not connect to {name}. Is Scopa open there, with Bluetooth allowed in the lobby?',
    btVersion: 'The other phone has a different version of Scopa. Install the same version on both phones.',
    confirmEnd: 'End the current game for everybody?',
    passDevice: 'Pass the device to {name}', tapToShow: '{name}: tap to show your cards',
    hidden: 'Cards hidden',
    connLost: 'Connection lost — retrying…',
    takeOver: 'Bot takes over', playHere: 'Play on this device',
    spectator: 'You are watching this game.',
    err_not_your_turn: 'Not your turn.', err_seat_taken: 'Seat already taken.',
    err_seats_open: 'Some browser seats are still empty.', err_illegal_capture: 'That capture is not allowed.',
    err_game_running: 'A game is already running.', err_must_choose_capture: 'Choose what to take.',
    err_default: 'Error: {e}',
    rulesHtml: `
<h3>Scopa</h3>
<p>40-card Italian deck. Values 1–10: Fante = 8, Cavallo = 9, Re = 10. Every player gets 3 cards and 4 cards go face up on the table. When all hands are empty, 3 new cards are dealt to each player until the deck runs out.</p>
<p>On your turn play one card. If a table card has the <b>same value</b> you must take it (a single card always beats a combination). Otherwise you may take table cards whose <b>sum</b> equals your card. If nothing can be taken, the card stays on the table.</p>
<p>Clearing the table is a <b>scopa</b> (1 point), except on the very last play of the round. The last player who captured takes the cards left on the table.</p>
<h3>Scoring</h3>
<p>1 point each for: most cards · most Denari · the Settebello (7 of Denari) · the Primiera · and 1 point per scopa. Ties score nothing.</p>
<p>Primiera: the best card of each suit counts 7 = 21, 6 = 18, Asso = 16, 5 = 15, 4 = 14, 3 = 13, 2 = 12, figures = 10. The highest total wins.</p>
<h3>Scopa a 15</h3>
<p>Your card plus the table cards you take must add up to <b>15</b> (e.g. Cavallo 9 takes a 5 and an Asso). Equal values do not take each other.</p>
<h3>Napola (option)</h3>
<p>Asso, 2 and 3 of Denari score 3 points, plus 1 for every following Denari card in sequence (4, 5, …).</p>
<h3>Players</h3>
<p>2 or 3 players play alone; 4 players play in two teams, partners sit opposite. The game ends when a side reaches the target and is ahead of everyone else.</p>`
  },
  it: {
    language: 'Lingua', subtitle: 'Gioco di carte italiano',
    copy: 'Copia', copied: 'Link copiato',
    dealer: 'Mazziere', myPile: 'Le tue prese', pileEmpty: 'Nessuna carta presa', releaseToClose: 'Rilascia per chiudere',
    holdPile: 'Tieni premuto per vedere le carte prese', rotate: 'Gira il telefono in verticale 📱',
    skin: 'Carte', skin_originale: 'Originali', skin_milanese: 'Milanesi (francesi)', skin_alternative: 'Alternative',
    variant: 'Gioco', classic: 'Scopa', fifteen: 'Scopa a 15',
    players: 'Giocatori', target: 'Punti per vincere', napola: 'Napola (Asso, 2, 3 di Denari)',
    seats: 'Posti', team: 'Squadra',
    local: 'Questo dispositivo', remote: 'Giocatore remoto', bot: 'Bot',
    easy: 'facile', normal: 'normale', hard: 'difficile',
    player: 'Giocatore', botName: 'Bot', yourName: 'Il tuo nome',
    waitingRemote: 'in attesa del giocatore…', online: 'online', offline: 'offline',
    joinHint: 'Altri giocatori: collegatevi allo stesso Wi-Fi o all\'hotspot di questo telefono e aprite nel browser:',
    noNetwork: 'Nessuna rete. Attiva il Wi-Fi o l\'hotspot per far entrare altri giocatori.',
    localOnly: 'Serve solo per i giocatori nel browser.',
    start: 'Inizia partita', startNeedsSeats: 'In attesa dei giocatori remoti',
    you: 'Tu', sitHere: 'Siediti qui', leave: 'Lascia',
    waitingHost: 'In attesa che l\'host avvii la partita…',
    noSeats: 'L\'host non ha posti liberi per giocatori remoti.',
    hostDevice: 'dispositivo host',
    yourTurn: 'Tocca a te — scegli una carta', turnOf: 'Gioca {name}…',
    deck: 'Mazzo', scopa: 'Scopa!', settebello: 'Settebello',
    tapAgain: 'Tocca di nuovo per giocare', takes: 'prende', toTable: 'va in tavola',
    chooseCapture: 'Scegli cosa prendere:',
    round: 'Mano', roundOver: 'Mano {n} finita',
    cards: 'Carte', denari: 'Denari', primiera: 'Primiera', scope: 'Scope', napolaPts: 'Napola',
    roundPts: 'Questa mano', total: 'Totale',
    nextRound: 'Prossima mano', waitingNext: 'In attesa dell\'host…',
    gameOver: 'Partita finita', wins: 'Vince {name}!', backToLobby: 'Nuova partita',
    rules: 'Regole', close: 'Chiudi', menu: 'Menu', endGame: 'Termina partita',
    cancel: 'Annulla',
    btOffHint: 'Chi ha l\'app Scopa può entrare anche via Bluetooth, senza Wi-Fi.',
    btAllow: 'Attiva Bluetooth',
    btOnHint: 'Bluetooth attivo. Sull\'altro telefono apri Scopa, tocca «Entra via Bluetooth» e scegli «{name}».',
    btOff: 'Disattiva',
    btJoin: 'Entra via Bluetooth',
    btGuest: 'Stai giocando via Bluetooth su {name}.',
    btLeave: 'Esci dalla partita Bluetooth',
    btNoAdapter: 'Questo dispositivo non ha il Bluetooth.',
    btTurnOn: 'Attiva il Bluetooth.',
    btNoPerm: 'Per giocare via Bluetooth serve il permesso «Dispositivi nelle vicinanze». Puoi concederlo nelle impostazioni dell\'app.',
    btAppSettings: 'Impostazioni app',
    btHostFailed: 'Impossibile avviare il Bluetooth.',
    btPick: 'A quale telefono?',
    btNone: 'Nessun telefono associato. Associa i due telefoni una volta nelle impostazioni Bluetooth e riprova.',
    btPair: 'Impostazioni Bluetooth',
    btConnecting: 'Connessione a {name}…',
    btFailed: 'Impossibile connettersi a {name}. Scopa è aperta lì, con il Bluetooth attivo nella sala?',
    btVersion: 'L\'altro telefono ha un\'altra versione di Scopa. Installa la stessa versione su entrambi.',
    confirmEnd: 'Terminare la partita per tutti?',
    passDevice: 'Passa il dispositivo a {name}', tapToShow: '{name}: tocca per vedere le carte',
    hidden: 'Carte nascoste',
    connLost: 'Connessione persa — riprovo…',
    takeOver: 'Gioca il bot', playHere: 'Gioca su questo dispositivo',
    spectator: 'Stai guardando la partita.',
    err_not_your_turn: 'Non è il tuo turno.', err_seat_taken: 'Posto già occupato.',
    err_seats_open: 'Ci sono ancora posti remoti liberi.', err_illegal_capture: 'Presa non valida.',
    err_game_running: 'C\'è già una partita in corso.', err_must_choose_capture: 'Scegli cosa prendere.',
    err_default: 'Errore: {e}',
    rulesHtml: `
<h3>Scopa</h3>
<p>Mazzo di 40 carte. Valori 1–10: Fante = 8, Cavallo = 9, Re = 10. Ogni giocatore riceve 3 carte e 4 carte vanno scoperte in tavola. Quando tutti hanno finito le carte se ne distribuiscono altre 3 finché il mazzo non è esaurito.</p>
<p>Al tuo turno giochi una carta. Se in tavola c'è una carta dello <b>stesso valore</b> devi prenderla (la carta singola ha la precedenza sulla somma). Altrimenti puoi prendere carte la cui <b>somma</b> è uguale alla tua. Se non puoi prendere nulla, la carta resta in tavola.</p>
<p>Svuotare la tavola è una <b>scopa</b> (1 punto), tranne con l'ultima giocata della mano. Le carte rimaste in tavola vanno a chi ha fatto l'ultima presa.</p>
<h3>Punteggio</h3>
<p>1 punto ciascuno per: carte · denari · settebello · primiera · e 1 punto per ogni scopa. In caso di parità il punto non viene assegnato.</p>
<p>Primiera: la carta migliore di ogni seme vale 7 = 21, 6 = 18, Asso = 16, 5 = 15, 4 = 14, 3 = 13, 2 = 12, figure = 10. Vince il totale più alto.</p>
<h3>Scopa a 15</h3>
<p>La carta giocata più le carte prese devono fare <b>15</b> (es. il Cavallo 9 prende un 5 e un Asso). Carte uguali non si prendono.</p>
<h3>Napola (opzione)</h3>
<p>Asso, 2 e 3 di Denari valgono 3 punti, più 1 per ogni denaro successivo in sequenza (4, 5, …).</p>
<h3>Giocatori</h3>
<p>In 2 o 3 si gioca da soli; in 4 si gioca a coppie, i compagni siedono di fronte. Vince chi raggiunge il punteggio ed è in testa.</p>`
  },
  de: {
    language: 'Sprache', subtitle: 'Italienisches Kartenspiel',
    copy: 'Kopieren', copied: 'Link kopiert',
    dealer: 'Geber', myPile: 'Deine Stiche', pileEmpty: 'Noch keine Karten genommen', releaseToClose: 'Loslassen zum Schließen',
    holdPile: 'Gedrückt halten, um deine Karten zu sehen', rotate: 'Bitte das Handy hochkant halten 📱',
    skin: 'Karten', skin_originale: 'Original', skin_milanese: 'Mailänder (französisch)', skin_alternative: 'Alternativ',
    variant: 'Spiel', classic: 'Scopa', fifteen: 'Scopa a 15',
    players: 'Spieler', target: 'Punkte zum Sieg', napola: 'Napola (Asso, 2, 3 Denari)',
    seats: 'Plätze', team: 'Team',
    local: 'Dieses Gerät', remote: 'Mitspieler (entfernt)', bot: 'Bot',
    easy: 'leicht', normal: 'normal', hard: 'schwer',
    player: 'Spieler', botName: 'Bot', yourName: 'Dein Name',
    waitingRemote: 'wartet auf Spieler…', online: 'online', offline: 'offline',
    joinHint: 'Mitspieler: mit demselben WLAN oder dem Hotspot dieses Handys verbinden und im Browser öffnen:',
    noNetwork: 'Kein Netzwerk. WLAN oder Hotspot einschalten, damit andere beitreten können.',
    localOnly: 'Nur für Browser-Spieler nötig.',
    start: 'Spiel starten', startNeedsSeats: 'Warte auf Browser-Spieler',
    you: 'Du', sitHere: 'Hier setzen', leave: 'Verlassen',
    waitingHost: 'Warte, bis der Gastgeber das Spiel startet…',
    noSeats: 'Der Gastgeber hat gerade keine freien Plätze für entfernte Mitspieler.',
    hostDevice: 'Gastgeber-Gerät',
    yourTurn: 'Du bist dran — tippe eine Karte', turnOf: '{name} spielt…',
    deck: 'Stapel', scopa: 'Scopa!', settebello: 'Settebello',
    tapAgain: 'Nochmals tippen zum Spielen', takes: 'nimmt', toTable: 'geht auf den Tisch',
    chooseCapture: 'Wähle, was du nimmst:',
    round: 'Runde', roundOver: 'Runde {n} beendet',
    cards: 'Karten', denari: 'Denari', primiera: 'Primiera', scope: 'Scope', napolaPts: 'Napola',
    roundPts: 'Diese Runde', total: 'Gesamt',
    nextRound: 'Nächste Runde', waitingNext: 'Warte auf den Gastgeber…',
    gameOver: 'Spiel vorbei', wins: '{name} gewinnt!', backToLobby: 'Neues Spiel',
    rules: 'Regeln', close: 'Schließen', menu: 'Menü', endGame: 'Spiel beenden',
    cancel: 'Abbrechen',
    btOffHint: 'Mitspieler mit der Scopa-App können auch per Bluetooth beitreten, ohne WLAN.',
    btAllow: 'Bluetooth erlauben',
    btOnHint: 'Bluetooth ist an. Auf dem anderen Handy Scopa öffnen, „Per Bluetooth beitreten“ tippen und „{name}“ wählen.',
    btOff: 'Ausschalten',
    btJoin: 'Per Bluetooth beitreten',
    btGuest: 'Du spielst per Bluetooth auf {name}.',
    btLeave: 'Bluetooth-Spiel verlassen',
    btNoAdapter: 'Dieses Gerät hat kein Bluetooth.',
    btTurnOn: 'Bitte Bluetooth einschalten.',
    btNoPerm: 'Für Bluetooth braucht die App die Berechtigung „Geräte in der Nähe“. Du kannst sie in den App-Einstellungen erlauben.',
    btAppSettings: 'App-Einstellungen',
    btHostFailed: 'Bluetooth konnte nicht gestartet werden.',
    btPick: 'Welchem Handy beitreten?',
    btNone: 'Noch keine gekoppelten Handys. Koppelt die beiden Handys einmal in den Bluetooth-Einstellungen und versucht es dann erneut.',
    btPair: 'Bluetooth-Einstellungen',
    btConnecting: 'Verbinde mit {name}…',
    btFailed: 'Keine Verbindung zu {name}. Ist Scopa dort offen und Bluetooth in der Lobby erlaubt?',
    btVersion: 'Das andere Handy hat eine andere Scopa-Version. Installiert auf beiden dieselbe Version.',
    confirmEnd: 'Das laufende Spiel für alle beenden?',
    passDevice: 'Gib das Gerät an {name}', tapToShow: '{name}: tippen, um die Karten zu zeigen',
    hidden: 'Karten verdeckt',
    connLost: 'Verbindung verloren — neuer Versuch…',
    takeOver: 'Bot übernimmt', playHere: 'Auf diesem Gerät spielen',
    spectator: 'Du schaust diesem Spiel zu.',
    err_not_your_turn: 'Du bist nicht dran.', err_seat_taken: 'Platz schon besetzt.',
    err_seats_open: 'Es sind noch Browser-Plätze frei.', err_illegal_capture: 'Dieser Stich ist nicht erlaubt.',
    err_game_running: 'Es läuft bereits ein Spiel.', err_must_choose_capture: 'Wähle, was du nimmst.',
    err_default: 'Fehler: {e}',
    rulesHtml: `
<h3>Scopa</h3>
<p>Italienisches Blatt mit 40 Karten. Werte 1–10: Fante = 8, Cavallo = 9, Re = 10. Jeder bekommt 3 Karten, 4 Karten liegen offen auf dem Tisch. Sind alle Hände leer, gibt es je 3 neue Karten, bis der Stapel aufgebraucht ist.</p>
<p>Wer dran ist, spielt eine Karte. Liegt eine Karte mit <b>gleichem Wert</b> auf dem Tisch, muss sie genommen werden (eine einzelne Karte geht vor einer Summe). Sonst darf man Karten nehmen, deren <b>Summe</b> dem Wert entspricht. Kann man nichts nehmen, bleibt die Karte liegen.</p>
<p>Wer den Tisch leer räumt, macht eine <b>Scopa</b> (1 Punkt) – außer mit dem allerletzten Zug der Runde. Die Restkarten bekommt, wer zuletzt gestochen hat.</p>
<h3>Wertung</h3>
<p>Je 1 Punkt für: meiste Karten · meiste Denari · den Settebello (7 Denari) · die Primiera · und 1 Punkt pro Scopa. Bei Gleichstand gibt es keinen Punkt.</p>
<p>Primiera: die beste Karte jeder Farbe zählt 7 = 21, 6 = 18, Asso = 16, 5 = 15, 4 = 14, 3 = 13, 2 = 12, Figuren = 10. Die höchste Summe gewinnt.</p>
<h3>Scopa a 15</h3>
<p>Gespielte Karte plus genommene Tischkarten müssen <b>15</b> ergeben (z. B. Cavallo 9 nimmt eine 5 und ein Asso). Gleiche Werte stechen sich nicht.</p>
<h3>Napola (Option)</h3>
<p>Asso, 2 und 3 Denari zählen 3 Punkte, plus 1 für jede weitere Denari-Karte in Folge (4, 5, …).</p>
<h3>Spieler</h3>
<p>Zu zweit oder dritt spielt jeder für sich; zu viert in zwei Teams, Partner sitzen sich gegenüber. Gewonnen hat, wer das Ziel erreicht und vorne liegt.</p>`
  }
};

let LANG = 'en';
function t(key, vars) {
  let s = (I18N[LANG] && I18N[LANG][key]) || I18N.en[key] || key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
