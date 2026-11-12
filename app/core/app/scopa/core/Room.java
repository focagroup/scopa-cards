package app.scopa.core;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import app.cards.core.GameInfo;

/**
 * The Scopa room: lobby settings, the running {@link Game} and its view for the web client.
 * Seats, joining, long polling and the bot loop come from the framework's Room.
 */
public final class Room extends app.cards.core.Room {
    public static final GameInfo INFO = new GameInfo("scopa", "Scopa", "Scopa");
    private static final int SEATS = 4;
    private static final long BOT_DELAY_MS = 1200;

    private final Game.Config cfg = new Game.Config();
    private Game game;

    public Room() {
        super(INFO, SEATS, BOT_DELAY_MS);
    }

    // ------------------------------------------------------------------ lifecycle

    @Override protected boolean hasGame() { return game != null; }

    @Override protected int players() { return cfg.players; }

    @Override protected void configureGame(Map<String, String> p) {
        if (p.containsKey("variant")) cfg.variant = "fifteen".equals(p.get("variant")) ? Game.Variant.FIFTEEN : Game.Variant.CLASSIC;
        if (p.containsKey("players")) cfg.players = clamp(parseInt(p.get("players"), 2), 2, 4);
        if (p.containsKey("target")) cfg.target = clamp(parseInt(p.get("target"), 11), 1, 99);
        if (p.containsKey("napola")) cfg.napola = "1".equals(p.get("napola")) || "true".equals(p.get("napola"));
    }

    @Override protected void newGame() { game = new Game(cfg, rng); }

    @Override protected void nextGameRound() { game.nextRound(); }

    @Override protected void clearGame() { game = null; }

    // ------------------------------------------------------------------ moves and bots

    @Override public boolean handles(String action) { return "play".equals(action); }

    /** "play": card=&lt;id&gt; and capture=&lt;id,id,...&gt; (the table cards taken). */
    @Override protected String play(int seat, String action, Map<String, String> p) {
        return game.play(seat, parseInt(p.get("card"), -1), parseInts(p.get("capture")));
    }

    @Override protected int botTurn() {
        return game.phase == Game.Phase.PLAYING ? game.turn : -1;
    }

    @Override protected void botPlay(int s, int level) {
        Bot.Choice c = Bot.choose(game, s, level, rng);
        game.play(s, c.card, c.capture);
    }

    // ------------------------------------------------------------------ state view

    @Override protected Object configView() {
        Map<String, Object> c = new LinkedHashMap<>();
        Game.Config gc = game != null ? game.cfg : cfg;
        c.put("variant", gc.variant == Game.Variant.FIFTEEN ? "fifteen" : "classic");
        c.put("players", gc.players);
        c.put("target", gc.target);
        c.put("napola", gc.napola);
        return c;
    }

    @Override protected String phase() {
        Game g = game;
        return g.phase == Game.Phase.PLAYING ? "playing" : g.phase == Game.Phase.ROUND_END ? "roundEnd" : "gameOver";
    }

    @Override protected Map<String, Object> gameView(List<Integer> mine) {
        Game g = game;
        Map<String, Object> gm = new LinkedHashMap<>();
        gm.put("round", g.round);
        gm.put("dealer", g.dealer);
        gm.put("turn", g.turn);
        gm.put("deck", g.deck.size());
        gm.put("dealSeq", g.dealSeq);
        gm.put("table", Game.toArray(g.table));
        List<Object> counts = new ArrayList<>();
        for (List<Integer> h : g.hands) counts.add(h.size());
        gm.put("handCounts", counts);
        Map<String, Object> hands = new LinkedHashMap<>();
        for (Object si : mine) hands.put(String.valueOf(si), Game.toArray(g.hands.get((Integer) si)));
        gm.put("hands", hands);
        // Captured cards are private: only the piles of the requester's own team(s) are sent.
        Map<String, Object> myPiles = new LinkedHashMap<>();
        for (Object si : mine) {
            int tm = g.team((Integer) si);
            myPiles.put(String.valueOf(tm), Game.toArray(g.piles.get(tm)));
        }
        gm.put("myPiles", myPiles);
        List<Object> piles = new ArrayList<>();
        for (List<Integer> p : g.piles) piles.add(p.size());
        gm.put("piles", piles);
        gm.put("scope", g.scope);
        gm.put("totals", g.totals);
        gm.put("winner", g.winner);
        gm.put("lastCapturer", g.lastCapturer);

        if (g.phase == Game.Phase.PLAYING && mine.contains(g.turn)) {
            Map<String, Object> opts = new LinkedHashMap<>();
            for (int card : g.hands.get(g.turn)) {
                List<Object> l = new ArrayList<>();
                for (int[] set : g.options(card)) l.add(set);
                opts.put(String.valueOf(card), l);
            }
            gm.put("options", opts);
        }

        if (g.lastMove != null) {
            Game.Move mv = g.lastMove;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("seq", mv.seq);
            m.put("seat", mv.seat);
            m.put("card", mv.card);
            m.put("capture", mv.capture);
            m.put("scopa", mv.scopa);
            m.put("sweep", mv.sweep);
            m.put("sweepTeam", mv.sweepTeam);
            gm.put("lastMove", m);
        }

        if (g.lastResult != null && g.phase != Game.Phase.PLAYING) {
            List<Object> res = new ArrayList<>();
            for (Game.TeamResult r : g.lastResult) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("cards", r.cards);
                m.put("denari", r.denari);
                m.put("settebello", r.settebello);
                m.put("primiera", r.primiera);
                m.put("scope", r.scope);
                m.put("napola", r.napola);
                m.put("ptCards", r.ptCards);
                m.put("ptDenari", r.ptDenari);
                m.put("ptSettebello", r.ptSettebello);
                m.put("ptPrimiera", r.ptPrimiera);
                m.put("total", r.total);
                res.add(m);
            }
            gm.put("result", res);
        }
        List<Object> hist = new ArrayList<>();
        for (int[] h : g.history) hist.add(h);
        gm.put("history", hist);
        return gm;
    }
}
