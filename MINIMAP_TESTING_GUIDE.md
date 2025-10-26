# React Flow Minimap - Testing & Verification Guide

## Quick Fix Verification

### Test 1: Visual Inspection
1. **Open the workflow designer page**
2. **Look at the minimap** (bottom-right corner by default)
3. **Expected Result**: You should now see **blue rectangles** representing your workflow nodes
4. **Verify**: Nodes should be clearly visible against the white (light mode) or dark gray (dark mode) background

### Test 2: Dark Mode Toggle
1. **Toggle dark mode** using the theme switcher
2. **Expected Result**:
   - Light mode: Darker blue nodes (#3b82f6) on white background
   - Dark mode: Lighter blue nodes (#60a5fa) on dark background
3. **Verify**: Nodes remain visible in both modes with good contrast

### Test 3: Node Interaction
1. **Add a new node** to the canvas (drag from components panel)
2. **Check minimap**: New node should appear immediately
3. **Move a node**: Minimap should update in real-time
4. **Delete a node**: Should disappear from minimap

### Test 4: Zoom & Pan
1. **Zoom in/out** on the main canvas
2. **Verify**: Minimap viewport indicator (lighter area) moves accordingly
3. **Click on minimap**: Should pan the main canvas to that location
4. **Drag on minimap**: Should pan the canvas

## Detailed Testing Scenarios

### Scenario 1: Multiple Node Types
```
Action: Create workflow with different node types (trigger, agent, action, etc.)
Expected: All nodes visible in minimap with same color
Optional Enhancement: Implement type-based coloring (see alternative solutions)
```

### Scenario 2: Large Workflow
```
Action: Create workflow with 10+ nodes spread across canvas
Expected:
- All nodes visible in minimap as small rectangles
- Can click any area to navigate
- Minimap provides overview of entire workflow
```

### Scenario 3: Edge Cases
```
Test A: Empty workflow
- Expected: Only background visible, no errors

Test B: Single node
- Expected: One rectangle in minimap

Test C: Overlapping nodes
- Expected: Both nodes visible (may overlap in minimap)
```

## Browser DevTools Verification

### Step 1: Inspect Minimap Element
```javascript
// Open browser console and run:
const minimap = document.querySelector('.react-flow__minimap');
console.log('Minimap found:', !!minimap);
console.log('Minimap styles:', window.getComputedStyle(minimap));
```

### Step 2: Check Node Rendering
```javascript
const minimapNodes = document.querySelectorAll('.react-flow__minimap-node');
console.log('Minimap nodes:', minimapNodes.length);

minimapNodes.forEach((node, i) => {
  const computed = window.getComputedStyle(node);
  console.log(`Node ${i}:`, {
    fill: computed.fill,
    stroke: computed.stroke,
    opacity: computed.opacity,
    display: computed.display
  });
});
```

### Step 3: Verify Colors
```javascript
// Check if colors have proper contrast
const node = document.querySelector('.react-flow__minimap-node');
const bg = document.querySelector('.react-flow__minimap');

console.log('Node color:', window.getComputedStyle(node).fill);
console.log('Background:', window.getComputedStyle(bg).backgroundColor);
```

## Common Issues & Quick Fixes

### Issue 1: Still Not Visible
**Possible Causes:**
- Browser cache not cleared
- Dark mode detection not working
- CSS not loaded

**Fix:**
```bash
# Clear cache and rebuild
npm run build
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
```

### Issue 2: Nodes Too Small
**Fix:** Increase node size in minimap:
```typescript
<MiniMap
  nodeStrokeWidth={3}  // Increase from 2
  // ... other props
/>
```

### Issue 3: Wrong Colors in Dark Mode
**Fix:** Verify theme detection:
```typescript
// Add console.log to debug
nodeColor={(node) => {
  const isDark = document.documentElement.classList.contains('dark');
  console.log('Dark mode:', isDark);
  return isDark ? '#60a5fa' : '#3b82f6';
}}
```

## Performance Verification

### Test: Large Workflow Performance
1. Create workflow with 50+ nodes
2. Move nodes around
3. **Expected**:
   - No lag in minimap updates
   - Smooth rendering
   - No console errors

### Test: Rapid Theme Switching
1. Toggle dark/light mode rapidly (5-10 times)
2. **Expected**:
   - Colors update smoothly
   - No visual glitches
   - Minimap remains functional

## Accessibility Testing

### Test: Keyboard Navigation
```
Action: Use Tab to focus minimap
Expected: Minimap should be focusable and operable with keyboard
Note: May need to add tabIndex={0} to MiniMap component
```

### Test: Screen Reader
```
Action: Use screen reader to inspect minimap
Expected: Should announce "Minimap" and provide context
Enhancement: Add aria-label to MiniMap component
```

## Success Criteria Checklist

- [ ] Nodes visible in light mode with clear contrast
- [ ] Nodes visible in dark mode with clear contrast
- [ ] Minimap updates in real-time with canvas changes
- [ ] Click on minimap navigates canvas
- [ ] Drag on minimap pans canvas
- [ ] Zoom controls reflect in minimap viewport
- [ ] No console errors
- [ ] Smooth performance with 20+ nodes
- [ ] Dark mode toggle works correctly
- [ ] Minimap border and shadow visible

## Rollback Plan

If issues persist after fixes:

```typescript
// Simplest working configuration
<MiniMap
  nodeColor="#3b82f6"  // Simple blue, no dynamic logic
  nodeStrokeColor="#1e40af"
  nodeStrokeWidth={2}
  maskColor="rgba(0,0,0,0.1)"
/>
```

## Next Steps After Fix

1. ✅ Verify visual appearance
2. ✅ Test in both light and dark modes
3. ✅ Test with multiple nodes
4. ✅ Verify performance
5. 📝 Document any customizations
6. 🎨 Consider implementing type-based colors (optional enhancement)
7. ♿ Add accessibility features (optional)
