#!/bin/sh
set -e

echo "Starting runtime environment variable replacement..."

# Escaneia a pasta .next inteira
TARGET_DIR=.next
echo "Scanning directory: $TARGET_DIR for placeholders..."

FILES=$(grep -rl "__NEXT_PUBLIC_" $TARGET_DIR)

if [ -z "$FILES" ]; then
  echo "Warning: No files containing placeholders were found in $TARGET_DIR."
else
  echo "Found placeholder files. Processing..."
  
  for file in $FILES; do
    if [ -f "$file" ]; then
      
      # --- APENAS UMA LINHA DE SUBSTITUIÇÃO ---
      sed -i "s|__NEXT_PUBLIC_API_URL_PLACEHOLDER__|${NEXT_PUBLIC_API_URL}|g" "$file"
      
    fi
  done
  
  echo "Replacement complete."
fi

# Executa o comando original (npm start)
echo "Starting Next.js..."
exec "$@"