/*!
 * Bellamar Housing — Chatbot embed widget
 * Usage (add to any website, e.g. Base44 custom code):
 *   <script src="https://bellamar-ai-real-estate-chatbot.vercel.app/embed.js" defer></script>
 *
 * Optional overrides on the <script> tag:
 *   data-app-url="https://your-app.vercel.app"   (defaults to the script's own origin)
 *   data-position="left"                          (defaults to "right")
 */
(function () {
  'use strict'
  if (window.__bellamarWidgetLoaded) return
  window.__bellamarWidgetLoaded = true

  // ---- Resolve config -------------------------------------------------------
  var thisScript =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName('script')
      for (var i = s.length - 1; i >= 0; i--) {
        if (s[i].src && s[i].src.indexOf('embed.js') !== -1) return s[i]
      }
      return null
    })()

  var origin = 'https://bellamar-ai-real-estate-chatbot.vercel.app'
  try {
    if (thisScript && thisScript.src) origin = new URL(thisScript.src).origin
  } catch (e) {}

  var appUrl = (thisScript && thisScript.getAttribute('data-app-url')) || origin
  var side = (thisScript && thisScript.getAttribute('data-position')) || 'right'
  var frameSrc = appUrl.replace(/\/$/, '') + '/?embed=1'
  var SIDE = side === 'left' ? 'left' : 'right'

  // ---- Styles ---------------------------------------------------------------
  var css =
    '#bellamar-widget,#bellamar-widget *{box-sizing:border-box}' +
    '#bellamar-launcher{position:fixed;bottom:24px;' + SIDE + ':24px;z-index:2147483000;' +
    'width:62px;height:62px;border:none;border-radius:50%;cursor:pointer;padding:0;' +
    'background:linear-gradient(135deg,#0c2733,#17475a);box-shadow:0 10px 30px rgba(8,24,32,.45);' +
    'display:flex;align-items:center;justify-content:center;' +
    'transition:transform .2s ease,box-shadow .2s ease;animation:bm-pop .4s ease}' +
    '#bellamar-launcher:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 14px 36px rgba(8,24,32,.55)}' +
    '#bellamar-launcher svg{width:28px;height:28px}' +
    '#bellamar-launcher .bm-ring{position:absolute;inset:0;border-radius:50%;border:2px solid #c9a45f;' +
    'opacity:.6;animation:bm-pulse 2.2s ease-out infinite}' +
    '#bellamar-launcher .bm-dot{position:absolute;top:6px;' + (SIDE === 'left' ? 'left' : 'right') + ':6px;' +
    'width:13px;height:13px;border-radius:50%;background:#34c759;border:2px solid #0c2733}' +
    '#bellamar-frame-wrap{position:fixed;bottom:96px;' + SIDE + ':24px;z-index:2147483000;' +
    'width:384px;height:600px;max-height:calc(100vh - 120px);border-radius:20px;overflow:hidden;' +
    'box-shadow:0 24px 60px rgba(8,24,32,.45);background:#f7f3ec;' +
    'opacity:0;transform:translateY(20px) scale(.98);pointer-events:none;' +
    'transition:opacity .28s ease,transform .28s ease}' +
    '#bellamar-frame-wrap.bm-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
    '#bellamar-frame-wrap iframe{width:100%;height:100%;border:0;display:block;background:transparent}' +
    '@keyframes bm-pop{from{transform:scale(0)}to{transform:scale(1)}}' +
    '@keyframes bm-pulse{0%{transform:scale(1);opacity:.6}70%{transform:scale(1.5);opacity:0}100%{opacity:0}}' +
    '@media (max-width:480px){' +
    '#bellamar-frame-wrap{bottom:0;right:0;left:0;top:0;width:100%;height:100%;max-height:100%;border-radius:0}' +
    '#bellamar-launcher.bm-hidden{display:none}}'

  var style = document.createElement('style')
  style.id = 'bellamar-widget-style'
  style.textContent = css
  document.head.appendChild(style)

  // ---- Elements -------------------------------------------------------------
  var root = document.createElement('div')
  root.id = 'bellamar-widget'

  var launcher = document.createElement('button')
  launcher.id = 'bellamar-launcher'
  launcher.setAttribute('aria-label', 'Open chat')
  launcher.innerHTML =
    '<span class="bm-ring"></span>' +
    '<span class="bm-dot"></span>' +
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-4 4v-4H6.5' +
    'A2.5 2.5 0 0 1 4 13.5v-8Z" fill="#c9a45f"/>' +
    '<circle cx="9" cy="9.5" r="1.1" fill="#0c2733"/><circle cx="12" cy="9.5" r="1.1" fill="#0c2733"/>' +
    '<circle cx="15" cy="9.5" r="1.1" fill="#0c2733"/></svg>'

  var frameWrap = document.createElement('div')
  frameWrap.id = 'bellamar-frame-wrap'

  var iframe = document.createElement('iframe')
  iframe.title = 'Bellamar Housing assistant'
  iframe.setAttribute('allow', 'microphone; clipboard-write')
  iframe.setAttribute('loading', 'lazy')
  // Load the app only on first open (faster host page).
  var loaded = false

  frameWrap.appendChild(iframe)
  root.appendChild(frameWrap)
  root.appendChild(launcher)

  function mount() {
    document.body.appendChild(root)
  }
  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount)

  // ---- Open / close ---------------------------------------------------------
  function openChat() {
    if (!loaded) {
      iframe.src = frameSrc
      loaded = true
    }
    frameWrap.classList.add('bm-open')
    launcher.classList.add('bm-hidden')
  }
  function closeChat() {
    frameWrap.classList.remove('bm-open')
    launcher.classList.remove('bm-hidden')
  }
  function toggle() {
    if (frameWrap.classList.contains('bm-open')) closeChat()
    else openChat()
  }

  launcher.addEventListener('click', toggle)

  // The app's close button posts a message asking the host to hide the iframe.
  window.addEventListener('message', function (ev) {
    if (ev && ev.data && ev.data.type === 'bellamar-chat-close') closeChat()
  })

  // Public API (optional): window.BellamarChat.open() / .close() / .toggle()
  window.BellamarChat = { open: openChat, close: closeChat, toggle: toggle }
})()
