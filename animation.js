// ローディング画面（4-1-6手書き風。同一セッション内の2回目以降はスキップ）
(function() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    if (sessionStorage.getItem('rimacafe_splash_shown')) {
        // サイト内を行き来している間はローディングを表示しない
        splash.style.display = 'none';
        return;
    }
    sessionStorage.setItem('rimacafe_splash_shown', '1');

    window.addEventListener('load', function() {
        setTimeout(function() {
            splash.classList.add('fadeout');
            setTimeout(function() {
                splash.style.display = 'none';
            }, 900);
        }, 2800); // 描画アニメーション完了を待ってからフェードアウト
    });
})();

// スクロール途中からヘッダーが縮小して固定（5-1-8）
(function() {
    const header = document.querySelector('header');
    if (!header) return;
    const headerH = header.offsetHeight;

    function fixedHeader() {
        if (window.scrollY >= headerH * 2) {
            header.classList.add('height-min');
        } else {
            header.classList.remove('height-min');
        }
    }

    window.addEventListener('scroll', fixedHeader);
    window.addEventListener('load', fixedHeader);
})();

// ハンバーガーメニュー（5-2-1：3本線が×に＋ナビが右からスライドイン）
(function() {
    const openbtn = document.getElementById('openbtn');
    const gnav = document.getElementById('g-nav');
    if (!openbtn || !gnav) return;

    openbtn.addEventListener('click', function() {
        openbtn.classList.toggle('active');
        gnav.classList.toggle('panelactive');
    });

    // ナビのリンクをクリックしたらメニューを閉じる
    gnav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            openbtn.classList.remove('active');
            gnav.classList.remove('panelactive');
        });
    });
})();

// スクロールアニメーション
document.addEventListener('DOMContentLoaded', function() {
    // アニメーション対象の要素を取得
    const fadeElements = document.querySelectorAll('.fade-in, .pop-in');
    
    // Intersection Observer のオプション
    const options = {
        root: null, // ビューポートをルートとする
        rootMargin: '0px 0px -100px 0px', // 下から100px手前で発火
        threshold: 0.1 // 10%表示されたら発火
    };
    
    // Intersection Observer のコールバック関数
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 表示領域に入ったらアニメーションを開始
                entry.target.classList.add('is-visible');
                // 一度表示したら監視を解除（再度非表示にしない場合）
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Intersection Observer のインスタンス作成
    const observer = new IntersectionObserver(callback, options);
    
    // 各要素を監視
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// スムーススクロール（既存のものを上書きしない場合）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});