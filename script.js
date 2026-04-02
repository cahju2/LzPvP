// ↓↓↓ IPコピーやステータス取得などのコードがある場合はこの上に残してください ↓↓↓

// --- 🌐 多言語対応 (i18n) の設定 ---
const translations = {
    ja: {
         visit_count: "📊 累計訪問数: <span id='visit-count' style='color: var(--primary); font-weight: bold;'>読み込み中...</span>"
	loading: "読み込み中...",
	unofficial: "非公式",
        click_copy: "クリックしてIPをコピー",
        discord: "公式Discord",
        rule: "ルール確認",
        love_page: "ガチ推し特設",
        points_title: "LzPvPのここが推せる",
        point_1: "1.21の最新技術で対戦が楽しめる",
        point_2: "多彩なKitが用意されている",
        point_3: "現在テスター募集中",
        arena_title: "アリーナ紹介",
        arena_desc: "<strong>1.21対応</strong>の迫力あるPvPが楽しめる、最新鋭の特設アリーナ。多彩なステージ環境を駆使して、王座を目指せ。",
        footer_text: "このサイトは非公式に制作されたファンサイトです。"
    },
    en: {
        visit_count: "📊 Total Visits: <span id='visit-count' style='color: var(--primary); font-weight: bold;'>Loading...</span>"
	loading: "Loading...",
	unofficial: "UNOFFICIAL",
        click_copy: "CLICK TO COPY IP",
        discord: "Official Discord",
        rule: "Rule",
        love_page: "Love Page",
        points_title: "Why You'll Love LzPvP",
        point_1: "Enjoy battles with the latest 1.21 mechanics",
        point_2: "A wide variety of Kits are available",
        point_3: "Currently recruiting testers",
        arena_title: "Arena Showcase",
        arena_desc: "A state-of-the-art special arena where you can enjoy intense PvP compatible with <strong>1.21</strong>.",
        footer_text: "This site is an unofficially produced fan site."
    }
};

let currentLang = 'ja';

function switchLang(lang) {
    currentLang = lang;
    
    // UIの切り替え
    document.getElementById('lang-jp').classList.toggle('active', lang === 'ja');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    
    // テキストの一括書き換え
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // スライダーのテキストも即時更新
    updateSliderText();
}

// 初期化（ブラウザの言語を判別）
function initLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    // ブラウザの言語設定が「ja」から始まらない場合は英語にする
    if (!userLang.startsWith('ja')) {
        switchLang('en');
    } else {
        switchLang('ja');
    }
}


// --- ⚔️ アリーナ画像スライダー制御（テキスト連動版） ---
let currentSlideIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.arena-img-item');
    const dots = document.querySelectorAll('.arena-dots .dot');
    
    if (slides.length === 0) return; // スライダーがない場合は無視
    
    // インデックスのループ処理
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;
    
    // 全ての画像を非表示、ドットを通常色に
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 対象の画像とドットだけをアクティブにする
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    updateSliderText();
}

// 言語設定と連動してスライダーの文字を更新する関数
function updateSliderText() {
    const stageTitle = document.getElementById('arena-stage-title');
    if (stageTitle) {
        stageTitle.textContent = `PvP Stage #${currentSlideIndex + 1}`;
    }
}

// 矢印ボタン用
function moveSlide(step) {
    showSlide(currentSlideIndex + step);
}

// ドットクリック用
function currentSlide(index) {
    showSlide(index);
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
});