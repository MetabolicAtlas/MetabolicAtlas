export function requestFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else {
    // Safari 15.6 and Safari on iOS does not implement Fullscreen API unprefixed
    // Should be able to remove this in the future
    elem.webkitRequestFullscreen();
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else {
    // Safari 15.6 and Safari on iOS does not implement Fullscreen API unprefixed
    // Should be able to remove this in the future
    document.webkitExitFullscreen();
  }
}

export function isFullscreen() {
  const fullscreenElement =
    document.fullscreenElement === undefined
      ? // Safari 15.6 and Safari on iOS does not implement Fullscreen API unprefixed
        // Should be able to remove this in the future
        document.webkitFullscreenElement
      : document.fullscreenElement;
  return fullscreenElement !== null;
}
