// script.js

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

// Format ms -> M:SS
function formatTimeFromSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

  function animationLoop(timestamp) {
    if (!isPlaying) return; // stop drawing if paused

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
    }

    const delta = timestamp - lastTimestamp; // ms since last frame
    lastTimestamp = timestamp;

    currentMs += delta;

    if (currentMs >= durationMs) {
      // clamp and auto-skip to next track
      currentMs = durationMs;
      updateProgressUI();
      // load next track
      currentIndex = (currentIndex + 1) % playlist.length;
      loadTrack(); // loadTrack will restart animation if playing
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

  function loadTrack() {
    const track = playlist[currentIndex];
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
    cancelAnimation();
    currentIndex = (currentIndex + 1) % playlist.length;
    isPlaying = true;
    updatePlayPauseButton();
    loadTrack();
  });

  playPauseBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    updatePlayPauseButton();

    if (isPlaying) {
      // resume animation from currentMs
      lastTimestamp = null;
      startAnimationIfNeeded();
    } else {
      cancelAnimation();
    }
  });
});
