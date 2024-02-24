export function focusFix() {
  const __tempEl__ = document.createElement('input');
  __tempEl__.style.position = 'absolute';
  __tempEl__.style.height = '0px';
  __tempEl__.style.opacity = '0px';
  document.body.appendChild(__tempEl__);
  __tempEl__.focus();
}
