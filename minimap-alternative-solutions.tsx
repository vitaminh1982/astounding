// Alternative Solution 1: Type-based coloring
<MiniMap
  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
  maskColor="rgb(0, 0, 0, 0.05)"
  nodeColor={(node) => {
    const isDark = document.documentElement.classList.contains('dark');

    // Color nodes based on their type for better identification
    const nodeType = node.data?.type as string;

    if (isDark) {
      // Dark mode colors (lighter shades)
      const colorMap: Record<string, string> = {
        trigger: '#fbbf24', // yellow-400
        agent: '#60a5fa',   // blue-400
        action: '#34d399',  // green-400
        notification: '#a78bfa', // violet-400
        database: '#f472b6', // pink-400
        output: '#fb923c',  // orange-400
      };
      return colorMap[nodeType] || '#60a5fa';
    } else {
      // Light mode colors (darker shades)
      const colorMap: Record<string, string> = {
        trigger: '#f59e0b', // yellow-500
        agent: '#3b82f6',   // blue-500
        action: '#10b981',  // green-500
        notification: '#8b5cf6', // violet-500
        database: '#ec4899', // pink-500
        output: '#f97316',  // orange-500
      };
      return colorMap[nodeType] || '#3b82f6';
    }
  }}
  nodeStrokeWidth={2}
  nodeBorderRadius={4}
  zoomable
  pannable
/>

// Alternative Solution 2: Gradient coloring with better contrast
<MiniMap
  className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg"
  maskColor="rgb(0, 0, 0, 0.03)"
  nodeColor={(node) => {
    const isDark = document.documentElement.classList.contains('dark');
    // Always use a contrasting color regardless of mode
    return isDark ? '#22d3ee' : '#0891b2'; // cyan shades
  }}
  nodeStrokeColor={(node) => {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? '#ffffff' : '#000000';
  }}
  nodeStrokeWidth={1.5}
  nodeBorderRadius={6}
  zoomable
  pannable
/>

// Alternative Solution 3: High contrast mode with selected state
<MiniMap
  className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl"
  maskColor="rgba(0, 0, 0, 0.08)"
  nodeColor={(node) => {
    const isDark = document.documentElement.classList.contains('dark');
    const isSelected = node.selected;

    if (isSelected) {
      return isDark ? '#fbbf24' : '#f59e0b'; // Highlight selected
    }

    return isDark ? '#60a5fa' : '#3b82f6';
  }}
  nodeStrokeColor={(node) => {
    const isSelected = node.selected;
    return isSelected ? '#dc2626' : '#64748b'; // Red border for selected
  }}
  nodeStrokeWidth={2}
  nodeClassName={(node) => {
    return node.selected ? 'animate-pulse' : '';
  }}
  zoomable
  pannable
/>
