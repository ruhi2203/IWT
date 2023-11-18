const SERVER_URL = 'http://localhost/personal_diary/server.php';

document.getElementById('saveButton').addEventListener('click', saveEntry);
document.getElementById('loadButton').addEventListener('click', loadEntries);
document.getElementById('applyFilterSort').addEventListener('click', applyFilterSort);

function saveEntry() {
    var entryText = document.getElementById('entry').value.trim();

    if (entryText === "") {
        alert("Please write something in your diary before saving.");
        return;
    }

    var currentDateTime = new Date();
    var formattedDateTime = formatDateTime(currentDateTime);

    var entry = {
        dateTime: formattedDateTime,
        text: entryText,
    };

    fetch(`${SERVER_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
    })
    .then(response => response.json())
    .then(message => {
        console.log(message);

        // After saving, load and display the updated entries
        loadEntries();
        
        // Optionally update the UI or provide user feedback
    })
    .catch(error => console.error('Error saving entry:', error));
}

function loadEntries() {
    fetch(`${SERVER_URL}`)
        .then(response => response.json())
        .then(entries => {
            console.log(entries);

            // Update the UI with the loaded entries
            displayEntries(entries);
        })
        .catch(error => console.error('Error loading entries:', error));
}

function displayEntries(entries) {
    var diaryElement = document.getElementById('diary');
    
    // Clear the existing entries
    diaryElement.innerHTML = '';

    // Iterate over entries in reverse order (most recent first)
    for (let i = entries.length - 1; i >= 0; i--) {
        var entry = entries[i];
        var entryHtml = '<div class="diary-entry" onclick="openEntryPage(' + i + ')"><strong>' + entry.dateTime + '</strong><p>' + entry.text + '</p></div>';
        diaryElement.innerHTML += entryHtml;
    }
}
function openEntryPage(entryIndex) {
    // Retrieve the selected entry
    var selectedEntry = entries[entryIndex];

    // Save the selected entry to localStorage for use in the entry page
    localStorage.setItem('selectedEntry', JSON.stringify(selectedEntry));

    // Open the entry.html page in a new tab or window
    window.open('entry.html');
}

function applyFilterSort() {
    // Load entries with applied filter and sort
    
    fetch(`${SERVER_URL}`)
        .then(response => response.json())
        .then(entries => {
            console.log(entries);

            // Apply filter and sort before updating the UI with the loaded entries
            const sortOption = document.getElementById('sort').value;
            const filteredAndSortedEntries = applyFilterAndSort(entries);
            if (sortOption === 'recent'){
            displayEntries(filteredAndSortedEntries);}
            else{
                displayLeastRecentEntries(filteredAndSortedEntries); 
            }
        })
        .catch(error => console.error('Error applying filter and sort:', error));
}

function applyFilterAndSort(entries) {
    const filterText = document.getElementById('filter').value.toLowerCase();
    const sortOption = document.getElementById('sort').value;

    // Apply filter based on content
    const filteredEntries = entries.filter(entry => entry.text.toLowerCase().includes(filterText));

    // Apply sort based on date
    const sortedEntries = filteredEntries;

    return sortedEntries;
}

function sortEntries(entries, sortOption) {
    const sortedEntries = [...entries];

    sortedEntries.sort((a, b) => {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();

        if (sortOption === 'recent') {
            return dateB - dateA; // Most recent first
        } else {
            return dateA - dateB; // Least recent first
        }
    });

    return sortedEntries;
}


function formatDateTime(dateTime) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return dateTime.toLocaleDateString('en-US', options);
}
function displayMostRecentEntries(entries) {
    var diaryElement = document.getElementById('diary');

    // Clear the existing entries
    diaryElement.innerHTML = '';

    // Iterate over entries in reverse order (most recent first)
    for (let i = entries.length - 1; i >= 0; i--) {
        var entry = entries[i];
        var entryHtml = '<div class="diary-entry" onclick="openEntryPage(' + i + ')"><strong>' + entry.dateTime + '</strong><p>' + entry.text + '</p></div>';
        diaryElement.innerHTML += entryHtml;
    }
}
function displayLeastRecentEntries(entries) {
    var diaryElement = document.getElementById('diary');

    // Clear the existing entries
    diaryElement.innerHTML = '';

    // Iterate over entries in normal order (least recent first)
    for (let i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var entryHtml = '<div class="diary-entry" onclick="openEntryPage(' + i + ')"><strong>' + entry.dateTime + '</strong><p>' + entry.text + '</p></div>';
        diaryElement.innerHTML += entryHtml;
    }
}
