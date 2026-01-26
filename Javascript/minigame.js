// Grab our elements
const cauldron = document.getElementById('cauldron');
const statusText = document.getElementById('status-text');
const potions = document.querySelectorAll('.potion');
const resetBtn = document.getElementById('reset-btn');

let currentMix = [];

// 1. Start dragging the potions around
potions.forEach(potion => {
    potion.addEventListener('dragstart', (e) => {
        // Send the data-type attribute to the cauldron
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
    });
});

// 2. Drag over allowing to put the potion
cauldron.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    cauldron.classList.add('drag-over');
});

// 3. Drag the potion away
cauldron.addEventListener('dragleave', () => {
    cauldron.classList.remove('drag-over');
});

// 4. Drop the potion into the cauldron
cauldron.addEventListener('drop', (e) => {
    e.preventDefault();
    cauldron.classList.remove('drag-over');

    const ingredient = e.dataTransfer.getData('text/plain');

    if (currentMix.length < 2) {
        currentMix.push(ingredient);
        statusText.innerText = `Added ${ingredient}... need 1 more.`;

        if (currentMix.length === 2) {
            processFormula();
        }
    }
});

// 5. The result of mixing
function processFormula() {
    cauldron.classList.add('mixing');
    statusText.innerText = "Brewing...";

    setTimeout(() => {
        cauldron.classList.remove('mixing');
        const formula = currentMix.sort().join(' + ');

        const recipes = {
            'Fire + Ice': 'Steam Vapor!',
            'Fire + Light': 'Sun Essence!',
            'Ice + Light': 'Aurora Borealis!',
            'Fire + Fire': 'Pure Magma!',
            'Light + Light': "Thunderstorm!",
            'Shadow + Light': 'Twilight Essence!',
            'Light + Shadow': 'Twilight Essence!',
            'Nature + Fire': 'Ash Powder!',
            'Fire + Nature': 'Ash Powder!',
            'Nature + Ice': 'Permanent Frost Plant!',
            'Ice + Nature': 'Permanent Frost Plant!',
            'Arcane + Shadow': 'Void Rift!',
            'Shadow + Arcane': 'Void Rift!',
            'Metal + Fire': "Molten Steel!",
            'Fire + Metal': "Molten Steel!",
            'Arcane + Arcane': 'Pure Mana!',
            'Nature + Shadow': 'NightShade Venom!',
            'Shadow + Nature': 'NightShade Venom!',
            'Metal + Light': 'Holy Armor!',
            'Light + Metal': 'Holy Armor!',
            'Fire + Wind': 'Blaze Gale!',
            'Wind + Fire': 'Blaze Gale!',
            'Wind + Light': 'Ascension Brew!',
            'Light + Wind': 'Ascension Brew!'
        };

        const result = recipes[formula] || "A Failed Experiment x_x";
        statusText.innerHTML = `<strong>Result: ${result}</strong>`;
    }, 1200); // 1.2 second delay for "brewing" effect
}

// 6. Reset the cauldron
resetBtn.addEventListener('click', () => {
    currentMix = [];
    statusText.innerText = "Select two ingredients to begin...";
});

window.addEventListener('load', function() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
});