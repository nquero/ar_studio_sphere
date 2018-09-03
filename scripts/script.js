(function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Reactive = require("Reactive");

  var Scaling = function () {
      function Scaling() {
          classCallCheck(this, Scaling);
      }

      createClass(Scaling, null, [{
          key: "scaleObject",
          value: function scaleObject(object, value) {
              var lastScaleX = object.transform.scaleX.lastValue;
              object.transform.scaleX = Reactive.mul(lastScaleX, value);

              var lastScaleY = object.transform.scaleY.lastValue;
              object.transform.scaleY = Reactive.mul(lastScaleY, value);

              var lastScaleZ = object.transform.scaleZ.lastValue;
              object.transform.scaleZ = Reactive.mul(lastScaleZ, value);
          }
      }, {
          key: "example",
          get: function get$$1() {
              return 'This is an example ES6 get method';
          }
      }]);
      return Scaling;
  }();

  /**
   * @author [Rob Southgate]
   * @email [robsouthgate4@gmail.com]
   * @create date 2018-08-13 04:39:01
   * @modify date 2018-08-13 04:39:01
   * @desc Module that can animate any scene object along a set or random path
  */

  var Animation = require('Animation');
  var Diagnostics = require('Diagnostics');

  var FlightPath = function () {
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
      function FlightPath(_ref) {
          var object = _ref.object,
              _ref$positionSamplerA = _ref.positionSamplerArray,
              positionSamplerArray = _ref$positionSamplerA === undefined ? [] : _ref$positionSamplerA,
              _ref$rotationSamplerA = _ref.rotationSamplerArray,
              rotationSamplerArray = _ref$rotationSamplerA === undefined ? [] : _ref$rotationSamplerA,
              duration = _ref.duration,
              easeType = _ref.easeType,
              randomConfig = _ref.randomConfig,
              _ref$loopCount = _ref.loopCount,
              loopCount = _ref$loopCount === undefined ? 1 : _ref$loopCount,
              _ref$mirror = _ref.mirror,
              mirror = _ref$mirror === undefined ? false : _ref$mirror,
              _ref$reverseLoop = _ref.reverseLoop,
              reverseLoop = _ref$reverseLoop === undefined ? false : _ref$reverseLoop,
              onCompleted = _ref.onCompleted;
          classCallCheck(this, FlightPath);


          this.object = object;
          this.easeType = easeType;

          if (positionSamplerArray.length === 0) {
              this.positionSamplerArray = [[object.transform.position.x.lastValue, object.transform.position.y.lastValue, object.transform.position.z.lastValue], [object.transform.position.x.lastValue, object.transform.position.y.lastValue, object.transform.position.z.lastValue]];
          } else {
              this.positionSamplerArray = positionSamplerArray;
          }

          if (rotationSamplerArray.length === 0) {
              this.rotationSamplerArray = [[object.transform.rotationX.lastValue, object.transform.rotationY.lastValue, object.transform.rotationZ.lastValue], [object.transform.rotationX.lastValue, object.transform.rotationY.lastValue, object.transform.rotationZ.lastValue]];
          } else {
              this.rotationSamplerArray = rotationSamplerArray;
          }

          this.duration = duration;
          this.positionDriver;
          this.rotationDriver;
          this.positionSampler;
          this.rotationSampler;
          this.randomConfig = randomConfig;
          this.loopCount = loopCount;
          this.mirror = mirror;
          this.reverseLoop = reverseLoop;
          this.onCompleted = onCompleted;

          /**
           * randomConfig mode
           */
          if (randomConfig) {
              this._setupRandomMode();
              this._runSetup();
          } else {
              this._runSetup();
          }
      }

      /**
       * Run default setup
       */


      createClass(FlightPath, [{
          key: '_runSetup',
          value: function _runSetup() {
              this._buildSamplers();
              this._buildDrivers();
              this._buildAnimations();
              this._attachAnimations();
          }

          /**
           * Create a set of points with random values
           */

      }, {
          key: '_setupRandomMode',
          value: function _setupRandomMode() {

              var position = [];

              this.positionSamplerArray = [];

              for (var i = 0; i < this.randomConfig.numberOfPointsBetween; i++) {
                  var rangeX = this._getRandomArbitrary(this.randomConfig.rangeX[0], this.randomConfig.rangeX[1]);
                  var rangeY = this._getRandomArbitrary(this.randomConfig.rangeY[0], this.randomConfig.rangeY[1]);
                  var rangeZ = this._getRandomArbitrary(this.randomConfig.rangeZ[0], this.randomConfig.rangeZ[1]);
                  position = [rangeX, rangeY, rangeZ];
                  this.positionSamplerArray.push(position);
              }

              this.positionSamplerArray.unshift(this.randomConfig.start);
              this.positionSamplerArray.push(this.randomConfig.end);
          }
      }, {
          key: '_getRandomArbitrary',
          value: function _getRandomArbitrary(min, max) {
              return Math.random() * (max - min) + min;
          }
          /**
           * Create samplers for animation
           */

      }, {
          key: '_buildSamplers',
          value: function _buildSamplers() {

              this.positionSampler = Animation.samplers[this.easeType]({
                  keyframes: this.positionSamplerArray
              });

              this.rotationSampler = Animation.samplers[this.easeType]({
                  keyframes: this.rotationSamplerArray
              });
          }
          /**
           * Create drivers for animation
           */

      }, {
          key: '_buildDrivers',
          value: function _buildDrivers() {
              var _this = this;

              this.positionDriver = this.rotationDriver = Animation.timeDriver({ durationMilliseconds: this.duration, loopCount: this.loopCount, mirror: this.mirror });

              if (this.reverseLoop) {
                  this.positionDriver.onCompleted().subscribe(function (e) {
                      _this.positionDriver.reverse();
                  });
              }

              if (this.onCompleted) {
                  this.positionDriver.onCompleted().subscribe(function () {
                      _this.onCompleted();
                  });
              }
          }
      }, {
          key: '_buildAnimations',
          value: function _buildAnimations() {
              this.flightAnimation = Animation.animate(this.positionDriver, this.positionSampler);
              this.rotationAnimation = Animation.animate(this.rotationDriver, this.rotationSampler);
          }

          /**
           * Attach animations to user defined object
           */

      }, {
          key: '_attachAnimations',
          value: function _attachAnimations() {
              this.object.transform.x = this.flightAnimation.get(0);
              this.object.transform.y = this.flightAnimation.get(1);
              this.object.transform.z = this.flightAnimation.get(2);

              this.object.transform.rotationX = this.rotationAnimation.get(0);
              this.object.transform.rotationY = this.rotationAnimation.get(1);
              this.object.transform.rotationZ = this.rotationAnimation.get(2);
          }

          /**
           * Public methods
           */

      }, {
          key: 'start',
          value: function start() {
              this.positionDriver.stop();
              this.rotationDriver.stop();
              this.positionDriver.reset();
              this.rotationDriver.reset();
              this.positionDriver.start();
              this.rotationDriver.start();

              return this.positionDriver;
          }
      }, {
          key: 'reset',
          value: function reset() {
              this.positionDriver.reset();
              this.rotationDriver.reset();
          }
      }, {
          key: 'stop',
          value: function stop() {
              this.positionDriver.stop();
              this.rotationDriver.stop();
          }
      }]);
      return FlightPath;
  }();

  /**
   * @author Rob Southgate <robsouthgate4@gmail.com>
   */

  var Diagnostics$1 = require("Diagnostics");
  var Reactive$1 = require("Reactive");
  var Scene = require("Scene");
  var FaceTracking = require('FaceTracking');
  var Materials = require('Materials');
  var Networking = require('Networking');
  var Time = require('Time');
  var Animation$1 = require('Animation');
  var TouchGestures = require('TouchGestures');
  var Patches = require('Patches');

  var Animations = function () {
      function Animations() {
          classCallCheck(this, Animations);
      }

      createClass(Animations, null, [{
          key: "sphereAnimation",
          value: function sphereAnimation(object) {

              return new FlightPath({
                  object: object,

                  positionSamplerArray: [[20.11, 76, 0], [5, 6, 0], [0, 0, 5], [15, 2, 0], [0, 13, 0], [-15, 16, 0], [5, 12, -5], [0, 40, -2], [8.5, 18.0, 0]],

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
              });
          }
      }]);
      return Animations;
  }();

  var Diagnostics$2 = require("Diagnostics");
  var Reactive$2 = require("Reactive");
  var Scene$1 = require("Scene");
  var FaceTracking$1 = require('FaceTracking');
  //const TouchGestures = require('TouchGestures')
  var Materials$1 = require('Materials');
  var Networking$1 = require('Networking');
  var Time$1 = require('Time');
  var Animation$2 = require('Animation');

  var numberOfSpheres = 10;

  for (var i = 1; i < numberOfSpheres + 1; i++) {

      var flyingSpheres = Scene$1.root.find('sphere' + i);
      //Diagnostics.log(flyingSpheres.name);
      Animations.sphereAnimation(flyingSpheres).start();
  }

  //CREATE ARRAY 

  //const spheresArray = []
  //let spheresInScene = Scene.root.find('sphere' + count)

  //spheresArray.push(spheresInScene)


  //GOAL

  //n number of spheres
  // module system 
  //create particle class
  // loop to instantiate sphere class
  // method called run animation

  //JS
  //- OO
  //- classes
  //- for loops
  //- arrays

  /**
   * @author Rob Southgate <robsouthgate4@gmail.com>
   */

  var Diagnostics$3 = require("Diagnostics");
  var Reactive$3 = require("Reactive");
  var Scene$2 = require("Scene");
  var FaceTracking$2 = require('FaceTracking');
  //const TouchGestures = require('TouchGestures')
  var Materials$2 = require('Materials');
  var Networking$2 = require('Networking');
  var Time$2 = require('Time');
  var Animation$3 = require('Animation');

}());
