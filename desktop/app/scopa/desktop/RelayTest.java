package app.scopa.desktop;

import app.scopa.core.Room;

/** Bluetooth relay checks for Scopa over TCP (see app.cards.desktop.RelayTest). */
public final class RelayTest {
    public static void main(String[] args) throws Exception {
        app.cards.desktop.RelayTest.run(new Room(), args);
    }
}
