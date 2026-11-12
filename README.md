# Scopa (Android)

Scopa and Scopa a 15 with a Napoletane-style deck, for 2–4 players, with bots.
The app never contacts the internet; it only runs a small game server on the local network.

## How to play together

- **One phone (pass-and-play):** set several seats to *This device*. When the turn
  changes, the hand is covered until the next player taps it.
- **Browser players:** set a seat to *Remote player*. The lobby shows
  `http://<phone-ip>:<port>`. Other players join the same Wi-Fi (or the host phone's
  hotspot) and open that address in any browser. No app install is needed.
- **Bluetooth (app players, no Wi-Fi needed):** pair the two phones once in Android's
  Bluetooth settings. On the host, set a seat to *Remote player* and tap *Allow Bluetooth*
  (it stays on across restarts until turned off). On the other phone open Scopa, tap
  *Join via Bluetooth* and pick the host phone. Up to ~7 phones can join one host.
  The guest app shows its own copy of the game UI; only the game moves go over Bluetooth.
  Both phones need the same app version.
- **Bots:** any seat can be a bot (easy / normal / hard). During a game the host can let
  a bot take over a seat (e.g. if someone disconnects) from the ☰ menu.
- With 4 players it is two teams (seats 1 + 3 vs 2 + 4).

Keep the app open on the host phone while playing.

## Card skins

Each player picks a deck in the lobby or the ☰ menu. The choice is stored per device.

- `skins/originale/` – the scanned cards cut from `originale.png` (default)
- `skins/milanese/` – French-suited Milanese cards, A and 2–10 (no face cards);
  Quadri (♦) = Denari, Cuori (♥) = Coppe, Picche (♠) = Spade, Fiori (♣) = Bastoni
- `skins/alternative/` – the earlier hand-drawn Napoletane-style cards

Every skin uses the same file names: `<denari|coppe|spade|bastoni>_<01..10>.<png|svg>` plus
`back.svg`. `build.sh` copies `skins/` into the APK.

Regenerate them with:

```bash
python3 tools/slice_originale.py originale.png skins/originale   # cut the scan
node tools/gen_skins.js skins                                     # milanese + alternative + originale back
python3 tools/make_icon.py                                        # icon.png + Android launcher icons
```

## Build (offline, no Gradle)

Requires JDK 17+ and the Android SDK (`platforms/android-35`, `build-tools/35.0.0`) in
`~/Android/Sdk`.

```bash
./build.sh          # -> build/scopa.apk (min Android 7.0 / API 24)
./build.sh test     # rule unit checks + thousands of bot-vs-bot games
./build.sh desktop  # run the same server on this PC (http://localhost:8080) for testing
./build.sh relaytest # Bluetooth relay checks, with TCP standing in for Bluetooth
```

The APK is signed with `~/claude/.keys/cards/scopa.jks`, with its password in `scopa.pass` next to it.
Keys and passwords are never in git. Keep them backed up: Android only installs updates signed
with the same key.

Install on a phone via USB: `adb install -r build/scopa.apk`, or copy the APK over and
open it (allow "install unknown apps").

## Layout

- `app/core/` – pure Java: rules engine (`Game`), bots, room/lobby, tiny HTTP server
- `app/src/` – Android `MainActivity` (WebView locked to the local server) and `Bluetooth`
  (RFCOMM host listener / guest connector)
- `app/core/.../Relay.java` – carries the API calls between guest and host over one stream
- `app/assets/web/` – the game UI (HTML/CSS/JS, cards drawn as SVG), shared by the app
  and remote browsers
- `desktop/` – desktop runner and simulation tests
