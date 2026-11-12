package app.scopa.desktop;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import app.scopa.core.Bot;
import app.scopa.core.Card;
import app.scopa.core.Game;

/** Plays many bot-only games and checks invariants plus a few hand-made rule cases. */
public final class SimTest {
    static int failures = 0;

    static void check(boolean ok, String msg) {
        if (!ok) { failures++; System.out.println("FAIL: " + msg); }
    }

    public static void main(String[] args) {
        ruleCases();
        Random rng = new Random(42);
        int games = 0;
        long[] winsByLevel = new long[3];
        for (Game.Variant v : Game.Variant.values()) {
            for (int players = 2; players <= 4; players++) {
                for (int i = 0; i < 300; i++) {
                    Game.Config c = new Game.Config();
                    c.variant = v;
                    c.players = players;
                    c.napola = i % 2 == 0;
                    c.target = 11;
                    Game g = new Game(c, rng);
                    int[] level = new int[players];
                    for (int s = 0; s < players; s++) level[s] = players == 2 ? (s == 0 ? 1 : 0) : rng.nextInt(3);
                    int guard = 0;
                    while (g.phase != Game.Phase.GAME_OVER && guard++ < 100000) {
                        if (g.phase == Game.Phase.ROUND_END) {
                            checkRoundEnd(g);
                            g.nextRound();
                            continue;
                        }
                        checkConservation(g);
                        int s = g.turn;
                        Bot.Choice ch = Bot.choose(g, s, level[s], rng);
                        String err = g.play(s, ch.card, ch.capture);
                        check(err == null, "bot move rejected: " + err);
                        if (err != null) break;
                    }
                    check(g.phase == Game.Phase.GAME_OVER, "game did not finish");
                    check(g.totals[g.winner] >= 11, "winner below target");
                    if (players == 2) winsByLevel[level[g.winner]]++;
                    games++;
                }
            }
        }
        System.out.println("simulated " + games + " games; 2p wins normal=" + winsByLevel[1] + " easy=" + winsByLevel[0]);
        System.out.println(failures == 0 ? "ALL OK" : failures + " FAILURES");
        if (failures > 0) System.exit(1);
    }

    static void checkConservation(Game g) {
        boolean[] seen = new boolean[40];
        int count = 0;
        List<Integer> all = new ArrayList<>(g.deck);
        all.addAll(g.table);
        for (List<Integer> h : g.hands) all.addAll(h);
        for (List<Integer> p : g.piles) all.addAll(p);
        for (int c : all) { check(!seen[c], "duplicate card " + c); seen[c] = true; count++; }
        check(count == 40, "card count " + count);
    }

    static void checkRoundEnd(Game g) {
        int sum = 0;
        for (List<Integer> p : g.piles) sum += p.size();
        check(sum == 40 || g.lastCapturer < 0, "piles do not hold 40 cards at round end: " + sum);
        check(g.table.isEmpty() || g.lastCapturer < 0, "table not swept");
    }

    static List<Integer> list(int... ids) {
        List<Integer> l = new ArrayList<>();
        for (int i : ids) l.add(i);
        return l;
    }

    static void ruleCases() {
        int d = Card.DENARI, c = Card.COPPE, s = Card.SPADE, b = Card.BASTONI;
        // Classic: single match beats a sum.
        List<int[]> o = Game.captureOptions(Game.Variant.CLASSIC, list(Card.id(c, 5), Card.id(s, 2), Card.id(b, 3)), Card.id(d, 5));
        check(o.size() == 1 && o.get(0).length == 1 && o.get(0)[0] == Card.id(c, 5), "single match priority");
        // Classic: sum capture when no single match.
        o = Game.captureOptions(Game.Variant.CLASSIC, list(Card.id(c, 4), Card.id(s, 2), Card.id(b, 3)), Card.id(d, 7));
        check(o.size() == 1 && o.get(0).length == 2, "sum capture 4+3=7");
        // Classic: two equal cards on table -> two options.
        o = Game.captureOptions(Game.Variant.CLASSIC, list(Card.id(c, 6), Card.id(s, 6)), Card.id(d, 6));
        check(o.size() == 2, "choose between equal singles");
        // Classic: no capture.
        o = Game.captureOptions(Game.Variant.CLASSIC, list(Card.id(c, 9), Card.id(s, 8)), Card.id(d, 3));
        check(o.isEmpty(), "no capture");
        // Fifteen: Wikipedia example ace,3,5,7 on table, play 2 -> ace+5+7 (13) + 2 = 15.
        o = Game.captureOptions(Game.Variant.FIFTEEN, list(Card.id(c, 1), Card.id(s, 3), Card.id(b, 5), Card.id(d, 7)), Card.id(c, 2));
        boolean found = false;
        for (int[] x : o) if (x.length == 3) found = true;
        check(found, "fifteen: 2 takes ace+5+7");
        // Fifteen: equal values do not capture.
        o = Game.captureOptions(Game.Variant.FIFTEEN, list(Card.id(c, 7)), Card.id(d, 7));
        check(o.isEmpty(), "fifteen: 7 does not take 7");
        // Fifteen: cavallo (9) takes 5 + ace.
        o = Game.captureOptions(Game.Variant.FIFTEEN, list(Card.id(c, 5), Card.id(s, 1), Card.id(b, 8)), Card.id(d, 9));
        check(o.size() == 1 && o.get(0).length == 2, "fifteen: 9 takes 5+1");
        // Primiera values.
        check(Card.prime(Card.id(d, 7)) == 21 && Card.prime(Card.id(d, 1)) == 16 && Card.prime(Card.id(d, 10)) == 10, "primiera values");
        System.out.println("rule cases done");
    }
}
