(function () {
    const signals = [
        { title: "Web3 is Going Just Great", url: "https://www.web3isgoinggreat.com/", description: "A public record of disasters, scams and structural failures." },
        { title: "Against Web3 and Faux-Decentralization", url: "https://soatok.blog/2021/10/19/against-web3-and-faux-decentralization/", description: "A security-minded argument against false decentralization." },
        { title: "Future Web", url: "https://letslearntogether.neocities.org/compute/futureweb01", description: "An independent-web perspective on what the future could become." },
        { title: "Invisible Up · Article 38", url: "https://invisibleup.com/articles/38/", description: "A critical signal included in Attoo's early reading archive." },
        { title: "Binance", url: "https://www.binance.com/", description: "A major centralized exchange and one of crypto's largest gateways." },
        { title: "Hyperliquid", url: "https://hyperliquid.xyz/", description: "Onchain trading infrastructure for crypto and global markets." },
        { title: "Magic Eden", url: "https://magiceden.io/", description: "A multi-chain marketplace for NFTs and digital assets." },
        { title: "Ethereum", url: "https://ethereum.org/", description: "The official home of Ethereum's network, ecosystem and learning resources." },
        { title: "Solana", url: "https://solana.com/", description: "A high-performance network for payments, markets and crypto applications." },
        { title: "Uniswap", url: "https://uniswap.org/", description: "A widely used decentralized exchange and liquidity protocol." },
        { title: "Aave", url: "https://aave.com/", description: "A decentralized liquidity and lending protocol." },
        { title: "Chainlink", url: "https://chain.link/", description: "Oracle infrastructure connecting blockchains with external data and systems." },
        { title: "OpenSea", url: "https://opensea.io/", description: "A large marketplace for NFTs, tokens and onchain collectibles." },
        { title: "Coinbase", url: "https://www.coinbase.com/", description: "A major regulated exchange and consumer gateway to crypto." },
        { title: "Polymarket", url: "https://polymarket.com/", description: "An onchain prediction market built around real-world events." },
        { title: "Jupiter", url: "https://jup.ag/", description: "A Solana-based hub for swaps and onchain financial products." },
        { title: "Pump.fun", url: "https://pump.fun/", description: "A permissionless platform where anyone can create and trade coins." },
        { title: "PancakeSwap", url: "https://pancakeswap.finance/", description: "A multi-chain decentralized exchange and DeFi platform." },
        { title: "Curve", url: "https://curve.finance/", description: "A decentralized exchange focused on stable and correlated assets." },
        { title: "Lido", url: "https://lido.fi/", description: "A liquid staking protocol best known for stETH." },
        { title: "Pendle", url: "https://www.pendle.finance/", description: "A protocol for trading and managing tokenized yield." },
        { title: "Raydium", url: "https://raydium.io/", description: "A Solana-based automated market maker and swap platform." },
        { title: "MetaMask", url: "https://metamask.io/", description: "A widely used self-custodial wallet and gateway to onchain apps." },
        { title: "Phantom", url: "https://phantom.com/", description: "A self-custodial wallet for trading, payments and onchain apps." },
        { title: "dYdX", url: "https://www.dydx.xyz/", description: "A decentralized platform for perpetual and professional trading." },
        { title: "GMX", url: "https://gmx.io/", description: "A decentralized spot and perpetual trading protocol." }
    ];

    document.querySelectorAll("[data-signal-ring]").forEach((ring) => {
        let current = 0;
        const link = ring.querySelector("[data-signal-current]");
        const index = ring.querySelector("[data-signal-index]");
        const title = ring.querySelector("[data-signal-title]");
        const description = ring.querySelector("[data-signal-description]");
        const list = ring.querySelector("[data-signal-member-list]");

        function show(next) {
            current = (next + signals.length) % signals.length;
            const signal = signals[current];
            link.href = signal.url;
            index.textContent = `SIGNAL ${String(current + 1).padStart(2, "0")} / ${String(signals.length).padStart(2, "0")}`;
            title.textContent = signal.title;
            description.textContent = signal.description;
        }

        list.innerHTML = "";
        signals.forEach((signal, signalIndex) => {
            const item = document.createElement("button");
            item.type = "button";
            item.textContent = `${String(signalIndex + 1).padStart(2, "0")} · ${signal.title}`;
            item.addEventListener("click", () => { show(signalIndex); list.hidden = true; });
            list.appendChild(item);
        });

        ring.querySelector("[data-signal-prev]").addEventListener("click", () => show(current - 1));
        ring.querySelector("[data-signal-next]").addEventListener("click", () => show(current + 1));
        ring.querySelector("[data-signal-random]").addEventListener("click", () => {
            let next = current;
            while (next === current) next = Math.floor(Math.random() * signals.length);
            show(next);
        });
        ring.querySelector("[data-signal-members]").addEventListener("click", () => { list.hidden = !list.hidden; });
        show(0);
    });
}());
