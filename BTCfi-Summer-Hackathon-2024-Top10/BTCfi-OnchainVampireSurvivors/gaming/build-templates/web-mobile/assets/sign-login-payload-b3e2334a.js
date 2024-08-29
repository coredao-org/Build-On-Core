function g(n){const t="Ethereum";let s=[`${n.domain} wants you to sign in with your ${t} account:`,n.address].join(`
`);s=[s,n.statement].join(`

`),n.statement&&(s+=`
`);const e=[];if(n.uri){const i=`URI: ${n.uri}`;e.push(i)}const o=`Version: ${n.version}`;if(e.push(o),n.chain_id){const i=`Chain ID: ${n.chain_id}`||"1";e.push(i)}const c=`Nonce: ${n.nonce}`;e.push(c);const u=`Issued At: ${n.issued_at}`;e.push(u);const f=`Expiration Time: ${n.expiration_time}`;if(e.push(f),n.invalid_before){const i=`Not Before: ${n.invalid_before}`;e.push(i)}n.resources&&e.push(["Resources:",...n.resources.map(i=>`- ${i}`)].join(`
`));const h=e.join(`
`);return[s,h].join(`
`)}async function $(n){const{payload:t,account:r}=n;return{signature:await r.signMessage({message:g(t)}),payload:t}}export{$ as signLoginPayload};
