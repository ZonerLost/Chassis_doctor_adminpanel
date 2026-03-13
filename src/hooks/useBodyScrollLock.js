/*
 * Custom hook that encapsulates body scroll lock state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useLayoutEffect } from "react";

let activeLocks = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";
let previousBodyOverscroll = "";
let previousHtmlOverflow = "";
let previousHtmlOverscroll = "";

export default function useBodyScrollLock(locked) {
  useLayoutEffect(() => {
    if (!locked || typeof window === "undefined") {
      return undefined;
    }

    const body = document.body;
    const html = document.documentElement;

    activeLocks += 1;

    if (activeLocks === 1) {
      previousBodyOverflow = body.style.overflow;
      previousBodyPaddingRight = body.style.paddingRight;
      previousBodyOverscroll = body.style.overscrollBehavior;
      previousHtmlOverflow = html.style.overflow;
      previousHtmlOverscroll = html.style.overscrollBehavior;

      const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);

      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";

      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);

      if (activeLocks === 0) {
        body.style.overflow = previousBodyOverflow;
        body.style.paddingRight = previousBodyPaddingRight;
        body.style.overscrollBehavior = previousBodyOverscroll;
        html.style.overflow = previousHtmlOverflow;
        html.style.overscrollBehavior = previousHtmlOverscroll;
      }
    };
  }, [locked]);
}
