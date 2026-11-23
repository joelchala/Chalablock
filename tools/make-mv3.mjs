import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const UNPACKED_DIR = path.join(ROOT, "dist", "build", "uBOLite.chromium");
const PACKAGES_DIR = path.join(ROOT, "store", "paquetes");
const BUILD_DIR = path.join(ROOT, "dist", "build");
const FIREFOX_OFFSCREEN_SRC = path.join(ROOT, "platform", "mv3", "firefox", "ext-offscreen.js");

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

export function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function collectFiles(dirPath, baseDir = dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dirPath, entry.name);
    const rel = path.relative(baseDir, abs).split(path.sep).join("/");
    if (rel === "log.txt" || rel === "_metadata" || rel.startsWith("_metadata/") || rel === "rulesets/debug" || rel.startsWith("rulesets/debug/")) {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...collectFiles(abs, baseDir));
    } else if (entry.isFile()) {
      files.push({ rel, abs });
    }
  }
  files.sort((a, b) => a.rel.localeCompare(b.rel));
  return files;
}

function compressEntry(name, rawBuf) {
  const deflated = zlib.deflateRawSync(rawBuf, { level: 6 });
  const useDeflate = deflated.length < rawBuf.length;
  return {
    name,
    rawLen: rawBuf.length,
    crc: crc32(rawBuf),
    method: useDeflate ? 8 : 0,
    payload: useDeflate ? deflated : rawBuf
  };
}

function assembleZip(compiledEntries) {
  const sorted = [...compiledEntries].sort((a, b) => a.name.localeCompare(b.name));
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() & 0x1f) << 11) |
    ((now.getMinutes() & 0x3f) << 5) |
    ((now.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((Math.max(1980, now.getFullYear()) - 1980) & 0x7f) << 9) |
    (((now.getMonth() + 1) & 0x0f) << 5) |
    (now.getDate() & 0x1f);

  for (const entry of sorted) {
    const nameBuf = Buffer.from(entry.name, "utf8");
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(entry.method, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(entry.crc, 14);
    localHeader.writeUInt32LE(entry.payload.length, 18);
    localHeader.writeUInt32LE(entry.rawLen, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, entry.payload);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(entry.method, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(entry.crc, 16);
    centralHeader.writeUInt32LE(entry.payload.length, 20);
    centralHeader.writeUInt32LE(entry.rawLen, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + entry.payload.length;
  }

  const centralDir = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(sorted.length, 8);
  eocd.writeUInt16LE(sorted.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDir, eocd]);
}

export function extractZipEntry(zipBuffer, targetName) {
  let eocdOffset = -1;
  for (let i = zipBuffer.length - 22; i >= Math.max(0, zipBuffer.length - 65557); i -= 1) {
    if (zipBuffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    throw new Error("Invalid ZIP: missing EOCD");
  }
  const totalEntries = zipBuffer.readUInt16LE(eocdOffset + 10);
  const cdOffset = zipBuffer.readUInt32LE(eocdOffset + 16);

  let cursor = cdOffset;
  for (let i = 0; i < totalEntries; i += 1) {
    if (zipBuffer.readUInt32LE(cursor) !== 0x02014b50) {
      throw new Error("Invalid ZIP: corrupt Central Directory");
    }
    const method = zipBuffer.readUInt16LE(cursor + 10);
    const compSize = zipBuffer.readUInt32LE(cursor + 20);
    const nameLen = zipBuffer.readUInt16LE(cursor + 28);
    const extraLen = zipBuffer.readUInt16LE(cursor + 30);
    const commentLen = zipBuffer.readUInt16LE(cursor + 32);
    const localOffset = zipBuffer.readUInt32LE(cursor + 42);
    const entryName = zipBuffer.subarray(cursor + 46, cursor + 46 + nameLen).toString("utf8");

    if (entryName === targetName) {
      const lfhNameLen = zipBuffer.readUInt16LE(localOffset + 26);
      const lfhExtraLen = zipBuffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lfhNameLen + lfhExtraLen;
      const compData = zipBuffer.subarray(dataStart, dataStart + compSize);
      return method === 8 ? zlib.inflateRawSync(compData) : Buffer.from(compData);
    }
    cursor += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

/**
 * Transforma un manifiesto MV3 de Chalablock a formato compatible con Mozilla Firefox (AMO).
 */
export function toFirefoxManifest(manifest, geckoId = "chalablock@chaladev.site") {
  const ff = structuredClone(manifest);
  ff.browser_specific_settings = {
    ...(ff.browser_specific_settings || {}),
    gecko: {
      ...(ff.browser_specific_settings?.gecko || {}),
      id: geckoId,
      strict_min_version: "113.0",
      data_collection_permissions: {
        required: ["none"]
      }
    }
  };
  if (ff.background && ff.background.service_worker) {
    const { service_worker: sw, ...rest } = ff.background;
    ff.background = {
      scripts: [sw],
      ...rest
    };
  }
  if (Array.isArray(ff.permissions)) {
    ff.permissions = ff.permissions.filter((p) => p !== "offscreen" && p !== "declarativeNetRequestFeedback");
  }
  delete ff.minimum_chrome_version;
  return ff;
}

/**
 * Adapta el manifiesto de Chalablock para Microsoft Edge Add-ons (rulesets en la raíz).
 */
export function toEdgeManifest(manifest) {
  const edge = structuredClone(manifest);
  if (Array.isArray(edge.declarative_net_request?.rule_resources)) {
    for (const ruleset of edge.declarative_net_request.rule_resources) {
      const pos = ruleset.path.lastIndexOf("/");
      if (pos !== -1) {
        ruleset.path = ruleset.path.slice(pos + 1);
      }
    }
  }
  return edge;
}

export function readTargetVersion() {
  const cliVersion = process.argv[2]?.trim();
  if (cliVersion) return cliVersion;
  if (process.env.VERSION?.trim()) return process.env.VERSION.trim();

  if (fs.existsSync(PACKAGES_DIR)) {
    const versions = fs
      .readdirSync(PACKAGES_DIR)
      .map((name) => /^Chalablock_(\d+\.\d+\.\d+)\.chromium\.zip$/.exec(name)?.[1])
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (versions.length > 0) {
      return versions[versions.length - 1];
    }
  }
  return "1.0.1";
}

export function buildChalablockPackages(version = readTargetVersion()) {
  if (!fs.existsSync(UNPACKED_DIR)) {
    throw new Error(`Falta compilación base en ${UNPACKED_DIR}. Ejecuta tools/make-mv3.sh chromium primero.`);
  }

  const baseManifestPath = path.join(UNPACKED_DIR, "manifest.json");
  const baseManifest = JSON.parse(fs.readFileSync(baseManifestPath, "utf8"));
  const chromiumManifest = structuredClone(baseManifest);
  chromiumManifest.version = version;
  if (Array.isArray(chromiumManifest.permissions)) {
    chromiumManifest.permissions = chromiumManifest.permissions.filter(
      (p) => p !== "declarativeNetRequestFeedback"
    );
  }

  const edgeManifest = toEdgeManifest(chromiumManifest);
  const firefoxManifest = toFirefoxManifest(chromiumManifest);

  const files = collectFiles(UNPACKED_DIR);
  const sharedEntries = [];
  for (const file of files) {
    if (file.rel === "manifest.json") continue;
    sharedEntries.push(compressEntry(file.rel, fs.readFileSync(file.abs)));
  }

  // Chromium ZIP
  const chromiumEntries = [
    ...sharedEntries,
    compressEntry("manifest.json", Buffer.from(`${JSON.stringify(chromiumManifest, null, 2)}\n`, "utf8"))
  ];
  const chromiumZipBuf = assembleZip(chromiumEntries);

  // Edge ZIP (rulesets/main/*.json movidos a la raíz)
  const edgeEntries = sharedEntries.map((entry) => {
    if (entry.name.startsWith("rulesets/main/")) {
      return { ...entry, name: entry.name.slice("rulesets/main/".length) };
    }
    return entry;
  });
  edgeEntries.push(
    compressEntry("manifest.json", Buffer.from(`${JSON.stringify(edgeManifest, null, 2)}\n`, "utf8"))
  );
  const edgeZipBuf = assembleZip(edgeEntries);

  // Firefox ZIP (manifest.json transformado + js/ext-offscreen.js de platform/mv3/firefox)
  const firefoxOffscreenBuf = fs.existsSync(FIREFOX_OFFSCREEN_SRC)
    ? fs.readFileSync(FIREFOX_OFFSCREEN_SRC)
    : null;
  const firefoxEntries = sharedEntries.map((entry) => {
    if (entry.name === "js/ext-offscreen.js" && firefoxOffscreenBuf) {
      return compressEntry("js/ext-offscreen.js", firefoxOffscreenBuf);
    }
    return entry;
  });
  firefoxEntries.push(
    compressEntry("manifest.json", Buffer.from(`${JSON.stringify(firefoxManifest, null, 2)}\n`, "utf8"))
  );
  const firefoxZipBuf = assembleZip(firefoxEntries);

  fs.mkdirSync(PACKAGES_DIR, { recursive: true });
  fs.mkdirSync(BUILD_DIR, { recursive: true });

  const outputs = [
    { path: path.join(PACKAGES_DIR, `Chalablock_${version}.chromium.zip`), buf: chromiumZipBuf },
    { path: path.join(PACKAGES_DIR, `Chalablock_${version}.edge.zip`), buf: edgeZipBuf },
    { path: path.join(PACKAGES_DIR, `Chalablock_${version}.firefox.zip`), buf: firefoxZipBuf },
    { path: path.join(BUILD_DIR, `Chalablock_${version}.chromium.zip`), buf: chromiumZipBuf },
    { path: path.join(BUILD_DIR, `Chalablock_${version}.edge.zip`), buf: edgeZipBuf },
    { path: path.join(BUILD_DIR, `Chalablock_${version}.firefox.zip`), buf: firefoxZipBuf }
  ];

  for (const out of outputs) {
    fs.writeFileSync(out.path, out.buf);
  }

  return {
    version,
    outputs: outputs.map((o) => o.path)
  };
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  path.resolve(fileURLToPath(import.meta.url)).toLowerCase() ===
    path.resolve(process.argv[1]).toLowerCase();

if (isDirectRun) {
  const result = buildChalablockPackages();
  console.log(`Built Chalablock v${result.version} packages (Chromium, Edge, Firefox AMO):`);
  for (const outPath of result.outputs) {
    console.log(`  - ${path.relative(ROOT, outPath)} (${fs.statSync(outPath).size} bytes)`);
  }
}
