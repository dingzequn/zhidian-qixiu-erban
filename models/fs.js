/* 智电汽修二班 · 3D 舞台全屏放大（右下角放大键；手机端自动转横屏） */
(function () {
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

  function lockLandscape() {
    try {
      var p = screen.orientation && screen.orientation.lock('landscape');
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }
  function unlockOrientation() {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
  }

  btn.addEventListener('click', function () {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (stage.requestFullscreen) {
      var p = stage.requestFullscreen();
      if (p && p.then) p.then(lockLandscape).catch(lockLandscape);
      else lockLandscape();
    }
  });

  document.addEventListener('fullscreenchange', function () {
    var fs = document.fullscreenElement === stage;
    document.documentElement.classList.toggle('fs-mode', fs);
    btn.textContent = fs ? '✕ 退出' : '⛶ 放大';
    btn.setAttribute('aria-label', fs ? '退出全屏' : '放大至全屏');
    if (!fs) unlockOrientation();
  });
})();
