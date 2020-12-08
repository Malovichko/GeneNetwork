function PhysSys(f, dt) {
  this.init = function(r, v) {
    r = [].concat(r);
    v = [].concat(v);
    function add(x, dx) {
      var n = x.length;
      for(var i = 0; i < n; ++i)
        x[i] += dx[i] * dt;
    }
    return {
      step: function() {
        var fv = f(r, v);
        add(v, fv);
        add(r, v);
      },
      state: function() {
        return r;
      },
      kinEnergy: function() {
        var E = 0;
        for(var i = 0; i < v.length; ++i)
          E += v[i]*v[i];
        return E / 2;
      }
    };
  }
}

function centralize(r, x0, y0) {
  var xm = 0, ym = 0;
  var n = r.length / 2;
  for(var i = 0; i < n; ++i) {
    xm += r[2*i];
    ym += r[2*i+1];
  }
  xm = xm / n;
  ym = ym / n;
  var a = [].concat(r);
  for(var j = 0; j < n; ++j) {
    a[2*j] += x0 - xm;
    a[2*j+1] += y0 - ym;
  }
  return a;
}

function rndPoss(n, mx, sym) {
  var r = new Array(2*n);
  for(var i = 0; i < 2*n; ++i)
    if(sym)
      r[i] = Math.random() * mx;
    else r[i] = Math.random() * 2 * mx - mx;
  return r;
}

function stablePoint(physsys, params) {
  if(!params) params = { K0: 1e-6, dK: 1e-2, a: 3.0/4.0, b: 3.0 };
  var
    K0 = params.K0, // value of final kin energy
    dK = params.dK, // value of magnitude of kin energy fluctuation (last maximum)
    a = params.a, // fraction of maximums to skip
    b = params.b; // kin energy limitation b*dK
  if(!K0 || !dK || !a || !b) throw "invalid parameters";
  physsys.step();
  var k2 = physsys.kinEnergy();
  physsys.step();
  var k1 = physsys.kinEnergy();
  var K = [];
  var cnd = true;
  do {
    physsys.step();
    var k = physsys.kinEnergy();
    if(k1 > k2 && k1 > k) {
      K.push(k1);
      cnd = cond();
    }
    k2 = k1;
    k1 = k;
  } while(cnd || k1 > K0 || K[K.length-1] > dK);
  
  function cond() {
    for(var i = Math.floor(K.length * a); i < K.length; ++i)
      if(K[i] > b * dK) return true;
    return false;
  }
  
  return physsys.state();
}
