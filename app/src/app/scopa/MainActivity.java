package app.scopa;

import android.graphics.Color;

import java.util.UUID;

import app.cards.android.CardsActivity;
import app.cards.core.GameInfo;
import app.scopa.core.Room;

/** Scopa on the cards framework: everything but the game's identity lives in {@link CardsActivity}. */
public class MainActivity extends CardsActivity {
    /** Unique per game, so a Scopa guest never connects to another game's host. */
    private static final UUID BT_SERVICE = UUID.fromString("6f3b1c52-8d4e-4b7a-9a61-5c0e2f7d9a11");

    @Override protected GameInfo info() { return Room.INFO; }

    @Override protected Room createRoom() { return new Room(); }

    @Override protected UUID bluetoothService() { return BT_SERVICE; }

    @Override protected int pageColor() { return Color.rgb(14, 77, 46); }

    @Override protected int frameColor() { return Color.rgb(10, 56, 33); }

    @Override protected String exitQuestion() { return "Exit Scopa? / Uscire? / Beenden?"; }
}
