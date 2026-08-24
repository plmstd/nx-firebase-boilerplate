'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastItem } from './ToastItem';
import { ToastViewport } from './ToastViewport';
import { useToastStore } from './toastStore';

const DEFAULT_VISIBLE_TOASTS = 3;
const STACK_OFFSET = 8;
const EXPANDED_GAP = 12;
const FALLBACK_HEIGHT = 64;

function createLayout(toasts, heights, expanded, visibleToasts) {
  let expandedOffset = 0;
  const visibleLimit = Math.max(1, visibleToasts);

  const items = toasts.map((toast, index) => {
    const measuredHeight = heights[toast.id] || FALLBACK_HEIGHT;
    const visible = index < visibleLimit;
    const depth = Math.min(index, visibleLimit - 1);
    const offset = expanded ? expandedOffset : depth * STACK_OFFSET;

    if (visible) {
      expandedOffset += measuredHeight + EXPANDED_GAP;
    }

    return {
      toast,
      index,
      visible,
      offset,
      scale: expanded ? 1 : 1 - depth * 0.04,
    };
  });

  const visibleCount = Math.min(toasts.length, visibleLimit);
  const frontHeight = heights[toasts[0]?.id] || FALLBACK_HEIGHT;
  const collapsedHeight =
    frontHeight + Math.max(0, visibleCount - 1) * STACK_OFFSET;
  const expandedHeight = Math.max(
    0,
    expandedOffset - (visibleCount > 0 ? EXPANDED_GAP : 0),
  );

  return {
    items,
    height: expanded ? expandedHeight : collapsedHeight,
  };
}

/**
 * Mounts the global toast surface and coordinates stacking, expansion, item
 * measurements, and paused timers during interaction.
 */
export function ToastProvider({
  className,
  visibleToasts = DEFAULT_VISIBLE_TOASTS,
}) {
  const toasts = useToastStore((state) => state.toasts);
  const [heights, setHeights] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    function handleVisibilityChange() {
      setDocumentHidden(document.visibilityState === 'hidden');
    }

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [toasts.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const isStillInteracting = Boolean(
      viewport &&
        (viewport.matches(':hover') ||
          viewport.contains(document.activeElement)),
    );

    if (!isStillInteracting) {
      setInteracting(false);
      setExpanded(false);
    }
  }, [toasts]);

  const handleHeightChange = useCallback((id, height) => {
    setHeights((current) => {
      if (height == null) {
        const { [id]: removedHeight, ...remaining } = current;
        return removedHeight === undefined ? current : remaining;
      }

      if (current[id] === height) {
        return current;
      }

      return { ...current, [id]: height };
    });
  }, []);

  const layout = useMemo(
    () => createLayout(toasts, heights, expanded, visibleToasts),
    [expanded, heights, toasts, visibleToasts],
  );

  if (toasts.length === 0) {
    return null;
  }

  function startInteraction() {
    setInteracting(true);
    if (toasts.length > 1) {
      setExpanded(true);
    }
  }

  function stopInteraction(event) {
    if (event?.currentTarget?.contains(event.relatedTarget)) {
      return;
    }

    setInteracting(false);
    setExpanded(false);
  }

  return (
    <ToastViewport
      className={className}
      viewportRef={viewportRef}
      height={layout.height}
      expanded={expanded}
      onMouseEnter={startInteraction}
      onMouseLeave={stopInteraction}
      onFocusCapture={startInteraction}
      onBlurCapture={stopInteraction}
    >
      {layout.items.map(({ toast, index, visible, offset, scale }) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          count={toasts.length}
          visible={visible}
          expanded={expanded}
          paused={interacting || documentHidden}
          offset={offset}
          scale={scale}
          onHeightChange={handleHeightChange}
        />
      ))}
    </ToastViewport>
  );
}
