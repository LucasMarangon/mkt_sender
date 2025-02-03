// import {makeWASocket, DisconnectReason, useMultiFileAuthState } from '../node_modules/@whiskeysockets';
// import { Boom } from '../node_modules/@hapi/boom'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import makeWASocket from "../node_modules/@whiskeysockets/baileys/lib/index";
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function* () {
        alert("HI!");
        return;
        const { state, saveCreds } = yield useMultiFileAuthState('auth_info_baileys');
        const sock = makeWASocket({
            // can provide additional config here
            auth: state,
            printQRInTerminal: true
        });
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (!lastDisconnect)
                    return;
                // const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
                // reconnect if not logged out
                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            }
            else if (connection === 'open') {
                console.log('opened connection');
            }
        });
        sock.ev.on('messages.upsert', ({ messages }) => {
            console.log('got messages', messages);
        });
        // sock.ev.on('messages.upsert', async event => {
        //     for (const m of event.messages) {
        //         console.log(JSON.stringify(m, undefined, 2))
        //         console.log('replying to', m.key.remoteJid)
        //         await sock.sendMessage(m.key.remoteJid!, { text: 'Hello Word' })
        //         return;
        //     }
        // })
        // to storage creds (session info) when it updates
        sock.ev.on('creds.update', saveCreds);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const sendButtonMessage = document.querySelector("#send-btn-message");
    if (!sendButtonMessage)
        return;
    sendButtonMessage.onclick = connectToWhatsApp;
});
