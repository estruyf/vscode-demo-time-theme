const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');

const commonDark = `../src/commonDark.jsonc`;
const darkFile = `demotime-dark.json`;
const darkItalicFile = `demotime-dark-italic.json`;

const commonLight = `../src/commonLight.jsonc`;
const lightFile = `demotime-light.json`;
const lightItalicFile = `demotime-light-italic.json`;

function engine() {
  // Process dark themes
  const commonDarkContents = jsonc.parse(fs.readFileSync(path.join(__dirname, commonDark), { encoding: "utf-8" }));
  const darkContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, darkFile), { encoding: "utf-8" }));
  const darkItalicContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, darkItalicFile), { encoding: "utf-8" }));

  const dark = { ...commonDarkContents, ...darkContents };
  const darkItalic = { ...commonDarkContents, ...darkItalicContents };

  fs.writeFileSync(path.join(__dirname, `../themes`, darkFile), JSON.stringify(dark, null, 2), { encoding: "utf-8" });
  fs.writeFileSync(path.join(__dirname, `../themes`, darkItalicFile), JSON.stringify(darkItalic, null, 2), { encoding: "utf-8" });

  // Process light themes
  const commonLightContents = jsonc.parse(fs.readFileSync(path.join(__dirname, commonLight), { encoding: "utf-8" }));
  const lightContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, lightFile), { encoding: "utf-8" }));
  const lightItalicContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, lightItalicFile), { encoding: "utf-8" }));

  const light = { ...commonLightContents, ...lightContents };
  const lightItalic = { ...commonLightContents, ...lightItalicContents };

  fs.writeFileSync(path.join(__dirname, `../themes`, lightFile), JSON.stringify(light, null, 2), { encoding: "utf-8" });
  fs.writeFileSync(path.join(__dirname, `../themes`, lightItalicFile), JSON.stringify(lightItalic, null, 2), { encoding: "utf-8" });

  console.log('Themes built successfully!');
}

module.exports = engine;