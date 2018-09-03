/**
 * @author [Rob Southgate]
 * @email [robsouthgate4@gmail.com]
 * @create date 2018-08-13 04:39:01
 * @modify date 2018-08-13 04:39:01
 * @desc Module that can animate any scene object along a set or random path
*/

const Animation = require('Animation')
const Diagnostics = require('Diagnostics')

export default class FlightPath {
    /**
     * @param {*} object zcene object to animate
     * @param {*} positionSamplerArray array of Vec3 points to follow path
     * @param {*} rotationSamplerArray array of Vec3 rotations to follow path
     * @param {*} duration length of animation
     * @param {*} easeType easing type: Polyline / PolyBezier
     * @param {*} randomConfig Object with randomisation properties
     * @param {*} loopCount number of times to loop animation: Set to Infinity for continuous
     * @param {*} mirror creates yoyo type animation
     * @param {*} reversloop reverses animation on completion
     */
    constructor({

        object,
        positionSamplerArray = [],
        rotationSamplerArray = [],
        duration,
        easeType,
        randomConfig,
        loopCount = 1,
        mirror = false,
        reverseLoop = false,
        onCompleted}) {

        this.object = object
        this.easeType = easeType

        if (positionSamplerArray.length === 0) {
            this.positionSamplerArray = [
                [
                    object.transform.position.x.lastValue,
                    object.transform.position.y.lastValue,
                    object.transform.position.z.lastValue
                ],
                [
                    object.transform.position.x.lastValue,
                    object.transform.position.y.lastValue,
                    object.transform.position.z.lastValue
                ]
            ]
        } else {
            this.positionSamplerArray = positionSamplerArray
        }

        if (rotationSamplerArray.length === 0) {
            this.rotationSamplerArray = [
                [
                    object.transform.rotationX.lastValue,
                    object.transform.rotationY.lastValue,
                    object.transform.rotationZ.lastValue
                ],
                [
                    object.transform.rotationX.lastValue,
                    object.transform.rotationY.lastValue,
                    object.transform.rotationZ.lastValue
                ]
            ]
        } else {
            this.rotationSamplerArray = rotationSamplerArray
        }


        this.duration = duration
        this.positionDriver
        this.rotationDriver
        this.positionSampler
        this.rotationSampler
        this.randomConfig = randomConfig
        this.loopCount = loopCount
        this.mirror = mirror
        this.reverseLoop = reverseLoop
        this.onCompleted = onCompleted

        /**
         * randomConfig mode
         */
        if (randomConfig) {
            this._setupRandomMode()
            this._runSetup()
        } else {
            this._runSetup()
        }

    }

    /**
     * Run default setup
     */
    _runSetup() {
        this._buildSamplers()
        this._buildDrivers()
        this._buildAnimations()
        this._attachAnimations()
    }

    /**
     * Create a set of points with random values
     */
    _setupRandomMode() {

        let position = []

        this.positionSamplerArray = []

        for (let i = 0; i < this.randomConfig.numberOfPointsBetween; i++) {
            const rangeX = this._getRandomArbitrary(this.randomConfig.rangeX[0], this.randomConfig.rangeX[1])
            const rangeY = this._getRandomArbitrary(this.randomConfig.rangeY[0], this.randomConfig.rangeY[1])
            const rangeZ = this._getRandomArbitrary(this.randomConfig.rangeZ[0], this.randomConfig.rangeZ[1])
            position = [rangeX, rangeY, rangeZ]
            this.positionSamplerArray.push(position)
        }


        this.positionSamplerArray.unshift(this.randomConfig.start)
        this.positionSamplerArray.push(this.randomConfig.end)


    }

    _getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    /**
     * Create samplers for animation
     */
    _buildSamplers() {

        this.positionSampler = Animation.samplers[this.easeType]({
            keyframes: this.positionSamplerArray
        })

        this.rotationSampler = Animation.samplers[this.easeType]({
            keyframes: this.rotationSamplerArray
        })
    }
    /**
     * Create drivers for animation
     */
    _buildDrivers() {
        this.positionDriver =
        this.rotationDriver =
        Animation.timeDriver({durationMilliseconds: this.duration, loopCount: this.loopCount, mirror: this.mirror})

        if (this.reverseLoop) {
            this.positionDriver.onCompleted().subscribe((e) => {
                this.positionDriver.reverse()
            })
        }

        if (this.onCompleted) {
            this.positionDriver.onCompleted().subscribe(() => {
                this.onCompleted()
            })
        }

    }

    _buildAnimations() {
        this.flightAnimation = Animation.animate(this.positionDriver, this.positionSampler)
        this.rotationAnimation = Animation.animate(this.rotationDriver, this.rotationSampler)
    }

    /**
     * Attach animations to user defined object
     */
    _attachAnimations() {
        this.object.transform.x = this.flightAnimation.get(0)
        this.object.transform.y = this.flightAnimation.get(1)
        this.object.transform.z = this.flightAnimation.get(2)

        this.object.transform.rotationX = this.rotationAnimation.get(0)
        this.object.transform.rotationY = this.rotationAnimation.get(1)
        this.object.transform.rotationZ = this.rotationAnimation.get(2)
    }

    /**
     * Public methods
     */
    start() {
        this.positionDriver.stop()
        this.rotationDriver.stop()
        this.positionDriver.reset()
        this.rotationDriver.reset()
        this.positionDriver.start()
        this.rotationDriver.start()

        return this.positionDriver
    }

    reset() {
        this.positionDriver.reset()
        this.rotationDriver.reset()
    }

    stop() {
        this.positionDriver.stop()
        this.rotationDriver.stop()
    }


}
