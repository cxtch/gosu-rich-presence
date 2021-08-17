# gosu-rich-presence

Let your friends know exactly what you're up to.

### config

`profile: string` your osu! profile

`private_server: string | boolean` the link to your profile on a private server. Ripple would be `ripple.moe/u`

`port: number` the port in config.ini

`client_id: string` your client id from discord.com/developers

`client_secret: string` your client secret from discord.com/developers

`update_rate: number` the number of milliseconds between rich presence updates

`inGameText: string` large image text when you are playing a beatmap

`inEditorText: string` large image text when you are editing a beatmap

`smallImageKey: boolean` whether to display your letter grade during gameplay

`customButtonText: boolean` whether to display the inGame/EditorText over the buttons

## This project depends on

`discord-rpc`

`clipboardy`

[gosumemory](https://github.com/l3lackShark/gosumemory)

## install

`git clone https://github.com/cxtch/gosu-rich-presence.git`

`cd gosu-rich-presence`

`npm install`
