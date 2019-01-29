module.exports = {
    mode: 'modules',
    out: './docs',
    theme: 'default',
    ignoreCompilerErrors: true,
    excludePrivate: true,
    excludeNotExported: true,
    excludeExternals: true,
    name: 'Foxbit API - Documentation',
    //target: 'ES5',
    //moduleResolution: 'node',
    //preserveConstEnums: true,
    //stripInternal: true,
    //suppressExcessPropertyErrors: true,
    //suppressImplicitAnyIndexErrors: true,
    //module: 'commonjs',
    //readme: 'README.md',
    exclude: [
      './src/index.ts',
      './src/api-descriptors.ts',
      './src/log-service.ts'
    ],
  };