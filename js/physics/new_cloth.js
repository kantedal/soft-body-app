/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./dynamic_body.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Cloth = (function (_super) {
    __extends(Cloth, _super);

    function Cloth(dimensions, divisions, renderer) {
        var cloth_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x444499,
            specular: 0x222222,
            shininess: 1000
        });
        var cloth_geometry = new THREE.PlaneGeometry(dimensions.x - 1, dimensions.y - 1, divisions.x - 1, divisions.y - 1);
        cloth_geometry.rotateY(Math.PI);
        cloth_geometry.translate(-0.5, 5 + dimensions.y, 0);
        var bodyMesh = new THREE.Mesh(cloth_geometry, cloth_material);

        _super.call(this, bodyMesh);

        this._dimensions = dimensions;
        this._divisions = divisions;
        this._renderer = renderer;
        this._renderer.scene.add(this._bodyMesh);

        for(var i=0; i < this._bodyMesh.geometry.vertices.length; i++)
            this._points.push(new PointMass(this._bodyMesh.geometry.vertices[i].clone(), 1));

        this._stiffnessFactor = 0.7;
        for (var y = 0; y < divisions.y; y++) {
            for (var x = 0; x < divisions.x; x++) {
                if (x != 0)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x - 1, y)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y)], this._renderer));
                if (y != 0)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x, y - 1)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 1)], this._renderer));
                if (x != divisions.x - 1)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x + 1, y)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y)], this._renderer));
                if (y != divisions.y - 1)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x, y + 1)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y + 1)], this._renderer));
                if (x != 0 && y != 0)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x - 1, y - 1)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y - 1)], this._renderer));
                if (x != divisions.x - 1 && y != 0)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x + 1, y - 1)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y - 1)], this._renderer));
                if (x != 0 && y != divisions.y - 1)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x - 1, y + 1)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y + 1)], this._renderer));
                if (x != divisions.x - 1 && y != divisions.y - 1)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x + 1, y + 1)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y + 1)], this._renderer));
                if (x > 1)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x - 2, y)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 2, y)], this._renderer));
                if (y > 1)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x, y - 2)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 2)], this._renderer));
                if (x < divisions.x - 2)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x + 2, y)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 2, y)], this._renderer));
                if (y < divisions.y - 2)
                    this._constraints.push(new BendConstraint(this._points[this.getClothIndexAt(x, y)].position.distanceTo(this._points[this.getClothIndexAt(x, y + 2)].position), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y + 2)], this._renderer));

                this._constraints.push(new HeightCollisionConstraint(-29.5, this._points[this.getClothIndexAt(x, y)]));
                this._velocityConstraints.push(new FrictionConstraint(this._points[this.getClothIndexAt(x, y)], 0.3));
            }
        }
        this._points[this.getClothIndexAt(0, divisions.y - 1)].isAttatchment = true;
        this._points[this.getClothIndexAt(divisions.x - 1, divisions.y - 1)].isAttatchment = true;

        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);
            var closestIdx = 0;
            for (var j = 1; j < this._points.length; j++) {
                if (vert_pos.distanceTo(this._points[j].position) < vert_pos.distanceTo(this._points[closestIdx].position))
                    closestIdx = j;
            }
            this._points[closestIdx].attatchVertex(i, this._points[closestIdx].position.clone().sub(vert_pos));
        }
    }

    Cloth.prototype.getClothIndexAt = function (x, y) {
        return x + this._divisions.x * y;
    };

    Object.defineProperty(SoftBody.prototype, "bodyMesh", {
        get: function () {
            return this._bodyMesh;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SoftBody.prototype, "points", {
        get: function () {
            return this._points;
        },
        enumerable: true,
        configurable: true
    });

    return Cloth;
})(DynamicBody);
