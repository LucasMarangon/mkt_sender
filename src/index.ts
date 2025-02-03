// import {makeWASocket, DisconnectReason, useMultiFileAuthState } from '../node_modules/@whiskeysockets';
// import { Boom } from '../node_modules/@hapi/boom'

import makeWASocket from "../node_modules/@whiskeysockets/baileys/lib/index";

async function connectToWhatsApp () {

    alert("HI!");
    return;

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        // can provide additional config here
        auth: state,
        printQRInTerminal: true
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            if(!lastDisconnect) return;
            // const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection');
        }
    })

    sock.ev.on('messages.upsert', ({ messages }) => {
        console.log('got messages', messages)
    })

    // sock.ev.on('messages.upsert', async event => {
    //     for (const m of event.messages) {
    //         console.log(JSON.stringify(m, undefined, 2))

    //         console.log('replying to', m.key.remoteJid)
    //         await sock.sendMessage(m.key.remoteJid!, { text: 'Hello Word' })
    //         return;
    //     }
    // })

    // to storage creds (session info) when it updates
    sock.ev.on('creds.update', saveCreds)
}

document.addEventListener("DOMContentLoaded", () => {

    const sendButtonMessage = document.querySelector<HTMLButtonElement>("#send-btn-message");
    if(!sendButtonMessage) return;
    sendButtonMessage.onclick = connectToWhatsApp;

})