'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto');
const root=__dirname,file=path.join(root,'party-character-settings.js'),C=require('./party-core.js'),ids=new Set(C.allCharacters.map(c=>c.id));
const missing=()=>C.allCharacters.filter(c=>!fs.existsSync(path.join(root,c.img))).map(c=>c.id);
function read(){delete require.cache[require.resolve(file)];return JSON.parse(JSON.stringify(require(file)))}
function revision(){return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}
function validate(input){if(!input||input.version!==1||!Array.isArray(input.disabled)||!input.profiles||typeof input.profiles!=='object'||Array.isArray(input.profiles))throw Error('設定ファイルの形式が正しくありません');
 const out={version:1,disabled:[...new Set([...input.disabled,...missing()])],profiles:{}};
 if(out.disabled.some(id=>!Number.isInteger(id)||!ids.has(id)))throw Error('未登録のキャラクターIDがあります');
 function rank(value){const m=typeof value==='string'&&value.match(/^(SS|S[+-]?|[ABCD][+-]?|E|F)(?:-(SS|S[+-]?|[ABCD][+-]?|E|F))?$/);if(!m||!C.rankOrder.includes(m[1])||!C.rankOrder.includes(m[2]||m[1])||C.rankOrder.indexOf(m[1])>C.rankOrder.indexOf(m[2]||m[1]))throw Error('ランクの範囲が正しくありません');return value}
 for(const [id,p] of Object.entries(input.profiles)){if(!/^\d+$/.test(id)||!ids.has(Number(id))||!p||typeof p!=='object')throw Error('未登録のキャラクター設定です');const item={traits:{}};if(p.rank)item.rank=rank(p.rank);if(p.traits){if(typeof p.traits!=='object'||Array.isArray(p.traits))throw Error('種目設定が不正です');for(const [key,value] of Object.entries(p.traits)){if(!['brain','sport','running','flying','power','luck'].includes(key))throw Error('未登録の種目です');if(value)item.traits[key]=rank(value)}}out.profiles[id]=item;}return out;}
function write(settings){const backup=path.join(root,'output','character-settings-backups');fs.mkdirSync(backup,{recursive:true});fs.copyFileSync(file,path.join(backup,Date.now()+'-'+crypto.randomBytes(3).toString('hex')+'.js'));const source='/* Saved by the character editor. */\n(function(root){const settings='+JSON.stringify(settings,null,2)+';root.MobCharacterSettings=settings;if(typeof module!=="undefined"&&module.exports)module.exports=settings;})(typeof window!=="undefined"?window:globalThis);\n';const temp=file+'.tmp';fs.writeFileSync(temp,source);fs.renameSync(temp,file)}
async function start(port=4178){const normalized=validate(read());if(JSON.stringify(normalized)!==JSON.stringify(read()))write(normalized);
 const server=http.createServer(async(req,res)=>{const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value))};
 try{const host='127.0.0.1:'+server.address().port;if(req.headers.host!==host){send(403,{error:'ローカル専用です'});return}const url=new URL(req.url,'http://'+host);
 if(url.pathname.startsWith('/api/')){
 if(req.method==='GET'&&url.pathname==='/api/settings'){send(200,{settings:validate(read()),revision:revision(),missing:missing()});return}
 if(req.method!=='POST'||!['/api/settings','/api/validate'].includes(url.pathname)){send(404,{error:'Not found'});return}
 if(req.headers.origin!=='http://'+host||!req.headers['content-type']?.startsWith('application/json')){send(403,{error:'編集画面から保存してください'});return}
 let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>300000)throw Error('ファイルが大きすぎます')}
 const input=JSON.parse(body),settings=validate(input.settings);if(url.pathname==='/api/settings'){if(input.revision!==revision()){send(409,{error:'別の画面で更新されています。バックアップを保存してから画面を開き直してください'});return}write(settings)}send(200,{settings,revision:revision()});return;
 }
 if(req.method!=='GET'){send(405,{error:'Method not allowed'});return}const name=decodeURIComponent(url.pathname).slice(1)||'character-editor.html',target=path.resolve(root,name),ext=path.extname(target).toLowerCase();
 if(!target.startsWith(root+path.sep)||name.split(/[\\/]/).some(s=>s.startsWith('.'))||name.startsWith('output/')||!['.html','.js','.css','.png','.jpg','.jpeg','.webp','.svg','.mp3','.wav','.ogg'].includes(ext)){send(403,{error:'Forbidden'});return}
 fs.readFile(target,(e,bytes)=>{if(e){send(404,{error:'Not found'});return}res.writeHead(200,{'Cache-Control':'no-store','Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'})[ext]||'application/octet-stream'});res.end(bytes)});
 }catch(e){send(400,{error:e.message})}});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve)});return server;
}
module.exports={start,validate};
if(require.main===module)start().then(server=>{const url='http://127.0.0.1:'+server.address().port+'/character-editor.html';console.log('MOB character editor: '+url+'\nKeep this window open while editing.');if(!process.argv.includes('--no-open'))require('child_process').execFile('cmd.exe',['/c','start','',url])}).catch(e=>{console.error(e.message);process.exitCode=1});