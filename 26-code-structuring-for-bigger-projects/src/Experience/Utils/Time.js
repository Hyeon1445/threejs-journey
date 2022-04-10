import EventEmitter from "./EventEmitter.js"

export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        // console.log(this.start)
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick () {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        // console.log(this.delta) // 16,17,18
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}