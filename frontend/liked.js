// Shows liked songs from localStorage and lets you remove/clear them.

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backToHomeFromLiked");
  const clearBtn = document.getElementById("clearLikedBtn");
  const container = document.getElementById("likedSongsContainer");

  // Back → index
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Load liked songs
  let likedSongs = [];
  try {
    const stored = localStorage.getItem("nexttrack-liked-songs");
    if (stored) likedSongs = JSON.parse(stored);
  } catch (e) {
    likedSongs = [];
  }

  function saveLikedSongs() {
    try {
      localStorage.setItem("nexttrack-liked-songs", JSON.stringify(likedSongs));
    } catch (e) {
      // ignore
    }
  }

  function renderList() {
    container.innerHTML = "";

    if (!likedSongs || likedSongs.length === 0) {
      if (clearBtn) clearBtn.style.display = "none";

      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "You haven't liked any songs yet. Go explore a vibe and hit the + button!";
      emptyMsg.className = "liked-empty-message";
      container.appendChild(emptyMsg);
      return;
    }

    if (clearBtn) clearBtn.style.display = "inline-flex";

    const list = document.createElement("ul");
    list.className = "liked-list";

    likedSongs.forEach((track, index) => {
      const li = document.createElement("li");
      li.className = "liked-row";

      const main = document.createElement("div");
      main.className = "liked-main";

      const titleEl = document.createElement("span");
      titleEl.className = "liked-title-text";
      titleEl.textContent = track.title;

      const artistEl = document.createElement("span");
      artistEl.className = "liked-artist-text";
      artistEl.textContent = track.artist;

      main.appendChild(titleEl);
      main.appendChild(artistEl);

      const meta = document.createElement("div");
      meta.className = "liked-meta";

      const mood = document.createElement("span");
      const moodText = track.mood
        ? track.mood.charAt(0).toUpperCase() + track.mood.slice(1)
        : "";
      mood.textContent = moodText;
      mood.className = "liked-mood";

      const bpm = document.createElement("span");
      bpm.textContent = `${track.tempo} BPM`;
      bpm.className = "liked-bpm";

      meta.appendChild(mood);
      meta.appendChild(bpm);

      const removeBtn = document.createElement("button");
      removeBtn.className = "liked-remove-btn pressable";
      removeBtn.type = "button";
      removeBtn.textContent = "✕";
      removeBtn.title = "Remove from liked songs";

      removeBtn.addEventListener("click", () => {
        likedSongs.splice(index, 1);
        saveLikedSongs();
        renderList();
      });

      li.appendChild(main);
      li.appendChild(meta);
      li.appendChild(removeBtn);

      list.appendChild(li);
    });

    container.appendChild(list);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      likedSongs = [];
      saveLikedSongs();
      renderList();
    });
  }

  renderList();
});
