declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Add Tailwind CSS directives
declare module 'tailwindcss/base';
declare module 'tailwindcss/components';
declare module 'tailwindcss/utilities'; 