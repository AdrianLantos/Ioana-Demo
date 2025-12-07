<?php
/**
 * Environment Configuration Loader
 * Loads environment variables from .env file
 */

/**
 * Load environment variables from .env file
 */
function loadEnv($path = __DIR__ . '/.env') {
    if (!file_exists($path)) {
        // If .env doesn't exist, use default values
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Parse KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Remove quotes if present
            $value = trim($value, '"\'');

            // Set as environment variable
            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
    }
}

/**
 * Get environment variable with optional default
 */
function env($key, $default = null) {
    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    }

    $value = getenv($key);
    return $value !== false ? $value : $default;
}

// Load environment variables
loadEnv();
