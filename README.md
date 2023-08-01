# [ INTERVIEW ]

![screenshot](screenshot.png)
![screenshot2](screenshot2.png)
![screenshot3](screenshot3.png)

## Beta preview @ deta.space

<https://interview.dev.lp45.net>

## Languages and helpers

- [fastapi](https://fastapi.tiangolo.com) 0.100
- [fuse.js](https://www.fusejs.io) 6.6.2
- [node.js](https://nodejs.org/en) v20
- [parcel](https://en.parceljs.org/getting_started.html) 2.9.3
- [python](https://www.python.org) 3.10
- [sass](https://sass-lang.com) 1.63.6
- [typescript](https://www.typescriptlang.org)  5.1.6


## Installation, development & build

Having `python` and `node.js` installed...

```bash
# installation

# clone source code
    git clone https://github.com/netzwerkerei/interview.git
    cd interview

# create virtual enviorment
    pip install virtualenv
    virtualenv venv
    source venv/bin/activate

    pip install requirements.txt
    npm i
```

```bash
# development

# overview
    npm run

# frontend
    npm run frontend:dev
    npm run frontend:build    

# backend
    npm run backend:dev

# deployment
    npm run deploy
```

## Deploy on Ubuntu 20 an higher.

For a detailed server setup running nginx with python check out: [ubuntu_server_setup.md](ubuntu_server_setup.md)

## ToDo

- Implement `searchTerm` logging
- Inline editing
- Generete
  - Terms
  - Content
- df-Backend-Data-Layer

## License

Copyleft /-right netzwerkerei@gmail.com 2023.
