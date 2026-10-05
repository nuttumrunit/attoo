(async function () {
    const root = document.getElementById("attoo-chat");
    if (!root) return;

    const messages = root.querySelector("[data-chat-messages]");
    const form = root.querySelector("[data-chat-form]");
    const nameInput = root.querySelector("[data-chat-name]");
    const bodyInput = root.querySelector("[data-chat-body]");
    const sendButton = root.querySelector("[data-chat-send]");
    const status = root.querySelector("[data-chat-status]");
    const colorButton = root.querySelector("[data-chat-color-button]");
    const colorInput = root.querySelector("[data-chat-color]");
    const colorDot = root.querySelector("[data-chat-color-dot]");
    const emojiToggle = root.querySelector("[data-chat-emoji-toggle]");
    const emojiMenu = root.querySelector("[data-chat-emoji-menu]");
    const config = window.ATTOO_SUPABASE || {};

    nameInput.value = localStorage.getItem("attoo-chat-name") || "";
    colorInput.value = localStorage.getItem("attoo-chat-color") || "#dcf2ff";
    colorDot.style.backgroundColor = colorInput.value;

    const emojis = ["😀", "😂", "🥹", "😊", "😎", "🤔", "🫡", "👀", "❤️", "🔥", "✨", "🌈", "☁️", "🌙", "🐟", "🐸", "🚀", "💎", "₿", "🪙"];
    emojis.forEach((emoji) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = emoji;
        button.addEventListener("click", () => {
            bodyInput.setRangeText(emoji, bodyInput.selectionStart, bodyInput.selectionEnd, "end");
            emojiMenu.hidden = true;
            bodyInput.focus();
        });
        emojiMenu.appendChild(button);
    });

    colorButton.addEventListener("click", () => colorInput.click());
    colorInput.addEventListener("input", () => {
        colorDot.style.backgroundColor = colorInput.value;
        localStorage.setItem("attoo-chat-color", colorInput.value);
    });
    emojiToggle.addEventListener("click", () => { emojiMenu.hidden = !emojiMenu.hidden; });

    function setStatus(text, state) {
        status.textContent = text;
        status.dataset.state = state || "";
    }

    function formatTime(value) {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(value)) + " ET";
    }

    function appendMessage(message, shouldScroll) {
        if (messages.querySelector(`[data-message-id="${message.id}"]`)) return;
        const item = document.createElement("div");
        item.className = "attoo-chat-message";
        item.dataset.messageId = message.id;
        const heading = document.createElement("div");
        heading.className = "attoo-chat-meta";
        const name = document.createElement("strong");
        name.textContent = message.display_name;
        name.style.color = message.display_color || "#dcf2ff";
        const time = document.createElement("time");
        time.textContent = formatTime(message.created_at);
        heading.append(name, time);
        const body = document.createElement("div");
        body.className = "attoo-chat-body";
        body.textContent = message.body;
        item.append(heading, body);
        messages.appendChild(item);
        if (shouldScroll) messages.scrollTop = messages.scrollHeight;
    }

    if (!config.url || !config.publishableKey || !window.supabase) {
        setStatus("SUPABASE SETUP REQUIRED", "setup");
        messages.innerHTML = '<div class="attoo-chat-empty">The old chat has been cleared.<br>Connect Attoo\'s Supabase project to open the public room.</div>';
        form.hidden = true;
        return;
    }

    const client = window.supabase.createClient(config.url, config.publishableKey);
    setStatus("CONNECTING", "connecting");

    let sessionResult = await client.auth.getSession();
    let session = sessionResult.data.session;
    if (!session) {
        const signIn = await client.auth.signInAnonymously();
        if (signIn.error) {
            setStatus("CONNECTION FAILED", "error");
            messages.innerHTML = '<div class="attoo-chat-empty">Anonymous sign-in is not enabled in Supabase.</div>';
            return;
        }
        session = signIn.data.session;
    }

    let response = await client.from("chat_messages").select("id, user_id, display_name, display_color, body, created_at").order("created_at", { ascending: false }).limit(100);
    if (response.error && response.error.code === "42703") {
        response = await client.from("chat_messages").select("id, user_id, display_name, body, created_at").order("created_at", { ascending: false }).limit(100);
    }
    if (response.error) {
        setStatus("DATABASE SETUP REQUIRED", "error");
        messages.innerHTML = '<div class="attoo-chat-empty">Run the supplied chat-schema.sql in Supabase.</div>';
        return;
    }

    messages.innerHTML = "";
    response.data.reverse().forEach((message) => appendMessage(message, false));
    messages.scrollTop = messages.scrollHeight;
    setStatus("PUBLIC ROOM · ONLINE", "online");
    form.hidden = false;

    client.channel("attoo-public-chat")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => appendMessage(payload.new, true))
        .subscribe();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const displayName = nameInput.value.trim().slice(0, 24);
        const body = bodyInput.value.trim().slice(0, 500);
        if (!displayName || !body || !session?.user?.id) return;
        localStorage.setItem("attoo-chat-name", displayName);
        sendButton.disabled = true;
        let result = await client.from("chat_messages").insert({ user_id: session.user.id, display_name: displayName, display_color: colorInput.value, body });
        if (result.error && result.error.code === "PGRST204") {
            result = await client.from("chat_messages").insert({ user_id: session.user.id, display_name: displayName, body });
        }
        sendButton.disabled = false;
        if (result.error) {
            setStatus("MESSAGE NOT SENT", "error");
            return;
        }
        bodyInput.value = "";
        setStatus("PUBLIC ROOM · ONLINE", "online");
    });
}());
