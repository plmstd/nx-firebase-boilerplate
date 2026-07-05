/**
 * Creates a project-owned icon component from a react-icons source component.
 *
 * Icons are decorative by default, so they are hidden from assistive
 * technology unless callers provide `aria-label`, `aria-labelledby`, or
 * `title`. The returned component accepts the same visual props as the
 * wrapped react-icons component, including `className`, `size`, `color`, and
 * SVG accessibility attributes.
 *
 * @param {import('react-icons').IconType} SourceIcon The react-icons component
 * to wrap.
 * @param {string} displayName The component name shown in React DevTools.
 * @returns {import('react-icons').IconType} A reusable application icon.
 */
export function createIcon(SourceIcon, displayName) {
  function Icon({ size = '1em', ...props }) {
    const hasAccessibleName =
      props['aria-label'] || props['aria-labelledby'] || props.title;
    const accessibilityProps = hasAccessibleName
      ? { role: 'img', focusable: 'false' }
      : { 'aria-hidden': true, focusable: 'false' };

    return <SourceIcon size={size} {...accessibilityProps} {...props} />;
  }

  Icon.displayName = displayName;
  return Icon;
}
