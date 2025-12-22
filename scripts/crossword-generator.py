"""
generate_crossword.py
---------------------

This script generates simple crossword layouts for a list of word sets.  It
implements a very basic crossword construction algorithm inspired by
the iterative placement approach described by Baeldung【949133641838950†L61-L116】.  For each set of words, it
attempts to place the longest words first on a two‑dimensional grid, allowing
words to cross when they share common letters.  When no crossing placement
is possible for a word, the script positions it away from existing words.

Once the grid has been constructed, the script randomly selects four letter
positions to use as clue squares.  In the final JSON representation, only
these clue squares reveal their letters; all other crossword cells remain
empty strings, and holes outside the placed words are represented as null.

Usage: run this file as a script (`python generate_crossword.py`) to print
the resulting JSON to stdout.  It requires no external dependencies.
"""

import json
import random
import unicodedata
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple


def remove_accents_keep_ene(text: str) -> str:
    """Remove diacritics but keep Ñ/ñ intact."""
    cleaned_chars: List[str] = []
    for char in text:
        if char in ("ñ", "Ñ"):
            cleaned_chars.append(char)
            continue
        decomposed = unicodedata.normalize("NFD", char)
        filtered = "".join(c for c in decomposed if unicodedata.category(c) != "Mn")
        cleaned_chars.append(filtered)
    normalized = "".join(cleaned_chars)
    return unicodedata.normalize("NFC", normalized)


def normalize_display_word(word: str) -> str:
    """Return the uppercase version without accents (Ñ preserved)."""
    return remove_accents_keep_ene(word).upper()


def normalize_lookup_key(word: str) -> str:
    """Return the lowercase version without accents (Ñ preserved)."""
    return remove_accents_keep_ene(word).lower()


@dataclass
class Placement:
    """Represents the placement of a word on the grid."""
    word: str
    row: int
    col: int
    direction: str  # 'horizontal' or 'vertical'


class CrosswordGenerator:
    """Simple crossword generator using iterative placement."""

    def __init__(self, seed: Optional[int] = None) -> None:
        # Use a deterministic seed for reproducibility if provided
        self.random = random.Random(seed)

    def generate(self, words: List[str]) -> Tuple[Dict[Tuple[int, int], str], List[Placement]]:
        """Generate a crossword layout from a list of words.

        Args:
            words: List of words to place (strings).  Words should be uppercase or
                   lower‑case; matching is case‑insensitive but letters are stored
                   as upper‑case.

        Returns:
            A tuple containing a dictionary mapping grid coordinates (row, col)
            to letters, and a list of `Placement` records describing where each
            word was placed.
        """
        # Make a copy of the words list and sort by length descending
        words_sorted = sorted(words, key=lambda w: len(w), reverse=True)
        # Use normalized uppercase letters (without accents) for the grid
        normalized_words = [normalize_display_word(w) for w in words_sorted]

        grid: Dict[Tuple[int, int], str] = {}
        placements: List[Placement] = []

        # Place the first word horizontally starting at (0, 0)
        first_word = normalized_words[0]
        for idx, ch in enumerate(first_word):
            grid[(0, idx)] = ch
        placements.append(Placement(word=first_word, row=0, col=0, direction="horizontal"))

        # Track current extents of the grid to help position stray words
        min_row = 0
        max_row = 0
        min_col = 0
        max_col = len(first_word) - 1

        # Attempt to place the remaining words
        for word in normalized_words[1:]:
            best_candidate = None
            best_overlap = -1
            # Iterate over each letter in the word
            for i, letter in enumerate(word):
                # Find positions in the grid where this letter appears
                for (r, c), existing_letter in grid.items():
                    if existing_letter != letter:
                        continue
                    # Try horizontal placement at this intersection
                    row_h = r
                    col_h = c - i
                    overlap_h, ok_h = self._check_can_place(grid, word, row_h, col_h, 'horizontal')
                    if ok_h and overlap_h > best_overlap:
                        best_overlap = overlap_h
                        best_candidate = ('horizontal', row_h, col_h)
                    # Try vertical placement at this intersection
                    row_v = r - i
                    col_v = c
                    overlap_v, ok_v = self._check_can_place(grid, word, row_v, col_v, 'vertical')
                    if ok_v and overlap_v > best_overlap:
                        best_overlap = overlap_v
                        best_candidate = ('vertical', row_v, col_v)
            # If we found a valid intersecting placement, use it
            if best_candidate is not None:
                direction, row, col = best_candidate
                self._place_word(grid, word, row, col, direction)
                placements.append(Placement(word=word, row=row, col=col, direction=direction))
                # Update extents
                if direction == 'horizontal':
                    min_row = min(min_row, row)
                    max_row = max(max_row, row)
                    min_col = min(min_col, col)
                    max_col = max(max_col, col + len(word) - 1)
                else:  # vertical
                    min_row = min(min_row, row)
                    max_row = max(max_row, row + len(word) - 1)
                    min_col = min(min_col, col)
                    max_col = max(max_col, col)
            else:
                # No crossing possible – place the word away from existing words
                # Determine new position: horizontally in a new row below current extents
                new_row = max_row + 2
                new_col = min_col
                self._place_word(grid, word, new_row, new_col, 'horizontal')
                placements.append(Placement(word=word, row=new_row, col=new_col, direction='horizontal'))
                # Update extents
                min_row = min(min_row, new_row)
                max_row = max(max_row, new_row)
                min_col = min(min_col, new_col)
                max_col = max(max_col, new_col + len(word) - 1)

        return grid, placements

    def _check_can_place(self, grid: Dict[Tuple[int, int], str], word: str, row: int, col: int, direction: str) -> Tuple[int, bool]:
        """Check if a word can be placed at the given position and direction.

        Returns a tuple of (overlap_count, can_place) indicating how many letters
        would overlap with existing letters (overlap_count) and whether the
        placement is valid (can_place).  A placement is valid if no conflicting
        letters occur (i.e., existing letters match the word at intersecting
        cells).
        """
        overlap = 0
        for i, ch in enumerate(word):
            r = row + i if direction == 'vertical' else row
            c = col + i if direction == 'horizontal' else col
            existing = grid.get((r, c))
            if existing is not None:
                if existing != ch:
                    return 0, False  # conflict
                overlap += 1
        return overlap, True

    def _place_word(self, grid: Dict[Tuple[int, int], str], word: str, row: int, col: int, direction: str) -> None:
        """Place a word on the grid at the given starting position and direction."""
        for i, ch in enumerate(word):
            r = row + i if direction == 'vertical' else row
            c = col + i if direction == 'horizontal' else col
            grid[(r, c)] = ch


def build_json_structures(word_sets: List[List[str]], emoji_map: Dict[str, str], seed: Optional[int] = 42) -> List[Dict]:
    """Build the JSON structures for each crossword.

    Args:
        word_sets: List of word lists for each crossword (case‑sensitive Spanish words).
        emoji_map: Mapping from words (case‑insensitive) to their emoji representations.
        seed: Random seed for reproducible clue selection.

    Returns:
        List of dictionaries ready to be serialized as JSON.
    """
    generator = CrosswordGenerator(seed)
    json_crosswords: List[Dict] = []
    for idx, words in enumerate(word_sets, start=1):
        grid, placements = generator.generate(words)
        # Determine bounding rectangle
        rows = [r for (r, _) in grid.keys()]
        cols = [c for (_, c) in grid.keys()]
        min_row, max_row = min(rows), max(rows)
        min_col, max_col = min(cols), max(cols)
        n_rows = max_row - min_row + 1
        n_cols = max_col - min_col + 1
        # Normalize placements to new origin
        normalized_words = []
        for placement in placements:
            norm_row = placement.row - min_row
            norm_col = placement.col - min_col
            emoji_key = normalize_lookup_key(placement.word)
            emoji = emoji_map.get(emoji_key, None)
            normalized_words.append({
                'word': placement.word.upper(),
                'emoji': emoji,
                'startRow': norm_row,
                'startCol': norm_col,
                'direction': placement.direction,
                'clueNumber': len(normalized_words) + 1,
            })
        # Prepare grid with holes represented as null and clue letters uppercase
        # Select four random clue positions from all letter cells
        letter_positions = list(grid.keys())
        clue_positions = set(generator.random.sample(letter_positions, min(4, len(letter_positions))))
        # Build the grid rows
        final_grid: List[List[Optional[str]]] = []
        for r in range(n_rows):
            row_list: List[Optional[str]] = []
            for c in range(n_cols):
                abs_row = r + min_row
                abs_col = c + min_col
                if (abs_row, abs_col) in grid:
                    if (abs_row, abs_col) in clue_positions:
                        row_list.append(grid[(abs_row, abs_col)].upper())
                    else:
                        row_list.append("")
                else:
                    row_list.append(None)
            final_grid.append(row_list)
        crossword = {
            'id': f'pc-{idx}',
            'type': 'pictogram-crossword',
            'title': f'CRUCIGRAMA {idx}',
            'instructions': 'ESCRIBE EL NOMBRE DE CADA IMAGEN',
            'gridSize': {'rows': n_rows, 'cols': n_cols},
            'words': normalized_words,
            'grid': final_grid,
        }
        json_crosswords.append(crossword)
    return json_crosswords


def main() -> None:
    """Entry point: define word sets and emoji mappings, build JSON and print it."""
    # Define the eight sets of words extracted from the solutions (pages 19 and 20)
    word_sets: List[List[str]] = [
        ["gato", "cáctus", "globo", "pastel", "piña", "diamante", "rayo", "corazón"],
        ["unicornio", "foca", "elefante", "estrellas", "gato", "helado", "nube", "oso"],
        ["mensaje", "labios", "fresa", "helado", "llave", "pizza", "zapato", "corona"],
        ["galleta", "pastel", "leche", "zanahoria", "salchicha", "magdalena", "pizza", "manzana"],
        ["pirata", "botella", "tesoro", "cangrejo", "mapa", "medusa", "peces", "sirena"],
        ["bruja", "princesa", "castillo", "dragón", "espada", "príncipe", "manzana", "rana"],
        ["foca", "domador", "globos", "elefante", "payaso", "mono", "cañón", "carpa"],
        ["mochila", "calendario", "pizarra", "estuche", "cuadernos", "calculadora", "libros", "lápiz"],
    ]
    # Emoji map; keys are lowercase Spanish words (accents allowed)
    emoji_map = {
        'gato': '🐱', 'cactus': '🌵', 'globo': '🎈', 'pastel': '🍰', 'piña': '🍍', 'diamante': '💎', 'rayo': '⚡', 'corazón': '❤️',
        'unicornio': '🦄', 'foca': '🦭', 'elefante': '🐘', 'estrellas': '⭐', 'helado': '🍦', 'nube': '☁️', 'oso': '🐻',
        'mensaje': '💬', 'labios': '👄', 'fresa': '🍓', 'llave': '🔑', 'pizza': '🍕', 'zapato': '👟', 'corona': '👑',
        'galleta': '🍪', 'leche': '🥛', 'zanahoria': '🥕', 'salchicha': '🌭', 'magdalena': '🧁', 'manzana': '🍎',
        'pirata': '🏴‍☠️', 'botella': '🍾', 'tesoro': '💰', 'cangrejo': '🦀', 'mapa': '🗺️', 'medusa': '🪼', 'peces': '🐟', 'sirena': '🧜‍♀️',
        'bruja': '🧙‍♀️', 'princesa': '👸', 'castillo': '🏰', 'dragón': '🐉', 'espada': '🗡️', 'príncipe': '🤴', 'rana': '🐸',
        'domador': '🎩', 'globos': '🎈', 'payaso': '🤡', 'mono': '🐵', 'cañón': '💣', 'carpa': '🎪',
        'mochila': '🎒', 'calendario': '📆', 'pizarra': '📋', 'estuche': '🧰', 'cuadernos': '📒', 'calculadora': '🔢', 'libros': '📚', 'lápiz': '✏️',
    }
    # Normalize keys: remove accents for matching
    normalized_emoji_map: Dict[str, str] = {}
    for key, value in emoji_map.items():
        # Remove diacritics from key (but preserve ñ/Ñ)
        normalized_key = normalize_lookup_key(key)
        normalized_emoji_map[normalized_key] = value
    # Build JSON structures
    json_data = build_json_structures(word_sets, normalized_emoji_map, seed=42)
    # Print JSON
    print(json.dumps(json_data, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
