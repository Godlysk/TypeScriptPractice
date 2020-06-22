// Custom Immutable List Data Structure

interface List<A> {

    // Pushes an element to the head
    push<A>(A: A): List<A>; // Done

    // Pops the head
    pop<A>(): [A | undefined, List<A>]; // Done

    // Maps a function to all elements of the list
    map<B>(ab: (A: A) => B): List<B>  // Done

    // Flattens a list of lists.
    flatMap<B>(ab: (A: A) => List<B>): List<B> // TODO

    // Creates a new list with elements that pass the predicate
    filter(predicate: (a: A) => boolean): List<A> // Done

    // Combines two lists and returns a new one.
    concat(other: List<A>): List<A> // Done


    //Head, tail done

};

/*
class CustomList<A> {

    head: A | undefined;
    tail: CustomList<A> | undefined;
    genesis_tail: CustomList<A> | undefined;

    constructor() {
        this.head = undefined;
        this.tail = undefined;
        this.genesis_tail = undefined;
    }

    // head -> O(1)
    // tail -> O(1)
    // pop -> O(1)
    // push -> O(1)
    // concat -> O(1)
    // filter -> O(n)

    push(input: A): CustomList<A> {
        let updated = new CustomList<A>();
        updated.head = input;
        updated.tail = this;
        return updated;
    }

    pop(): [A | undefined, CustomList<A> | undefined] {
        if (this.tail === undefined) return [this.head, this.genesis_tail];
        return [this.head, this.tail];
    }

    peekHead(): A | undefined {
        return this.head;
    }

    peekTail(): CustomList<A> {
        if (this.tail === undefined) return this.genesis_tail;
        return this.tail;
    }

    concat(otherList: CustomList<A>): CustomList<A> {
        
        let updated = new CustomList<A>();
        updated.head = otherList.head;
        updated.tail = otherList.tail;
        updated.genesis_tail = this;

        
        let temporary = otherList;
        while (temporary.tail !== undefined) {
            updated.push(temporary.head);
            temporary = temporary.tail;
        }
        return updated;
        

        console.log(updated);
        return updated;
    }

}
*/

// Ideas for accumulator
// Convert to integer, and write an algorithm to encode and decode
// Convert to string, and split by seed character (makes more sense)


class CustomElement<A> {

    value: A | undefined;

    // What comes before 
    previous: CustomElement<A> | undefined;

    // What comes after
    next: CustomElement<A> | undefined;

    constructor(value: A) {
        this.value = value;
        this.next = undefined;
        this.previous = undefined;
    }

}

class CustomList<A> {

    // Top is the head of the structure
    top: CustomElement<A> | undefined;

    // Bottom is the base of the structure
    bottom: CustomElement<A> | undefined;

    constructor() {
        this.top = undefined;
        this.bottom = undefined;
    }

    // O(1)
    push(input: A): CustomList<A> {

        let updatedList = new CustomList<A>();

        let newTop = new CustomElement<A>(input);

        let oldTop = this.top;
        let oldBottom = this.bottom;

        if (oldTop !== undefined) {
            // Link oldTop to newTop
            oldTop.next = newTop;
            newTop.previous = oldTop;
        }

        if (this.bottom === undefined) {
            // oldTop becomes bottom in the event that no bottom exists
            updatedList.bottom = oldTop;
        } else {
            // If there is an oldBottom, let it remain
            updatedList.bottom = oldBottom;
        }

        // Make newTop the new top
        updatedList.top = newTop;

        return updatedList;

    }

    // O(1)
    pop(): [A | undefined, CustomList<A>] {
        
        let tail = new CustomList<A>();

        let oldTop = this.top;
        let oldBottom = this.bottom;

        // The oldTop value
        let popped = oldTop.value;

        // Return an undefined value and an empty list if there is no head
        if (oldTop === undefined) return [undefined, tail];
        if (oldBottom === undefined) return [oldTop.value, tail];


        // newTop is just the element before oldTop
        let newTop = oldTop.previous;
        
        if (newTop.previous === undefined) {
            // If the oldBottom is the same as the newTop, the newBottom must be undefined
            tail.bottom = undefined;
        } else {
            // Re-use the oldBottom
            tail.bottom = oldBottom;
        }

        // Remove link from oldTop to newTop
        newTop.next = undefined;

        tail.top = newTop;

        return [popped, tail];
    }


    // O(1)
    peekHead(): A | undefined {

        let oldTop = this.top;
        if (oldTop === undefined) return undefined;
        return oldTop.value;

    }

    // O(1)
    peekTail(): CustomList<A> {

        let tail = new CustomList<A>();

        let oldTop = this.top;
        let oldBottom = this.bottom;

        // If top or bottom is empty i.e. no tail elements, return an empty list
        if (oldTop === undefined || oldBottom === undefined) return tail;

        let newTop = oldTop.previous;

        if (newTop.previous === undefined) {
            // If the oldBottom is the same as the newTop, the newBottom must be undefined
            tail.bottom = undefined;
        } else {
            // Re-use the oldBottom
            tail.bottom = oldBottom;
        }

        // Do not remove link between newTop and oldTop. oldTop still exists
        tail.top = newTop;

        return tail;
    }

    // O(1)
    concatList(otherList: CustomList<A>): CustomList<A> {

        let listOneTop = this.top;
        let listOneBottom = this.bottom;

        let listTwoTop = otherList.top;
        let listTwoBottom = otherList.bottom;

        // If any list is empty return another list
        if (listTwoTop === undefined) return this;
        if (listOneTop === undefined) return otherList;

        let updatedList;

        if (listTwoBottom === undefined) {
            // If listTwo has only a head, push that head onto this list
            updatedList = this.push(listTwoTop.value);
        } else {
            updatedList = new CustomList<A>();

            // Link List 1 top to List 2 bottom
            listOneTop.next = listTwoBottom;
            listTwoBottom.previous = listOneTop;

            // The new top is the top of the other list
            updatedList.top = listTwoTop;
            
            // If listOne has only a head, make it the bottom. Otherwise, use the existing bottom
            if (listOneBottom === undefined) updatedList.bottom = listOneTop;
            else updatedList.bottom = listOneBottom;

        }

        return updatedList;

    }

    // O(n)
    map<B>(f: (input: A) => B): CustomList<B> {
        
        let oldBottom = this.bottom;
        let updatedList = new CustomList<B>();

        // Work way upwards from bottom 
        let startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Push the new value into the updated List
            updatedList = updatedList.push(f(startPoint.value));
            startPoint = startPoint.next;
        }

        return updatedList;
    }


    // O(n * l) where l = average length of CustomList<B>
    flatMap<B>(f: (input: A) => CustomList<B>): CustomList<B> {
        let oldBottom = this.bottom;
        let updatedList = new CustomList<B>();

        // Work way upwards from bottom 
        let startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Concat the new list into the updated List
            updatedList = updatedList.concatList(f(startPoint.value));
            startPoint = startPoint.next;
        }

        return updatedList;
    }

    // O(n)
    filter(predicate: (input: A) => boolean): CustomList<A> {
        
        let oldBottom = this.bottom;
        let updatedList = new CustomList<A>();

        // Work way upwards from bottom 
        let startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Push the updated value into the updated List if predicate is true
            if (predicate(startPoint.value)) updatedList = updatedList.push(startPoint.value);
            startPoint = startPoint.next;
        }

        return updatedList;
    }


    // O(n)
    fold<S>(seed: S, accumulator: (seed: S, value: A) => S): S {
        
        let foldedList = seed;
        let oldBottom = this.bottom;

        let startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Set folded list to accumulator output
            foldedList = accumulator(foldedList, startPoint.value);
            startPoint = startPoint.next;
        }

        return foldedList;
    }

}


// O(n)
function unfold<S, A>(seed: S, distributor: (seed: S) => [A | undefined, S]): [CustomList<A>, S | undefined] {
    
    // New List that we need to populate
    let unfoldedList = new CustomList<A>();

    let output = distributor(seed);
    let value = output[0];
    let retreivedSeed = output[1];

    while (value !== undefined) {
        unfoldedList = unfoldedList.push(value);

        // Recalculate outputs with new seed
        output = distributor(retreivedSeed);
        value = output[0];
        retreivedSeed = output[1];
    }

    return [unfoldedList, retreivedSeed];
}



function printList(list: CustomList<any>): void {
    let temp = list;
    while (temp.top !== undefined) {
        console.log(temp.top.value);
        temp.top = temp.top.previous;
    }
}


// --------------------------------------------------------------
//      DEBUGGING   and   TESTING
// --------------------------------------------------------------


let shiv = new CustomList<number>();

console.log(shiv);
console.log("------");

shiv = shiv.push(2);

console.log(shiv);
console.log("------");

shiv = shiv.push(3);

console.log(shiv);
console.log("------");

shiv = shiv.push(4);

console.log(shiv);
console.log("------");

const func = (inp: number): number => {
    return inp * inp;
}

shiv = shiv.map(func);

console.log(shiv);

const acc = (seed: string, value: number):string => {
    return seed + "?" + value;
}

const dist = (seed: string):[number | undefined, string] => {
    
    let index = seed.lastIndexOf("?");

    if (index == -1) return [undefined, seed];

    let newSeed = seed.substring(0, index);
    let value = seed.substring(index+1, seed.length);

    return [parseInt(value), newSeed];

}


let folded = shiv.fold("SHIV", acc);

console.log(folded);

let unfolded = unfold(folded, dist);

console.log(unfolded[0]);

const otherFunc = (inp: number): CustomList<number> => {
    let newList = new CustomList<number>();
    newList = newList.push(-1 * Math.sqrt(inp));
    newList = newList.push(Math.sqrt(inp));

    return newList;
}

shiv = shiv.flatMap(otherFunc);

console.log(shiv);

let out = (new CustomList<number>().push(1)).pop();
console.log(out[0]);
console.log(out[1]);
