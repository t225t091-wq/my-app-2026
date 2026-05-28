document.addEventListener('DOMContentLoaded', () => {
    const moodGrid = document.getElementById('mood-grid');
    const moodSelection = document.getElementById('mood-selection');
    const recipeDisplay = document.getElementById('recipe-display');
    const recipeCard = document.getElementById('recipe-card');
    const backButton = document.getElementById('back-button');
    const subtitle = document.querySelector('.subtitle');

    // 気分ボタンを生成
    moods.forEach(mood => {
        const moodItem = document.createElement('div');
        moodItem.className = 'mood-item';
        moodItem.innerHTML = `
            <span class="mood-emoji">${mood.emoji}</span>
            <span class="mood-name">${mood.name}</span>
        `;
        moodItem.addEventListener('click', () => showRecipe(mood.name));
        moodGrid.appendChild(moodItem);
    });

    // レシピを表示
    function showRecipe(moodName) {
        // ローディング演出
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
            
            // スムーズにトップへ
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

    // 戻るボタン
    backButton.addEventListener('click', () => {
        recipeDisplay.classList.add('hidden');
        moodSelection.classList.remove('hidden');
        subtitle.textContent = "今の気分は？";
    });
});
