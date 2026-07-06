export const refreshCurrentPageSoon = (delayMs = 700) => {
  window.setTimeout(() => {
    window.location.reload();
  }, delayMs);
};
