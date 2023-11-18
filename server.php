<?php
header('Content-Type: application/json');

$entriesPath = 'entries.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save entry
    $entry = json_decode(file_get_contents('php://input'), true);
    saveEntry($entry);
    echo json_encode(['message' => 'Entry saved successfully']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Load entries
    $entries = loadEntries();
    echo json_encode($entries);
}

function saveEntry($entry) {
    $existingEntries = json_decode(file_get_contents($GLOBALS['entriesPath']), true) ?? [];
    $existingEntries[] = $entry;
    file_put_contents($GLOBALS['entriesPath'], json_encode($existingEntries));
}

function loadEntries() {
    return json_decode(file_get_contents($GLOBALS['entriesPath']), true) ?? [];
}
?>
