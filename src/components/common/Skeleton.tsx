// components/common/Skeleton.tsx
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-container rounded ${className}`} />
);

export default Skeleton;
