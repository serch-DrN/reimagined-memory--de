import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,SignJWT,createLocalJWKSet,exportJWK} from 'jose';
import {handle} from '../hosting/worker.js';
const pair=await generateKeyPair('RS256');
const jwk=await exportJWK(pair.publicKey);jwk.kid='test';
const keys=createLocalJWKSet({keys:[jwk]});
const env={ACCESS_ISSUER:'https://example.cloudflareaccess.com',ACCESS_AUD:'app-id',OWNER_EMAIL:'owner@example.com'};
async function token(options={}){return new SignJWT({email:options.email||env.OWNER_EMAIL}).setProtectedHeader({alg:'RS256',kid:'test'}).setSubject('account-123').setIssuer(options.issuer||env.ACCESS_ISSUER).setAudience(options.audience||env.ACCESS_AUD).setIssuedAt().setExpirationTime(options.exp||'1h').sign(options.key||pair.privateKey)}
async function check(jwt,path='/index.html',config=env){let calls=0;const response=await handle(new Request('https://app.example'+path,{headers:jwt?{'Cf-Access-Jwt-Assertion':jwt}:{}}),{...config,ASSETS:{fetch:async()=>{calls++;return new Response('protected asset')}}},keys);return {response,calls}}
test('todos los archivos bloqueados sin sesión, incluso rutas directas',async()=>{for(const path of ['/','/index.html','/app.js','/styles.css','/other']){const {response,calls}=await check(null,path);assert.equal(response.status,403);assert.equal(calls,0)}});
test('solo la cuenta permitida recibe archivos y sin caché compartida',async()=>{for(const path of ['/','/app.js','/styles.css']){const {response,calls}=await check(await token(),path);assert.equal(response.status,200);assert.equal(calls,1);assert.equal(response.headers.get('Cache-Control'),'private, no-store');assert.equal(await response.text(),'protected asset')}});
test('otra cuenta, firma falsa, token vencido, emisor y audiencia incorrectos bloqueados',async()=>{const attacker=await generateKeyPair('RS256');for(const options of [{email:'other@example.com'},{key:attacker.privateKey},{exp:1},{issuer:'https://attacker.cloudflareaccess.com'},{audience:'other-app'}]){const {response,calls}=await check(await token(options));assert.equal(response.status,403);assert.equal(calls,0)}});
test('cabecera manipulada y configuración incompleta fallan cerradas',async()=>{for(const jwt of ['email=owner@example.com','broken.jwt.value'])assert.equal((await check(jwt)).response.status,403);for(const field of ['ACCESS_ISSUER','ACCESS_AUD','OWNER_EMAIL']){const {response,calls}=await check(await token(),'/',{...env,[field]:''});assert.equal(response.status,403);assert.equal(calls,0)}});
