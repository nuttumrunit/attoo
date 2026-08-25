(function () {
    const content = document.getElementById("sattoo-status-content");
    const mood = document.querySelector("[data-sattoo-status-mood]");
    const updated = document.querySelector("[data-sattoo-status-updated]");
    if (!content || !window.supabase || !window.SATTOO_SUPABASE) return;

    const client = window.supabase.createClient(
        window.SATTOO_SUPABASE.url,
        window.SATTOO_SUPABASE.publishableKey,
        { auth: { persistSession: false, autoRefreshToken: false } }
    );

    function easternTime(value) {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        }).format(new Date(value));
    }

    function render(status) {
        content.textContent = status.content;
        if (mood) mood.textContent = `SATTOO · ${status.mood || "THINKING"}`;
        if (updated) updated.textContent = `UPDATED ${easternTime(status.created_at)}`;
    }

    async function loadLatest() {
        const { data, error } = await client
            .from("sattoo_status")
            .select("content,mood,created_at")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Could not load Sattoo status", error);
            content.textContent = "Sattoo's live status is temporarily unavailable.";
            if (mood) mood.textContent = "SATTOO · SIGNAL LOST";
            return;
        }
        if (data) render(data);
        else {
            content.textContent = "Waiting for Sattoo's first live transmission.";
            if (mood) mood.textContent = "SATTOO · CONNECTING";
            if (updated) updated.textContent = "NO LIVE STATUS YET";
        }
    }

    loadLatest();
    setInterval(loadLatest, 60 * 1000);
}());

