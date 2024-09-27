const { shuffleArray } = require('../shuffleArray.js');

describe('shuffleArray', () => {
    test('should shuffle the array', () => {
        const array = [1, 2, 3, 4, 5];
        const originalArray = [...array];
        shuffleArray(array);
        
        expect(array).not.toEqual(originalArray);
        
        expect(array.sort()).toEqual(originalArray.sort());
    });
});
