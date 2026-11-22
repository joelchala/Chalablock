# How to build Chalablock (MV3)

Instructions for reviewers.

The following assumes a Linux environment (or WSL/Git Bash with Node.js, `jq`, and `zip`).

1. Open Bash console
2. `git clone https://github.com/joelchala/Chalablock.git`
3. `cd Chalablock`
4. `git submodule init`
5. `git submodule update`
6. `tools/make-mv3.sh chromium` (or `edge`, `firefox`, `safari`), or `tools/make-mv3.sh chromium <version>` to build a release zip.
7. This will build Chalablock (based on uBlock Origin Lite) and compile the bundled filter lists into static declarativeNetRequest rulesets.

Upon completion of the script, the resulting extension package will become present in:

- Chromium: `dist/build/uBOLite.chromium`
- Edge: `dist/build/uBOLite.edge`
- Firefox: `dist/build/uBOLite.firefox`
- Safari: `dist/build/uBOLite.safari`

The folder `dist/build/mv3-data` will cache data fetched from remote servers, so as to avoid fetching repeatedly from remote servers with repeated build commands. Use `make cleanassets` to remove all locally cached filter lists if you want to build with latest versions of filter lists.

The file `dist/build/uBOLite.[platform]/log.txt` will contain information about what happened during the build process.

The entry in the `Makefile` which implement the build process is `tools/make-mv3.sh [platform]`.[1] This Bash script copy various files from uBlock Origin branch and MV3-specific branch into a single folder which will be the final extension package.

Notably, `tools/make-mv3.sh [platform]` calls a Nodejs script which purpose is to convert the filter lists into various rulesets to be used in a declarative way. The Nodejs version required is 17.5.0 or above.

All the final rulesets are present in the `dist/build/uBOLite.[platform]/rulesets` in the final extension package.

---

[1] https://github.com/gorhill/uBlock/blob/c4d324362fdb95ff8ef20f0b18f42f0eec955433/tools/make-mv3.sh<br>
