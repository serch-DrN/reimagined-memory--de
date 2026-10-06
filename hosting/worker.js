import {createRemoteJWKSet, jwtVerify} from 'jose';
const keysets=new Map();
export async function authorize(request, env, testKeys) {
  if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_ISSUER || '') || !env.ACCESS_AUD || !env.OWNER_EMAIL) throw new Error('Access no configurado');
  const token=request.headers.get('Cf-Access-Jwt-Assertion');
  if(!token) throw new Error('Sin identidad');
  let keys=testKeys;
  if(!keys){
    if(!keysets.has(env.ACCESS_ISSUER)) keysets.set(env.ACCESS_ISSUER,createRemoteJWKSet(new URL(env.ACCESS_ISSUER+'/cdn-cgi/access/certs')));
    keys=keysets.get(env.ACCESS_ISSUER);
  }
  const {payload}=await jwtVerify(token,keys,{
    issuer:env.ACCESS_ISSUER,audience:env.ACCESS_AUD,algorithms:['RS256'],requiredClaims:['sub','email','exp','iat'],maxTokenAge:'24h'
  });
  if(typeof payload.email!=='string'||payload.email.toLowerCase()!==env.OWNER_EMAIL.toLowerCase()||!payload.sub) throw new Error('Cuenta no autorizada');
}
export async function handle(request,env,keys){
  try {await authorize(request,env,keys)} catch {
    return new Response('Acceso restringido. Inicia sesión con la cuenta autorizada mediante Cloudflare Access.',{status:403,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  }
  const result=await env.ASSETS.fetch(request);
  const response=new Response(result.body,result);
  response.headers.set('Cache-Control','private, no-store');
  response.headers.set('X-Content-Type-Options','nosniff');
  response.headers.set('Referrer-Policy','no-referrer');
  response.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  return response;
}
export default {fetch:(request,env)=>handle(request,env)};
