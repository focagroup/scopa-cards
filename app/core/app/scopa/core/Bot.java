package app.scopa.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/** Simple heuristic bots. Level 0 = easy, 1 = normal, 2 = hard. */
public final class Bot {

    public static final class Choice {
        public final int card;
        public final int[] capture;
        Choice(int card, int[] capture) { this.card = card; this.capture = capture; }
    }

    private Bot() {}

    public static Choice choose(Game g, int seat, int level, Random rng) {
        List<Integer> hand = g.hands.get(seat);
        List<Choice> moves = new ArrayList<>();
        for (int c : hand) {
            List<int[]> opts = g.options(c);
            if (opts.isEmpty()) moves.add(new Choice(c, new int[0]));
            else for (int[] o : opts) moves.add(new Choice(c, o));
        }
        if (level <= 0 && rng.nextInt(100) < 45) return moves.get(rng.nextInt(moves.size()));

        int[] unseen = unseenByRank(g, seat);
        int unseenTotal = 0;
        for (int k : unseen) unseenTotal += k;
        int nextSeat = (seat + 1) % g.n;
        int oppHand = g.hands.get(nextSeat).size();
        if (oppHand == 0 && !g.deck.isEmpty()) oppHand = 3;

        Choice best = null;
        double bestV = -1e9;
        for (Choice m : moves) {
            double v = evaluate(g, m, level, unseen, unseenTotal, oppHand);
            if (level >= 1) v += rng.nextDouble() * 0.05;
            else v += rng.nextDouble() * 1.5;
            if (v > bestV) { bestV = v; best = m; }
        }
        return best;
    }

    private static double cardWorth(int c) {
        double v = 1.0;
        if (Card.suit(c) == Card.DENARI) v += 1.2;
        if (c == Card.SETTEBELLO) v += 6;
        int r = Card.rank(c);
        if (r == 7) v += 2.5;
        else if (r == 6) v += 1.2;
        else if (r == 1) v += 0.8;
        return v;
    }

    private static double evaluate(Game g, Choice m, int level, int[] unseen, int unseenTotal, int oppHand) {
        double v = 0;
        List<Integer> rest = new ArrayList<>(g.table);
        boolean lastPlay = g.deck.isEmpty();
        for (List<Integer> h : g.hands) if (h.size() > (h.contains(m.card) ? 1 : 0)) lastPlay = false;
        if (m.capture.length > 0) {
            v += 0.5 + cardWorth(m.card);
            for (int c : m.capture) { v += cardWorth(c); rest.remove(Integer.valueOf(c)); }
            if (rest.isEmpty() && !lastPlay) v += 12;
        } else {
            v -= cardWorth(m.card) * 0.8;
            rest.add(m.card);
        }
        if (level >= 1 && !rest.isEmpty() && !lastPlay) {
            // Risk that the next (opponent) player sweeps the table.
            int s = 0;
            for (int c : rest) s += Card.rank(c);
            int need;
            if (g.cfg.variant == Game.Variant.CLASSIC) {
                need = s;
                if (rest.size() > 1) for (int c : rest) if (Card.rank(c) == s) need = -1; // single match takes priority
            } else {
                need = 15 - s;
            }
            if (need >= 1 && need <= 10) {
                double p = unseenTotal == 0 ? 0 : Math.min(1.0, unseen[need] * (double) oppHand / unseenTotal);
                double loss = 10;
                for (int c : rest) loss += cardWorth(c) * 0.5;
                v -= p * loss;
            }
            if (level >= 2) {
                // Exposure of valuable cards left on the table to any capture.
                for (int c : rest) {
                    double w = cardWorth(c);
                    if (w > 2) v -= w * 0.25;
                }
            }
        }
        return v;
    }

    /** Cards this seat cannot see (other hands + deck), counted per rank. */
    private static int[] unseenByRank(Game g, int seat) {
        boolean[] seen = new boolean[40];
        for (int c : g.hands.get(seat)) seen[c] = true;
        for (int c : g.table) seen[c] = true;
        for (List<Integer> p : g.piles) for (int c : p) seen[c] = true;
        int[] out = new int[11];
        for (int c = 0; c < 40; c++) if (!seen[c]) out[Card.rank(c)]++;
        return out;
    }
}
