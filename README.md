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

The shared engine is the git submodule `framework/`
([cards-framework](https://github.com/focagroup/cards-framework)). Clone with
`git clone --recursive https://github.com/focagroup/scopa-cards`, or run `git submodule update --init`
in an existing clone.

Requires JDK 17+ and the Android SDK (`platforms/android-35`, `build-tools/35.0.0`) in
`~/Android/Sdk`.

```bash
./build.sh          # -> build/scopa.apk (min Android 7.0 / API 24)
./build.sh test     # rule unit checks + thousands of bot-vs-bot games
./build.sh desktop  # run the same server on this PC (http://localhost:8080) for testing
./build.sh relaytest # Bluetooth relay checks, with TCP standing in for Bluetooth
```

The APK is signed with `~/claude/.keys/cards/scopa.jks`, with its password in `scopa.pass` next to it
(see Signing in the framework README). Keys and passwords are never in git. Keep them backed up:
Android only installs updates signed with the same key.

Install on a phone via USB: `adb install -r build/scopa.apk`, or copy the APK over and
open it (allow "install unknown apps").

## Layout

- `framework/` – git submodule [cards-framework](https://github.com/focagroup/cards-framework):
  lobby/room base, HTTP server, Bluetooth relay, the Android activity and the shared `build.sh`
- `app/core/` – pure Java: rules engine (`Game`), bots, and `Room` (the framework room with
  Scopa's settings, moves and state view)
- `app/src/` – Android `MainActivity`: Scopa's identity, colours and Bluetooth UUID on top of the
  framework's `CardsActivity`
- `game.conf` – build settings read by `framework/build.sh`
- `app/assets/web/` – the game UI (HTML/CSS/JS, cards drawn as SVG), shared by the app
  and remote browsers
- `desktop/` – desktop runner and simulation tests
