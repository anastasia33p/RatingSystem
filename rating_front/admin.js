const API_BASE_URL = "http://localhost:8080";

// Проверка токена
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    let currentPage = 1;
    let currentSearch = null;

    // Initial fetch
    fetchLeaderboard({ page: currentPage });

    const searchForm = document.getElementById("search-player");
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const searchInput = document.querySelector("#search");
        const playerName = searchInput.value.trim();
        if (playerName.length === 0) {
            fetchLeaderboard();
            return;
        }
        if (playerName) {
            searchPlayers(playerName);
        }
    });

    const pageForm = document.getElementById("page-form");
    pageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const pageInput = document.querySelector("#page");
        const pageValue = parseInt(pageInput.value, 10);

        if (pageValue >= 1) {
            currentPage = pageValue;
            fetchLeaderboard({ searchQuery: currentSearch, page: currentPage });
        } else {
            console.error("Invalid page number");
        }
    });
});

async function fetchLeaderboard({ searchQuery = null, page = 1 } = {}) {
    try {
        let url = `${API_BASE_URL}/player/top?page=${page}`;
        if (searchQuery) {
            url = `${API_BASE_URL}/player/search?name=${encodeURIComponent(searchQuery)}&page=${page}`;
        }

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const players = await response.json();
        updateLeaderboardTable(players);
    } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
    }
}


function updateLeaderboardTable(players) {
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    players.forEach((player, index) => {
        const row = document.createElement("tr");

        const positionCell = document.createElement("td");
        positionCell.textContent = index + 1;
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

        const actionCell = document.createElement("td");

        // Кнопка редактирования
        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.addEventListener("click", () => openEditDialog(player));
        actionCell.appendChild(editButton);

        // Кнопка удаления
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener("click", () => deletePlayer(player.id));
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}

// Редактирование игрока
function openEditDialog(player) {
    const dialog = document.getElementById("editDialog");
    const editForm = document.getElementById("editForm");
    document.getElementById("editUsername").value = player.nickName;
    document.getElementById("editScore").value = player.score;
    document.getElementById("editLevel").value = player.level;

    dialog.classList.remove("hidden");

    editForm.onsubmit = async (event) => {
        event.preventDefault();
        const updatedPlayer = {
            id: player.id,
            nickName: document.getElementById("editUsername").value,
            score: parseInt(document.getElementById("editScore").value, 10),
            level: parseInt(document.getElementById("editLevel").value, 10),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/admin/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedPlayer),
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            dialog.classList.add("hidden");
            fetchLeaderboard(); // Обновление таблицы
        } catch (error) {
            console.error("Failed to update player:", error);
        }
    };

    document.getElementById("cancelEdit").addEventListener("click", () => {
        dialog.classList.add("hidden");
    });
}

// Удаление игрока
async function deletePlayer(playerId) {
    if (!confirm("Вы уверены, что хотите удалить игрока?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/delete?id=${playerId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        fetchLeaderboard(); // Обновление таблицы
    } catch (error) {
        console.error("Failed to delete player:", error);
    }
}

// Поиск игроков
async function searchPlayers(name) {
    try {
        const url = `${API_BASE_URL}/player/search?name=${encodeURIComponent(name)}`;
        const response = await fetch(url, {
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const players = await response.json();
        updateLeaderboardTable(players);
    } catch (error) {
        console.error("Failed to search players:", error);
    }
}
