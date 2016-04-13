/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this._softBodyEngine = new App();

        var module = ons.bootstrap('my-app', ['onsen']);

        module.factory('MemoService', function() {
            return {
                templates  : {
                    "page1" : "templates/page1.html",
                    "page2" : "templates/page2.html"
                },

                animationClasses : {
                    "slide_left" : "slide-left",
                    "slide_right" : "slide-right",
                    "fade" : "fade",
                    "move_left" : "move-left",
                    "move_right" : "move-right"
                }
            };
        });

        module.controller('AppController', function($scope) {
            $scope.selectedObject = null;

            ons.ready(function() {
                $scope.showAddBodyDialog = function() {
                    ons.createDialog('material.html').then(function(dialog) {
                        dialog.show();
                    });
                };

                $scope.selectObject = function(){
                    $scope.splitter.openLeft();
                    $("#object-controller-view")[0]._mode = "split";
                    $scope.$apply();
                }

                $scope.deselectObject = function(){
                    $scope.selectedObject = null;
                    $("#object-controller-view")[0]._mode = "collapse";
                    $scope.splitter.closeLeft();
                }

                $scope.deleteObject = function(){
                    for(var i=0; i<app._softBodyEngine.softBodyMeshes.length; i++){
                        if(app._softBodyEngine.softBodyMeshes[i] == $scope.selectedObject.bodyMesh){
                            app._softBodyEngine.softBodyMeshes.splice(i,1);
                            app._softBodyEngine.softBodies.splice(i,1);
                            break;
                        }
                    }

                    app._softBodyEngine.renderer.scene.remove($scope.selectedObject.bodyMesh);
                    $scope.deselectObject();
                }
            });
        });

        module.controller('PageController', function($scope) {
            ons.ready(function() {
              // Init code here
            });
        });

        module.controller('AddItemController', function($scope) {
            ons.ready(function() {
                ons.createPopover('menu.html').then(
                    function(popover) {
                        $scope.menu = popover;
                    }
                );
            });

            $scope.addCube = function(){
                app._softBodyEngine.addSoftBody(new SoftBox(new THREE.Vector3(60, 10, 40), new THREE.Vector3(12, 2, 8), app._softBodyEngine.renderer));
            };

            $scope.addCloth = function(){
                app._softBodyEngine.addSoftBody(new Cloth(new THREE.Vector2(40,40), new THREE.Vector2(20,20), app._softBodyEngine.renderer));
            };

        });

        module.controller('ObjectController', function($scope) {
            $scope.selectedObject = null;
            $scope.dimensions = new THREE.Vector3(60, 10, 40);
            $scope.divisions = new THREE.Vector3(12, 2, 8);
            $scope.stiffness = 10;
            $scope.friction = 70;
            $scope.selectionMode = "move";

            $scope.dimensionChange = function(){
                $scope.dimensions.x = Math.min(500, Math.max(1,parseInt($scope.dimensions.x)));
                $scope.dimensions.y = Math.min(500, Math.max(1,parseInt($scope.dimensions.y)));
                $scope.dimensions.z = Math.min(500, Math.max(1,parseInt($scope.dimensions.z)));

                $scope.divisions.x = Math.max(1,parseInt($scope.dimensions.x / 5));
                $scope.divisions.y = Math.max(1,parseInt($scope.dimensions.y / 5));
                $scope.divisions.z = Math.max(1,parseInt($scope.dimensions.z / 5));

                app._softBodyEngine.regenerateSoftBox($scope.dimensions, $scope.divisions);
            };

            $scope.divisionChange = function(){
                $scope.divisions.x = Math.min(500, Math.max(1,parseInt($scope.divisions.x)));
                $scope.divisions.y = Math.min(500, Math.max(1,parseInt($scope.divisions.y)));
                $scope.divisions.z = Math.min(500, Math.max(1,parseInt($scope.divisions.z)));

                app._softBodyEngine.regenerateSoftBox($scope.dimensions, $scope.divisions);
            };

            $scope.stiffnessChange = function(){
                console.log($scope.selectedObject);
                $scope.selectedObject.setStiffness($scope.stiffness);
            };

            $scope.frictionChange = function(){
                $scope.selectedObject.setFriciton(100-$scope.friction);
            };

            // $scope.deleteObject = function(){
            //     for(var i=0; i<app._softBodyEngine.softBodyMeshes.length; i++){
            //         if(app._softBodyEngine.softBodyMeshes[i] == $scope.selectedObject.bodyMesh){
            //             app._softBodyEngine.softBodyMeshes.splice(i,1);
            //             app._softBodyEngine.softBodies.splice(i,1);
            //             break;
            //         }
            //     }
            //     app._softBodyEngine.renderer.scene.remove($scope.selectedObject.bodyMesh);
            // }
        });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var newapp = new App();
        //newapp.start();
        app._softBodyEngine.start();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        //
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
    }
};

app.initialize();
