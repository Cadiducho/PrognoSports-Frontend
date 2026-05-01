let modalSeq = 0;

let scrollLockCount = 0;
let bodyOverflowBackup: string | null = null;

export function nextModalDomId(prefix = 'progno-modal') {
  modalSeq += 1;
  return `${prefix}-${modalSeq}`;
}

export function lockBodyScroll() {
  if (typeof document === 'undefined') {
    return;
  }

  if (scrollLockCount === 0) {
    bodyOverflowBackup = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  scrollLockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') {
    return;
  }

  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0 && bodyOverflowBackup !== null) {
    document.body.style.overflow = bodyOverflowBackup;
    bodyOverflowBackup = null;
  }
}

