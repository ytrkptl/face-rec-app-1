#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Log file location
LOG_FILE="migration_errors.log"

# Function to display a link to the log file
display_log_file_link() {
  echo "Please check the log file (located in this same directory) for more details: ./$LOG_FILE"
}

# Function to handle errors and log them
handle_error() {
  echo "An error occurred while running the script."
  echo "$(date '+%Y-%m-%d %H:%M:%S') - An error occurred while running the script." >> "$LOG_FILE"
  # call the display_log_file_link function
  display_log_file_link
  exit 1
}

# Trap errors and call the handle_error function
trap 'handle_error' ERR

# Redirect all stderr to the log file but also print it to the console
exec 2> >(tee -a "$LOG_FILE")

# Check if a migration name is provided
if [ -z "$1" ]; then
  echo "Please provide a migration name"
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Please provide a migration name" >> "$LOG_FILE"
  # Call the display_log_file_link function
  display_log_file_link
  exit 1
fi

MIGRATION_NAME=$1
MIGRATIONS_DIR="./migrations"

# Check if the migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Migrations directory does not exist"
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Migrations directory does not exist" >> "$LOG_FILE"
  # Call the display_log_file_link function
  display_log_file_link
  exit 1
fi

# Function to search for files that include the provided name
search_matching_files() {
  # Search for files that include the provided name
  MATCHING_FILES=$(ls $MIGRATIONS_DIR | grep "$MIGRATION_NAME")

  if [ -z "$MATCHING_FILES" ]; then
    echo "No matching files found"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - No matching files found" >> "$LOG_FILE"
  else
    # Log the matching files
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Matching files: $MATCHING_FILES" >> "$LOG_FILE"
    echo "The following migrations with similar names already exist: ./migrations/$MATCHING_FILES"
    exit 1
  fi
}

# Call the search_matching_files function
search_matching_files

# Run the migration command
if ! npx knex migrate:make --stub ./stubs/migration_stub.mjs "$MIGRATION_NAME"; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Failed to run migration command for $MIGRATION_NAME" >> "$LOG_FILE"
  # Call the display_log_file_link function
  display_log_file_link
  exit 1
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') - Migration command executed successfully." >> "$LOG_FILE"
echo "Don't forget to delete the following log file: ./$LOG_FILE"

# for displaying a link to the migrations file
search_matching_files

# Exit the script with a success status
exit 0

