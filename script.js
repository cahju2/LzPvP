// サーバーIPの定義
const SERVER_IP = "as.lzpvp.xyz";

// リレー中継地点のIP
const RELAY_IPS = {
    tokyo: "tyo.lzpvp.xyz",
    osaka: "osk.lzpvp.xyz",
    tcpshield: "ts.lzpvp.xyz"
};

let selectedRelay = null;

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

// リレー中継地点の選択
function selectRelay(relay) {
    const relayCards = document.querySelectorAll('.relay-card');
    relayCards.forEach(card => card.classList.remove('active'));

    const relayMap = { 'tokyo': 0, 'osaka': 1, 'tcpshield': 2 };
    relayCards[relayMap[relay]].classList.add('active');
    selectedRelay = relay;

    // /relay コマンド用にIPをコピー
    navigator.clipboard.writeText(RELAY_IPS[relay]).then(() => {
        const hint = document.querySelector(`.relay-card[onclick="selectRelay('${relay}')"] .relay-sub`);
        if (hint) {
            const original = hint.innerText;
            hint.innerText = "IP Copied!";
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

// 画像を全画面表示（ライトボックス）
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const img = document.getElementById('lightbox-img');
    img.src = src;
    lb.classList.remove('closing');
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.add('closing');
    setTimeout(() => {
        lb.classList.remove('active', 'closing');
        document.body.style.overflow = '';
    }, 200);
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
                
                if (motdEl && data.motd) {
                    if (data.motd.html) {
                        motdEl.innerHTML = data.motd.html.map(l => l.trim()).filter(Boolean).join('<br>');
                    } else if (data.motd.clean) {
                        motdEl.innerText = data.motd.clean.map(l => l.trim()).filter(Boolean).join('\n') || '';
                    }
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

// 読み込み時に初期実行とタイマー設定
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    // 5分おきに自動更新
    setInterval(updateServerStatus, 1000 * 60 * 5);

    // ESCキーでライトボックスを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});