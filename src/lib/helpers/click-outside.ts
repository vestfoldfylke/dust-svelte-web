import type { Action } from "svelte/action";

/** Invoke callback on click outside of node */
export const clickOutside: Action<HTMLElement, (() => void) | undefined> = (node, callback) => {
  let cb: (() => void) | undefined = callback;
  const handleClick = (event: MouseEvent): void => {
    const target: Node | null = event.target as Node | null;
    if (node && target && !node.contains(target) && !event.defaultPrevented) {
      cb?.();
      node.dispatchEvent(new CustomEvent("click_outside"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    update(next: (() => void) | undefined): void {
      cb = next;
    },
    destroy(): void {
      document.removeEventListener("click", handleClick, true);
    }
  };
};
