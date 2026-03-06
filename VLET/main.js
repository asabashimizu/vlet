/**
 * main.js - 整合了菜單切換、搜索欄、加載更多功能，並修復了錯誤
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- 核心元素選擇 ---
    const topMenu = document.getElementById('topMenu');           // 側邊欄菜單容器
    const menuBtn = document.getElementById('menuBtn');           // 漢堡菜單/開啟菜單按鈕
    const closeMenuBtn = document.getElementById('closeMenuBtn'); // 關閉菜單按鈕
    
    const searchBtn = document.getElementById('searchBtn');       // 搜索切換按鈕
    const searchBar = document.getElementById('searchBar');       // 搜索欄容器

    const feedbackBtn = document.getElementById('feedbackBtn');   // 意見回饋開啟按鈕
    // 假設 feedbackModal 和 submitFeedback 在您的 HTML 中存在
    const feedbackModal = document.getElementById('feedbackModal');
    const submitFeedback = document.getElementById('submitFeedback');
    
    // 加載更多功能元素
    const articles = document.querySelectorAll('#all-news-container .news-list article');
    const loadMoreBtn = document.querySelector('.load-more-button');
    
    // --- 工具函數 ---
    function toggleBodyScroll(shouldFreeze) {
        if (shouldFreeze) {
            body.classList.add('no-scroll');
        } else {
            body.classList.remove('no-scroll');
        }
    }

    // --- 1. 菜單 (topMenu) 邏輯 ---
    if (menuBtn && topMenu && closeMenuBtn) {
        menuBtn.addEventListener('click', () => {
            topMenu.classList.add('active');
            toggleBodyScroll(true); // 菜單打開，凍結滾動
        });

        closeMenuBtn.addEventListener('click', () => {
            topMenu.classList.remove('active');
            toggleBodyScroll(false); // 菜單關閉，恢復滾動
        });
    }

    // --- 2. 搜索欄 (searchBar) 邏輯 ---
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', function() {
            // 切換 .is-open class
            searchBar.classList.toggle('is-open');
            // 讓按鈕在打開/關閉時改變外觀
            this.classList.toggle('active'); 
            
            // 由於搜索欄是全寬的，如果它完全覆蓋內容，您可以選擇凍結滾動
            // 但如果它只是頂部的一個欄位，通常不需要凍結。這裡保持不凍結。
        });
    }

    // --- 3. 意見回饋 (Feedback Modal) 邏輯 ---
    if (feedbackBtn && feedbackModal && submitFeedback) {
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.classList.add('active');
            // 建議打開 Modal 時也凍結滾動
            toggleBodyScroll(true); 
        });

        // 點擊 Modal 外部關閉
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.classList.remove('active');
                toggleBodyScroll(false); // 關閉 Modal，恢復滾動
            }
        });

        // 提交邏輯
        submitFeedback.addEventListener('click', () => {
            const department = document.getElementById('departmentSelect').value;
            if (department && department !== 'Chọn cơ quan') {
                // 這裡應該先關閉 modal，再跳轉
                feedbackModal.classList.remove('active');
                toggleBodyScroll(false);
                window.location.href = 'complaint_' + department + '.html';
            }
        });
    }


    // --- 4. 加載更多新聞 (Load More) 邏輯 ---

});
// main.js - 整合新的 .center-cta-button 結構來實現 Load More 邏輯

// ----------------------------------------------------------------------
// 🚨 變量選擇器更新 🚨
// ----------------------------------------------------------------------

const articles = document.querySelectorAll('#all-news-container .news-list article');
// ⭐️ 關鍵變更：選擇器現在是 .center-cta-button ⭐️
const loadMoreBtn = document.querySelector('.center-cta-button'); 

// 獲取按鈕內部的文本和圖標元素
const ctaTextSpan = loadMoreBtn ? loadMoreBtn.querySelector('.cta-text') : null;
const ctaIconSpan = loadMoreBtn ? loadMoreBtn.querySelector('.cta-icon') : null;

// ... (其他菜單/搜索欄等邏輯在上面保持不變) ...

// --- 加載更多邏輯開始 ---

const loadCount = 6;
const initialCount = 6;
let currentlyVisible = initialCount; 

// 確保文章強制設置 flex-direction: column
if (articles && articles.length > 0) {
    articles.forEach(article => {
        article.style.flexDirection = 'column';
    });
}

// 確保按鈕和核心元素存在，且文章多於初始數量
if (loadMoreBtn && articles.length > initialCount && ctaTextSpan) {


    function updateButtonState() {
        if (currentlyVisible >= articles.length) {
            // ⭐️ 更新文本：顯示結束信息 ⭐️
            ctaTextSpan.textContent = '無更多信息';
            loadMoreBtn.disabled = true;
            
            // 隱藏按鈕 (或容器)
            loadMoreBtn.style.display = 'none'; 
            
            // 隱藏圖標
            if (ctaIconSpan) {
                ctaIconSpan.style.display = 'none';
            }
            
        } else {
            // ⭐️ 更新文本：顯示加載信息 ⭐️
            ctaTextSpan.textContent = `點擊顯示 新的${loadCount} 個`;
            loadMoreBtn.disabled = false;
            
            // 顯示圖標
            if (ctaIconSpan) {
                // 確保按鈕和圖標是可見的
                loadMoreBtn.style.display = 'flex'; 
                ctaIconSpan.style.display = 'block'; 
            }
        }
    }

    loadMoreBtn.addEventListener('click', () => {
        
        const nextBatchEnd = Math.min(currentlyVisible + loadCount, articles.length);

        for (let i = currentlyVisible; i < nextBatchEnd; i++) {
            articles[i].style.display = 'flex'; 
        }

        currentlyVisible = nextBatchEnd;
        updateButtonState();
    });

    // 執行加載更多功能的初始化
    initializeDisplay();
} else if (loadMoreBtn) {
    // 文章數量不足，隱藏按鈕
    loadMoreBtn.style.display = 'none';
}