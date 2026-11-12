package app.scopa;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import app.scopa.core.Relay;
import app.scopa.core.WebServer;

/**
 * Bluetooth (RFCOMM) transport for {@link Relay}. Phones must be paired; the host listens
 * on a fixed service UUID, guests connect to it by device address.
 */
final class Bluetooth {

    /** Unique per game, so a Scopa guest never connects to another game's host. */
    static final UUID SERVICE = UUID.fromString("6f3b1c52-8d4e-4b7a-9a61-5c0e2f7d9a11");
    static final String SERVICE_NAME = "Scopa";

    private Bluetooth() {}

    /** Accepts guests and answers their API calls with the host's WebServer. */
    static final class Host {
        private final BluetoothServerSocket server;
        private final List<BluetoothSocket> clients = new ArrayList<>();
        private volatile boolean running = true;

        Host(BluetoothAdapter adapter, final WebServer web, final Runnable onStopped) throws IOException {
            server = adapter.listenUsingRfcommWithServiceRecord(SERVICE_NAME, SERVICE);
            Thread t = new Thread(new Runnable() {
                @Override public void run() {
                    while (running) {
                        final BluetoothSocket s;
                        try {
                            s = server.accept();
                        } catch (IOException e) {
                            // Bluetooth was turned off or we were stopped.
                            boolean wasRunning = running;
                            stop();
                            if (wasRunning && onStopped != null) onStopped.run();
                            return;
                        }
                        synchronized (clients) { clients.add(s); }
                        Thread c = new Thread(new Runnable() {
                            @Override public void run() {
                                try {
                                    Relay.serve(s.getInputStream(), s.getOutputStream(), web);
                                } catch (IOException ignored) {
                                    // guest left or link lost
                                } finally {
                                    try { s.close(); } catch (IOException ignored) {}
                                    synchronized (clients) { clients.remove(s); }
                                }
                            }
                        }, "bt-guest");
                        c.setDaemon(true);
                        c.start();
                    }
                }
            }, "bt-accept");
            t.setDaemon(true);
            t.start();
        }

        boolean isRunning() { return running; }

        void stop() {
            running = false;
            try { server.close(); } catch (IOException ignored) {}
            synchronized (clients) {
                for (BluetoothSocket s : clients) {
                    try { s.close(); } catch (IOException ignored) {}
                }
                clients.clear();
            }
        }
    }

    /** Opens a fresh link to the host with the given address on every call. */
    static Relay.Connector connector(final BluetoothAdapter adapter, final String address) {
        return new Relay.Connector() {
            @Override public Relay.Client connect() throws IOException {
                try {
                    adapter.cancelDiscovery();
                } catch (SecurityException ignored) {
                    // needs the scan permission on Android 12+; we never start discovery anyway
                }
                BluetoothSocket s = null;
                try {
                    BluetoothDevice d = adapter.getRemoteDevice(address);
                    s = d.createRfcommSocketToServiceRecord(SERVICE);
                    s.connect();
                    return new Relay.Client(s.getInputStream(), s.getOutputStream(), s);
                } catch (SecurityException e) {
                    close(s);
                    throw new IOException("permission");
                } catch (IOException e) {
                    close(s);
                    throw e;
                }
            }
        };
    }

    private static void close(BluetoothSocket s) {
        if (s == null) return;
        try { s.close(); } catch (IOException ignored) {}
    }
}
