#!/bin/bash
# scripts/check.sh
# run all checks in one step before pushing

set -euo pipefail

echo "Running ESLint..."
cd ..
npx ng lint

echo "Type checking..."
npx tsc --noEmit

echo "All checks passed."