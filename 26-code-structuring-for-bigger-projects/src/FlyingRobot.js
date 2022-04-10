import Robot from './Robot.js'

export default class FlyingRobot extends Robot {
    constructor(name, legs) {
        super(name, legs) // extends에서는 constructor쓰려면 super 호출!, base가 되는 class를 참조
        super.sayHi() // FlyingRobot의 sayHi가 아닌 원본인 Robot의 sayHi
        this.sayHi() // FlyingRobot의 sayHi
    }
    sayHi() { // override
        console.log('flyingrobot sayHi')
    }
    takeOff() {
        console.log(`take off ${this.name}`)
    }
    land() {
        console.log(`land ${this.name}`)
    }
}