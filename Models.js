(function (Models) {
    Models.ForceFrictionModel = ForceFrictionModel;

    Models.Friction = {
        LinearForce: function (gamma) {
            return function (v) {
                return gamma * v;
            };
        },
        SquareForce: function (gamma) {
            return function (v) {
                return gamma * v * v;
            };
        }
    };

    Models.Force = {
        SpringChargeForce: SpringChargeForce,
        LogSpringChargeForce: LogSpringChargeForce
    };

    Models.Energy = {
        SpringChargeEnergy: SpringChargeEnergy,
        Coulomb: Coulomb,
        HookeSpring: HookeSpring,
        LogSpring: LogSpring
    };

    /**
     * Модель поведения, разделяющая потенциальную силу и силу трения.
     * force - потенциальная сила, воздействующая на систему, функция состояния (массива коорд.), возвращающая массив коорд. силы.
     * friction - функциональная зависимость модуля силы трения на одну частицу от модуля скорости.
     */
    function ForceFrictionModel(force, friction) {
        return function (r, v) {
            var n = r.length / 2;
            var f = force(r);
            for (var i = 0; i < n; ++i) {
                var dv = Math.sqrt(v[2 * i] * v[2 * i] + v[2 * i + 1] * v[2 * i + 1]);
                if (dv == 0) continue;
                f[2 * i] -= friction(dv) * v[2 * i] / dv;
                f[2 * i + 1] -= friction(dv) * v[2 * i + 1] / dv;
            }
            return f;
        };
    }

    /**
     * Простейшая модель поведения графа.
     * Параметры модели:
     * graph - граф, на основании которого моделируется система
     * edge - сила притягивания между двумя смежными вершинами
     * noedge - сила притягивания (хотя чаще знак отрицателен - отталкивание) между двумя несмежными вершинами
     * притягивание и отталкивание являются функциями расстояния между вершинами
     * Возвращается функция, которая положению и скорости сопоставляется сила
     * Положение задаётся массивом координат, на четных позициях абсцисса, на нечетных - ордината
     */
    function EdgeNodeForce(graph, edge, noedge) {
        var n = graph.getSize();
        return function (r, v) {
            var f = new Array(2 * n);
            var i;
            for (i = 0; i < n; ++i)
                f[2 * i] = f[2 * i + 1] = 0;
            for (i = 0; i < n; ++i)
                for (var j = i + 1; j < n; ++j) {
                    var
                        dx = r[2 * i] - r[2 * j];
                    dy = r[2 * i + 1] - r[2 * j + 1];
                    dl = Math.sqrt(dx * dx + dy * dy);
                    if (dl == 0) continue;
                    var
                        fs = graph.edge(i, j) ? edge(dl) : noedge(dl);
                    fx = fs * dx / dl;
                    fy = fs * dy / dl;
                    f[2 * i] += fx;
                    f[2 * j] -= fx;
                    f[2 * i + 1] += fy;
                    f[2 * j + 1] -= fy;
                }
            return f;
        }
    }

    /* Instance: Hooke springs and charged nodes */
    function SpringChargeForce(graph, params) {
        var
            gamma = params.gamma,
            l0 = params.l0,
            k = params.k,
            q2 = params.q2;
        return EdgeNodeForce(graph,
            function (dl) {
                return q2 / (dl * dl) - k * (dl - l0);
            },
            function (dl) {
                return q2 / (dl * dl);
            }
        );
    }

    /* Instance: log springs and charged nodes */
    function LogSpringChargeForce(graph, params) {
        var
            gamma = params.gamma,
            l0 = params.l0,
            k = params.k,
            q2 = params.q2;
        return EdgeNodeForce(graph,
            function (dl) {
                return q2 / (dl * dl) - k * Math.log(dl / l0);
            },
            function (dl) {
                return q2 / (dl * dl);
            }
        );
    }

    /* Energy of system */
    function SpringChargeEnergy(graph, chargeE, springE) {
        var n = graph.getSize();
        return function (r) {
            var E = 0;
            for (var i = 0; i < n; ++i)
                for (var j = i + 1; j < n; ++j) {
                    dx = r[2 * i] - r[2 * j];
                    dy = r[2 * i + 1] - r[2 * j + 1];
                    dl = Math.sqrt(dx * dx + dy * dy);
                    E += graph.edge(i, j) ? chargeE(dl) + springE(dl) : chargeE(dl);
                }
            return E;
        }
    }

    function Coulomb(params) {
        var q2 = params.q2;
        return function (dl) {
            return q2 / dl;
        };
    }

    function HookeSpring(params) {
        var l0 = params.l0,
            k = params.k;
        return function (dl) {
            return k * (dl - l0) * (dl - l0) / 2;
        };
    }

    function LogSpring(params) {
        var l0 = params.l0,
            k = params.k;
        return function (dl) {
            return k * (dl * Math.log(dl / l0) - dl);
        };
    }

    /**
     * It was not tested yet
     */
    function PotentialForceModel(energy, fric, dr) {
        dr = dr || 1e-6;
        dv = dv || 1e-6;
        return function (r, v) {
            var n2 = r.length;
            var f = new Array(n2);
            var i;
            for (i = 0; i < n2; ++i) {
                r[i] += dr;
                var e1 = energy(r);
                r[i] -= dr;
                f[i] = (energy(r) - e1) / dr;
            }
            for (i = 0; i < n; ++i) {
                var dv = Math.sqrt(v[2 * i] * v[2 * i] + v[2 * i + 1] * v[2 * i + 1]);
                if (dv == 0) continue;
                f[2 * i] -= fric(dv) * v[2 * i] / dv;
                f[2 * i + 1] -= fric(dv) * v[2 * i + 1] / dv;
            }
            return f;
        };
    }

})(window.Models = {});
