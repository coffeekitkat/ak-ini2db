# ini

## Requirements

- Yarn 1.22.0
- Node JS >= 12.14
- Unpacked Aura Kingdom client (at least the `Data/db/` pack)

## Setup

Install dependencies using Yarn

```
yarn install
```

Define `GAME_PATH` environment variable.

Example:

```ini
# .env
GAME_PATH=~/aura-kingdom/unpack/
```

## Usage

Run the script

```
node ./tools/convert-db.js
```