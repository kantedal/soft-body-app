!function e(t,o,r){function n(i,a){if(!o[i]){if(!t[i]){var c="function"==typeof require&&require;if(!a&&c)return c(i,!0);if(s)return s(i,!0);throw new Error("Cannot find module '"+i+"'")}var u=o[i]={exports:{}};t[i][0].call(u.exports,function(e){var o=t[i][1][e];return n(o?o:e)},u,u.exports,e,t,o,r)}return o[i].exports}for(var s="function"==typeof require&&require,i=0;i<r.length;i++)n(r[i]);return n}({1:[function(e,t,o){(function(){function e(){this._renderer=new Renderer,this._clock=new THREE.Clock,this._stats=new Stats;var e=new THREE.Mesh(new THREE.PlaneGeometry(4e3,4e3,1,1),new THREE.MeshPhongMaterial({color:10066329,side:THREE.DoubleSide}));e.translateY(-30),e.rotateX(Math.PI/2),e.receiveShadow=!0,this._renderer.scene.add(e)}return e.prototype.start=function(){this._dimensions=angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().dimensions.clone(),this._divisions=angular.element(document.querySelector('[ng-controller="ObjectController"]')).scope().divisions.clone(),this._softBox=new SoftBox(this._dimensions,this._divisions,this._renderer),this._cameraSelector=new CameraSelector(this._softBox,this._renderer),this._renderer.start(),this._stats.setMode(0),this._stats.domElement.style.position="absolute",this._stats.domElement.style.left="20px",this._stats.domElement.style.bottom="20px",this.update()},e.prototype.update=function(){var e=this;this._stats.begin(),this._softBox.update(this._clock.getElapsedTime(),.05),this._cameraSelector.update(),this._renderer.render(),this._stats.end(),requestAnimationFrame(function(){return e.update()})},e.prototype.regenerateSoftBox=function(e,t){this._renderer.scene.remove(this._softBox.bodyMesh),this._softBox=new SoftBox(e,t,this._renderer),this._cameraSelector.setSoftbody(this._softBox)},Object.defineProperty(e.prototype,"softBox",{get:function(){return this._softBox},set:function(e){this._softBox=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"dimensions",{get:function(){return this._dimensions},set:function(e){this._dimensions=e},enumerable:!0,configurable:!0}),e.DEVELOPER_MODE=!1,e.CAST_SHADOW=!0,e})()},{}]},{},[1]);