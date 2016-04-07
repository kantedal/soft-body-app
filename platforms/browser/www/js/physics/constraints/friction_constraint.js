/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>
///<reference path="./constraint.ts"/>
var FrictionConstraint = (function () {
    function FrictionConstraint(pointMass, friction) {
        this.shouldRemove = false;
        this._breakingDistance = 0.3;
        this._restLength = 0.0;
        this._pointMass = pointMass;
        this._friction = friction;
        this._connectionPoint = this._pointMass.position.clone();
    }

    FrictionConstraint.prototype.solve = function () {
        if (this._pointMass.isColliding) {
            this._pointMass.velocity.setX(this._pointMass.velocity.x * this._friction);
            this._pointMass.velocity.setZ(this._pointMass.velocity.z * this._friction);
        }
    };

    Object.defineProperty(FrictionConstraint.prototype, "friction", {
        get: function(){
            return this._friction;
        },
        set: function (value) {
            this._friction = value;
        },
        enumerable: true,
        configurable: true
    });

    return FrictionConstraint;
})();
//# sourceMappingURL=friction_constraint.js.map
