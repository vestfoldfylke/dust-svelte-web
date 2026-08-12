import type { Action } from "svelte/action";

/** Invoke callback on click outside of node */
export const clickOutside: Action<HTMLElement, (() => void) | undefined> = (node, callback) => {
  let cb = callback;
  const handleClick = (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (node && target && !node.contains(target) && !event.defaultPrevented) {
      cb?.();
      node.dispatchEvent(new CustomEvent("click_outside"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    update(next) {
      cb = next;
    },
    destroy() {
      document.removeEventListener("click", handleClick, true);
    }
  };
};
