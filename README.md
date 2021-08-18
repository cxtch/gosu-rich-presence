<h1 align="center">gosu-rich-presence</h1>
<p align="center">A more detailed Discord Rich Presence for "osu!" with the help of gosumemory!</p>

![Preview A](https://thigh.photography/raw/riAXjNnbKD.png)  ![Preview B](https://download-ram.online/raw/sSU68CPuvH.png)

## Dependencies

| Name                                                                      |
| ------------------------------------------------------------------------- |
| [Discord RPC](https://github.com/discord/discord-rpc )                    |
| [gosumemory](https://github.com/l3lackShark/gosumemory)                   |
| [Clipboardy](https://github.com/sindresorhus/clipboardy)                  |


## Installation and Usage from the source

### Installation commands (copy and paste to your terminal of choice)

```
git clone https://github.com/cxtch/gosu-rich-presence.git
cd gosu-rich-presence
npm install
```

### Usage

Simply run this command

```
node .
```

## rpc-config.ini

If you don't know what boolean, string and integer understand:

`boolean`: true or false

`string`: user input (can be anything)

`integer`: number

| Setting                             | Description                                                           |  
| ------------------------------------| ----------------------------------------------------------------------|
| `profile: string`                   | Profile link; Profile ID; Name are all accepted                       |
| `private_server: string or boolean` | Used for private server profiles instead                              |
| `port: string`                      | The Web Server port for gosumemory                                    |
| `client_id: string`                 | The Rich Presence application ID that you can get [here](https://discord.com/developers/applications)|
| `update_rate: integer`              | Update rate for Rich Presence *recommended value is 3000(ms)-5000(ms)*|
| `ingameText: string`                | Large image text when you are playing a beatmap                       |
| `inEditorText: string`              | Large image text when you are editing a beatmap                       |
| `smallImageKey: boolean`            | Whether to display your letter grade during gameplay                  |
| `customButtonText: boolean`         | Whether to display the inGame/EditorText over the buttons             |
