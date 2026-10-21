/* 智电汽修二班 · 3D 舞台全屏放大（右下角放大键；手机端强制/模拟横屏） */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var stage = document.getElementById('stage');
    if (!stage || stage.dataset.fsInit) return;
    stage.dataset.fsInit = '1';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fs-btn';
    btn.id = 'tFS';
    btn.setAttribute('aria-label', '放大至全屏');
    btn.textContent = '⛶ 放大';
    stage.appendChild(btn);

    var hint = document.createElement('div');
    hint.className = 'fs-hint';
    hint.textContent = '📱 请将手机逆时针旋转 90° 横屏观看';
    stage.appendChild(hint);

    var rotTimer = null;
    var lockFailed = false;
    var lockOK = false;

    function inFS() { return document.fullscreenElement === stage; }
    function isPortrait() { return window.innerHeight > window.innerWidth; }

    function clearRot() {
      if (stage.classList.contains('fs-rot')) {
        stage.classList.remove('fs-rot');
        window.dispatchEvent(new Event('resize'));
      }
      hint.classList.remove('show');
    }

    /* 浏览器不支持横屏锁定时，用 CSS 把舞台旋转 90° 模拟横屏 */
    function fakeLandscape() {
      if (!stage.classList.contains('fs-rot')) {
        stage.classList.add('fs-rot');
        window.dispatchEvent(new Event('resize'));
      }
      hint.classList.add('show');
    }

    function applyOrientation() {
      if (!inFS()) { clearRot(); return; }
      if (!isPortrait()) { clearRot(); return; }
      var canLock = !!(screen.orientation && typeof screen.orientation.lock === 'function');
      if (canLock && !lockFailed && !lockOK) {
        try {
          var p = screen.orientation.lock('landscape');
          if (p && p.catch) p.catch(function () { lockFailed = true; fakeLandscape(); });
          else lockOK = true; /* 同步成功（部分旧浏览器） */
        } catch (e) { lockFailed = true; fakeLandscape(); }
      } else if (!canLock) {
        fakeLandscape();
      } else if (lockFailed) {
        fakeLandscape();
      }
    }

    function unlockOrientation() {
      try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
    }

    btn.addEventListener('click', function () {
      if (inFS()) { document.exitFullscreen(); return; }
      if (stage.requestFullscreen) {
        var p = stage.requestFullscreen();
        if (p && p.then) p.then(function () { setTimeout(applyOrientation, 120); }).catch(function () {});
      }
    });

    document.addEventListener('fullscreenchange', function () {
      var fs = inFS();
      document.documentElement.classList.toggle('fs-mode', fs);
      btn.textContent = fs ? '✕ 退出' : '⛶ 放大';
      btn.setAttribute('aria-label', fs ? '退出全屏' : '放大至全屏');
      if (fs) {
        rotTimer = setInterval(applyOrientation, 600);
        setTimeout(applyOrientation, 200);
      } else {
        clearInterval(rotTimer);
        rotTimer = null;
        lockFailed = false;
        lockOK = false;
        clearRot();
        unlockOrientation();
      }
    });

    window.addEventListener('resize', function () { if (inFS()) applyOrientation(); });
    window.addEventListener('orientationchange', function () {
      setTimeout(function () { if (inFS()) applyOrientation(); }, 120);
    });
  });
})();
