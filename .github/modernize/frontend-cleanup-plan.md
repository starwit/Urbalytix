# Frontend Architecture Cleanup Plan - Clean Code Principles

## Executive Summary
The Urbalytix frontend application has several architectural and code quality issues that violate clean code principles. This document outlines identified issues and cleanup strategies.

## Current Architecture Issues

### 1. **Component Organization**
- **Issue**: Mixed concerns in components (business logic, styling, routing logic)
- **Violation**: Single Responsibility Principle (SRP)
- **Example**: `DetectionOverview.jsx` (183 lines) handles data fetching, state management, filtering, and rendering

### 2. **Service Layer**
- **Issue**: No centralized error handling or request interceptors
- **Issue**: REST classes using arrow functions for methods (inconsistent with class patterns)
- **Issue**: No separation between API calls and business logic
- **Violation**: Dependency Inversion Principle (DIP)

### 3. **State Management**
- **Issue**: Over-reliance on `useContext` without centralized store
- **Issue**: Props drilling in deeply nested components
- **Issue**: Inconsistent state initialization and updates
- **Violation**: Don't Repeat Yourself (DRY)

### 4. **Hook Architecture**
- **Issue**: Custom hooks mix data fetching with business logic
- **Issue**: No consistent error handling pattern
- **Issue**: Missing loading states in some hooks
- **Issue**: No memoization strategy

### 5. **Code Duplication**
- **Issue**: Similar filter components with duplicated logic
- **Issue**: Repeated API base URL construction
- **Issue**: Multiple similar data transformation patterns

### 6. **Naming & Readability**
- **Issue**: Inconsistent naming conventions (camelCase vs PascalCase)
- **Issue**: Abbreviated variable names (`t`, `i18n`) not immediately clear
- **Issue**: Magic numbers and strings scattered throughout

### 7. **Error Handling**
- **Issue**: No global error boundary for specific features
- **Issue**: No retry logic for failed API calls
- **Issue**: Missing error logging strategy

### 8. **Configuration Management**
- **Issue**: Environment variables accessed directly in components
- **Issue**: No centralized config file
- **Issue**: Hard-coded magic numbers (e.g., `2000` in `useVehicleData(2000)`)

### 9. **Type Safety**
- **Issue**: No TypeScript despite complexity
- **Issue**: No PropTypes validation
- **Issue**: Runtime errors due to missing property checks

### 10. **Testing Infrastructure**
- **Issue**: Limited test structure
- **Issue**: No mock utilities for services
- **Issue**: No test data factories

## Cleanup Strategy

### Phase 1: Foundation (High Priority)
1. **Create constants file** for magic numbers and strings
2. **Implement centralized config** for environment variables
3. **Add PropTypes validation** to all components
4. **Create service adapters** with consistent error handling

### Phase 2: Code Organization (High Priority)
1. **Split large components** (>100 lines) using composition
2. **Extract business logic** from components into custom hooks
3. **Create custom hooks** for common patterns
4. **Implement proper separation of concerns**

### Phase 3: State Management (Medium Priority)
1. **Evaluate Context API vs alternative** (Redux, Zustand)
2. **Implement global error state**
3. **Centralize filter state**
4. **Add loading states**

### Phase 4: Code Quality (Medium Priority)
1. **Add ESLint rules** for complexity and file size
2. **Implement naming conventions**
3. **Add JSDoc comments** for complex functions
4. **Create error boundary components**

### Phase 5: Testing (Medium Priority)
1. **Create test utilities and mocks**
2. **Add unit tests** for hooks and services
3. **Add integration tests** for critical flows

## File Structure After Cleanup

```
src/
├── app/
│   ├── index.jsx (entry point)
│   ├── App.jsx
│   ├── MainContentRouter.jsx
│   ├── assets/ (themes, icons, images)
│   ├── commons/ (shared components)
│   │   ├── layout/
│   │   ├── dialogs/
│   │   ├── filters/
│   │   ├── errorHandling/
│   │   └── navigation/
│   ├── features/ (feature modules)
│   │   ├── detection/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── admin/
│   │   ├── comparison/
│   │   └── landing/
│   ├── services/ (API layer)
│   │   ├── api/ (axios instances)
│   │   ├── adapters/ (REST client wrappers)
│   │   ├── interceptors/
│   │   └── types/
│   ├── hooks/ (shared hooks)
│   ├── utils/ (helpers)
│   ├── constants/ (magic numbers, strings)
│   ├── config/ (environment config)
│   ├── types/ (shared types)
│   ├── localization/
│   └── styles/
├── index.css
└── index.jsx
```

## Priority Changes

### HIGH PRIORITY
1. Extract magic numbers to constants
2. Add PropTypes to all components
3. Split large components (>120 lines)
4. Add global error handling

### MEDIUM PRIORITY
1. Create centralized config
2. Improve hook patterns
3. Add JSDoc documentation
4. Implement consistent error state

### LOW PRIORITY
1. Add unit tests
2. Consider TypeScript migration
3. Refactor filter patterns
4. State management optimization

## Success Metrics

- [ ] All components < 120 lines
- [ ] All components have PropTypes
- [ ] Zero magic numbers in components
- [ ] Consistent naming conventions
- [ ] Global error handling in place
- [ ] ESLint config with complexity rules
- [ ] All public functions documented
- [ ] Component test coverage > 60%
