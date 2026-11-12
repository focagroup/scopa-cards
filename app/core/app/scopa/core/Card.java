package app.scopa.core;

/**
 * Cards are plain ints 0..39: id = suit * 10 + (rank - 1).
 * Suits (Napoletane): 0 Denari, 1 Coppe, 2 Spade, 3 Bastoni.
 * Ranks 1..10, where 8 = Fante, 9 = Cavallo, 10 = Re.
 */
public final class Card {
    public static final int DENARI = 0, COPPE = 1, SPADE = 2, BASTONI = 3;
    public static final int SETTEBELLO = id(DENARI, 7);

    /** Primiera values indexed by rank. */
    private static final int[] PRIME = {0, 16, 12, 13, 14, 15, 18, 21, 10, 10, 10};

    private Card() {}

    public static int suit(int id) { return id / 10; }
    public static int rank(int id) { return id % 10 + 1; }
    public static int id(int suit, int rank) { return suit * 10 + rank - 1; }
    public static int prime(int id) { return PRIME[rank(id)]; }
}
