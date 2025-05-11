# Linting and TypeScript Configuration Guide

This document explains the linting and TypeScript configuration used in this project.

## ESLint Configuration

Our ESLint configuration enforces code quality and consistency across the project. Here are the key aspects:

### Core Configuration
- Uses Next.js recommended rules
- Enforces TypeScript best practices
- Includes import sorting and organization
- Integrates with Prettier for formatting

### Key Rules
- Strict TypeScript checks (no any, explicit return types)
- React Hooks rules
- Import organization
- Code complexity limits
- Consistent spacing and formatting

### Running ESLint
```bash
# Check all files
npm run lint

# Check specific files
npx eslint src/ --ext .ts,.tsx

# Fix automatically fixable issues
npx eslint src/ --ext .ts,.tsx --fix
```

## TypeScript Configuration

The TypeScript configuration (`tsconfig.json`) is set up for a Next.js project with strict type checking:

### Key Features
- Strict type checking enabled
- Path aliases (@/* points to src/*)
- Next.js and React support
- Modern JavaScript features support

### Important Settings
- `strict: true`: Enables strict type checking
- `noEmit: true`: TypeScript is used only for type checking
- `jsx: "preserve"`: Lets Next.js handle JSX transformation
- `moduleResolution: "bundler"`: Uses the new bundler resolution

## Prettier Configuration

Prettier handles code formatting with the following key settings:
- Single quotes for strings
- 2 spaces for indentation
- 80 characters line length
- Trailing commas in objects and arrays
- Semicolons at the end of statements

## VS Code Integration

For the best development experience in VS Code:

1. Install required extensions:
   - ESLint
   - Prettier

2. The workspace settings are configured to:
   - Format on save
   - Show lint errors in real-time
   - Use the correct TypeScript version
   - Auto-fix ESLint issues on save

## Best Practices

1. **Types**
   ```typescript
   // ❌ Avoid
   const data: any = fetchData();
   
   // ✅ Good
   interface DataType {
     id: number;
     name: string;
   }
   const data: DataType = fetchData();
   ```

2. **React Components**
   ```typescript
   // ❌ Avoid
   function component(props: any) {
     return <div>{props.name}</div>;
   }
   
   // ✅ Good
   interface ComponentProps {
     name: string;
   }
   
   export const Component: React.FC<ComponentProps> = ({ name }) => {
     return <div>{name}</div>;
   };
   ```

3. **Imports**
   ```typescript
   // ❌ Avoid
   import {something} from'package'
   
   // ✅ Good
   import { something } from 'package';
   ```

## Common Issues and Solutions

1. **ESLint can't find module**
   - Check if the path alias is correctly configured in both `tsconfig.json` and `.eslintrc.js`
   - Ensure the module exists and is exported correctly

2. **Type errors**
   - Use explicit types instead of `any`
   - Create interfaces for component props
   - Use TypeScript utility types when needed

3. **Import ordering issues**
   - Let ESLint auto-fix with `npm run lint -- --fix`
   - Follow the import order: external → internal → relative

## Getting Help

If you encounter any issues:
1. Check the error message in VS Code
2. Run `npm run lint` for detailed error information
3. Consult this documentation
4. Ask for help from the team 