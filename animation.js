// スクロールアニメーション
document.addEventListener('DOMContentLoaded', function() {
    // アニメーション対象の要素を取得
    const fadeElements = document.querySelectorAll('.fade-in');
    
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