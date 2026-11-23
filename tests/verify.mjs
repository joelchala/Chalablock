import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractZipEntry, readTargetVersion } from "../tools/make-mv3.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

let passed = 0;

function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS: ${name}`);
}

test("1. Sintaxis válida de tools/make-mv3.mjs", () => {
  const packager = path.join(ROOT, "tools", "make-mv3.mjs");
  assert.ok(fs.existsSync(packager), "Missing tools/make-mv3.mjs");
  execFileSync(process.execPath, ["--check", packager], { stdio: "pipe" });
});

test("2. Paquetes Chromium, Edge y Firefox (AMO) generados en store/paquetes y dist/build", () => {
  const version = readTargetVersion();
  for (const dir of [path.join(ROOT, "store", "paquetes"), path.join(ROOT, "dist", "build")]) {
    for (const target of ["chromium", "edge", "firefox"]) {
      const zipPath = path.join(dir, `Chalablock_${version}.${target}.zip`);
      assert.ok(fs.existsSync(zipPath), `Missing package: ${zipPath}`);
      assert.ok(fs.statSync(zipPath).size > 100000, `Package unexpectedly small: ${zipPath}`);
    }
  }
});

test("3. Manifiesto Firefox dentro de .firefox.zip incluye browser_specific_settings.gecko y background.scripts", () => {
  const version = readTargetVersion();
  const ffZipPath = path.join(ROOT, "store", "paquetes", `Chalablock_${version}.firefox.zip`);
  const rawManifest = extractZipEntry(fs.readFileSync(ffZipPath), "manifest.json");
  assert.ok(rawManifest, "Missing manifest.json inside Firefox ZIP");

  const manifest = JSON.parse(rawManifest.toString("utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, version);
  assert.equal(manifest.browser_specific_settings?.gecko?.id, "chalablock@chaladev.site");
  assert.equal(manifest.browser_specific_settings?.gecko?.strict_min_version, "113.0");
  assert.deepEqual(manifest.browser_specific_settings?.gecko?.data_collection_permissions, {
    required: ["none"]
  });
  assert.ok(Array.isArray(manifest.background?.scripts), "Firefox manifest must declare background.scripts");
  assert.deepEqual(manifest.background.scripts, ["/js/background.js"]);
  assert.equal(manifest.background?.service_worker, undefined);
  assert.equal(manifest.incognito, undefined);
  assert.equal(manifest.options_page, undefined);
  assert.equal(manifest.options_ui?.page, "dashboard.html");
  assert.equal(manifest.options_ui?.open_in_tab, true);
  assert.equal(manifest.permissions?.includes("userScripts"), false);
  assert.equal(manifest.optional_permissions?.includes("userScripts"), true);
  assert.equal(manifest.storage, undefined);
  assert.ok(Array.isArray(manifest.web_accessible_resources));
  for (const war of manifest.web_accessible_resources) {
    assert.equal(war.use_dynamic_url, undefined);
  }

  const offscreenEntry = extractZipEntry(fs.readFileSync(ffZipPath), "js/ext-offscreen.js");
  assert.ok(offscreenEntry, "Missing js/ext-offscreen.js in Firefox ZIP");
  assert.match(offscreenEntry.toString("utf8"), /document\.createElement\(['"]iframe['"]\)/);
});

test("4. Manifiesto Edge mantiene rulesets en la raíz del paquete", () => {
  const version = readTargetVersion();
  const edgeZipPath = path.join(ROOT, "store", "paquetes", `Chalablock_${version}.edge.zip`);
  const edgeManifestBuf = extractZipEntry(fs.readFileSync(edgeZipPath), "manifest.json");
  assert.ok(edgeManifestBuf, "Missing manifest.json inside Edge ZIP");
  const edgeManifest = JSON.parse(edgeManifestBuf.toString("utf8"));
  assert.ok(Array.isArray(edgeManifest.declarative_net_request?.rule_resources));
  for (const rs of edgeManifest.declarative_net_request.rule_resources) {
    assert.equal(rs.path.includes("/"), false, `Edge ruleset path must be at package root: ${rs.path}`);
  }
});

console.log(`\nAll ${passed} Chalablock checks passed.`);
