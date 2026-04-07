// 新しいサーバーIP
const SERVER_IP = "as.lzpvp.xyz";

// IPをクリップボードにコピー
function copyIP() {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        const hint = document.querySelector('.copy-hint');
        if (hint) {
            const original = hint.innerText;
            hint.innerText = "COPIED!";
            hint.style.color = "#4ade80";
            setTimeout(() => {
                hint.innerText = original;
                hint.style.color = "";
            }, 1500);
        }
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// サーバーのステータス取得 (MCSrvStat API)
function updateServerStatus() {
    fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`)
        .then(res => res.json())
        .then(data => {
            const countEl = document.getElementById('player-count');
            const cardCountEl = document.getElementById('mc-players-card');
            const motdEl = document.getElementById('mc-motd');
            const pingEl = document.getElementById('mc-ping');
            
            if (data.online) {
                const p = data.players;
                const statusStr = `${p.online}/${p.max}`;
                
                if (countEl) countEl.innerText = `${statusStr} Online`;
                if (cardCountEl) cardCountEl.innerText = statusStr;
                
                if (motdEl && data.motd && data.motd.clean) {
                    motdEl.innerText = data.motd.clean[0] || '';
                }
                
                if (pingEl) pingEl.innerText = "Connected";
            } else {
                if (countEl) countEl.innerText = "Offline";
                if (cardCountEl) cardCountEl.innerText = "0/0";
                if (motdEl) motdEl.innerText = "サーバーは現在オフラインです";
                if (pingEl) pingEl.innerText = "Disconnected";
            }
        })
        .catch(err => {
            console.error('Status fetch failed:', err);
        });
}

// 読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    // 5分おきに更新
    setInterval(updateServerStatus, 1000 * 60 * 5);
});