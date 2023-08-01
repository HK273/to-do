# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW)

## Table of contents

- [Overview](#overview)
  - [Links](#links)
  - [DragNDrop](#drag-and-drop)
  - [Vite/TS/GH Pages](#vite--typescript-gh-pages-notes)

## Overview

- [Solution]()
- [Site](https://hk273.github.io/to-do/)

### Links

- [Basic To-Do](https://www.youtube.com/watch?v=-l0FEONO-cM&t=323s)
- [Drag and Drop](https://www.youtube.com/watch?v=aYZRRyukuIw)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [CSS Gradient](https://cssgradient.io/)

Add the below for use with TS

```bash
npm install --save-dev @types/react-beautiful-dnd
```

```bash
npm i --save-dev @types/uuid
```

### Drag and Drop

- Need to define the size of the parent container, if you set size using the child element the drag and drop looks a bit janky and will lurch to the left when moved

### Vite + Typescript GH Pages Notes

- [Great Tutorial](https://www.youtube.com/watch?v=Y3yCB7CfjF4)
- [Vite Docs](https://vitejs.dev/guide/static-deploy.html)

#### General steps....

This will create a dist folder providing the output directory where the optimized and bundled files are generated during the build process

```bash
npm run build
```

Update vite.config.ts to inlude the repo name as the base

```typescript
export default defineConfig({
  base: "/to-do/",
  plugins: [react()],
});
```

Add a .github/workflows folder with the yml example from the vite docs

Ensure you enable GitHub Actions in the Pages section of GitHub 
