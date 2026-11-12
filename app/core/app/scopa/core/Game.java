package app.scopa.core;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/** Rules engine for Scopa (classic) and Scopa a 15. Not thread-safe; Room synchronizes. */
public final class Game {

    public enum Variant { CLASSIC, FIFTEEN }

    public enum Phase { PLAYING, ROUND_END, GAME_OVER }

    public static final class Config {
        public Variant variant = Variant.CLASSIC;
        public int players = 2;      // 2..4; 4 players = two teams (seats 0+2 vs 1+3)
        public int target = 11;
        public boolean napola = false;

        public Config copy() {
            Config c = new Config();
            c.variant = variant; c.players = players; c.target = target; c.napola = napola;
            return c;
        }
    }

    /** Last move, used by clients for animation. */
    public static final class Move {
        public int seq, seat, card;
        public int[] capture = new int[0];
        public boolean scopa;
        /** Cards left on table at round end, swept to team `sweepTeam` (-1 = none). */
        public int[] sweep = new int[0];
        public int sweepTeam = -1;
    }

    public static final class TeamResult {
        public int cards, denari, primiera, scope, napola;
        public boolean settebello;
        public int ptCards, ptDenari, ptSettebello, ptPrimiera, total;
    }

    public final Config cfg;
    public final int n;
    public final int nTeams;
    private final Random rng;

    public final List<Integer> deck = new ArrayList<>();
    public final List<List<Integer>> hands = new ArrayList<>();
    public final List<Integer> table = new ArrayList<>();
    public final List<List<Integer>> piles = new ArrayList<>(); // per team
    public final int[] scope;
    public final int[] totals;
    public final List<int[]> history = new ArrayList<>(); // per round: points per team

    public int dealer;
    public int turn;
    public int lastCapturer = -1;
    public int round = 0;
    public int dealSeq = 0;
    public int winner = -1;
    public Phase phase = Phase.PLAYING;
    public Move lastMove;
    public TeamResult[] lastResult;
    private int moveSeq = 0;

    public Game(Config cfg, Random rng) {
        this.cfg = cfg.copy();
        this.n = cfg.players;
        this.nTeams = n == 4 ? 2 : n;
        this.rng = rng;
        this.scope = new int[nTeams];
        this.totals = new int[nTeams];
        for (int i = 0; i < n; i++) hands.add(new ArrayList<Integer>());
        for (int i = 0; i < nTeams; i++) piles.add(new ArrayList<Integer>());
        this.dealer = rng.nextInt(n);
        startRound();
    }

    public int team(int seat) { return n == 4 ? seat % 2 : seat; }

    // ------------------------------------------------------------------ dealing

    private void startRound() {
        round++;
        for (List<Integer> h : hands) h.clear();
        for (List<Integer> p : piles) p.clear();
        java.util.Arrays.fill(scope, 0);
        table.clear();
        lastCapturer = -1;
        lastResult = null;
        while (true) {
            deck.clear();
            for (int i = 0; i < 40; i++) deck.add(i);
            Collections.shuffle(deck, rng);
            table.clear();
            for (int i = 0; i < 4; i++) table.add(deck.remove(deck.size() - 1));
            if (cfg.variant != Variant.CLASSIC) break;
            int kings = 0;
            for (int c : table) if (Card.rank(c) == 10) kings++;
            if (kings < 3) break; // 3+ kings on the table: redeal (no scopa possible)
        }
        dealHands();
        turn = (dealer + 1) % n;
        phase = Phase.PLAYING;
    }

    private void dealHands() {
        for (int k = 0; k < 3; k++)
            for (int i = 1; i <= n; i++)
                hands.get((dealer + i) % n).add(deck.remove(deck.size() - 1));
        dealSeq++;
    }

    // ------------------------------------------------------------------ captures

    /** All legal capture sets (table cards) for playing `card` against `tbl`. Empty = card goes to table. */
    public static List<int[]> captureOptions(Variant v, List<Integer> tbl, int card) {
        List<int[]> out = new ArrayList<>();
        int r = Card.rank(card);
        int m = tbl.size();
        if (v == Variant.CLASSIC) {
            for (int c : tbl) if (Card.rank(c) == r) out.add(new int[]{c});
            if (!out.isEmpty()) return out; // a single equal card must be taken over a sum
            subsets(tbl, r, 2, out);
        } else {
            subsets(tbl, 15 - r, 1, out);
        }
        return out;
    }

    private static void subsets(List<Integer> tbl, int target, int minSize, List<int[]> out) {
        int m = tbl.size();
        if (target <= 0 || m > 20) return;
        for (int mask = 1; mask < (1 << m); mask++) {
            int bits = Integer.bitCount(mask);
            if (bits < minSize) continue;
            int sum = 0;
            for (int i = 0; i < m && sum <= target; i++) if ((mask & (1 << i)) != 0) sum += Card.rank(tbl.get(i));
            if (sum != target) continue;
            int[] set = new int[bits];
            int k = 0;
            for (int i = 0; i < m; i++) if ((mask & (1 << i)) != 0) set[k++] = tbl.get(i);
            out.add(set);
        }
    }

    public List<int[]> options(int card) { return captureOptions(cfg.variant, table, card); }

    private static boolean sameSet(int[] a, int[] b) {
        if (a.length != b.length) return false;
        int[] x = a.clone(), y = b.clone();
        java.util.Arrays.sort(x); java.util.Arrays.sort(y);
        return java.util.Arrays.equals(x, y);
    }

    /** Play a card. Returns null on success, or an error code. */
    public String play(int seat, int card, int[] capture) {
        if (phase != Phase.PLAYING) return "not_playing";
        if (seat != turn) return "not_your_turn";
        List<Integer> hand = hands.get(seat);
        if (!hand.contains(card)) return "no_such_card";
        if (capture == null) capture = new int[0];
        List<int[]> opts = options(card);
        if (opts.isEmpty()) {
            if (capture.length > 0) return "illegal_capture";
        } else {
            if (capture.length == 0) {
                if (opts.size() == 1) capture = opts.get(0); // must capture; only one way
                else return "must_choose_capture";
            }
            boolean ok = false;
            for (int[] o : opts) if (sameSet(o, capture)) { ok = true; break; }
            if (!ok) return "illegal_capture";
        }

        hand.remove(Integer.valueOf(card));
        Move mv = new Move();
        mv.seq = ++moveSeq;
        mv.seat = seat;
        mv.card = card;
        mv.capture = capture.clone();
        int t = team(seat);
        if (capture.length > 0) {
            for (int c : capture) table.remove(Integer.valueOf(c));
            piles.get(t).add(card);
            for (int c : capture) piles.get(t).add(c);
            lastCapturer = seat;
            if (table.isEmpty() && !isRoundOver()) {
                scope[t]++;
                mv.scopa = true;
            }
        } else {
            table.add(card);
        }
        lastMove = mv;

        turn = (turn + 1) % n;
        if (allHandsEmpty()) {
            if (!deck.isEmpty()) dealHands();
            else endRound();
        }
        return null;
    }

    private boolean allHandsEmpty() {
        for (List<Integer> h : hands) if (!h.isEmpty()) return false;
        return true;
    }

    private boolean isRoundOver() { return deck.isEmpty() && allHandsEmpty(); }

    // ------------------------------------------------------------------ scoring

    private void endRound() {
        if (!table.isEmpty() && lastCapturer >= 0) {
            int t = team(lastCapturer);
            lastMove.sweep = toArray(table);
            lastMove.sweepTeam = t;
            piles.get(t).addAll(table);
            table.clear();
        }
        TeamResult[] res = new TeamResult[nTeams];
        int[] cards = new int[nTeams], den = new int[nTeams], prim = new int[nTeams];
        for (int t = 0; t < nTeams; t++) {
            TeamResult r = new TeamResult();
            int[] best = new int[4];
            for (int c : piles.get(t)) {
                r.cards++;
                if (Card.suit(c) == Card.DENARI) r.denari++;
                if (c == Card.SETTEBELLO) r.settebello = true;
                best[Card.suit(c)] = Math.max(best[Card.suit(c)], Card.prime(c));
            }
            r.primiera = best[0] + best[1] + best[2] + best[3];
            r.scope = scope[t];
            if (cfg.napola) r.napola = napola(piles.get(t));
            cards[t] = r.cards; den[t] = r.denari; prim[t] = r.primiera;
            res[t] = r;
        }
        int w;
        if ((w = uniqueMax(cards)) >= 0) res[w].ptCards = 1;
        if ((w = uniqueMax(den)) >= 0) res[w].ptDenari = 1;
        if ((w = uniqueMax(prim)) >= 0) res[w].ptPrimiera = 1;
        int[] pts = new int[nTeams];
        for (int t = 0; t < nTeams; t++) {
            TeamResult r = res[t];
            if (r.settebello) r.ptSettebello = 1;
            r.total = r.ptCards + r.ptDenari + r.ptSettebello + r.ptPrimiera + r.scope + r.napola;
            totals[t] += r.total;
            pts[t] = r.total;
        }
        history.add(pts);
        lastResult = res;
        dealer = (dealer + 1) % n;
        int top = uniqueMax(totals);
        if (top >= 0 && totals[top] >= cfg.target) {
            winner = top;
            phase = Phase.GAME_OVER;
        } else {
            phase = Phase.ROUND_END;
        }
    }

    /** Napola: ace, 2 and 3 of Denari = 3 points, +1 for each further consecutive Denari card. */
    static int napola(List<Integer> pile) {
        int len = 0;
        for (int r = 1; r <= 10; r++) {
            if (pile.contains(Card.id(Card.DENARI, r))) len++;
            else break;
        }
        return len >= 3 ? len : 0;
    }

    static int uniqueMax(int[] v) {
        int best = -1, idx = -1;
        boolean tie = false;
        for (int i = 0; i < v.length; i++) {
            if (v[i] > best) { best = v[i]; idx = i; tie = false; }
            else if (v[i] == best) tie = true;
        }
        return tie ? -1 : idx;
    }

    public void nextRound() {
        if (phase == Phase.ROUND_END) startRound();
    }

    static int[] toArray(List<Integer> l) {
        int[] a = new int[l.size()];
        for (int i = 0; i < a.length; i++) a[i] = l.get(i);
        return a;
    }
}
