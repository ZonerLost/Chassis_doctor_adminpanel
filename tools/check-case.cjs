const fs = require("fs");
const path = require("path");

const workspace = path.resolve(__dirname, "..");
const exts = [".js", ".jsx", ".ts", ".tsx", ".json"];

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results.push(...walk(full));
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      results.push(full);
    }
  });
  return results;
}

function resolveImport(importer, imp) {
  if (!imp.startsWith(".") && !imp.startsWith("/")) return null;
  const base = path.dirname(importer);
  let resolved = path.resolve(base, imp);
  const tryPaths = [
    resolved,
    ...exts.map((e) => resolved + e),
    ...exts.map((e) => path.join(resolved, "index" + e)),
  ];
  for (const t of tryPaths) {
    if (fs.existsSync(t)) return t;
  }
  return null;
}

function checkFile(file) {
  const content = fs.readFileSync(file, "utf8");
  const importRegex = /import\s+[^'"\n]+['"](\.[^'"\n]+)['"]/g;
  const requireRegex = /require\(['"](\.[^'"\n]+)['"]\)/g;
  const issues = [];
  let m;
  while ((m = importRegex.exec(content))) {
    issues.push(m[1]);
  }
  while ((m = requireRegex.exec(content))) {
    issues.push(m[1]);
  }
  const mismatches = [];
  for (const imp of issues) {
    const resolved = resolveImport(file, imp);
    if (!resolved) continue;
    const rel = path.relative(workspace, resolved);
    const parts = rel.split(path.sep);
    let cur = path.resolve(workspace);
    for (const part of parts) {
      const entries = fs.readdirSync(cur);
      const match = entries.find((e) => e === part);
      if (!match) {
        const ci = entries.find((e) => e.toLowerCase() === part.toLowerCase());
        if (ci) {
          const expected = path.join(cur, part);
          const actual = path.join(cur, ci);
          mismatches.push({
            importer: file,
            importPath: imp,
            resolved,
            expected,
            actual,
          });
          break;
        }
      }
      cur = path.join(cur, match || part);
    }
  }
  return mismatches;
}

(function main() {
  console.log("Scanning project for case-sensitive import mismatches...");
  const files = walk(path.join(workspace, "src"));
  const problems = [];
  files.forEach((f) => {
    try {
      const res = checkFile(f);
      if (res && res.length) problems.push(...res);
    } catch (err) {
      console.error("Error checking", f, err.message);
    }
  });

  if (problems.length === 0) {
    console.log("No case mismatches found.");
    process.exit(0);
  }

  console.log("\nFound case mismatches:");
  problems.forEach((p, idx) => {
    console.log("\n" + (idx + 1) + ")");
    console.log("Importer:", path.relative(workspace, p.importer));
    console.log("Import string:", p.importPath);
    console.log("Resolved path:", path.relative(workspace, p.resolved));
    console.log("Expected casing:", path.relative(workspace, p.expected));
    console.log("Actual on disk:", path.relative(workspace, p.actual));
  });
  process.exit(2);
})();
