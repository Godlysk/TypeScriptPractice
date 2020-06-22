// Custom Immutable List Data Structure
;
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
var CustomElement = /** @class */ (function () {
    function CustomElement(value) {
        this.value = value;
        this.next = undefined;
        this.previous = undefined;
    }
    return CustomElement;
}());
var CustomList = /** @class */ (function () {
    function CustomList() {
        this.top = undefined;
        this.bottom = undefined;
    }
    // O(1)
    CustomList.prototype.push = function (input) {
        var updatedList = new CustomList();
        var newTop = new CustomElement(input);
        var oldTop = this.top;
        var oldBottom = this.bottom;
        if (oldTop !== undefined) {
            // Link oldTop to newTop
            oldTop.next = newTop;
            newTop.previous = oldTop;
        }
        if (this.bottom === undefined) {
            // oldTop becomes bottom in the event that no bottom exists
            updatedList.bottom = oldTop;
        }
        else {
            // If there is an oldBottom, let it remain
            updatedList.bottom = oldBottom;
        }
        // Make newTop the new top
        updatedList.top = newTop;
        return updatedList;
    };
    // O(1)
    CustomList.prototype.pop = function () {
        var tail = new CustomList();
        var oldTop = this.top;
        var oldBottom = this.bottom;
        // The oldTop value
        var popped = oldTop.value;
        // Return an undefined value and an empty list if there is no head
        if (oldTop === undefined)
            return [undefined, tail];
        if (oldBottom === undefined)
            return [oldTop.value, tail];
        // newTop is just the element before oldTop
        var newTop = oldTop.previous;
        if (newTop.previous === undefined) {
            // If the oldBottom is the same as the newTop, the newBottom must be undefined
            tail.bottom = undefined;
        }
        else {
            // Re-use the oldBottom
            tail.bottom = oldBottom;
        }
        // Remove link from oldTop to newTop
        newTop.next = undefined;
        tail.top = newTop;
        return [popped, tail];
    };
    // O(1)
    CustomList.prototype.peekHead = function () {
        var oldTop = this.top;
        if (oldTop === undefined)
            return undefined;
        return oldTop.value;
    };
    // O(1)
    CustomList.prototype.peekTail = function () {
        var tail = new CustomList();
        var oldTop = this.top;
        var oldBottom = this.bottom;
        // If top or bottom is empty i.e. no tail elements, return an empty list
        if (oldTop === undefined || oldBottom === undefined)
            return tail;
        var newTop = oldTop.previous;
        if (newTop.previous === undefined) {
            // If the oldBottom is the same as the newTop, the newBottom must be undefined
            tail.bottom = undefined;
        }
        else {
            // Re-use the oldBottom
            tail.bottom = oldBottom;
        }
        // Do not remove link between newTop and oldTop. oldTop still exists
        tail.top = newTop;
        return tail;
    };
    // O(1)
    CustomList.prototype.concatList = function (otherList) {
        var listOneTop = this.top;
        var listOneBottom = this.bottom;
        var listTwoTop = otherList.top;
        var listTwoBottom = otherList.bottom;
        // If any list is empty return another list
        if (listTwoTop === undefined)
            return this;
        if (listOneTop === undefined)
            return otherList;
        var updatedList;
        if (listTwoBottom === undefined) {
            // If listTwo has only a head, push that head onto this list
            updatedList = this.push(listTwoTop.value);
        }
        else {
            updatedList = new CustomList();
            // Link List 1 top to List 2 bottom
            listOneTop.next = listTwoBottom;
            listTwoBottom.previous = listOneTop;
            // The new top is the top of the other list
            updatedList.top = listTwoTop;
            // If listOne has only a head, make it the bottom. Otherwise, use the existing bottom
            if (listOneBottom === undefined)
                updatedList.bottom = listOneTop;
            else
                updatedList.bottom = listOneBottom;
        }
        return updatedList;
    };
    // O(n)
    CustomList.prototype.map = function (f) {
        var oldBottom = this.bottom;
        var updatedList = new CustomList();
        // Work way upwards from bottom 
        var startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Push the new value into the updated List
            updatedList = updatedList.push(f(startPoint.value));
            startPoint = startPoint.next;
        }
        return updatedList;
    };
    // O(n * l) where l = average length of CustomList<B>
    CustomList.prototype.flatMap = function (f) {
        var oldBottom = this.bottom;
        var updatedList = new CustomList();
        // Work way upwards from bottom 
        var startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Concat the new list into the updated List
            updatedList = updatedList.concatList(f(startPoint.value));
            startPoint = startPoint.next;
        }
        return updatedList;
    };
    // O(n)
    CustomList.prototype.filter = function (predicate) {
        var oldBottom = this.bottom;
        var updatedList = new CustomList();
        // Work way upwards from bottom 
        var startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Push the updated value into the updated List if predicate is true
            if (predicate(startPoint.value))
                updatedList = updatedList.push(startPoint.value);
            startPoint = startPoint.next;
        }
        return updatedList;
    };
    // O(n)
    CustomList.prototype.fold = function (seed, accumulator) {
        var foldedList = seed;
        var oldBottom = this.bottom;
        var startPoint = oldBottom;
        while (startPoint !== undefined) {
            // Set folded list to accumulator output
            foldedList = accumulator(foldedList, startPoint.value);
            startPoint = startPoint.next;
        }
        return foldedList;
    };
    return CustomList;
}());
// O(n)
function unfold(seed, distributor) {
    // New List that we need to populate
    var unfoldedList = new CustomList();
    var output = distributor(seed);
    var value = output[0];
    var retreivedSeed = output[1];
    while (value !== undefined) {
        unfoldedList = unfoldedList.push(value);
        // Recalculate outputs with new seed
        output = distributor(retreivedSeed);
        value = output[0];
        retreivedSeed = output[1];
    }
    return [unfoldedList, retreivedSeed];
}
function printList(list) {
    var temp = list;
    while (temp.top !== undefined) {
        console.log(temp.top.value);
        temp.top = temp.top.previous;
    }
}
// --------------------------------------------------------------
//      DEBUGGING   and   TESTING
// --------------------------------------------------------------
var shiv = new CustomList();
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
var func = function (inp) {
    return inp * inp;
};
shiv = shiv.map(func);
console.log(shiv);
var acc = function (seed, value) {
    return seed + "?" + value;
};
var dist = function (seed) {
    var index = seed.lastIndexOf("?");
    if (index == -1)
        return [undefined, seed];
    var newSeed = seed.substring(0, index);
    var value = seed.substring(index + 1, seed.length);
    return [parseInt(value), newSeed];
};
var folded = shiv.fold("SHIV", acc);
console.log(folded);
var unfolded = unfold(folded, dist);
console.log(unfolded[0]);
var otherFunc = function (inp) {
    var newList = new CustomList();
    newList = newList.push(-1 * Math.sqrt(inp));
    newList = newList.push(Math.sqrt(inp));
    return newList;
};
shiv = shiv.flatMap(otherFunc);
console.log(shiv);
var out = (new CustomList().push(1)).pop();
console.log(out[0]);
console.log(out[1]);
