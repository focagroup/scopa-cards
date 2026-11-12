package app.scopa.desktop;

import app.scopa.core.Room;

/** Runs the Scopa server on a desktop JVM for testing: java DesktopMain <webDir> [port] [skinsDir] */
public final class DesktopMain {
    public static void main(String[] args) throws Exception {
        app.cards.desktop.DesktopMain.run(new Room(), args);
    }
}
