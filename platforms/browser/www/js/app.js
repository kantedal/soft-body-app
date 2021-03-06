/**
 * Created by filles-dator on 2016-03-26.
 */

var App = (function () {
    function App() {
        this._renderer = new Renderer();
        this._clock = new THREE.Clock();
        this._stats = new Stats();

        var plane = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000, 1, 1), new THREE.MeshPhongMaterial({ color: 0x999999, side: THREE.DoubleSide }));
        plane.translateY(-30);
        plane.rotateX(Math.PI / 2);
        plane.receiveShadow = true;
        this._renderer.scene.add(plane);
    }

    App.prototype.start = function () {
        this._dimensions = angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().dimensions.clone();
        this._divisions = angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().divisions.clone();
        //this._softBox = new SoftBox(this._dimensions, this._divisions, this._renderer);

        this._softBodies = [];
        this._softBodyMeshes = [];
        this.addSoftBody(new SoftBox(this._dimensions, this._divisions, this._renderer));
        //this.addSoftBody(new Cloth(new THREE.Vector2(40,40), new THREE.Vector2(20,20), this._renderer));

        this._cameraSelector = new CameraSelector(this, this._renderer);

        this._renderer.start();
        this._stats.setMode(0); // 0: fps, 1: ms, 2: mb
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '20px';
        this._stats.domElement.style.bottom = '20px';
        //document.body.appendChild(this._stats.domElement);

        this.update();
    };

    App.prototype.update = function () {
        var _this = this;
        this._stats.begin();

        //this._softBox.update(this._clock.getElapsedTime(), 0.05);
        for(var i=0; i<this._softBodies.length; i++)
            this._softBodies[i].update(this._clock.getElapsedTime(), 0.05);

        this._cameraSelector.update();
        this._renderer.render();

        this._stats.end();
        requestAnimationFrame(function () { return _this.update(); });
    };

    App.prototype.addSoftBody = function(softBody){
        this._softBodies.push(softBody);
        this._softBodyMeshes.push(softBody.bodyMesh);
    }

    App.prototype.regenerateSoftBox = function (dimensions, divisions) {
        this._renderer.scene.remove(angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().selectedObject.bodyMesh);
        var softBody = new SoftBox(dimensions, divisions, this._renderer);
        this.addSoftBody(softBody);
    };

    Object.defineProperty(App.prototype, "softBox", {
        get: function () {
            return this._softBox;
        },
        set: function (value) {
            this._softBox = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(App.prototype, "dimensions", {
        get: function () {
            return this._dimensions;
        },
        set: function (value) {
            this._dimensions = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(App.prototype, "softBodyMeshes", {
        get: function () {
            return this._softBodyMeshes;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(App.prototype, "softBodies", {
        get: function () {
            return this._softBodies;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(App.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });

    App.DEVELOPER_MODE = false;
    App.CAST_SHADOW = false;

    return App;
})();
//# sourceMappingURL=app.js.map
