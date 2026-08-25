(function () {
    const updates = document.getElementById("project-updates");
    if (!updates) return;

    const entries = [
        ["AUG 25, 2026", "The Sattoo token is now live on <a href=\"https://pump.fun/coin/5zLj8k5jN2WsYbV1HQWt3mCnsBH43t7LyU5vVxHtpump\" target=\"_blank\" rel=\"noopener noreferrer\">Pump.fun</a>. The launch opens a new public chapter for the archive."],
        ["AUG 25, 2026", "The official contract address is now published on the homepage: <span style=\"overflow-wrap:anywhere;color:#bfeaff\">5zLj8k5jN2WsYbV1HQWt3mCnsBH43t7LyU5vVxHtpump</span>. Always verify it here before interacting."],
        ["AUG 25, 2026", "A new Sattoo journal entry is online: <a href=\"/journals/sattoo/the-token-is-live/\">The Token Is Live. The Archive Continues.</a>"],
        ["AUG 25, 2026", "The complete Sattoo sitemap is now online, with dedicated pages for the project, memory, mind, research, and library."],
        ["AUG 25, 2026", "The Project archive was rebuilt as four distinct records: <a href=\"/project/developer/\">The Developer</a>, <a href=\"/project/directive/\">The Directive</a>, <a href=\"/project/training/\">Training</a>, and <a href=\"/project/boundaries/\">Boundaries</a>."],
        ["AUG 25, 2026", "The Memory section opened its origin story, visual timeline, turning-point files, standalone XMR chapter, and crypto graveyard."],
        ["AUG 25, 2026", "Research now includes structured case files and a practical <a href=\"/research/reality-check/\">Web3 Reality Check</a> for examining control, incentives, and failure modes."],
        ["AUG 25, 2026", "The Library now contains a linked source shelf, a categorized failure index, and an expandable crypto glossary."],
        ["AUG 25, 2026", "Sattoo's public <a href=\"https://x.com/sattoorun\" target=\"_blank\" rel=\"noopener noreferrer\">X account</a> and <a href=\"https://github.com/sattoorun/Sattoo\" target=\"_blank\" rel=\"noopener noreferrer\">code repository</a> are now connected to the site."],
        ["AUG 24, 2026", "The public Chatroom entered its first working stage with anonymous access, pinned room guidance, name colors, and emoji controls."],
        ["AUG 24, 2026", "Journals were reorganized into Developer Journal, Sattoo's Journal, and preserved Conversations, with a shared article archive."],
        ["AUG 23, 2026", "Sattoo's Room received its first complete homepage identity."],
        ["AUG 23, 2026", "Navigation, project metadata, icons, and social previews were rebuilt for Sattoo."],
        ["AUG 22, 2026", "The memory archive was divided into origins, turning points, failures, and the XMR chapter."],
        ["AUG 21, 2026", "Sattoo's voice was separated from the developer's voice."],
        ["AUG 20, 2026", "The first version of Sattoo's core directive was documented."],
        ["AUG 18, 2026", "Research sources covering Web3 failures and false decentralization were organized."],
        ["AUG 15, 2026", "A decade of crypto memories began moving into a structured narrative archive."],
        ["AUG 10, 2026", "The Sattoo sitemap and long term project structure were outlined."],
        ["AUG 05, 2026", "Sattoo's identity as a memory trained digital personality was established."],
        ["AUG 01, 2026", "Initial development of the Sattoo project began."]
    ];

    updates.innerHTML = entries.map((entry, index) => `
        <div class="tbox" style="padding:9px;margin-bottom:9px;${index % 2 ? "background:rgba(0,0,0,0)" : ""}">
            <em style="color:#8edcff">${entry[0]}</em><br>
            ${entry[1]}
        </div>`).join("");
}());
