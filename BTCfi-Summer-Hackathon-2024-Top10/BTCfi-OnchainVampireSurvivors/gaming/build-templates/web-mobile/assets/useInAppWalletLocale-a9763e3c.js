import{aq as f,an as G,_ as S,ar as t,ay as h,bO as Y,ax as P,bP as Z,aF as K,az as _,bQ as ee,bd as te,at as ne,bR as oe,av as y,aM as v,aG as V,bS as ae,bT as ie,bU as se,bx as W,bM as re,aC as x,bV as L,bW as le,bX as C,bY as ce,bZ as de,b_ as ue,aL as he,aI as me,b$ as ge,c0 as pe,bL as fe,aN as xe,c1 as ye,c2 as we,c3 as be}from"./index-0c28943e.js";function Se({countryCode:e,setCountryCode:n}){const r=f.useRef(null),{data:i}=G({queryKey:["supported-sms-countries"],queryFn:async()=>{const{supportedSmsCountries:a}=await S(()=>import("./supported-sms-countries-9b9fdfc6.js"),[]);return a}}),c=i??[{countryIsoCode:"US",countryName:"United States",phoneNumberCode:1}];return t.jsx(t.Fragment,{children:t.jsxs(Ie,{ref:r,name:"countries",id:"countries",value:e,onChange:a=>{n(a.target.value)},style:{paddingLeft:h.md,paddingRight:"0"},children:[t.jsx(q,{style:{display:"none"},value:e,children:e}),c.map(a=>t.jsxs(q,{value:`${a.countryIsoCode} +${a.phoneNumberCode}`,children:[a.countryName," +",a.phoneNumberCode," "]},a.countryIsoCode))]})})}const q=Y(()=>{const e=P();return{color:e.colors.primaryText,background:e.colors.modalBg,transition:"background 0.3s ease","&:hover":{background:e.colors.tertiaryBg}}}),Ie=Z(()=>{const e=P();return{fontSize:K.sm,display:"block",padding:h.sm,boxSizing:"border-box",outline:"none",border:"none",borderRadius:_.lg,color:e.colors.primaryText,WebkitAppearance:"none",appearance:"none",cursor:"pointer",background:"transparent","&::placeholder":{color:e.colors.secondaryText},"&[disabled]":{cursor:"not-allowed"},minWidth:"0px",maxWidth:"90px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}});function N(e){const[n,r]=f.useState("US +1"),[i,c]=f.useState(""),[a,s]=f.useState(),[d,k]=f.useState(!1),l=()=>{k(!0),!(!i||a)&&e.onSelect(e.format==="phone"?`+${n.split("+")[1]}${i}`:i)},m=d&&!!a||!i&&!!e.emptyErrorMessage&&d;return t.jsxs("div",{style:{width:"100%"},children:[t.jsxs(ee,{style:{position:"relative",display:"flex",flexDirection:"row"},"data-error":m,children:[e.format==="phone"&&t.jsx(Se,{countryCode:n,setCountryCode:r}),t.jsx(te,{tabIndex:-1,placeholder:e.placeholder,style:{flexGrow:1,padding:`${h.md} ${e.format==="phone"?0:h.md}`},variant:"transparent",type:e.type,name:e.name,value:i,onChange:g=>{c(g.target.value),e.errorMessage?s(e.errorMessage(g.target.value)):s(void 0)},onKeyDown:g=>{g.key==="Enter"&&l()}}),t.jsx(ne,{onClick:l,style:{padding:h.md,borderRadius:`0 ${_.lg} ${_.lg} 0`},children:t.jsx(oe,{width:y.md,height:y.md})})]}),d&&a&&t.jsxs(t.Fragment,{children:[t.jsx(v,{y:"xs"}),t.jsx(V,{color:"danger",size:"sm",children:a})]}),!(d&&a)&&!i&&e.emptyErrorMessage&&d&&t.jsxs(t.Fragment,{children:[t.jsx(v,{y:"xs"}),t.jsx(V,{color:"danger",size:"sm",children:e.emptyErrorMessage})]})]})}function je(e){switch(e){case"google":return"Sign In - Google Accounts";default:return`Sign In - ${e.slice(0,1).toUpperCase()}${e.slice(1)}`}}function ve(e){switch(e){case"facebook":return{width:715,height:555};default:return{width:350,height:500}}}function ke(e,n){const{height:r,width:i}=ve(e),c=(window.innerHeight-r)/2,a=(window.innerWidth-i)/2,s=window.open("",void 0,`width=${i}, height=${r}, top=${c}, left=${a}`);if(s){const d=je(e);s.document.title=d,s.document.body.innerHTML=Ee,s.document.body.style.background=n.colors.modalBg,s.document.body.style.color=n.colors.accentText}return s&&window.addEventListener("beforeunload",()=>{s==null||s.close()}),s}const Ee=`
<svg class="loader" viewBox="0 0 50 50">
  <circle
    cx="25"
    cy="25"
    r="20"
    fill="none"
    stroke="currentColor"
    stroke-width="4"
  />
</svg>

<style>
  body,
  html {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  .loader circle {
    animation: loading 1.5s linear infinite;
  }

  @keyframes loading {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
`,Ce={google:ae,apple:ie,facebook:se};function _e(e){return/^\S+@\S+\.\S+$/.test(e.replace(/\+/g,""))}const Le=["email","phone","google","apple","facebook","passkey"],Pe=e=>{var A,B,F,z,D;const n=e.locale,{chain:r,client:i,connectModal:c}=W(),{wallet:a}=e,s=re(),d=P(),k={google:n.signInWithGoogle,facebook:n.signInWithFacebook,apple:n.signInWithApple},l=e.wallet.getConfig(),m=((A=l==null?void 0:l.auth)==null?void 0:A.options)||Le,g=m.includes("passkey"),T=m.indexOf("email"),I=T!==-1,M=m.indexOf("phone"),w=M!==-1,[p,O]=f.useState(()=>I&&w?T<M?"email":"phone":I?"email":w?"phone":"none"),$=p==="email"?n.emailPlaceholder:n.phonePlaceholder,R=p==="email"?n.emailRequired:n.phoneRequired;let j="text";p==="email"?j="email":p==="phone"&&(j="tel");const E=m.filter(o=>o==="google"||o==="apple"||o==="facebook"),U=E.length>0,Q=async o=>{try{const u=ke(o,d);if(!u)throw new Error("Failed to open login window");const H=a.connect({chain:r,client:i,strategy:o,openedWindow:u,closeOpenedWindow:X=>{X.close()}});await ge(o,pe),s({socialLogin:{type:o,connectionPromise:H}}),e.select()}catch(u){console.error(`Error sign in with ${o}`,u)}};function J(){s({passkeyLogin:!0}),e.select()}const b=E.length>1;return(B=l==null?void 0:l.metadata)!=null&&B.image&&(!l.metadata.image.height||!l.metadata.image.width)&&console.warn("Image is not properly configured. Please set height and width.",l.metadata.image),t.jsxs(x,{flex:"column",gap:"md",style:{position:"relative"},children:[((F=l==null?void 0:l.metadata)==null?void 0:F.image)&&t.jsx(x,{flex:"row",center:"both",children:t.jsx(L,{loading:"eager",client:i,style:{maxHeight:"100px",maxWidth:"300px"},src:l.metadata.image.src,alt:l.metadata.image.alt,width:(z=Math.min(l.metadata.image.width??300,300))==null?void 0:z.toString(),height:(D=Math.min(l.metadata.image.height??100,100))==null?void 0:D.toString()})}),U&&t.jsx(x,{flex:b?"row":"column",center:"x",gap:"sm",style:{justifyContent:"space-between"},children:E.map(o=>{const u=b?y.lg:y.md;return t.jsxs(We,{"aria-label":`Login with ${o}`,"data-variant":b?"icon":"full",variant:"outline",fullWidth:!b,onClick:()=>{Q(o)},children:[t.jsx(L,{src:Ce[o],width:u,height:u,client:i}),!b&&k[o]]},o)})}),c.size==="wide"&&U&&(I||w)&&t.jsx(le,{text:n.or}),I&&t.jsx(t.Fragment,{children:p==="email"?t.jsx(N,{type:j,onSelect:o=>{s({emailLogin:o}),e.select()},placeholder:$,name:"email",errorMessage:o=>{if(!_e(o.toLowerCase()))return n.invalidEmail},emptyErrorMessage:R,submitButtonText:n.submitEmail}):t.jsx(C,{client:i,icon:ce,onClick:()=>{O("email")},title:"Email address"})}),w&&t.jsx(t.Fragment,{children:p==="phone"?t.jsx(N,{format:"phone",type:j,onSelect:o=>{s({phoneLogin:o.replace(/[-\(\) ]/g,"")}),e.select()},placeholder:$,name:"phone",errorMessage:o=>{const u=o.replace(/[-\(\) ]/g,"");if(!/^[0-9]+$/.test(u)&&w)return n.invalidPhone},emptyErrorMessage:R,submitButtonText:n.submitEmail}):t.jsx(C,{client:i,icon:de,onClick:()=>{O("phone")},title:"Phone number"})}),g&&t.jsx(t.Fragment,{children:t.jsx(C,{client:i,icon:ue,onClick:()=>{J()},title:"Passkey"})})]})};function Oe(e){const n=e.locale.emailLoginScreen,{connectModal:r,client:i}=W(),c=r.size==="compact",{initialScreen:a,screen:s}=fe(),d=s===e.wallet&&a===e.wallet?void 0:e.goBack;return t.jsxs(x,{fullHeight:!0,flex:"column",p:"lg",animate:"fadein",style:{minHeight:"250px"},children:[c?t.jsxs(t.Fragment,{children:[t.jsx(xe,{onBack:d,title:t.jsxs(t.Fragment,{children:[r.titleIcon?t.jsx(L,{src:r.titleIcon,width:y.md,height:y.md,client:i}):null,t.jsx(ye,{children:r.title??n.title})]})}),t.jsx(v,{y:"lg"})]}):null,t.jsx(x,{expand:!0,flex:"column",center:"y",p:c?void 0:"lg",children:t.jsx(Pe,{...e})}),c&&(r.showThirdwebBranding!==!1||r.termsOfServiceUrl||r.privacyPolicyUrl)&&t.jsx(v,{y:"xl"}),t.jsxs(x,{flex:"column",gap:"lg",children:[t.jsx(we,{termsOfServiceUrl:r.termsOfServiceUrl,privacyPolicyUrl:r.privacyPolicyUrl}),r.showThirdwebBranding!==!1&&t.jsx(be,{})]})]})}const We=he(me)({"&[data-variant='full']":{display:"flex",justifyContent:"flex-start",padding:h.md,gap:h.md,fontSize:K.md,fontWeight:500,transition:"background-color 0.2s ease","&:active":{boxShadow:"none"}},"&[data-variant='icon']":{padding:h.sm,flexGrow:1}});async function Te(e){switch(e){case"es_ES":return(await S(()=>import("./es-1992b07e.js"),[])).default;case"ja_JP":return(await S(()=>import("./ja-e5ffd66d.js"),[])).default;case"tl_PH":return(await S(()=>import("./tl-8bfdf819.js"),[])).default;default:return(await S(()=>import("./en-efd8c06e.js"),[])).default}}function $e(){const e=W().locale;return G({queryKey:["inAppWalletLocale",e],queryFn:()=>Te(e),refetchOnMount:!1,refetchOnWindowFocus:!1})}export{Pe as I,Oe as a,ke as o,$e as u};
