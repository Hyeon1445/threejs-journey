export default class Robot {
    constructor(name, legs) {
        this.name = name
        this.legs = legs
        console.log(`robot name is ${name}`)
    }
    sayHi() {
        console.log(`hello ${this.name}`)
    }
}
