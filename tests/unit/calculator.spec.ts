import {sum} from "../../src/calculator";
import {test, expect} from 'vitest'

test('sum to positive numbers', ()=> {
    expect(sum(1, 2)).toEqual(3)
})