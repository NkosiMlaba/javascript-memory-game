/**
 * Shuffles the elements of the input array in-place using the Fisher-Yates (Knuth) algorithm.
 *
 * @param {Array} array - The array to be shuffled. The function modifies this array directly.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = { shuffleArray };
