/**
 * SimplifiedGlassSurface - Performance-optimized glass morphism component
 * Uses only CSS backdrop-filter without expensive SVG filters
 */

const SimplifiedGlassSurface = ({
  children,
  className = '',
  style = {},
  borderRadius = 20,
  blur = 12,
  opacity = 0.9,
}) => {
  const containerStyles = {
    ...style,
    borderRadius: `${borderRadius}px`,
    background: `rgba(255, 255, 255, ${opacity * 0.85})`,
    backdropFilter: `blur(${blur}px) saturate(1.8)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(1.8)`,
    border: '0px solid rgba(255, 255, 255, 0.4)',
    boxShadow: `
      0 8px 32px 0 rgba(31, 38, 135, 0.15),
      0 2px 16px 0 rgba(31, 38, 135, 0.1),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)
    `,
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={containerStyles}
    >
      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SimplifiedGlassSurface;
