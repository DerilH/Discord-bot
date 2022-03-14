    class Queue {
        #arr

        constructor() 
        {
            this.#arr = new Array();
        }
        
        push(song)
        {
            this.#arr.push(song)
        }

        get current() 
        {
            return this.#arr[0]
        }

        get arr() 
        {
            return this.#arr;
        }

        get empty()
        {
            if(this.#arr.length == 0) 
            {
                return true;
            } else return false;
        }

        get itemsCount() { 
            return this.#arr.length
        }

        clear()
        {
            this.#arr = [];
        }

        shift(count)
        {
            for (let index = 0; index <= count; index++) {
                this.#arr.shift();
            }
        }

        position(song) 
        {
            return this.#arr.indexOf(song);
        }

        next()
        {
           this.previousItem = this.#arr.shift();
        }
    }
module.exports = Queue