
# [ INTERVIEW ] - Real-time Knowledgebase

**INTERVIEW**  is an innovative prototype of a real-time knowledgebase interface, created for quick and intuitive access to complex information resources. This dataset encompasses a glossary covering data analytics, engineering, and science, along with categories such as BI, DA, Excel, ML, Python, and SQL.

## Beta preview

[https://interview.dev.lp45.net](https://interview.dev.lp45.net)

## Screenshots

![screenshot](screenshot.png)

![screenshot2](screenshot2.png)

![screenshot3](screenshot3.png)

## Shortcuts

|Key sequence|Effect|
|-|-|
|:h|Display help|
|*|Browser whole dataset|
|:t0|Set fuzzy search threshold between 0 and 9, where 0 is an exact match|
|:c0|Toggle all categories on/off|
|:c[n]|toggle single categorie on/off. Replace [n] with category-nr. counting from left to right. So :c3 whould toggle the third category in your dataset from the right.|

## Dataset

This dataset with a total of 1259 entries in six categories was generated using an augmented dolphin-mistral model. Entries:

* 167 BI
* 170 DA
* 153 Excel
* 359 ML
* 161 Python
* 249 SQL

Last updated: 2024-01-28

## Languages and helpers

- [node.js](https://nodejs.org/en) v20
- [fuse.js](https://www.fusejs.io) 6.6.2
- [parcel](https://en.parceljs.org/getting_started.html) 2.9.3
- [sass](https://sass-lang.com) 1.63.6
- [typescript](https://www.typescriptlang.org)  5.1.6


## Development & build

Having `node.js` installed...

```bash
# clone source code
git clone https://github.com/netzwerkerei/interview.git
cd interview
npm i

# development

# overview
npm run

# frontend
npm run development
npm run frontend:build    

# deployment
npm run deploy
```

## Serving your own data

Just create a data.json file with the following schema:

```json
[
    {
        "id": ID,
        "category": CATEGORY_NAME,
        "title": ENTRY_TITLE,
        "content": ENTRY_CONTENT
    },
    ...
]
```

## License

Copyleft /-right hello@lp45.net 2024.
