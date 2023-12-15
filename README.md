# CSCI 2720: EC2Find@HK

## Group Members

- So Tsz Chung 1155149485
- Chan Sik Lam 1155159276
- So Chin Ting 1155156676
- Tse Hui Tung 1155158864
- Yie Tin Hon 1155158824

## Installation

1. #### Setup Environment

   _Important: The script will install yarn globally, if you don't want to install yarn globally, please remove the line `npm install -g yarn` in `setup.sh`_

   Windows:

   ```
   ./setup.sh
   ```

   MacOS/Linux:

   ```
   source ./setup.sh
   ```

2. #### add .env file

add .env file in ./backend (need your mongodb ac here, others can remain the same)

```
DB_CONNECTION=mongodb+srv://brandonso:708bLsCdYxebc2Jh@cluster1.dyxbptr.mongodb.net/
GOV_DATA_API=https://api.data.gov.hk/v1/nearest-clp-electric-vehicle-charging-stations
DEV_SERVER_PATH=http://localhost:3000
PORT=5500
```

add .env file in ./frontend (can use the same )

```
NEXT_PUBLIC_DEV_API_PATH=http://localhost:5500/
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAMiD_jySJ5GVMBrBzTLTLf7_vv50OjCLI
```

## Possible Script

### `yarn run dev`

run this command in ./csci2720 to start the frontend and backend concurrently

## Requirements

- node version >=v21.1.0
- yarn
