// ローディング画面（4-1-6手書き風。同一セッション内の2回目以降はスキップ）
(function() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    // アニメーションを減らす設定のユーザーにはローディングを表示しない
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || sessionStorage.getItem('rimacafe_splash_shown')) {
        // サイト内を行き来している間はローディングを表示しない
        splash.style.display = 'none';
        return;
    }
    sessionStorage.setItem('rimacafe_splash_shown', '1');

    // ローディング中はヒーローの文字を隠しておく（明けてからフェードイン）
    document.body.classList.add('splash-active');

    // ※window.load（全画像・フォント読み込み完了）を待つと、モバイル回線では
    // ヒーロー画像等の読み込みが遅い分だけ表示時間が延びてしまうため、
    // splash自身のロゴ演出（2.8秒）だけを基準にフェードアウトする
    setTimeout(function() {
        splash.classList.add('fadeout');
        document.body.classList.remove('splash-active');
        setTimeout(function() {
            splash.style.display = 'none';
        }, 900);
    }, 2800);
})();

// スクロール途中からヘッダーが縮小して固定（5-1-8）
// ＋下スクロール中は隠し、上スクロールで再表示（UpMove/DownMove）
(function() {
    const header = document.querySelector('header');
    if (!header) return;
    const headerH = header.offsetHeight;
    let lastScrollY = window.scrollY;

    function fixedHeader() {
        const currentY = window.scrollY;

        if (currentY >= headerH * 2) {
            header.classList.add('height-min');

            // ハンバーガーメニューが開いている間は隠さない
            const gnavOpen = document.getElementById('g-nav')?.classList.contains('panelactive');
            if (!gnavOpen) {
                if (currentY > lastScrollY) {
                    header.classList.add('header-hide'); // 下スクロール → 隠す
                } else {
                    header.classList.remove('header-hide'); // 上スクロール → 再表示
                }
            }
        } else {
            header.classList.remove('height-min');
            header.classList.remove('header-hide');
        }

        lastScrollY = currentY;
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

// スクロール進捗バー（Scrollgress）
(function() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function updateProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    window.addEventListener('load', updateProgress);
})();

// トップへ戻るボタン（8-1-2：指定の高さを超えたら下から出現）
(function() {
    const pageTop = document.getElementById('page-top');
    if (!pageTop) return;
    let shown = false;

    function togglePageTop() {
        if (window.scrollY > window.innerHeight) {
            if (!shown) {
                pageTop.classList.add('up-move');
                pageTop.classList.remove('down-move');
                shown = true;
            }
        } else if (shown) {
            pageTop.classList.add('down-move');
            pageTop.classList.remove('up-move');
            shown = false;
        }
    }

    window.addEventListener('scroll', togglePageTop);
})();

// ナビの現在地ハイライト（5-1-26）
(function() {
    const navLinks = document.querySelectorAll('header ul li a[href^="#"]');
    if (!navLinks.length) return;
    const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    function highlightCurrent() {
        const pos = window.scrollY + 80; // 固定ヘッダー分のオフセット
        let currentId = sections[0] ? sections[0].id : null;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop) currentId = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('current', a.getAttribute('href') === '#' + currentId);
        });
    }

    window.addEventListener('scroll', highlightCurrent);
    window.addEventListener('load', highlightCurrent);
})();

// スクロールアニメーション
document.addEventListener('DOMContentLoaded', function() {
    // 主要な見出しに下線アニメーション用のクラスを付与（5-3-3）
    // ※h3はpaddingがなく線が文字に重なるためh2のみ
    document.querySelectorAll('section h2').forEach(h => {
        h.classList.add('line-heading');
    });

    // アニメーション対象の要素を取得
    const fadeElements = document.querySelectorAll('.fade-in, .pop-in, .line-heading');
    
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