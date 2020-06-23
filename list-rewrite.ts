import * as assert from 'assert'

class Leaf<A> {

    value: A | undefined;
    branch: Leaf<A> | undefined;

    constructor() {
        this.value = undefined;
        this.branch = undefined;
    }

    push(input: A): Leaf<A> {
        let newLeaf = new Leaf<A>();
        newLeaf.value = input;
        newLeaf.branch = this;
        return newLeaf;
    }

    pop(): [A | undefined, Leaf<A> | undefined] {
        return [this.value, this.branch];
    }

    head(): A | undefined {
        return this.value;
    }

    tail(): Leaf<A> {
        return this.branch;
    }

    concat(otherLeaf: Leaf<A>): Leaf<A> {

        let temporary = new Leaf<A>();

        let current = otherLeaf;
        while (current.value !== undefined) {
            temporary = temporary.push(current.value);
            current = current.branch;
        }

        current = temporary;
        let finalLeaf = this as Leaf<A>;

        while (current.value !== undefined) {
            finalLeaf = finalLeaf.push(current.value);
            current = current.branch;
        }

        return finalLeaf;
        
    }

    map<B>(f: (input: A) => B): Leaf<B> {
        
        let temporary = new Leaf<A>();

        let current = this as Leaf<A>;
        while (current.value !== undefined) {
            temporary = temporary.push(current.value);
            current = current.branch;
        }

        current = temporary;
        let finalLeaf = new Leaf<B>();

        while (current.value !== undefined) {
            finalLeaf = finalLeaf.push(f(current.value));
            current = current.branch;
        }

        return finalLeaf;
    }

    flatMap<B>(f: (input: A) => Leaf<B>): Leaf<B> {
        
        let temporary = new Leaf<A>();

        let current = this as Leaf<A>;
        while (current.value !== undefined) {
            temporary = temporary.push(current.value);
            current = current.branch;
        }

        current = temporary;
        let finalLeaf = new Leaf<B>();

        while (current.value !== undefined) {
            finalLeaf = finalLeaf.concat(f(current.value));
            current = current.branch;
        }

        return finalLeaf;
    }

    filter(predicate: (input: A) => boolean): Leaf<A> {
        
        let temporary = new Leaf<A>();

        let current = this as Leaf<A>;
        while (current.value !== undefined) {
            temporary = temporary.push(current.value);
            current = current.branch;
        }

        current = temporary;
        let finalLeaf = new Leaf<A>();

        while (current.value !== undefined) {
            if (predicate(current.value)) finalLeaf = finalLeaf.push(current.value);
            current = current.branch;
        }

        return finalLeaf;
    }


    fold<S>(seed: S, accumulator: (seed: S, value: A) => S): S {

        let foldedLeaf = seed;
        let temporary = new Leaf<A>();

        let current = this as Leaf<A>;
        while (current.value !== undefined) {
            temporary = temporary.push(current.value);
            current = current.branch;
        }

        current = temporary;

        while (current.value !== undefined) {
            foldedLeaf = accumulator(foldedLeaf, current.value);
            current = current.branch;
        }

        return foldedLeaf;

    }


}


// # Evaluate
// Handling of edge cases
// Performance ie time / space complexity (use judgement) A - F
// Purely functional (Extra) - No Side Effect, No Mutable State, No Exceptions
// 20 June 2020 4:20 -> 22 June 2020 11:00 am 


const concatStr = (a: string, b: string) => a + b

const emp = new Leaf<string>();

assert.strictEqual(emp.fold('', concatStr), '')
assert.strictEqual(emp.fold('ABC', concatStr), 'ABC')
assert.strictEqual(emp.push('A').push('B').fold('', concatStr), 'AB')
assert.strictEqual(emp.push('A').push('B').map(s => s + s.toLowerCase()).fold('', concatStr), 'AaBb')
assert.strictEqual(emp.push('A').concat(emp.push('B')).fold('', concatStr), 'AB')
assert.strictEqual(emp.push('A0').push('A1').concat(emp.push('B0').push('B1')).fold('', concatStr), 'A0A1B0B1')
assert.strictEqual(emp.push('A').push('B').flatMap(item => emp.push(item)).fold('', concatStr), 'AB')
assert.strictEqual(emp.push('A').push('B').filter(_ => true).fold('', concatStr), 'AB')
assert.strictEqual(emp.push('A').push('B').filter(_ => false).fold('', concatStr), '')
assert.strictEqual(emp.push('A').push('B').push('B').filter(_ => _ ===  'B').fold('', concatStr), 'BB')

// FAIL
assert.strictEqual(emp.push('A').fold('', concatStr), 'A')
assert.strictEqual(emp.push('A').map(s => s + s.toLowerCase()).fold('', concatStr), 'Aa')
assert.strictEqual(emp.push('A').flatMap(item => emp.push(item)).fold('', concatStr), 'A')
assert.strictEqual(emp.push('A').push('B').filter(_ => _ ===  'B').fold('', concatStr), 'B')

const shiv = new Leaf<string>();

const a = shiv.push('A').push('B')
const b = a.push('C')

assert.strictEqual(a.fold('', (a, b) => a + b), 'AB') 
assert.strictEqual(b.fold('', (a, b) => a + b), 'ABC')


