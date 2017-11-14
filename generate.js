const fs = require('fs');
const mkdir = require('mkdirp');
const now = new Date();

const numFiles = parseInt(process.argv[2]);
if (!numFiles) {
  throw new Error("number of files?");
}

const generateIndex = process.argv[3];
const packages = numFiles / 10;

console.log(`Generating ${numFiles} source files...`);
for (i = 0; i < numFiles; i++) {
  const dir = `src/package${i % packages}`;
  const path = `${dir}/timer${i}.ts`;
  mkdir.sync(dir);

  let content;
  if (i === 0) {
    content = `/** some copyright header */
export const createdAt${i} = new Date('${now.toISOString()}');
`;
  } else {
    content = `/** some copyright header */
export const dummy${i} = 0;
`;
  }

  fs.writeFileSync(path, content, {encoding: 'utf-8'});
}

if (generateIndex) {
  for (p = 0; p < packages; p++) {
    const content = `package(default_visibility=["//visibility:public"])
load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")
ts_library(
    name = "lib",
    srcs = glob(["*.ts"]),
    tsconfig = "//:tsconfig.json",
)
`;
    const path = `src/package${p}/BUILD.bazel`;
    fs.writeFileSync(path, content, {encoding: 'utf-8'});
  }

  console.log('Generating index.ts...');
  let index = `import { createdAt0 } from './package0/timer0';
const now = new Date();
console.log("Updated at", createdAt0.toISOString());
console.log("Now", now.toISOString());
document.body.appendChild(document.createTextNode('Num files ${numFiles}'));
document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createTextNode(\`JS start time (ms) $\{(window as any).jsStartTime.getTime() - createdAt0.getTime()}\`));
document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createTextNode(\`RTT (ms) $\{now.getTime() - createdAt0.getTime()}\`));
`;
  fs.writeFileSync('src/index.ts', index, {encoding: 'utf-8'});

  const deps = [];
  for (let p = 0; p < packages; p++) {
    deps.push(`//src/package${p}:lib`);
  }
  const buildContent = `package(default_visibility=["//visibility:public"])
load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")
ts_library(name = "app", srcs = ["index.ts"], deps = [
${deps.map(d => `    "${d}"`).join(',\n')}
])
`;
  fs.writeFileSync('src/BUILD.bazel', buildContent, {encoding: 'utf-8'});
}
