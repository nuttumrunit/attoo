(async function () {
    const consoleBox = document.querySelector(".talk-console");
    const config = window.SATTOO_SUPABASE || {};
    if (!consoleBox) return;

    consoleBox.innerHTML = `
      <div class="talk-console-bar"><span>DIRECT CHANNEL / SATTOO</span><i data-talk-state>CONNECTING</i></div>
      <div class="sattoo-talk-notice">One visitor, one temporary thread. Never send a seed phrase, private key, password, or identifying information.</div>
      <div class="sattoo-talk-log" data-talk-log aria-live="polite"></div>
      <form class="sattoo-talk-form" data-talk-form>
        <textarea data-talk-input maxlength="1600" rows="2" placeholder="Ask Sattoo something..." aria-label="Message to Sattoo" disabled></textarea>
        <button type="submit" data-talk-send disabled>SEND</button>
      </form>
      <div class="sattoo-talk-foot"><span>10 messages / 10 min · 60 / day</span><button type="button" data-talk-clear>CLEAR THREAD</button></div>`;

    const log = consoleBox.querySelector("[data-talk-log]");
    const form = consoleBox.querySelector("[data-talk-form]");
    const input = consoleBox.querySelector("[data-talk-input]");
    const send = consoleBox.querySelector("[data-talk-send]");
    const state = consoleBox.querySelector("[data-talk-state]");
    const clear = consoleBox.querySelector("[data-talk-clear]");
    let history = [];

    function add(role, text, pending) {
        const item = document.createElement("article");
        item.className = `sattoo-talk-line ${role}${pending ? " pending" : ""}`;
        const name = document.createElement("b");
        name.textContent = role === "user" ? "YOU" : "SATTOO";
        const message = document.createElement("div");
        message.textContent = text;
        item.append(name, message);
        log.appendChild(item);
        log.scrollTop = log.scrollHeight;
        return item;
    }

    function setReady(ready, label) {
        input.disabled = !ready;
        send.disabled = !ready;
        state.textContent = label;
    }

    if (!window.supabase || !config.url || !config.publishableKey) {
        state.textContent = "SETUP REQUIRED";
        add("assistant", "The direct channel cannot find its Supabase configuration.");
        return;
    }

    const client = window.supabase.createClient(config.url, config.publishableKey);
    let session = (await client.auth.getSession()).data.session;
    if (!session) {
        const result = await client.auth.signInAnonymously();
        if (result.error) {
            state.textContent = "AUTH FAILED";
            add("assistant", "Anonymous access is unavailable. The room cannot open yet.");
            return;
        }
        session = result.data.session;
    }

    add("assistant", "I am here. Ask me about an inherited memory, a failed system, privacy, custody, belief, or the part of Web3 that does not fit a simple verdict.");
    setReady(true, "ONLINE / GPT-5.5");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        history.push({ role: "user", content: text });
        add("user", text);
        input.value = "";
        setReady(false, "SATTOO IS RESPONDING");
        const pending = add("assistant", "Listening to the archive...", true);

        const controller = new AbortController();
        const requestTimeout = setTimeout(() => controller.abort(), 60000);
        try {
            const response = await fetch(`${config.url}/functions/v1/talk-to-sattoo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.publishableKey,
                    "Authorization": `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ messages: history.slice(-12) }),
                signal: controller.signal,
            });
            clearTimeout(requestTimeout);
            const data = await response.json();
            pending.remove();
            if (!response.ok) throw new Error(data.error || "Sattoo could not answer.");
            history.push({ role: "assistant", content: data.reply });
            add("assistant", data.reply);
            setReady(true, "ONLINE / GPT-5.5");
        } catch (error) {
            clearTimeout(requestTimeout);
            pending.remove();
            const message = error.name === "AbortError"
                ? "Sattoo took too long to answer. Please try again."
                : (error.message || "The direct signal failed.");
            add("assistant", message);
            setReady(true, "SIGNAL ERROR / RETRY");
        }
        input.focus();
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
    });
    clear.addEventListener("click", () => {
        history = [];
        log.innerHTML = "";
        add("assistant", "The local thread is clear. We can begin again.");
        input.focus();
    });
}());

