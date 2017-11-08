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
  const path = `${dir}/timer${i}.js`;
  mkdir.sync(dir);

  const content = `/** some copyright header */
export class Timer${i} {
  static createdAt() {
    return new Date('${now.toISOString()}');
  }
}
`;

  fs.writeFileSync(path, content, {encoding: 'utf-8'});
}

if (generateIndex) {
  console.log('Generating index.ts...');
  let index = ``;
  for (i = 0; i < numFiles; i++) {
    index += `import { Timer${i} } from './package${i % packages}/timer${i}';\n`;
  }
  index += `let updatedAt = Timer0.createdAt();\n`
  for (i = 1; i < numFiles; i++) {
    index += `updatedAt = Timer${i}.createdAt() > updatedAt ? Timer${i}.createdAt() : updatedAt;\n`;
  }
  index += `
    document.body.appendChild(document.createTextNode('Num files ${numFiles}'));
    document.body.appendChild(document.createElement("br"));
    console.log("Updated at", updatedAt.toISOString());
    const now = new Date();
    console.log("Now", now.toISOString());

    document.body.appendChild(document.createTextNode(\`RTT (ms) $\{now.getTime() - updatedAt.getTime()}\`));
  `;
  fs.writeFileSync('src/main.js', index, {encoding: 'utf-8'});
}
