const API_BASE_URL = "http://localhost:8080/player";

// Function to fetch leaderboard data with optional sort, search, and pagination
async function fetchLeaderboard({ sortBy = null, searchQuery = null, page = 1 } = {}) {
    try {
        let url = `${API_BASE_URL}/top?page=${page}`;
        if (sortBy) url += `&by=${sortBy}`;
        if (searchQuery) url = `${API_BASE_URL}/search?name=${encodeURIComponent(searchQuery)}&page=${page}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const players = await response.json();
        updateLeaderboardTable(players);
    } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
    }
}

// Function to update the leaderboard table
function updateLeaderboardTable(players) {
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    players.forEach((player, index) => {
        const row = document.createElement("tr");

        const positionCell = document.createElement("td");
        positionCell.textContent = index + shownPage * 10 - 9;
        row.appendChild(positionCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = player.nickName;
        row.appendChild(nameCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = player.score;
        row.appendChild(scoreCell);

        const levelCell = document.createElement("td");
        levelCell.textContent = player.level;
        row.appendChild(levelCell);

        tableBody.appendChild(row);
    });
}

let shownPage = 1;

// Event listeners for search, sort, and pagination
document.addEventListener("DOMContentLoaded", () => {
    let currentSort = null;
    let currentSearch = null;
    let currentPage = 1;

    // Initial fetch
    fetchLeaderboard({});

    const searchForm = document.getElementById("search-player");
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const searchInput = document.querySelector("#search");
        const playerName = searchInput.value.trim();

        currentSearch = playerName || null;
        currentPage = 1; // Reset to page 1 on new search
        fetchLeaderboard({ sortBy: currentSort, searchQuery: currentSearch, page: currentPage });
    });

    const sortForm = document.getElementById("sort-filter");
    sortForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const sortSelect = document.querySelector("#sort");
        currentSort = sortSelect.value;
        currentPage = 1; // Reset to page 1 on new sort
        fetchLeaderboard({ sortBy: currentSort, searchQuery: currentSearch, page: currentPage });
    });

    const pageForm = document.getElementById("page-form");
    pageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const pageInput = document.querySelector("#page");
        const pageValue = parseInt(pageInput.value, 10);

        if (pageValue >= 1) {
            currentPage = pageValue;
            shownPage = pageValue;
            fetchLeaderboard({ sortBy: currentSort, searchQuery: currentSearch, page: currentPage });
        } else {
            console.error("Invalid page number");
        }
    });
});
