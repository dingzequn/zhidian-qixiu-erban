/* 智电汽修二班 · 3D 舞台全屏放大（右下角放大键，纯全屏不含旋转） */
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

    function inFS() { return document.fullscreenElement === stage; }

    btn.addEventListener('click', function () {
      if (inFS()) { document.exitFullscreen(); return; }
      if (stage.requestFullscreen) {
        var p = stage.requestFullscreen();
        if (p && p.catch) p.catch(function () {});
      }
    });

    document.addEventListener('fullscreenchange', function () {
      var fs = inFS();
      document.documentElement.classList.toggle('fs-mode', fs);
      btn.textContent = fs ? '✕ 退出' : '⛶ 放大';
      btn.setAttribute('aria-label', fs ? '退出全屏' : '放大至全屏');
    });
  });
})();
