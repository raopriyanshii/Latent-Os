#!/usr/bin/env bash
# Reassembles data/transactions.csv from a header file plus numbered chunk
# parts (produced by `split`), in the exact order they were split.
#
# Usage:
#   scripts/reassemble_transactions.sh <uploads_dir> <output_csv>
#
# Expects in <uploads_dir>: one file matching *transactions_header*.csv and
# one or more files matching *transactions_part_*.csv, numbered so that
# lexicographic sort == correct order (e.g. transactions_part_00.csv,
# transactions_part_01.csv, ...).
set -euo pipefail

UPLOADS_DIR="${1:?usage: reassemble_transactions.sh <uploads_dir> <output_csv>}"
OUT_CSV="${2:?usage: reassemble_transactions.sh <uploads_dir> <output_csv>}"

HEADER_FILE=$(find "$UPLOADS_DIR" -iname "*transactions_header*.csv" | head -n 1)
if [[ -z "$HEADER_FILE" ]]; then
  echo "No transactions_header*.csv found in $UPLOADS_DIR" >&2
  exit 1
fi

mapfile -t PARTS < <(find "$UPLOADS_DIR" -iname "*transactions_part_*.csv" | sort)
if [[ ${#PARTS[@]} -eq 0 ]]; then
  echo "No transactions_part_*.csv files found in $UPLOADS_DIR" >&2
  exit 1
fi

echo "Header: $HEADER_FILE"
echo "Parts (${#PARTS[@]}), in order:"
printf '  %s\n' "${PARTS[@]}"

cat "$HEADER_FILE" "${PARTS[@]}" > "$OUT_CSV"

ROWS=$(($(wc -l < "$OUT_CSV") - 1))
echo "Wrote $OUT_CSV"
echo "Data rows: $ROWS (expected 590742)"
if [[ "$ROWS" -ne 590742 ]]; then
  echo "WARNING: row count does not match the README's documented 590,742 rows." >&2
fi
