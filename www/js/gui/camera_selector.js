/**
 * Created by filles-dator on 2016-03-29.
 */
///<reference path="./../physics/soft_body.ts"/>
///<reference path="./../physics/point_mass.ts"/>
var CameraSelector = (function () {

    function CameraSelector(app, renderer) {
        var _this = this;

        this.getCoord = function(e, c) {
            return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
        }

        this.mouseDown = function (ev) {
            //console.log("Mouse down");
            if (_this._dragAllowed) {
                angular.element(document.querySelector('[ng-controller="AppController"]')).scope().selectObject();

                _this._renderer.controls.enabled = false;
                if(_this._selectedMesh != null){
                    var softBody = null;
                    angular.element(document.querySelector('[ng-controller="AppController"]')).scope().selectedObject = null;
                    angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().selectedObject = null;

                    for(var i=0; i<_this._app.softBodies.length; i++){
                        if(_this._app.softBodies[i].bodyMesh == _this._selectedMesh){
                            softBody = _this._app.softBodies[i];
                            angular.element(document.querySelector('[ng-controller="AppController"]')).scope().selectedObject = _this._app.softBodies[i];
                            angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().selectedObject = _this._app.softBodies[i];
                            break;
                        }
                    }

                    if(softBody != null){
                        _this._selectedPointMass = softBody.points[0];
                        var closestDistance = 1000;
                        for (var _i = 0, _a = softBody.points; _i < _a.length; _i++) {
                            var point = _a[_i];
                            var distance = point.position.distanceTo(_this._raycasterSelector.position);
                            if (distance < closestDistance) {
                                _this._selectedPointMass = point;
                                closestDistance = distance;
                            }
                        }
                        _this._selectedPointMass.isAttatchment = true;
                        _this._isDragging = true;
                    }
                }
            }
        };

        this.mouseUp = function (ev) {
            //console.log("Mouse up");
            if (_this._isDragging) {
                _this._isDragging = false;
                _this._selectedPointMass.position = _this._selectedPointMass.position.clone();

                var selectionMode = angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().selectionMode;

                if (selectionMode == "move")
                    _this._selectedPointMass.isAttatchment = false;

                _this._renderer.controls.enabled = true;
            }
        };

        this.mouseMove = function (ev) {
            //console.log("Mouse move");

            // if(device.platform == "browser"){
            if(true){
                _this._mouse.x = ((ev.clientX) / window.innerWidth) * 2 - 1;
                _this._mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
            }
            else {
                _this._mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
                _this._mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
            }

            if (_this._isDragging) {
                _this._selectedPointMass.position.copy(_this._raycasterSelector.position);
            }
        };

        this._renderer = renderer;
        this._app = app;
        this._raycaster = new THREE.Raycaster();
        this._raycasterIntersects = [];
        this._mouse = new THREE.Vector2(0, 0);
        this._dragAllowed = false;
        this._isDragging = false;
        this._dragPosition = new THREE.Vector3(0, 0, 0);
        this._raycasterSelector = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        this._renderer.scene.add(this._raycasterSelector);
        this._raycasterSelectorPlane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), new THREE.MeshLambertMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.0 }));
        this._renderer.scene.add(this._raycasterSelectorPlane);
        this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);
        this._selectedMesh = null;

        // if(device.platform == "browser"){
        if(true){
            window.addEventListener("mousedown", this.mouseDown);
            window.addEventListener("mouseup", this.mouseUp);
            window.addEventListener("mousemove", this.mouseMove);
        }
        else {
            window.addEventListener("touchstart", this.mouseDown);
            window.addEventListener("touchend", this.mouseUp);
            window.addEventListener("touchmove", this.mouseMove);
        }

    }

    CameraSelector.prototype.update = function () {
        this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);
        this._dragAllowed = false;
        if (this._isDragging) {
            this._raycaster.setFromCamera(this._mouse, this._renderer.camera);
            this._raycasterIntersects = this._raycaster.intersectObject(this._raycasterSelectorPlane);
            if (this._raycasterIntersects.length != 0) {
                this._raycasterSelector.visible = true;
                this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
            }
        }
        else {
            this._raycaster.setFromCamera(this._mouse, this._renderer.camera);
            this._raycasterIntersects = this._raycaster.intersectObjects(this._app.softBodyMeshes);
            this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);
            if (this._raycasterIntersects.length != 0) {
                this._dragAllowed = true;
                this._selectedMesh = this._raycasterIntersects[0].object;
                this._raycasterSelector.visible = true;
                this._raycasterSelectorPlane.position.copy(this._raycasterIntersects[0].point.clone());
                this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
            }
            else {
                if (!this._isDragging) {
                    this._selectedMesh = null;
                    this._raycasterSelector.visible = false;
                }
            }
        }
    };

    return CameraSelector;
})();
//# sourceMappingURL=camera_selector.js.map
