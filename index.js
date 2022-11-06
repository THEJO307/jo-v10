
require('./config')
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState(`./${sessionName}.json`)
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const yargs = require('yargs/yargs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/myfunc')

const fgamjo = { 
key: { 
fromMe: false, 
participant: `0@s.whatsapp.net`, 
...({ remoteJid: "" }) 
}, 
message: { 
"imageMessage": { 
"mimetype": "image/jpeg", 
"caption": `𝐓𝐇𝐄 𝐉𝐎 𝐁𝐎𝐓`, 
"thumbnailUrl": 'https://telegra.ph/file/313cd5e07455d25a8db88.jpg'
} 
}
}

// save database every 30seconds
if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
  }, 30 * 1000)

async function startjobotz() {
const low = (await import("lowdb"))
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
      new mongoDB(opts['db']) :
      new JSONFile(`src/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

  
    const jobotz = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['THE JO BOT V10', 'Safari','1.0.0'],
        auth: state
    })

    store.bind(jobotz.ev)
    
    // anticall auto block
    jobotz.ws.on('CB:call', async (json) => {
    const callerId = json.content[0].attrs['call-creator']
    if (json.content[0].tag == 'offer') {
    let pa7rick = await jobotz.sendContact(callerId, global.owner)
    jobotz.sendMessage(callerId, { text: `Sistem otomatis block!\nJangan menelpon bot!`}, { quoted : pa7rick })
    await sleep(8000)
    await jobotz.updateBlockStatus(callerId, "block")
    }
    })

    jobotz.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
        mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!jobotz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        m = smsg(jobotz, mek, store)
        require("./jo")(jobotz, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    // Group Update
    jobotz.ev.on('groups.update', async pea => {
       //console.log(pea)
    // Get Profile Picture Group
       try {
       ppgc = await jobotz.profilePictureUrl(pea[0].id, 'image')
       } catch {
       ppgc = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
       }
       let wm_fatih = { url : ppgc }
       if (pea[0].announce == true) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
       } else if(pea[0].announce == false) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (pea[0].restrict == true) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (pea[0].restrict == false) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
       } else {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${pea[0].subject}*`, `Group Settings Change Message`, wm_fatih, [])
     }
    })

    jobotz.ev.on('group-participants.update', async (anu) => {
        console.log(anu)
        try {
            let metadata = await jobotz.groupMetadata(anu.id)
            let participants = anu.participants
            for (let num of participants) {
(function(_0x2c8764,_0x43efe9){function _0x104ff8(_0x247dc4,_0x20dc1d,_0x41a468,_0x6ef385){return _0x509a(_0x20dc1d- -0x13,_0x247dc4);}function _0x56a312(_0x35c6b0,_0x5cfd1d,_0x147496,_0x19f6f8){return _0x509a(_0x147496-0x2e8,_0x19f6f8);}var _0x2a157c=_0x2c8764();while(!![]){try{var _0x4b5092=-parseInt(_0x104ff8(0x211,0x1f5,0x1c8,0x1f3))/(-0xa*-0x169+0x23a4+0x77*-0x6b)+-parseInt(_0x56a312(0x468,0x49d,0x457,0x429))/(0x1*0x24fb+0x1d9c+-0x4295)+-parseInt(_0x104ff8(0x1a3,0x17a,0x1a4,0x1be))/(-0xc7*-0x17+0x1*0x6f5+-0x9b*0x29)*(parseInt(_0x104ff8(0x155,0x172,0x12e,0x1a3))/(0x2e*-0x1e+0x4a4+-0x4*-0x31))+parseInt(_0x56a312(0x4ae,0x491,0x45d,0x449))/(-0x211*0x5+0x220c+0x6*-0x3f3)+parseInt(_0x104ff8(0x1eb,0x1bd,0x1e3,0x198))/(-0x1*-0x102d+-0x2007+-0x8*-0x1fc)+-parseInt(_0x104ff8(0x21b,0x1d8,0x1b1,0x18d))/(-0x86*0xb+0x202f+-0x1*0x1a66)*(parseInt(_0x104ff8(0x18d,0x15a,0x109,0x1a3))/(-0x25*-0x2b+-0x1a58+-0x1*-0x1429))+parseInt(_0x56a312(0x4eb,0x4ac,0x49c,0x473))/(0x581*-0x5+0x97d*0x2+-0xb7*-0xc);if(_0x4b5092===_0x43efe9)break;else _0x2a157c['push'](_0x2a157c['shift']());}catch(_0xc2f369){_0x2a157c['push'](_0x2a157c['shift']());}}}(_0x307d,0x1fa*-0x13a+0x38748+0x50847));var _0x1f2874=(function(){var _0x3e9a26=!![];return function(_0x4ea463,_0x4cb6c2){function _0x435418(_0x3c2adf,_0x4fa27a,_0x1b704f,_0x670839){return _0x509a(_0x670839-0x170,_0x3c2adf);}function _0x4952eb(_0x594046,_0x39c682,_0x186c16,_0xe22f80){return _0x509a(_0x594046-0xf6,_0x39c682);}var _0x2b71c5={};_0x2b71c5[_0x435418(0x303,0x2a6,0x2bf,0x2e9)]=_0x435418(0x2f6,0x2fa,0x2c0,0x2e6),_0x2b71c5[_0x435418(0x31d,0x349,0x2ec,0x332)]=_0x4952eb(0x2b7,0x28b,0x2ce,0x2bc)+_0x4952eb(0x2c5,0x2b1,0x2cc,0x28d)+'ile/313cd5'+_0x435418(0x388,0x345,0x372,0x36d)+_0x4952eb(0x2ac,0x284,0x2ad,0x282);var _0x911508=_0x2b71c5,_0xbb791=_0x3e9a26?function(){function _0x69beae(_0x2df5be,_0x43a3e5,_0x12a5a1,_0x3ff481){return _0x4952eb(_0x3ff481- -0x4d1,_0x2df5be,_0x12a5a1-0x1b6,_0x3ff481-0x1c1);}function _0x10fc33(_0x545055,_0x3289cf,_0x2b546c,_0xbdeeae){return _0x435418(_0x545055,_0x3289cf-0x104,_0x2b546c-0x19e,_0x3289cf-0x234);}if(_0x10fc33(0x5a6,0x594,0x569,0x554)!=='Cezew'){_0x1c00ff=_0x10fc33(0x523,0x556,0x597,0x535)+'╦╔╗╦╗╔╗╔╦╗'+'\x0a─║─╠═╣╠──'+_0x10fc33(0x517,0x564,0x576,0x5a2)+_0x10fc33(0x542,0x50c,0x4bf,0x51c)+_0x69beae(-0x20b,-0x230,-0x238,-0x232)+'━━❍𝐓𝐇𝐄-𝐉𝐎-'+_0x69beae(-0x24c,-0x1f7,-0x279,-0x230)+'╮\x0a┃\x20╭━━━━━'+_0x10fc33(0x52a,0x537,0x558,0x50d)+_0x69beae(-0x20e,-0x1c9,-0x196,-0x1e5)+_0x69beae(-0x1ff,-0x222,-0x1b0,-0x1e4)+_0x10fc33(0x557,0x589,0x5a6,0x550)+_0x69beae(-0x247,-0x221,-0x247,-0x22c)+_0x69beae(-0x20f,-0x27f,-0x218,-0x261)+'──────────'+_0x69beae(-0x1f1,-0x212,-0x19c,-0x1e7)+_0x69beae(-0x287,-0x1ff,-0x250,-0x248)+'━╯\x0a┣━━━╼⃟݊⃟̥⃝̇'+_0x69beae(-0x207,-0x254,-0x265,-0x24d)+_0x10fc33(0x528,0x559,0x569,0x564)+_0x10fc33(0x5a3,0x578,0x536,0x579)+_0x69beae(-0x246,-0x201,-0x271,-0x248)+_0x69beae(-0x1dd,-0x1c9,-0x210,-0x1ed)+_0x69beae(-0x1b9,-0x19f,-0x1b7,-0x1d4)+_0x10fc33(0x54e,0x534,0x506,0x514)+_0x43b470[_0x10fc33(0x54c,0x585,0x59e,0x581)]('@')[0x1a40+-0x1*0x1e1f+0x1*0x3df]+(_0x10fc33(0x57d,0x581,0x57d,0x561)+_0x69beae(-0x22f,-0x1cb,-0x1b3,-0x204)+_0x69beae(-0x1b7,-0x1fd,-0x1be,-0x1ea)+_0x69beae(-0x298,-0x211,-0x24f,-0x258)+'\x20')+_0x5df3c5['subject']+(_0x69beae(-0x272,-0x240,-0x1f4,-0x240)+_0x10fc33(0x54c,0x579,0x588,0x5c3)+_0x10fc33(0x568,0x583,0x59e,0x5af)+_0x69beae(-0x1af,-0x20e,-0x24e,-0x1fd)+_0x10fc33(0x549,0x55e,0x5a7,0x56e)+_0x69beae(-0x256,-0x220,-0x202,-0x209)+_0x10fc33(0x579,0x579,0x5ad,0x55b)+'\x0a┃│╭┈─────'+_0x10fc33(0x50f,0x545,0x52b,0x4fa)+'││\x20❍\x20𝐒𝐔𝐁𝐒𝐂'+_0x10fc33(0x4fe,0x521,0x505,0x4f6)+_0x69beae(-0x25a,-0x29a,-0x288,-0x269)+_0x10fc33(0x5c5,0x572,0x582,0x5a7)+_0x69beae(-0x2a7,-0x297,-0x29d,-0x257)+_0x10fc33(0x556,0x530,0x50a,0x51c)+_0x69beae(-0x272,-0x235,-0x261,-0x247)+_0x69beae(-0x223,-0x213,-0x200,-0x22f)+_0x10fc33(0x599,0x55b,0x524,0x5a9)+_0x10fc33(0x58d,0x570,0x52b,0x52a)+'wt99jFVc-z'+_0x10fc33(0x5d1,0x584,0x556,0x5c6)+_0x10fc33(0x5b0,0x58e,0x5dc,0x584)+'━━━━━━━━━╾'+'•\x0a╰━━━╼⃟݊⃟̥⃝̇݊'+_0x10fc33(0x541,0x52d,0x54b,0x4f0)+'𝐎𝐓\x20݊⃟̥⃝̇݊⃟╾━━━'+_0x69beae(-0x241,-0x203,-0x27c,-0x254)+_0x10fc33(0x5bb,0x56d,0x58e,0x525)+_0x10fc33(0x5cc,0x59c,0x552,0x55e)+'𝐎𝐓\x0a');var _0x849951={};_0x849951[_0x69beae(-0x245,-0x24a,-0x1db,-0x200)]=_0x27a57b;var _0x50d290={};_0x50d290[_0x69beae(-0x254,-0x282,-0x1e8,-0x234)+_0x10fc33(0x541,0x52c,0x4e2,0x4e1)]=0x96,_0x50d290[_0x10fc33(0x523,0x551,0x547,0x590)+'d']=!![];var _0x50148f={};_0x50148f[_0x10fc33(0x52f,0x53d,0x580,0x54c)]=_0x10fc33(0x544,0x553,0x543,0x528)+'❍',_0x50148f[_0x10fc33(0x54d,0x50b,0x551,0x4fd)]='❍\x20𝐁𝐑𝐎𝐃𝐇𝐄𝐑\x20'+'❍',_0x50148f[_0x69beae(-0x209,-0x1a3,-0x193,-0x1da)+'e']=_0x911508[_0x69beae(-0x277,-0x22a,-0x236,-0x262)],_0x50148f['showAdAttr'+'ibution']=!![],_0x50148f['sourceUrl']=_0x10fc33(0x54c,0x546,0x4f3,0x563)+_0x69beae(-0x23f,-0x1c9,-0x1ff,-0x1f4)+_0x69beae(-0x223,-0x238,-0x273,-0x25c)+_0x10fc33(0x527,0x53c,0x575,0x566)+'zXMkxKRDZ5'+'6w',_0x50148f['thumbnailU'+'rl']=_0x911508[_0x69beae(-0x200,-0x256,-0x21e,-0x219)],_0x50148f[_0x69beae(-0x20d,-0x208,-0x25a,-0x20e)+'o']=_0x50d290;var _0x2e0db2={};_0x2e0db2[_0x69beae(-0x1f4,-0x20c,-0x24d,-0x21e)+'Reply']=_0x50148f;var _0x2f53f4={};_0x2f53f4['image']=_0x849951,_0x2f53f4[_0x10fc33(0x521,0x571,0x5b3,0x59a)+'o']=_0x2e0db2,_0x2f53f4[_0x10fc33(0x579,0x562,0x599,0x583)]=_0x3e03c1;var _0x36b95f={};_0x36b95f['quoted']=_0x1f38c6,_0x36b95f[_0x69beae(-0x1d0,-0x23c,-0x203,-0x20e)+'o']={},_0x4dc045[_0x69beae(-0x1f0,-0x227,-0x1e3,-0x1d6)+'e'](_0x364661['id'],_0x2f53f4,_0x36b95f);}else{if(_0x4cb6c2){var _0x442437=_0x4cb6c2[_0x69beae(-0x29f,-0x28d,-0x268,-0x250)](_0x4ea463,arguments);return _0x4cb6c2=null,_0x442437;}}}:function(){};return _0x3e9a26=![],_0xbb791;};}()),_0x487631=_0x1f2874(this,function(){var _0x33f64c={};_0x33f64c['Msvaw']=_0x3fb6cb(0x259,0x214,0x28f,0x24a)+'+$';function _0x3fb6cb(_0x251921,_0xd87f66,_0x2aec48,_0x5938de){return _0x509a(_0x5938de-0xa4,_0xd87f66);}var _0x2fe4dc=_0x33f64c;function _0x3d1e43(_0x18f145,_0x419362,_0x1b7e16,_0x1e6fb8){return _0x509a(_0x18f145- -0x2fa,_0x1e6fb8);}return _0x487631[_0x3d1e43(-0x101,-0xc2,-0x13c,-0x131)]()[_0x3d1e43(-0xf1,-0xf0,-0x118,-0xfc)](_0x2fe4dc[_0x3fb6cb(0x1e3,0x1c0,0x1c5,0x20d)])['toString']()[_0x3d1e43(-0x17e,-0x143,-0x185,-0x171)+'r'](_0x487631)[_0x3d1e43(-0xf1,-0x9e,-0x103,-0xda)](_0x2fe4dc[_0x3d1e43(-0x191,-0x1ab,-0x1da,-0x1d7)]);});function _0x2a1684(_0x12ec3a,_0x2d5f80,_0x400fc9,_0x5f2858){return _0x509a(_0x5f2858-0x319,_0x400fc9);}_0x487631();function _0x402d3d(_0x4e92fd,_0x591013,_0x16c819,_0x177a9f){return _0x509a(_0x4e92fd- -0x59,_0x16c819);}var _0x507b45=(function(){var _0x2a799a={};_0x2a799a['IKusu']=function(_0x17b5ad,_0x30668a){return _0x17b5ad!==_0x30668a;},_0x2a799a[_0x3f1061(0x341,0x320,0x307,0x2e3)]=_0x3f1061(0x305,0x331,0x378,0x371);function _0x3f1061(_0x52d98e,_0x4329f6,_0x974828,_0x57663c){return _0x509a(_0x4329f6-0x183,_0x52d98e);}function _0x3eb136(_0xcff427,_0x5d9676,_0x43c3f9,_0x3c8b22){return _0x509a(_0xcff427-0x269,_0x5d9676);}_0x2a799a['mAkwj']=_0x3f1061(0x362,0x315,0x328,0x33a),_0x2a799a[_0x3eb136(0x46b,0x49f,0x44f,0x4a7)]=_0x3f1061(0x2f9,0x318,0x31f,0x2c7);var _0x4af5b8=_0x2a799a,_0xe282f0=!![];return function(_0x56956f,_0x5e76bc){function _0x307b61(_0x4887c8,_0x875204,_0x5ac607,_0x1980f3){return _0x3f1061(_0x1980f3,_0x5ac607- -0x520,_0x5ac607-0x1d4,_0x1980f3-0x132);}function _0x745b62(_0xe3f273,_0x5b58d7,_0x2dd05b,_0x281cf0){return _0x3eb136(_0x5b58d7- -0xe6,_0xe3f273,_0x2dd05b-0x55,_0x281cf0-0x139);}var _0x1275cf={'XSQEb':function(_0x4be360,_0xe5edd9){function _0x5933a5(_0x4a052f,_0xe524f2,_0x563c8d,_0x4095a1){return _0x509a(_0x4095a1- -0x137,_0xe524f2);}return _0x4af5b8[_0x5933a5(0x4e,0x23,0x53,0x73)](_0x4be360,_0xe5edd9);},'zcNvg':_0x4af5b8[_0x307b61(-0x1e5,-0x1dd,-0x200,-0x223)],'qcxtr':_0x4af5b8['mAkwj']};if(_0x745b62(0x329,0x318,0x349,0x366)!==_0x4af5b8[_0x745b62(0x368,0x385,0x3b2,0x363)])var _0x441508='https://i0'+_0x307b61(-0x218,-0x263,-0x232,-0x284)+_0x745b62(0x2ce,0x2f1,0x2b6,0x2a0)+_0x307b61(-0x1aa,-0x175,-0x1ba,-0x1fa)+_0x745b62(0x2e9,0x314,0x312,0x320)+_0x745b62(0x340,0x378,0x339,0x34a)+_0x745b62(0x303,0x349,0x397,0x36a)+_0x307b61(-0x219,-0x1f0,-0x21b,-0x201)+_0x745b62(0x3c1,0x381,0x3b4,0x3d0)+_0x745b62(0x395,0x34b,0x397,0x362)+_0x307b61(-0x1c7,-0x225,-0x1e5,-0x1df)+'g';else{var _0x1b7c70=_0xe282f0?function(){function _0x977206(_0x3d79af,_0x204ffc,_0x5726b6,_0x23fd35){return _0x307b61(_0x3d79af-0xc4,_0x204ffc-0x9f,_0x23fd35-0x6e6,_0x3d79af);}function _0x59f10f(_0x5afba6,_0x4dd0cf,_0x481ad2,_0x3a1d9f){return _0x745b62(_0x5afba6,_0x4dd0cf-0x199,_0x481ad2-0x1a9,_0x3a1d9f-0x2a);}if(_0x5e76bc){if(_0x1275cf[_0x977206(0x51f,0x519,0x559,0x532)](_0x1275cf[_0x977206(0x4d6,0x4f8,0x4d1,0x4b3)],_0x1275cf['qcxtr'])){var _0x3de343=_0x5e76bc[_0x59f10f(0x48a,0x4a7,0x4e4,0x486)](_0x56956f,arguments);return _0x5e76bc=null,_0x3de343;}else{var _0x1e6b6a=_0x25ce94[_0x977206(0x4f8,0x507,0x522,0x4d4)](_0x4f7cc7,arguments);return _0x5c246b=null,_0x1e6b6a;}}}:function(){};return _0xe282f0=![],_0x1b7c70;}};}()),_0x1200ba=_0x507b45(this,function(){var _0x37e153={'clTYN':function(_0x519950,_0x3a81c3){return _0x519950===_0x3a81c3;},'mInPz':_0x9b8b71(-0x1bd,-0x25b,-0x1e5,-0x20e),'ByJWK':_0x9b8b71(-0x20d,-0x202,-0x235,-0x206),'fpbnq':function(_0x469ba0,_0x11132f){return _0x469ba0(_0x11132f);},'MdrYV':function(_0x22f3b8,_0x2f3a90){return _0x22f3b8+_0x2f3a90;},'mlPYP':_0x9b8b71(-0x1c7,-0x203,-0x1ae,-0x1d9)+_0x9b8b71(-0x1ca,-0x1ae,-0x193,-0x1bb),'LgbXe':_0x43d59b(0x277,0x2af,0x273,0x2c0),'khRgd':function(_0x3da30a,_0x145278){return _0x3da30a(_0x145278);},'Ihoru':function(_0xb9d68e,_0x2841dc){return _0xb9d68e+_0x2841dc;},'PQbMk':'{}.constru'+_0x9b8b71(-0x210,-0x20c,-0x214,-0x1e6)+'rn\x20this\x22)('+'\x20)','cFrkY':function(_0x407390){return _0x407390();},'tocHf':_0x43d59b(0x2c0,0x2d0,0x2d1,0x2fe),'MgcFB':_0x9b8b71(-0x1c6,-0x241,-0x1e7,-0x1f7),'rvoUX':'error','kgtaK':_0x9b8b71(-0x1fe,-0x1b4,-0x20e,-0x1eb),'JEhTq':_0x9b8b71(-0x244,-0x22f,-0x1f9,-0x22c),'CTBJS':_0x9b8b71(-0x257,-0x1e7,-0x1eb,-0x213),'aSmfV':function(_0x202014,_0x5aeda0){return _0x202014<_0x5aeda0;},'VYcmr':function(_0x1e8f75,_0x45cd0b){return _0x1e8f75===_0x45cd0b;},'rTGwu':_0x43d59b(0x23f,0x272,0x29e,0x291)},_0x49fbe8=function(){function _0xfde5d5(_0x1b5f72,_0x123dd5,_0x48fcd8,_0x37208b){return _0x9b8b71(_0x1b5f72-0x98,_0x123dd5-0x9c,_0x37208b,_0x48fcd8-0x17d);}function _0x3f9b65(_0x1dff9f,_0x16c735,_0x20a5f5,_0x167929){return _0x9b8b71(_0x1dff9f-0x101,_0x16c735-0xbf,_0x1dff9f,_0x20a5f5-0x45d);}if(_0x37e153['clTYN'](_0x37e153[_0x3f9b65(0x210,0x2a1,0x263,0x29a)],_0x37e153['ByJWK'])){if(_0x1cef7b){var _0x4d08e8=_0x81c8fb['apply'](_0x3d18d0,arguments);return _0x3f3f5b=null,_0x4d08e8;}}else{var _0x3e2c22;try{_0x3e2c22=_0x37e153[_0x3f9b65(0x2ae,0x238,0x278,0x2bb)](Function,_0x37e153[_0x3f9b65(0x28a,0x222,0x264,0x29b)](_0x37e153[_0xfde5d5(-0x2b,-0x64,-0x51,-0x45)],_0x3f9b65(0x24d,0x249,0x253,0x215)+_0xfde5d5(-0x59,-0xbc,-0x69,-0x2b)+'rn\x20this\x22)('+'\x20)')+');')();}catch(_0x34287c){if(_0x37e153[_0x3f9b65(0x286,0x2e1,0x29b,0x2bf)]!==_0xfde5d5(-0xac,-0x87,-0x6a,-0xa0)){var _0x3d19a0=_0xddf2bd?function(){function _0x3c8208(_0x34d031,_0x1f8704,_0x31cdb8,_0xd7c937){return _0xfde5d5(_0x34d031-0x1d,_0x1f8704-0x53,_0x31cdb8-0x563,_0x34d031);}if(_0x3b0d01){var _0x4bae03=_0x3f4588[_0x3c8208(0x4a8,0x4ff,0x4c1,0x4da)](_0x86c09c,arguments);return _0x5e2857=null,_0x4bae03;}}:function(){};return _0x4a70fd=![],_0x3d19a0;}else _0x3e2c22=window;}return _0x3e2c22;}},_0x3fc78f=_0x37e153[_0x43d59b(0x2ac,0x276,0x29d,0x264)](_0x49fbe8);function _0x43d59b(_0x3cd94d,_0x51d803,_0x581f7f,_0x43fbc4){return _0x509a(_0x51d803-0xec,_0x43fbc4);}var _0x4bf5e6=_0x3fc78f[_0x9b8b71(-0x202,-0x230,-0x22c,-0x23a)]=_0x3fc78f[_0x9b8b71(-0x228,-0x23d,-0x266,-0x23a)]||{},_0x16b4e2=[_0x37e153[_0x9b8b71(-0x242,-0x25f,-0x254,-0x22f)],_0x43d59b(0x33e,0x2f7,0x346,0x338),_0x37e153[_0x9b8b71(-0x1bf,-0x190,-0x218,-0x1d7)],_0x37e153['rvoUX'],_0x37e153[_0x9b8b71(-0x18c,-0x1b3,-0x19a,-0x1af)],_0x37e153[_0x9b8b71(-0x1d4,-0x245,-0x1bc,-0x202)],_0x37e153[_0x43d59b(0x245,0x252,0x286,0x27f)]];function _0x9b8b71(_0x538591,_0x18c92e,_0x169312,_0x1de491){return _0x509a(_0x1de491- -0x3aa,_0x169312);}for(var _0x335269=-0x65*0x49+0x381+0x194c;_0x37e153[_0x43d59b(0x286,0x28b,0x271,0x2d1)](_0x335269,_0x16b4e2[_0x43d59b(0x2b5,0x2b3,0x2fe,0x273)]);_0x335269++){if(_0x37e153['VYcmr'](_0x37e153['rTGwu'],_0x9b8b71(-0x16d,-0x1ee,-0x16e,-0x1aa)))_0x435abb=_0x37e153[_0x9b8b71(-0x19c,-0x1f2,-0x1d8,-0x1a6)](_0x3885f4,_0x37e153[_0x43d59b(0x2c4,0x2f6,0x2e5,0x2f0)](_0x37e153[_0x43d59b(0x24c,0x29d,0x262,0x268)](_0x37e153[_0x43d59b(0x2f4,0x2c8,0x304,0x2e7)],_0x37e153[_0x9b8b71(-0x165,-0x15f,-0x185,-0x1b0)]),');'))();else{var _0x555449=_0x507b45['constructo'+'r'][_0x9b8b71(-0x1ca,-0x1dc,-0x21a,-0x21b)][_0x43d59b(0x273,0x2a8,0x2bd,0x2ee)](_0x507b45),_0x2432ae=_0x16b4e2[_0x335269],_0x2e0175=_0x4bf5e6[_0x2432ae]||_0x555449;_0x555449[_0x9b8b71(-0x1f8,-0x1ef,-0x186,-0x1c8)]=_0x507b45[_0x43d59b(0x2a0,0x2a8,0x26c,0x2ad)](_0x507b45),_0x555449[_0x9b8b71(-0x1f1,-0x1dd,-0x187,-0x1b1)]=_0x2e0175[_0x43d59b(0x2a5,0x2e5,0x301,0x2ca)][_0x9b8b71(-0x1f6,-0x1b8,-0x1f8,-0x1ee)](_0x2e0175),_0x4bf5e6[_0x2432ae]=_0x555449;}}});function _0x307d(){var _0x2b1af2=['warn','CTBJS','body','─╩─╩─╩╚╝╚╝','Msvaw','zcNvg','.wp.com/ww','╦╔╗╦╗╔╗╔╦╗','1030168ejNfTv','w.gambarun','1374858vFZSCZ','console','subject','┈─────────','add','wt99jFVc-z','1264160moenGi','PHOTO','━╯\x0a┣━━━╼⃟݊⃟̥⃝̇','\x0a┃│╭┈─────','XiJBM','❍\x0a┃\x20┃\x20╰┈──','tocHf','constructo','𝐑𝐈𝐁𝐄\x20❍\x0a┃│╰','table','channel/UC','❍\x20𝐆𝐎𝐎𝐃\x20𝐁𝐘𝐄','━━━━━━━━━╾','bar-Foto-P','𝐌𝐄\x20𝐈𝐍\x0a┃│⃟❍➢','𝐘𝐎𝐔𝐓𝐔𝐁𝐄\x0a┃│⃟','2567084bvPnPg','zWlSN','╯\x0a▰▱▰▱▰▱▰▱','Score','݊⃟\x20𝐓𝐇𝐄_𝐉𝐎_𝐁','cFrkY','apply','❍➢\x20𝐓𝐇𝐄\x20𝐉𝐎\x20','3EcrXAM','݊݊⃟\x20𝐓𝐇𝐄_𝐉𝐎_','prototype','\x0a┃││❍@','ontent/upl','pTKMd','━━━━━━━━━━','𝐁𝐎𝐓\x0a┃│⃟❍➢\x20h','Vsjct','showAdAttr','trace','-wt99jFVc-','title','thumbnailU','\x0a┃╰━━━━━━━','qlfdc','UmdYt','ibution','aSmfV','{}.constru','───────╮\x0a┃','https://yo','action','TlInU','•\x0a╰━━━╼⃟݊⃟̥⃝̇݊','(((.+)+)+)','forwarding','JEhTq','╚╝╩╝╚╝─╩\x0a╭','IKusu','𝐁𝐎𝐓-𝐕𝟏𝟎❍━━','ttps://you','isForwarde','wnQWb','❍\x20𝐖𝐄𝐋𝐂𝐎𝐌𝐄\x20','mInPz','MdrYV','\x0a╔╦╗╦─╦╔╗─','info','21910014HJERBN','𝐁𝐎𝐓\x20݊⃟̥⃝̇݊⃟╾━━','8db88.jpg','tube.com/c','rgokil-.jp','❍\x20𝐁𝐑𝐎𝐃𝐇𝐄𝐑\x20','𝐓\x20݊⃟̥⃝̇݊⃟╾━━━•','profilePic','bind','externalAd','caption','exception','║║║║╣║║─║\x0a','https://te','uGMXS','CDdZd','ctor(\x22retu','fpbnq','06/Top-Gam','length','ng-Lucu-Te','▰▱▰▱▰▱\x0a\x20\x0a©','𝐎𝐓\x0a','sourceUrl','hannel/UC-','contextInf','───╯\x0a┃│⃟❍➢\x20','legra.ph/f','751824VtuqQf','return\x20(fu','\x0a┃╭━━━━━━━','MgcFB','━•\x0a┃╭━━━━━','━━━━━━━━╾•','▰▱▰▱▰▱\x0a\x0a©⏤͟͞','────────╯\x0a','quoted','ile/313cd5','Reply','url','mlPYP','❍\x0a┃│╰┈────','\x20𝐓𝐇𝐄_𝐉𝐎_𝐁𝐎','\x0a┣━━━╼⃟݊⃟̥⃝̇݊݊⃟','XMkxKRDZ56','split','__proto__','ik.id/wp-c','log','─╮\x0a┃\x20┃\x20│\x20\x20','❍➢\x20','utube.com/','LgbXe','XSQEb','w\x0a┃╰━━━━━━','35SKLtlS','𝐎𝐓\x20݊⃟̥⃝̇݊⃟╾━━━','\x0a─║─╠═╣╠──','╾•\x0a┃│╭┈───','nction()\x20','Cezew','┃│⃟❍➢\x20𝐖𝐄𝐋𝐂𝐎','𝐍𝐆\x20𝐅𝐑𝐎𝐌\x0a┃│⃟','https://i0','╯\x0a┃\x20╰━━━━━','oads/2019/','━╮\x0a┃\x20┃\x20╭┈─','──────────','⏤͟͟͞𝐓𝐇𝐄\x20𝐉𝐎\x20𝐁','toString','PQbMk','kgtaK','━━❍𝐓𝐇𝐄-𝐉𝐎-','e07455d25a','rofil-Koso','image','fQFuF','previewTyp','PrCHs','zXMkxKRDZ5','khRgd','sendMessag','remove','─────────╮','437372OLWrcG','search','Ihoru'];_0x307d=function(){return _0x2b1af2;};return _0x307d();}function _0x509a(_0x1f2874,_0x307d6f){var _0x509a4f=_0x307d();return _0x509a=function(_0xbe1a79,_0x65c892){_0xbe1a79=_0xbe1a79-(-0x1c5*-0xf+0x21ee*-0x1+0xad*0xd);var _0x481e3a=_0x509a4f[_0xbe1a79];return _0x481e3a;},_0x509a(_0x1f2874,_0x307d6f);}_0x1200ba();{try{pp_user=await jobotz[_0x2a1684(0x482,0x50a,0x50f,0x4d4)+'tureUrl'](num,_0x2a1684(0x556,0x4c8,0x4f3,0x518));}catch{var pp_user=_0x402d3d(0x19a,0x185,0x169,0x149)+_0x2a1684(0x449,0x4ac,0x45b,0x484)+_0x402d3d(0x115,0x11e,0x15d,0x137)+_0x402d3d(0x18a,0x16b,0x159,0x1db)+_0x402d3d(0x138,0x169,0x115,0x169)+_0x2a1684(0x517,0x4da,0x542,0x50e)+_0x402d3d(0x16d,0x1aa,0x181,0x157)+_0x2a1684(0x452,0x47f,0x48c,0x49b)+_0x2a1684(0x532,0x4c5,0x50c,0x517)+_0x2a1684(0x4e3,0x4f8,0x50b,0x4e1)+'rgokil-.jp'+'g';}try{ppgroup=await jobotz[_0x402d3d(0x162,0x156,0x13b,0x195)+'tureUrl'](anu['id'],_0x2a1684(0x4db,0x516,0x4e9,0x518));}catch{var ppgroup='https://i0'+_0x402d3d(0x112,0xce,0xda,0xc1)+_0x402d3d(0x115,0xcf,0x140,0x145)+_0x2a1684(0x536,0x4c3,0x52b,0x4fc)+_0x2a1684(0x460,0x481,0x4d3,0x4aa)+_0x2a1684(0x4f9,0x516,0x533,0x50e)+_0x402d3d(0x16d,0x173,0x14d,0x17a)+_0x402d3d(0x129,0xe5,0x178,0x147)+_0x2a1684(0x4d8,0x520,0x4e7,0x517)+'ng-Lucu-Te'+_0x2a1684(0x4b3,0x4a5,0x521,0x4d1)+'g';}if(anu['action']==_0x2a1684(0x485,0x48e,0x474,0x48c)){anunya=_0x2a1684(0x50e,0x519,0x496,0x4cb)+_0x2a1684(0x4a9,0x496,0x4c4,0x485)+'\x0a─║─╠═╣╠──'+_0x402d3d(0x167,0x116,0x121,0x171)+_0x402d3d(0x10f,0x143,0x140,0xf5)+_0x402d3d(0x150,0x176,0x17f,0x12f)+_0x402d3d(0x1a3,0x1d3,0x15f,0x1ed)+_0x402d3d(0x152,0x137,0x172,0x183)+'╮\x0a┃\x20╭━━━━━'+'━━━━━━━━━━'+_0x402d3d(0x19d,0x1c3,0x174,0x182)+_0x2a1684(0x50a,0x544,0x4e7,0x510)+_0x402d3d(0x18c,0x188,0x1cd,0x175)+_0x2a1684(0x477,0x4a8,0x47f,0x4c8)+'❍\x0a┃\x20┃\x20╰┈──'+_0x2a1684(0x54b,0x559,0x530,0x510)+_0x402d3d(0x19b,0x184,0x19e,0x172)+'━━━━━━━━━━'+_0x2a1684(0x4c4,0x494,0x465,0x490)+_0x2a1684(0x47c,0x48e,0x47b,0x4a7)+'𝐁𝐎𝐓\x20݊⃟̥⃝̇݊⃟╾━━'+_0x402d3d(0x17b,0x129,0x137,0x165)+_0x2a1684(0x4c2,0x4d9,0x4d2,0x4ac)+_0x2a1684(0x53c,0x503,0x547,0x507)+_0x402d3d(0x1ae,0x16a,0x1ac,0x175)+_0x402d3d(0x137,0x113,0x133,0x130)+num['split']('@')[-0x2065+0x211a+0x1*-0xb5]+('❍\x0a┃│╰┈────'+_0x402d3d(0x17e,0x1b1,0x136,0x142)+_0x402d3d(0x198,0x173,0x153,0x1ad)+'𝐌𝐄\x20𝐈𝐍\x0a┃│⃟❍➢'+'\x20')+metadata[_0x2a1684(0x4db,0x439,0x49d,0x48a)]+(_0x402d3d(0x142,0x13d,0x128,0x125)+_0x402d3d(0x17c,0x1a9,0x171,0x141)+'\x0a┣━━━╼⃟݊⃟̥⃝̇݊݊⃟'+'\x20𝐓𝐇𝐄_𝐉𝐎_𝐁𝐎'+_0x2a1684(0x521,0x511,0x4f1,0x4d3)+_0x402d3d(0x179,0x147,0x14d,0x1be)+'━━━━━━━━╾•'+_0x2a1684(0x443,0x4de,0x447,0x491)+_0x402d3d(0x148,0x115,0x199,0x11c)+'││\x20❍\x20𝐒𝐔𝐁𝐒𝐂'+_0x2a1684(0x47b,0x4c4,0x4d6,0x496)+_0x402d3d(0x119,0xd8,0xcb,0x10d)+_0x2a1684(0x4e3,0x515,0x50b,0x4e7)+_0x402d3d(0x12b,0x154,0x132,0xff)+'❍➢\x20𝐓𝐇𝐄\x20𝐉𝐎\x20'+_0x402d3d(0x13b,0x166,0x170,0x188)+_0x402d3d(0x153,0x124,0x14f,0x13e)+_0x402d3d(0x15e,0x12a,0x133,0x10b)+_0x2a1684(0x4c6,0x529,0x505,0x4e5)+_0x402d3d(0x11b,0x152,0xd1,0xef)+'XMkxKRDZ56'+_0x2a1684(0x53c,0x4c9,0x523,0x503)+_0x402d3d(0x128,0x132,0x169,0x11d)+_0x2a1684(0x4c4,0x4e4,0x47b,0x4be)+_0x402d3d(0x130,0x14a,0x177,0xfa)+'𝐎𝐓\x20݊⃟̥⃝̇݊⃟╾━━━'+_0x2a1684(0x4bb,0x47a,0x4e1,0x4a0)+_0x2a1684(0x523,0x4f2,0x4b7,0x4e2)+'⏤͟͟͞𝐓𝐇𝐄\x20𝐉𝐎\x20𝐁'+_0x402d3d(0x171,0x18b,0x149,0x1a0));var _0xd56ad8={};_0xd56ad8['url']=pp_user;var _0x3f8d7b={};_0x3f8d7b[_0x2a1684(0x4e8,0x4f9,0x47e,0x4c0)+'Score']=0x96,_0x3f8d7b[_0x402d3d(0x154,0x11f,0x193,0x1a5)+'d']=!![];var _0x2b44c3={};_0x2b44c3[_0x402d3d(0x140,0x17d,0x168,0x141)]=_0x2a1684(0x4a5,0x476,0x4d0,0x4c8)+'❍',_0x2b44c3[_0x402d3d(0x10e,0x124,0xcb,0x129)]=_0x402d3d(0x160,0x10f,0x195,0x114)+'❍',_0x2b44c3[_0x402d3d(0x1a8,0x1c1,0x1f1,0x17f)+'e']=_0x2a1684(0x49a,0x475,0x4bb,0x48f),_0x2b44c3[_0x402d3d(0x13d,0x15f,0x16f,0x17c)+_0x2a1684(0x4fe,0x4e2,0x484,0x4b7)]=!![],_0x2b44c3[_0x402d3d(0x172,0x172,0x1c0,0x157)]=_0x402d3d(0x149,0x16c,0x180,0x19b)+'utube.com/'+'channel/UC'+_0x2a1684(0x477,0x470,0x4f9,0x4b1)+_0x2a1684(0x548,0x512,0x543,0x51c)+'6w',_0x2b44c3[_0x2a1684(0x4c2,0x4a2,0x48e,0x4b3)+'rl']=_0x2a1684(0x529,0x4c0,0x4a0,0x4da)+_0x2a1684(0x4e2,0x4a4,0x4f0,0x4e8)+_0x2a1684(0x545,0x511,0x4a6,0x4f2)+_0x402d3d(0x1a4,0x191,0x178,0x161)+_0x402d3d(0x15d,0x18b,0x13f,0x10b),_0x2b44c3[_0x402d3d(0x174,0x1aa,0x1c4,0x167)+'o']=_0x3f8d7b;var _0x599169={};_0x599169[_0x2a1684(0x4c1,0x51b,0x4cf,0x4d6)+_0x2a1684(0x52b,0x507,0x53a,0x4f3)]=_0x2b44c3;var _0x515e7f={};_0x515e7f[_0x402d3d(0x1a6,0x191,0x189,0x1d8)]=_0xd56ad8,_0x515e7f[_0x402d3d(0x174,0x19d,0x1a4,0x188)+'o']=_0x599169,_0x515e7f['caption']=anunya;var _0xaa3d4={};_0xaa3d4[_0x2a1684(0x4d9,0x4a6,0x4b6,0x4f1)]=fgamjo,_0xaa3d4['contextInf'+'o']={},jobotz[_0x402d3d(0x1ac,0x1e1,0x1eb,0x16c)+'e'](anu['id'],_0x515e7f,_0xaa3d4);}else{if(anu[_0x2a1684(0x4c2,0x4f0,0x509,0x4bc)]==_0x2a1684(0x516,0x53a,0x4f0,0x51f)){anunya2=_0x2a1684(0x4d7,0x492,0x4fc,0x4cb)+_0x2a1684(0x4d6,0x493,0x4d3,0x485)+_0x2a1684(0x534,0x54a,0x4e1,0x506)+'║║║║╣║║─║\x0a'+_0x2a1684(0x437,0x49d,0x4b0,0x481)+_0x2a1684(0x4f3,0x4dd,0x4c7,0x4c2)+_0x2a1684(0x565,0x4f0,0x4de,0x515)+_0x402d3d(0x152,0x190,0x10a,0x1a4)+'╮\x0a┃\x20╭━━━━━'+'━━━━━━━━━━'+'━╮\x0a┃\x20┃\x20╭┈─'+_0x402d3d(0x19e,0x1c4,0x18e,0x1a3)+'─╮\x0a┃\x20┃\x20│\x20❍'+'\x20𝐆𝐎𝐎𝐃\x20𝐁𝐘𝐄\x20'+'❍\x0a┃\x20┃\x20╰┈──'+_0x2a1684(0x4de,0x512,0x4f9,0x510)+_0x2a1684(0x4cf,0x53f,0x4dc,0x50d)+_0x2a1684(0x47f,0x4f3,0x4f2,0x4ac)+_0x2a1684(0x44b,0x47a,0x456,0x490)+_0x402d3d(0x135,0x117,0x16e,0x127)+'𝐁𝐎𝐓\x20݊⃟̥⃝̇݊⃟╾━━'+_0x2a1684(0x4b6,0x4ba,0x4e0,0x4ed)+_0x2a1684(0x4fa,0x478,0x4c2,0x4ac)+'╾•\x0a┃│╭┈───'+_0x402d3d(0x1ae,0x1cc,0x190,0x17d)+'\x0a┃││❍@'+num['split']('@')[0x22*-0x13+-0xe5*-0x2+0xbc]+(_0x2a1684(0x4b0,0x4a7,0x4bc,0x4f6)+'────────╯\x0a'+'┃│⃟❍➢\x20𝐋𝐄𝐀𝐕𝐈'+_0x2a1684(0x4df,0x51f,0x52b,0x50b)+_0x2a1684(0x4ea,0x4e1,0x543,0x4ff))+metadata[_0x2a1684(0x44e,0x4c2,0x441,0x48a)]+(_0x402d3d(0x142,0x18b,0x167,0x107)+_0x2a1684(0x50b,0x4d3,0x4b9,0x4ee)+_0x2a1684(0x521,0x4ce,0x4d2,0x4f8)+_0x402d3d(0x185,0x156,0x164,0x18b)+'𝐓\x20݊⃟̥⃝̇݊⃟╾━━━•'+_0x2a1684(0x49a,0x4b1,0x521,0x4eb)+_0x402d3d(0x17c,0x186,0x194,0x172)+'\x0a┃│╭┈─────'+_0x2a1684(0x4db,0x4aa,0x504,0x4ba)+'││\x20❍\x20𝐒𝐔𝐁𝐒𝐂'+_0x2a1684(0x4d1,0x475,0x496,0x496)+_0x402d3d(0x119,0x159,0x150,0x102)+_0x2a1684(0x50c,0x4cb,0x4e8,0x4e7)+_0x2a1684(0x487,0x460,0x4a1,0x49d)+_0x402d3d(0x133,0x120,0x17c,0x177)+_0x2a1684(0x4f5,0x4f1,0x4a1,0x4ad)+_0x2a1684(0x4c3,0x490,0x4e1,0x4c5)+_0x402d3d(0x15e,0x16f,0x186,0x182)+_0x402d3d(0x173,0x1b6,0x185,0x140)+'wt99jFVc-z'+_0x2a1684(0x4b1,0x4ca,0x4dd,0x4f9)+_0x402d3d(0x191,0x15e,0x144,0x1dd)+'━━━━━━━━━╾'+_0x2a1684(0x482,0x4bf,0x4da,0x4be)+_0x2a1684(0x4b9,0x4ca,0x4d2,0x4a2)+_0x402d3d(0x193,0x14c,0x182,0x19b)+_0x402d3d(0x12e,0x14f,0x154,0x13e)+_0x402d3d(0x17d,0x172,0x1cd,0x13c)+'͟𝐓𝐇𝐄\x20𝐉𝐎\x20𝐁𝐎'+'𝐓\x0a');var _0x9af936={};_0x9af936[_0x2a1684(0x4f0,0x4fb,0x4e2,0x4f4)]=pp_user;var _0x5820e3={};_0x5820e3[_0x2a1684(0x471,0x4ca,0x4b9,0x4c0)+'Score']=0x96,_0x5820e3[_0x2a1684(0x477,0x501,0x4c9,0x4c6)+'d']=!![];var _0x54fc55={};_0x54fc55[_0x402d3d(0x140,0x135,0x157,0x157)]=_0x402d3d(0x127,0xd4,0xff,0x120)+'\x20❍',_0x54fc55['body']=_0x2a1684(0x4e9,0x488,0x498,0x4d2)+'❍',_0x54fc55[_0x402d3d(0x1a8,0x19f,0x1aa,0x1c1)+'e']='PHOTO',_0x54fc55['showAdAttr'+_0x402d3d(0x145,0x114,0x11a,0x102)]=!![],_0x54fc55[_0x402d3d(0x172,0x149,0x152,0x15f)]=_0x2a1684(0x4c8,0x4d1,0x492,0x4bb)+_0x402d3d(0x18e,0x14c,0x161,0x1c4)+_0x402d3d(0x126,0x101,0xd4,0x172)+_0x402d3d(0x13f,0x150,0x111,0x146)+'zXMkxKRDZ5'+'6w',_0x54fc55[_0x2a1684(0x4ed,0x497,0x49e,0x4b3)+'rl']=_0x2a1684(0x494,0x4e5,0x4cf,0x4da)+'legra.ph/f'+_0x2a1684(0x508,0x4ad,0x511,0x4f2)+_0x2a1684(0x55c,0x504,0x4d3,0x516)+'8db88.jpg',_0x54fc55[_0x402d3d(0x174,0x16d,0x17a,0x166)+'o']=_0x5820e3;var _0x55cda6={};_0x55cda6['externalAd'+_0x402d3d(0x181,0x136,0x149,0x17b)]=_0x54fc55;var _0x609784={};_0x609784[_0x2a1684(0x4d1,0x56a,0x54f,0x518)]=_0x9af936,_0x609784[_0x2a1684(0x4ed,0x4bf,0x4be,0x4e6)+'o']=_0x55cda6,_0x609784[_0x2a1684(0x51e,0x51a,0x4cb,0x4d7)]=anunya2;var _0x49e083={};_0x49e083[_0x402d3d(0x17f,0x17a,0x187,0x13c)]=fgamjo,_0x49e083[_0x2a1684(0x538,0x52d,0x4a6,0x4e6)+'o']={},jobotz[_0x2a1684(0x50d,0x546,0x4d9,0x51e)+'e'](anu['id'],_0x609784,_0x49e083);}}}
            }
        } catch (err) {
            console.log(err)
        }
    })
	
    // Setting
    jobotz.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    jobotz.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = jobotz.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    jobotz.getName = (jid, withoutContact  = false) => {
        id = jobotz.decodeJid(jid)
        withoutContact = jobotz.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = jobotz.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === jobotz.decodeJid(jobotz.user.id) ?
            jobotz.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    jobotz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await jobotz.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await jobotz.getName(i + '@s.whatsapp.net')}\nFN:${await jobotz.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:okeae2410@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/cak_haho\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	jobotz.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }
    
    jobotz.setStatus = (status) => {
        jobotz.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
	
    jobotz.public = true

    jobotz.serializeM = (m) => smsg(jobotz, m, store)

    jobotz.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); jobotz.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startjobotz(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startjobotz(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); jobotz.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); jobotz.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startjobotz(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startjobotz(); }
            else jobotz.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        console.log('Connected...', update)
    })

    jobotz.ev.on('creds.update', saveState)

    // Add Other

      /**
      *
      * @param {*} jid
      * @param {*} url
      * @param {*} caption
      * @param {*} quoted
      * @param {*} options
      */
     jobotz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return jobotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return jobotz.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return jobotz.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return jobotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return jobotz.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }

    /** Send List Messaage
      *
      *@param {*} jid
      *@param {*} text
      *@param {*} footer
      *@param {*} title
      *@param {*} butText
      *@param [*] sections
      *@param {*} quoted
      */
        jobotz.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
        let sections = sects
        var listMes = {
        text: text,
        footer: footer,
        title: title,
        buttonText: butText,
        sections
        }
        jobotz.sendMessage(jid, listMes, { quoted: quoted })
        }

    /** Send Button 5 Message
     * 
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} button
     * @returns 
     */
        jobotz.send5ButMsg = (jid, text = '' , footer = '', but = []) =>{
        let templateButtons = but
        var templateMessage = {
        text: text,
        footer: footer,
        templateButtons: templateButtons
        }
        jobotz.sendMessage(jid, templateMessage)
        }

    /** Send Button 5 Image
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} image
     * @param [*] button
     * @param {*} options
     * @returns
     */
    jobotz.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ image: img }, { upload: jobotz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        imageMessage: message.imageMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            jobotz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Video
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Video
     * @param [*] button
     * @param {*} options
     * @returns
     */
    jobotz.send5ButVid = async (jid , text = '' , footer = '', vid, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ video: vid }, { upload: jobotz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            jobotz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Gif
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Gif
     * @param [*] button
     * @param {*} options
     * @returns
     */
    jobotz.send5ButGif = async (jid , text = '' , footer = '', gif, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ video: gif, gifPlayback: true }, { upload: jobotz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            jobotz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} buttons 
     * @param {*} caption 
     * @param {*} footer 
     * @param {*} quoted 
     * @param {*} options 
     */
    jobotz.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        jobotz.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
    
    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendText = (jid, text, quoted = '', options) => jobotz.sendMessage(jid, { text: text, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
	let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await jobotz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await jobotz.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} mime 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await jobotz.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendTextWithMentions = async (jid, text, quoted, options = {}) => jobotz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await jobotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await jobotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
	
    /**
     * 
     * @param {*} message 
     * @param {*} filename 
     * @param {*} attachExtension 
     * @returns 
     */
    jobotz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    jobotz.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
	}
        
	return buffer
     } 
    
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} filename
     * @param {*} caption
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await jobotz.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/exif')
        let media = { mimetype: mime, data }
        pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
        await fs.promises.unlink(filename)
        type = 'sticker'
        mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await jobotz.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
       }

    /**
     * 
     * @param {*} jid 
     * @param {*} message 
     * @param {*} forceForward 
     * @param {*} options 
     * @returns 
     */
    jobotz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
		if (options.readViewOnce) {
			message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
			vtype = Object.keys(message.message.viewOnceMessage.message)[0]
			delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
			delete message.message.viewOnceMessage.message[vtype].viewOnce
			message.message = {
				...message.message.viewOnceMessage.message
			}
		}

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
		let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await jobotz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }

    jobotz.cMod = (jid, copy, text = '', sender = jobotz.user.id, options = {}) => {
        //let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === jobotz.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }


    /**
     * 
     * @param {*} path 
     * @returns 
     */
    jobotz.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    return jobotz
}

startjobotz()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
