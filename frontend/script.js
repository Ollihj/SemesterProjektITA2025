// Track list based on your short-tracks.csv
const tracks = [
  { id: 7399,  title: "Blinding Lights",           artist: "The Weeknd",                        duration: 15523, energy_level: 8, tempo: 171, mood: "energetic",   is_instrumental: false, activity_fit: ["gym","party","running"] },
  { id: 4733,  title: "Shape of You",              artist: "Ed Sheeran",                        duration: 16697, energy_level: 7, tempo: 96,  mood: "happy",       is_instrumental: false, activity_fit: ["party","cafe","home"] },
  { id: 4256,  title: "Uptown Funk",               artist: "Mark Ronson ft. Bruno Mars",        duration: 26310, energy_level: 9, tempo: 115, mood: "energetic",   is_instrumental: false, activity_fit: ["party","gym","running"] },
  { id: 8642,  title: "Closer",                    artist: "The Chainsmokers ft. Halsey",       duration: 22826, energy_level: 6, tempo: 95,  mood: "happy",       is_instrumental: false, activity_fit: ["party","cafe"] },
  { id: 4714,  title: "Levitating",                artist: "Dua Lipa",                          duration: 22575, energy_level: 8, tempo: 103, mood: "energetic",   is_instrumental: false, activity_fit: ["party","gym","running"] },
  { id: 9927,  title: "Drivers License",           artist: "Olivia Rodrigo",                    duration: 29948, energy_level: 3, tempo: 144, mood: "sad",         is_instrumental: false, activity_fit: ["home","study"] },
  { id: 7777,  title: "Bad Guy",                   artist: "Billie Eilish",                     duration: 25582, energy_level: 7, tempo: 135, mood: "energetic",   is_instrumental: false, activity_fit: ["party","gym"] },
  { id: 1080,  title: "Happier Than Ever",         artist: "Billie Eilish",                     duration: 25866, energy_level: 4, tempo: 120, mood: "sad",         is_instrumental: false, activity_fit: ["home","study","cafe"] },
  { id: 9901,  title: "Dance Monkey",              artist: "Tones and I",                       duration: 17861, energy_level: 8, tempo: 98,  mood: "happy",       is_instrumental: false, activity_fit: ["party","gym"] },
  { id: 9433,  title: "Old Town Road",             artist: "Lil Nas X",                         duration: 19109, energy_level: 7, tempo: 136, mood: "happy",       is_instrumental: false, activity_fit: ["party","running"] },
  { id: 5083,  title: "Watermelon Sugar",          artist: "Harry Styles",                      duration: 29419, energy_level: 7, tempo: 95,  mood: "happy",       is_instrumental: false, activity_fit: ["party","cafe","home"] },
  { id: 7030,  title: "Sunflower",                 artist: "Post Malone & Swae Lee",           duration: 24604, energy_level: 6, tempo: 90,  mood: "happy",       is_instrumental: false, activity_fit: ["cafe","home"] },
  { id: 7554,  title: "Peaches",                   artist: "Justin Bieber",                     duration: 21548, energy_level: 6, tempo: 90,  mood: "happy",       is_instrumental: false, activity_fit: ["party","cafe"] },
  { id: 6818,  title: "Save Your Tears",           artist: "The Weeknd",                        duration: 17298, energy_level: 7, tempo: 118, mood: "happy",       is_instrumental: false, activity_fit: ["party","running"] },
  { id: 6718,  title: "Stay",                      artist: "The Kid LAROI & Justin Bieber",    duration: 24961, energy_level: 8, tempo: 170, mood: "energetic",   is_instrumental: false, activity_fit: ["party","gym","running"] },
  { id: 4843,  title: "As It Was",                 artist: "Harry Styles",                      duration: 16963, energy_level: 6, tempo: 174, mood: "happy",       is_instrumental: false, activity_fit: ["party","running"] },
  { id: 2577,  title: "Anti-Hero",                 artist: "Taylor Swift",                      duration: 17042, energy_level: 5, tempo: 97,  mood: "happy",       is_instrumental: false, activity_fit: ["cafe","home"] },
  { id: 9045,  title: "Good 4 U",                  artist: "Olivia Rodrigo",                    duration: 16917, energy_level: 9, tempo: 164, mood: "energetic",   is_instrumental: false, activity_fit: ["party","gym","running"] },
  { id: 4836,  title: "Montero (Call Me By Your Name)", artist: "Lil Nas X",                    duration: 22671, energy_level: 8, tempo: 179, mood: "energetic",   is_instrumental: false, activity_fit: ["party","gym"] },
  { id: 9610,  title: "Shivers",                   artist: "Ed Sheeran",                        duration: 21722, energy_level: 7, tempo: 141, mood: "happy",       is_instrumental: false, activity_fit: ["party","running"] },
  { id: 1001,  title: "Clair de Lune",             artist: "Claude Debussy",                    duration: 18000, energy_level: 2, tempo: 60,  mood: "calm",        is_instrumental: true,  activity_fit: ["study","home","cafe"] },
  { id: 1002,  title: "Gymnopédie No.1",           artist: "Erik Satie",                        duration: 21000, energy_level: 1, tempo: 70,  mood: "calm",        is_instrumental: true,  activity_fit: ["study","home","cafe"] },
  { id: 1003,  title: "Lo-Fi Study Beats",         artist: "ChilledCow",                        duration: 24000, energy_level: 3, tempo: 85,  mood: "calm",        is_instrumental: true,  activity_fit: ["study","cafe"] },
  { id: 1004,  title: "Ambient Meditation",        artist: "Deep Focus",                        duration: 30000, energy_level: 1, tempo: 65,  mood: "calm",        is_instrumental: true,  activity_fit: ["study","home"] },
  { id: 1005,  title: "Piano Instrumental",        artist: "Peaceful Piano",                    duration: 22000, energy_level: 2, tempo: 75,  mood: "calm",        is_instrumental: true,  activity_fit: ["study","cafe","home"] }
];

// Get ?activity= from URL
function getActivityFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const activity = params.get("activity");
  return activity ? activity.toLowerCase() : "gym";
}

// Format seconds -> M:SS
function formatTimeFromSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/* ---------- SIMPLE SIMILARITY HELPERS (for like-based recs) ---------- */

function similarityScore(a, b) {
  let score = 0;

  if (a.mood === b.mood) score += 3;
  if (a.is_instrumental === b.is_instrumental) score += 2;
  if (a.artist === b.artist) score += 3;

  const tempoDiff = Math.abs(a.tempo - b.tempo);
  if (tempoDiff <= 5) score += 3;
  else if (tempoDiff <= 15) score += 1;

  const energyDiff = Math.abs(a.energy_level - b.energy_level);
  if (energyDiff <= 1) score += 2;
  else if (energyDiff <= 3) score += 1;

  const sharedActivities = a.activity_fit.filter(x => b.activity_fit.includes(x)).length;
  score += sharedActivities;

  return score;
}

document.addEventListener("DOMContentLoaded", () => {
  // Only run on player page
  if (!document.querySelector(".player-card")) return;

  const activity = getActivityFromUrl();

  const activityLabel = document.getElementById("activityLabel");
  const activityLabelInline = document.getElementById("activityLabelInline");
  const trackTitle = document.getElementById("trackTitle");
  const trackArtist = document.getElementById("trackArtist");
  const trackMeta = document.getElementById("trackMeta");

  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");
  const progressFill = document.getElementById("progressFill");

  const backBtn = document.getElementById("backToHomeBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const playPauseBtn = document.getElementById("playPauseBtn");

  const dislikeBtn = document.getElementById("dislikeBtn");
  const likeBtn = document.getElementById("likeBtn");

  // Filter tracks by activity
  let playlist = tracks.filter(t => t.activity_fit.includes(activity));
  if (playlist.length === 0) playlist = tracks;

  let currentIndex = 0;
  let isPlaying = true;

  // time in milliseconds
  let currentMs = 0;
  let durationMs = 0;

  // animation state
  let lastTimestamp = null;
  let rafId = null;

  // disliked songs: Map(trackId -> remaining songs to skip)
  const dislikedCounters = new Map();

  // liked songs (used as taste seeds + stored in localStorage)
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
    } catch (e) { /* ignore */ }
  }

  // recent history of indices so we don't bounce between 2 songs
  const recentHistory = [];

  const niceActivity = activity.charAt(0).toUpperCase() + activity.slice(1);
  activityLabel.textContent = niceActivity;
  if (activityLabelInline) activityLabelInline.textContent = activity;

  function cancelAnimation() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastTimestamp = null;
  }

  function updateProgressUI() {
    const totalSeconds = Math.floor(durationMs / 1000);
    const currentSeconds = Math.floor(currentMs / 1000);

    currentTimeEl.textContent = formatTimeFromSeconds(currentSeconds);
    totalTimeEl.textContent = formatTimeFromSeconds(totalSeconds);

    const ratio = durationMs > 0 ? currentMs / durationMs : 0;
    progressFill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  }

  function updatePlayPauseButton() {
    playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
  }

  // Shared visual feedback for like/dislike buttons
  function flashButton(btn) {
    btn.classList.remove("flash-fill");
    void btn.offsetWidth; // reflow so re-adding retriggers transition

    btn.classList.add("flash-fill");
    setTimeout(() => {
      btn.classList.remove("flash-fill");
    }, 300); // matches CSS transition nicely
  }

  function animationLoop(timestamp) {
    if (!isPlaying) return;

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
    }

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    currentMs += delta;

    if (currentMs >= durationMs) {
      currentMs = durationMs;
      updateProgressUI();
      goToNextTrack();  // auto-next at end
      return;
    }

    updateProgressUI();
    rafId = requestAnimationFrame(animationLoop);
  }

  function startAnimationIfNeeded() {
    cancelAnimation();
    if (isPlaying) {
      rafId = requestAnimationFrame(animationLoop);
    }
  }

  // Is a given track currently blocked by dislike?
  function isBlockedTrack(track) {
    const remaining = dislikedCounters.get(track.id);
    return typeof remaining === "number" && remaining > 0;
  }

  // Choose next index, respecting dislike + recent history + likes
  function chooseNextIndex() {
    const n = playlist.length;
    if (n <= 1) return currentIndex;

    // candidate indices (not current)
    const candidates = [];
    for (let i = 0; i < n; i++) {
      if (i !== currentIndex) candidates.push(i);
    }

    // 1) filter out blocked tracks
    let allowed = candidates.filter(i => !isBlockedTrack(playlist[i]));
    if (allowed.length === 0) allowed = candidates; // all blocked? fallback

    // 2) avoid very recent tracks if possible
    let pool = allowed.filter(i => !recentHistory.includes(i));
    if (pool.length === 0) pool = allowed;

    // 3) if no likes yet: basically "next in order" within pool
    if (likedSongs.length === 0) {
      for (let step = 1; step < n; step++) {
        const idx = (currentIndex + step) % n;
        if (pool.includes(idx)) return idx;
      }
      return pool[0];
    }

    // 4) with likes: pick allowed track most similar to liked seeds
    function similarityToLiked(track) {
      let best = 0;
      for (const liked of likedSongs) {
        best = Math.max(best, similarityScore(track, liked));
      }
      return best;
    }

    let bestIndex = pool[0];
    let bestScore = -Infinity;

    for (const idx of pool) {
      const tr = playlist[idx];
      const s = similarityToLiked(tr);
      if (s > bestScore) {
        bestScore = s;
        bestIndex = idx;
      } else if (s === bestScore) {
        // tiebreaker: more "forward" in the playlist
        const nStepsCurrent = (idx - currentIndex + n) % n;
        const nStepsBest = (bestIndex - currentIndex + n) % n;
        if (nStepsCurrent < nStepsBest) bestIndex = idx;
      }
    }

    return bestIndex;
  }

  function loadTrack() {
    // decrement dislike counters each time we start ANY new song
    for (const [id, remaining] of dislikedCounters.entries()) {
      if (remaining > 1) dislikedCounters.set(id, remaining - 1);
      else dislikedCounters.delete(id);
    }

    const track = playlist[currentIndex];

    // update recent history
    recentHistory.push(currentIndex);
    const maxHistory = Math.min(5, playlist.length - 1);
    if (recentHistory.length > maxHistory) {
      recentHistory.shift();
    }

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    const moodText = track.mood[0].toUpperCase() + track.mood.slice(1);
    const bpm = track.tempo;
    trackMeta.textContent = `${moodText} • ${bpm} BPM`;

    durationMs = track.duration;
    currentMs = 0;
    updateProgressUI();
    lastTimestamp = null;

    startAnimationIfNeeded();
  }

  function goToNextTrack() {
    cancelAnimation();
    currentIndex = chooseNextIndex();
    isPlaying = true;
    updatePlayPauseButton();
    loadTrack();
  }

  // Initial state
  loadTrack();
  updatePlayPauseButton();

  // Controls
  backBtn.addEventListener("click", () => {
    cancelAnimation();
    window.location.href = "index.html";
  });

  prevBtn.addEventListener("click", () => {
    cancelAnimation();
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    isPlaying = true;
    updatePlayPauseButton();
    loadTrack();
  });

  nextBtn.addEventListener("click", () => {
    goToNextTrack();
  });

  playPauseBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    updatePlayPauseButton();

    if (isPlaying) {
      lastTimestamp = null;
      startAnimationIfNeeded();
    } else {
      cancelAnimation();
    }
  });

  // Dislike – don't play this song for the next 15 tracks
  dislikeBtn.addEventListener("click", () => {
    const track = playlist[currentIndex];
    dislikedCounters.set(track.id, 15);
    flashButton(dislikeBtn);
    goToNextTrack();
  });

  // Like – add to Liked Songs + bias future picks
  likeBtn.addEventListener("click", () => {
    const track = playlist[currentIndex];
    if (!likedSongs.some(t => t.id === track.id)) {
      likedSongs.push({ ...track });
      saveLikedSongs();
    }
    flashButton(likeBtn);
    // we keep playing the same song; next picks are influenced by likedSongs
  });
});
