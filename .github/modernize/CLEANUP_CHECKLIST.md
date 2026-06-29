# Frontend Cleanup Checklist

## Phase 1: Foundation ✅ COMPLETED

- [x] Create constants file for magic numbers
- [x] Create centralized configuration
- [x] Add PropTypes validation system
- [x] Implement API error handling
- [x] Refactor error handler component
- [x] Add JSDoc documentation
- [x] Update ESLint configuration

## Phase 2: Component Refactoring (Next)

### High Priority
- [ ] Split DetectionOverview.jsx (183 lines → multiple components)
  - [ ] Extract DetectionMapContainer
  - [ ] Extract DetectionFiltersContainer
  - [ ] Extract DetectionDataTable
  
- [ ] Add PropTypes to all components
  - [ ] Detection feature components
  - [ ] Admin area components
  - [ ] Comparison feature components
  
- [ ] Refactor hook implementations
  - [ ] Add error handling to all data hooks
  - [ ] Add loading states
  - [ ] Standardize hook patterns

- [ ] Review and fix ESLint violations
  - [ ] Address max-lines warnings
  - [ ] Fix magic number warnings
  - [ ] Resolve import ordering

### Medium Priority
- [ ] Extract filter components into separate hooks
- [ ] Create custom hooks for data fetching
- [ ] Implement error boundaries for features
- [ ] Add loading skeletons

## Phase 3: Testing

- [ ] Add unit tests for utilities
- [ ] Add unit tests for hooks
- [ ] Add integration tests for API service
- [ ] Add component tests for key components

## Phase 4: Documentation

- [ ] Document component patterns
- [ ] Add README for hooks usage
- [ ] Document API service patterns
- [ ] Create developer guide

## Phase 5: Performance

- [ ] Identify unnecessary re-renders
- [ ] Add React.memo to appropriate components
- [ ] Optimize useMemo/useCallback usage
- [ ] Add code splitting recommendations

## Quick Start: Running the Checks

### 1. Install Dependencies (if needed)
```bash
cd webclient/app
npm install prop-types --save
```

### 2. Run ESLint
```bash
npm run lint
```

### 3. Fix Auto-fixable Issues
```bash
npm run lint -- --fix
```

### 4. Review Warnings
```bash
# Identify high-priority warnings
npm run lint | grep "error\|warning"
```

## Component Refactoring Guidelines

When refactoring components, follow this pattern:

### 1. Size Check
- If component > 120 lines → Split it
- If function > 50 lines → Extract logic

### 2. Responsibilities
- Does it fetch data? → Use custom hook
- Does it have complex logic? → Extract to utils
- Does it manage filters? → Use useForm hook

### 3. Props Check
- Add PropTypes
- Document with JSDoc
- Use CommonPropTypes where applicable

### 4. Example: Refactoring a Large Component

```javascript
// BEFORE: 183 lines in one component
function DetectionOverview() {
  const [viewState, setViewState] = useState(...);
  const [showDataTable, setShowDataTable] = useState(...);
  // ... 180 more lines
}

// AFTER: Split into focused components
function DetectionOverviewContainer() {
  const { viewState, setViewState } = useDetectionViewState();
  const { filters, handleFilterChange } = useDetectionFilters();
  
  return (
    <>
      <DetectionMapView viewState={viewState} />
      <DetectionFiltersPanel filters={filters} onChange={handleFilterChange} />
      <DetectionDataPanel />
    </>
  );
}
```

## Common Patterns

### Using Constants
```javascript
import { MAP_CONFIG } from '@/constants/appConstants';

const viewState = {
  zoom: MAP_CONFIG.DEFAULT_ZOOM,
  pitch: MAP_CONFIG.DEFAULT_PITCH,
};
```

### Using PropTypes
```javascript
import PropTypes from 'prop-types';
import { CommonPropTypes, CommonShapes } from '@/types/propTypes';

function MyComponent({ items, isLoading, onItemSelect }) {
  // ...
}

MyComponent.propTypes = {
  items: PropTypes.arrayOf(CommonShapes.error),
  isLoading: CommonPropTypes.isLoading,
  onItemSelect: CommonPropTypes.onClick,
};
```

### Using Custom Hooks
```javascript
import { useAsync, useForm, useToggle } from '@/hooks/useCommon';

function MyComponent() {
  const { isLoading, error, execute } = useAsync(fetchData);
  const { values, handleChange, reset } = useForm(initialValues);
  const { value: isOpen, toggle: toggleOpen } = useToggle(false);
}
```

### Using Utilities
```javascript
import { truncate, capitalizeFirst } from '@/utils/stringUtils';
import { isEmpty, getUnique } from '@/utils/arrayUtils';

const title = capitalizeFirst(data.name);
const preview = truncate(description, 50);
```

## Performance Optimization

### Identify Issues
```bash
# Use React Developer Tools Profiler
# Or add console timing:
console.time('componentName');
// ... render logic
console.timeEnd('componentName');
```

### Common Optimizations
- Wrap expensive components with `React.memo()`
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for handler functions
- Split large components into smaller ones

## Success Metrics

Track progress with these metrics:

- [ ] ESLint score: 0 errors, < 50 warnings
- [ ] Component size: All components < 150 lines
- [ ] PropTypes coverage: > 90%
- [ ] Test coverage: > 60%
- [ ] Zero magic numbers in components
- [ ] Zero console.log in production code
- [ ] All components documented

## Additional Resources

### Documentation Files
- `CLEANUP_IMPLEMENTATION_REPORT.md` - Current improvements
- `frontend-cleanup-plan.md` - Original analysis
- React Best Practices: https://react.dev/learn
- ESLint Rules: https://eslint.org/docs/rules/

### Video References
- React Composition: https://www.youtube.com/watch?v=k-fW5Qmf_U4
- Custom Hooks: https://www.youtube.com/watch?v=tzXW1j7M069
- Clean Code: https://www.youtube.com/watch?v=7EmboKQH8M0

## Notes

- These improvements are incremental
- Don't rush - focus on one section at a time
- Get code review before major refactors
- Add tests as you refactor
- Keep commits small and focused
