const { shuffleArray } = require('../shuffleArray.js');

describe('shuffleArray', () => {
    test('should shuffle the array', () => {
        const array = [1, 2, 3, 4, 5];
        const originalArray = [...array]; // Copy the original array
        shuffleArray(array);
        
        // Check if the shuffled array is different from the original array
        expect(array).not.toEqual(originalArray);
        
        // Ensure the shuffled array still contains the same elements
        expect(array.sort()).toEqual(originalArray.sort());
    });
});
