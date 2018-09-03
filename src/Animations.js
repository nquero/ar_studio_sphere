/**
 * @author Rob Southgate <robsouthgate4@gmail.com>
 */
import FlightPath from './modules/FlightPath'



const Diagnostics = require("Diagnostics")
const Reactive = require("Reactive")
const Scene = require("Scene")
const FaceTracking = require('FaceTracking')
const Materials = require('Materials')
const Networking = require('Networking')
const Time = require('Time')
const Animation = require('Animation')
const TouchGestures = require('TouchGestures')
const Patches = require('Patches')



export default class Animations {

static sphereAnimation(object){

    return new FlightPath({
    object,

    positionSamplerArray: [
        [20.11, 76, 0],
        [5, 6, 0],
        [0, 0, 5],
        [15, 2, 0],
        [0, 13, 0],
        [-15, 16, 0],
        [5, 12, -5],
        [0, 40, -2],
        [8.5, 18.0, 0]
    ],
    
    duration: 18000,
    easeType: 'polybezier', // polyline,,
    loopCount: Infinity,
    mirror: true,


    randomConfig: { // if defined, will override any previously provided positions
        start: [20.11, 76, 0],
        end: [8.5, 18.0, 0],
        rangeX: [-20, 20],
        rangeY: [-20, 20],
        rangeZ: [0, 1],
        numberOfPointsBetween: 6
    }
        })
    }
}
