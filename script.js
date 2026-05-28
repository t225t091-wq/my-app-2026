document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const moodGrid = document.getElementById('mood-grid');
    const moodSelection = document.getElementById('mood-selection');
    const recipeDisplay = document.getElementById('recipe-display');
    const recipeCard = document.getElementById('recipe-card');
    const backButton = document.getElementById('back-button');
    const subtitle = document.querySelector('.subtitle');
    
    // ナビゲーション関連
    const navHome = document.getElementById('nav-home');
    const navCommunity = document.getElementById('nav-community');
    const recipeSectionContainer = document.getElementById('recipe-section-container');
    const communitySection = document.getElementById('community-section');

    // コミュニティ関連
    const postForm = document.getElementById('post-form');
    const postMoodSelect = document.getElementById('post-mood');
    const communityFeed = document.getElementById('community-feed');

    // 初期化
    initMoods();
    renderCommunityFeed();

    // 気分ボタンとセレクトボックスを生成
    function initMoods() {
        moods.forEach(mood => {
            // 気分グリッド用
            const moodItem = document.createElement('div');
            moodItem.className = 'mood-item';
            moodItem.innerHTML = `
                <span class="mood-emoji">${mood.emoji}</span>
                <span class="mood-name">${mood.name}</span>
            `;
            moodItem.addEventListener('click', () => showRecipe(mood.name));
            moodGrid.appendChild(moodItem);

            // 投稿フォーム用
            const option = document.createElement('option');
            option.value = mood.name;
            option.textContent = `${mood.emoji} ${mood.name}`;
            postMoodSelect.appendChild(option);
        });
    }

    // レシピ表示ロジック
    function showRecipe(moodName) {
        subtitle.textContent = "考え中...";
        moodGrid.style.pointerEvents = 'none';
        moodGrid.style.opacity = '0.5';

        setTimeout(() => {
            const filteredRecipes = recipes.filter(r => r.mood === moodName);
            const recipe = filteredRecipes.length > 0 
                ? filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)]
                : {
                    title: `${moodName}なあなたに贈る、秘密のレシピ`,
                    emoji: "✨",
                    time: "???",
                    difficulty: "???",
                    ingredients: ["愛: たっぷり", "優しさ: 少々"],
                    instructions: ["これからもっとたくさんのレシピを追加していきます！"]
                };

            renderRecipe(recipe);
            moodSelection.classList.add('hidden');
            recipeDisplay.classList.remove('hidden');
            moodGrid.style.pointerEvents = 'auto';
            moodGrid.style.opacity = '1';
            subtitle.textContent = `${moodName}のあなたへのおすすめ`;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
    }

    function renderRecipe(recipe) {
        recipeCard.innerHTML = `
            <h2 class="recipe-title">${recipe.title}</h2>
            <div class="recipe-image-placeholder">${recipe.emoji}</div>
            <div class="recipe-info">
                <span>⏱ ${recipe.time}</span>
                <span>📊 難易度: ${recipe.difficulty}</span>
            </div>
            <div class="recipe-section">
                <h3>材料</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="recipe-section">
                <h3>作り方</h3>
                <ol>
                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        `;
    }

    // タブ切り替え
    navHome.addEventListener('click', () => {
        switchTab('home');
    });

    navCommunity.addEventListener('click', () => {
        switchTab('community');
    });

    function switchTab(tab) {
        if (tab === 'home') {
            navHome.classList.add('active');
            navCommunity.classList.remove('active');
            recipeSectionContainer.classList.remove('hidden');
            communitySection.classList.add('hidden');
            subtitle.textContent = "今の気分は？";
        } else {
            navHome.classList.remove('active');
            navCommunity.classList.add('active');
            recipeSectionContainer.classList.add('hidden');
            communitySection.classList.remove('hidden');
            subtitle.textContent = "みんなの料理ギャラリー";
            renderCommunityFeed();
        }
    }

    // コミュニティフィードの描画
    function renderCommunityFeed() {
        const userPosts = JSON.parse(localStorage.getItem('moodChefPosts') || '[]');
        const allPosts = [...userPosts, ...initialCommunityPosts];

        communityFeed.innerHTML = '';
        allPosts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'community-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            const moodData = moods.find(m => m.name === post.mood) || { emoji: "🍴" };

            card.innerHTML = `
                <div class="community-card-header">
                    <div class="user-badge">
                        <div class="user-avatar">${post.avatar || '👤'}</div>
                        <span>${post.user || 'ゲストユーザー'}</span>
                    </div>
                    <span class="post-mood-tag">${moodData.emoji} ${post.mood}</span>
                </div>
                <div class="post-title-small">${post.title}</div>
                <div class="post-comment">${post.comment}</div>
            `;
            communityFeed.appendChild(card);
        });
    }

    // 投稿フォーム送信
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            user: "あなた",
            avatar: "👩‍🍳",
            title: document.getElementById('post-title').value,
            mood: document.getElementById('post-mood').value,
            comment: document.getElementById('post-comment').value
        };

        const userPosts = JSON.parse(localStorage.getItem('moodChefPosts') || '[]');
        userPosts.unshift(newPost);
        localStorage.setItem('moodChefPosts', JSON.stringify(userPosts));

        postForm.reset();
        renderCommunityFeed();
        
        // 成功フィードバック（簡易）
        const submitBtn = postForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "投稿しました！";
        submitBtn.style.background = "var(--accent-color)";
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = "";
        }, 2000);
    });

    backButton.addEventListener('click', () => {
        recipeDisplay.classList.add('hidden');
        moodSelection.classList.remove('hidden');
        subtitle.textContent = "今の気分は？";
    });
});
