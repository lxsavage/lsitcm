# Changelog

### Version 1.1.0
#### Additions
- Changelog
- Addition of verbose tags on each get function:
  - `get(name, callback, isVerbose)`
  - `getMetadata(callback, isVerbose)`
- Addition of nocolor tag:
  - `lsitcm -nocolor` or
  - `lsitcm -C`
#### Removals
- None
#### Optimizations
- `getMetadata(callback, isVerbose)`
  - Runs on one AppleScript statement, increasing efficiency
  - Moved to external file, for easier editing
#### Deprecations
- None
#### Next version plans
- Convert `lsitcm` to a TypeScript project, designated as `lsitcm-typescript`