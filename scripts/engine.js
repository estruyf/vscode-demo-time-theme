const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');

const commonDark = `../src/commonDark.jsonc`;
const darkFile = `demotime-dark.json`;
const darkItalicFile = `demotime-dark-italic.json`;

const commonLight = `../src/commonLight.jsonc`;
const lightFile = `demotime-light.json`;
const lightItalicFile = `demotime-light-italic.json`;

// Define scopes that should have italic styling
const italicScopes = [
  "comment",
  "punctuation.definition.comment", 
  "string.comment",
  "constant",
  "entity.name.constant",
  "variable.other.constant",
  "variable.other.enummember",
  "variable.language",
  "entity",
  "entity.name.function",
  "keyword",
  "storage",
  "storage.type",
  "support",
  "invalid.broken",
  "invalid.deprecated", 
  "invalid.illegal",
  "invalid.unimplemented",
  "markup.quote",
  "markup.italic",
  "support.constant",
  "support.variable",
  "meta.module-reference"
];

function removeItalicFromTokenColors(tokenColors) {
  return tokenColors.map(token => {
    if (token.settings && token.settings.fontStyle) {
      // Check if any scope in this token should have italics
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      const hasItalicScope = scopes.some(scope => 
        italicScopes.includes(scope)
      );
      
      if (hasItalicScope) {
        const newToken = JSON.parse(JSON.stringify(token));
        let fontStyle = newToken.settings.fontStyle;
        
        // Remove italic but keep other styles like bold, underline
        if (fontStyle === 'italic') {
          delete newToken.settings.fontStyle;
        } else if (fontStyle.includes('italic')) {
          fontStyle = fontStyle
            .replace(/\bitalic\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (fontStyle) {
            newToken.settings.fontStyle = fontStyle;
          } else {
            delete newToken.settings.fontStyle;
          }
        }
        
        return newToken;
      }
    }
    return token;
  });
}

function addItalicToTokenColors(tokenColors) {
  return tokenColors.map(token => {
    if (token.scope) {
      // Check if any scope in this token should have italics
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      const hasItalicScope = scopes.some(scope => 
        italicScopes.includes(scope)
      );
      
      if (hasItalicScope) {
        const newToken = JSON.parse(JSON.stringify(token));
        let fontStyle = newToken.settings.fontStyle || '';
        
        // Add italic if not already present
        if (!fontStyle.includes('italic')) {
          if (fontStyle) {
            newToken.settings.fontStyle = `${fontStyle} italic`.trim();
          } else {
            newToken.settings.fontStyle = 'italic';
          }
        }
        
        return newToken;
      }
    }
    return token;
  });
}

function engine() {
  // Process dark themes
  const commonDarkContents = jsonc.parse(fs.readFileSync(path.join(__dirname, commonDark), { encoding: "utf-8" }));
  const darkContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, darkFile), { encoding: "utf-8" }));
  const darkItalicContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, darkItalicFile), { encoding: "utf-8" }));

  // Create regular dark theme (remove italics from specified scopes)
  const dark = { ...commonDarkContents, ...darkContents };
  if (dark.tokenColors) {
    dark.tokenColors = removeItalicFromTokenColors(dark.tokenColors);
  }

  // Create italic dark theme (ensure italics are present for specified scopes)
  const darkItalic = { ...commonDarkContents, ...darkContents, ...darkItalicContents };
  if (darkItalic.tokenColors) {
    darkItalic.tokenColors = addItalicToTokenColors(darkItalic.tokenColors);
  }

  fs.writeFileSync(path.join(__dirname, `../themes`, darkFile), JSON.stringify(dark, null, 2), { encoding: "utf-8" });
  fs.writeFileSync(path.join(__dirname, `../themes`, darkItalicFile), JSON.stringify(darkItalic, null, 2), { encoding: "utf-8" });

  // Process light themes
  const commonLightContents = jsonc.parse(fs.readFileSync(path.join(__dirname, commonLight), { encoding: "utf-8" }));
  const lightContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, lightFile), { encoding: "utf-8" }));
  const lightItalicContents = JSON.parse(fs.readFileSync(path.join(__dirname, `../src/`, lightItalicFile), { encoding: "utf-8" }));

  // Create regular light theme (remove italics from specified scopes)
  const light = { ...commonLightContents, ...lightContents };
  if (light.tokenColors) {
    light.tokenColors = removeItalicFromTokenColors(light.tokenColors);
  }

  // Create italic light theme (ensure italics are present for specified scopes)
  const lightItalic = { ...commonLightContents, ...lightContents, ...lightItalicContents };
  if (lightItalic.tokenColors) {
    lightItalic.tokenColors = addItalicToTokenColors(lightItalic.tokenColors);
  }

  fs.writeFileSync(path.join(__dirname, `../themes`, lightFile), JSON.stringify(light, null, 2), { encoding: "utf-8" });
  fs.writeFileSync(path.join(__dirname, `../themes`, lightItalicFile), JSON.stringify(lightItalic, null, 2), { encoding: "utf-8" });

  console.log('Themes built successfully!');
}

module.exports = engine;