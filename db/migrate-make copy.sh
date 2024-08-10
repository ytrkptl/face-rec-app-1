#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Log file location
LOG_FILE="migration_errors.log"

# Function to handle errors and log them
handle_error() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - An error occurred while running the script." >> "$LOG_FILE"
  exit 1
}

# Trap errors and call the handle_error function
trap 'handle_error' ERR

# Redirect all stderr to the log file but also print it to the console
exec 2> >(tee -a "$LOG_FILE")

# Check if a migration name is provided
if [ -z "$1" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Please provide a migration name" >> "$LOG_FILE"
  exit 1
fi

MIGRATION_NAME=$1
MIGRATIONS_DIR="./migrations"

# Check if the migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Migrations directory does not exist" >> "$LOG_FILE"
  exit 1
fi

# Search for files that include the provided name
MATCHING_FILES=$(ls "$MIGRATIONS_DIR" | grep "$MIGRATION_NAME")

if [ -z "$MATCHING_FILES" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') - No matching files found" >> "$LOG_FILE"
else
  echo "Matching files:"
  echo "$MATCHING_FILES"
fi

# Run the migration command
if ! npx knex migrate:make --stub ./stubs/migration_stub.mjs "$MIGRATION_NAME"; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Failed to run migration command for $MIGRATION_NAME" >> "$LOG_FILE"
  exit 1
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') - Migration command executed successfully." >> "$LOG_FILE"
