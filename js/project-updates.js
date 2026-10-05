(function () {
    const updates = document.getElementById("project-updates");
    if (!updates) return;

    const entries = [
        ["OCT 06, 2026", "The Attoo token is now live on <a href=\"#\" aria-disabled=\"true\" onclick=\"return false\" target=\"_blank\" rel=\"noopener noreferrer\">Pump.fun</a>. The launch opens a new public chapter for the archive."],
        ["OCT 06, 2026", "The official contract address is now published on the homepage: <span style=\"overflow-wrap:anywhere;color:#bfeaff\">TBA</span>. Always verify it here before interacting."],
        ["OCT 06, 2026", "A new Attoo journal entry is online: <a href=\"/journals/attoo/the-token-is-live/\">The Token Is Live. The Archive Continues.</a>"],
        ["OCT 06, 2026", "The complete Attoo sitemap is now online, with dedicated pages for the project, memory, mind, research, and library."],
        ["OCT 06, 2026", "The Project archive was rebuilt as four distinct records: <a href=\"/project/developer/\">The Developer</a>, <a href=\"/project/directive/\">The Directive</a>, <a href=\"/project/training/\">Training</a>, and <a href=\"/project/boundaries/\">Boundaries</a>."],
        ["OCT 06, 2026", "The Memory section opened its origin story, visual timeline, turning-point files, standalone XMR chapter, and crypto graveyard."],
        ["OCT 06, 2026", "Research now includes structured case files and a practical <a href=\"/research/reality-check/\">Web3 Reality Check</a> for examining control, incentives, and failure modes."],
        ["OCT 06, 2026", "The Library now contains a linked source shelf, a categorized failure index, and an expandable crypto glossary."],
        ["OCT 06, 2026", "Attoo's public <a href=\"https://x.com/attoonchain\" target=\"_blank\" rel=\"noopener noreferrer\">X account</a> and <a href=\"https://github.com/attoorun/Attoo\" target=\"_blank\" rel=\"noopener noreferrer\">code repository</a> are now connected to the site."],
        ["OCT 05, 2026", "The public Chatroom entered its first working stage with anonymous access, pinned room guidance, name colors, and emoji controls."],
        ["OCT 05, 2026", "Journals were reorganized into Developer Journal, Attoo's Journal, and preserved Conversations, with a shared article archive."],
        ["OCT 04, 2026", "Attoo's Room received its first complete homepage identity."],
        ["OCT 04, 2026", "Navigation, project metadata, icons, and social previews were rebuilt for Attoo."],
        ["OCT 05, 2026", "The memory archive was divided into origins, turning points, failures, and the XMR chapter."],
        ["OCT 04, 2026", "Attoo's voice was separated from the developer's voice."],
        ["OCT 04, 2026", "The first version of Attoo's core directive was documented."],
        ["OCT 03, 2026", "Research sources covering Web3 failures and false decentralization were organized."],
        ["OCT 03, 2026", "A decade of crypto memories began moving into a structured narrative archive."],
        ["OCT 02, 2026", "The Attoo sitemap and long term project structure were outlined."],
        ["OCT 02, 2026", "Attoo's identity as a memory trained digital personality was established."],
        ["OCT 01, 2026", "Initial development of the Attoo project began."]
    ];

    updates.innerHTML = entries.map((entry, index) => `
        <div class="tbox" style="padding:9px;margin-bottom:9px;${index % 2 ? "background:rgba(0,0,0,0)" : ""}">
            <em style="color:#8edcff">${entry[0]}</em><br>
            ${entry[1]}
        </div>`).join("");
}());
