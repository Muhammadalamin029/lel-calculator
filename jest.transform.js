const ts = require('typescript');

/** Minimal Jest transform for pure-TS tests — no Babel needed. */
module.exports = {
  process(src, path) {
    const { outputText } = ts.transpileModule(src, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2019,
      },
      fileName: path,
    });
    return { code: outputText };
  },
};
