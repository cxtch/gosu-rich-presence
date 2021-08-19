<h1 align="center">gosu-rich-presence</h1>
<p align="center">A more detailed Discord Rich Presence for "osu!" with the help of gosumemory!</p>

![Preview A](https://thigh.photography/raw/riAXjNnbKD.png)  ![Preview B](https://download-ram.online/raw/sSU68CPuvH.png)

## Dependencies

| Name                                                                      |
| ------------------------------------------------------------------------- |
| [Discord RPC](https://github.com/discord/discord-rpc )                    |
| [gosumemory](https://github.com/l3lackShark/gosumemory)                   |
| [Clipboardy](https://github.com/sindresorhus/clipboardy)                  |


## How to use

The simplest way to use it, is to download the executable and config from [releases](https://github.com/cxtch/gosu-rich-presence/releases).

The thing it isn't always updated so the best way to keep up to date is to use the method below. 

^ For example, the executable doesn't have clipboardy.
We use clipboardy for the `np` command. If you write this in the console it will copy the current beatmap to the clipboard.
This does not work on the executable.

## Installation and Usage from the source

*This guide is assuming you have [git](https://git-scm.com/) installed.*

### Installation commands (copy and paste to your terminal of choice)

```
git clone https://github.com/cxtch/gosu-rich-presence.git
cd gosu-rich-presence
npm install
```

#### Troubleshooting the install

If you have problems with the `npm install`.

The easiest solution we've found for it is to delete `package-lock.json` and the `node_modules` folder.

### Usage

Simply run this command in the gosu-rich-presence folder

```
node .
```

### Updating

Git Bash in to the gosu-rich-presence folder

```
git pull
```

If the command doens't work simply type `git pull https://github.com/cxtch/gosu-rich-presence`

## Configuration 

### Editing the configuration

There are 2 ways to edit the configuration.

* Live editing / In console editing
* .ini file editing

#### Live editing / In console editing

This allows the edit the configuration file through the console of gosu-rich-presence

```
config set <variable> <value>
```
There's a variable table if you scroll down.

It's extremely simple to use. Example: `config set profile megahello`

#### .ini file editing

Open up `rpc-config.ini` in any text editor and edit the values.

### Variables

| Variable                            | Description                                                           |  
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

#### Word explanations

If you don't know what boolean, string and integer mean:

`boolean`: true or false (could also be 1 or 0)

`string`: user input (can be anything)

`integer`: number
