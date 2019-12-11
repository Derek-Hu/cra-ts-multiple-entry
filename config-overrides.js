const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const htmlFiles = {
  index: resolveApp('public/index.html'),
  config: resolveApp('public/config.html'),
  video_overlay: resolveApp('public/video_overlay.html'),
}

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: resolveModule(resolveApp, `src/index`),
    template: htmlFiles.index,
    outPath: path.basename(htmlFiles.index)
  },
  {
    entry: resolveModule(resolveApp, `src/config`),
    template: htmlFiles.config,
    outPath: path.basename(htmlFiles.config)
  },
  {
    entry: resolveModule(resolveApp, `src/video_overlay`),
    template: htmlFiles.video_overlay,
    outPath: path.basename(htmlFiles.video_overlay)
  }
]);

module.exports = function override(config, webpackEnv) {
  multipleEntry.addMultiEntry(config);

  return config;
}