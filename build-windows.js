// Windows-compatible build script
const esbuild = require('esbuild');
const path = require('path');

async function buildForWindows() {
  try {
    console.log('Building for Windows...');
    
    await esbuild.build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs', // Use CommonJS for Windows compatibility
      outfile: 'dist/index-windows.cjs',
      external: [
        '@neondatabase/serverless',
        'drizzle-orm',
        'ws'
      ],
      define: {
        'import.meta.url': 'require("url").pathToFileURL(__filename).href',
      },
      inject: ['./polyfill-dirname.js'],
      sourcemap: true,
      minify: false,
    });
    
    console.log('Windows build complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForWindows();