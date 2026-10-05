(function () {
    const player = document.getElementById("attoo-fm-player");
    if (!player) return;

    const tracks = [
        { title: "Signal One", artist: "Attoo FM · Demo transmission", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Night Memory", artist: "Attoo FM · Demo transmission", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "Blue Circuit", artist: "Attoo FM · Demo transmission", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ];
    const audio = player.querySelector("audio");
    const title = player.querySelector("[data-fm-title]");
    const artist = player.querySelector("[data-fm-artist]");
    const play = player.querySelector("[data-fm-play]");
    const progress = player.querySelector("[data-fm-progress]");
    const current = player.querySelector("[data-fm-current]");
    const duration = player.querySelector("[data-fm-duration]");
    let index = 0;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";
        return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
    }
    function loadTrack(nextIndex) {
        index = (nextIndex + tracks.length) % tracks.length;
        audio.src = tracks[index].src;
        title.textContent = tracks[index].title;
        artist.textContent = tracks[index].artist;
        progress.value = 0;
        current.textContent = "0:00";
        duration.textContent = "0:00";
    }
    function togglePlayback() {
        if (audio.paused) audio.play().catch(() => {}); else audio.pause();
    }
    play.addEventListener("click", togglePlayback);
    player.querySelector("[data-fm-prev]").addEventListener("click", () => { loadTrack(index - 1); audio.play().catch(() => {}); });
    player.querySelector("[data-fm-next]").addEventListener("click", () => { loadTrack(index + 1); audio.play().catch(() => {}); });
    progress.addEventListener("input", () => { if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration; });
    audio.addEventListener("play", () => { play.textContent = "❚❚"; });
    audio.addEventListener("pause", () => { play.textContent = "▶"; });
    audio.addEventListener("ended", () => { loadTrack(index + 1); audio.play().catch(() => {}); });
    audio.addEventListener("loadedmetadata", () => { duration.textContent = formatTime(audio.duration); });
    audio.addEventListener("timeupdate", () => { current.textContent = formatTime(audio.currentTime); progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0; });
    loadTrack(0);
}());
