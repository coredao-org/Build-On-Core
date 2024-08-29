import{cl as e,cm as a,ai as i,W as o}from"./index-0c28943e.js";const c=`Ethereum Signed Message:
`;function u(t,n){const r=(()=>typeof t=="string"?e(t):t.raw instanceof Uint8Array?t.raw:a(t.raw))(),s=e(`${c}${r.length}`);return i(o([s,r]),n)}export{u as hashMessage};
