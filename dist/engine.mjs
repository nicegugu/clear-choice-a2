export const PRODUCTS = Object.freeze([
  {id:'harbour',name:'Harbour Studio',price:79,battery:38,anc:true,purposes:['study','commute'],sponsor:null,colour:'#4665b5'},
  {id:'field',name:'Field Runner',price:65,battery:24,anc:false,purposes:['exercise'],sponsor:null,colour:'#338471'},
  {id:'orbit',name:'Orbit Everyday',price:39,battery:20,anc:false,purposes:['general'],sponsor:null,colour:'#62697b'},
  {id:'aster',name:'Aster Lite',price:59,battery:30,anc:false,purposes:['general'],sponsor:'Aster Audio',colour:'#b17742',priority:3},
  {id:'metro',name:'Metro Quiet',price:89,battery:40,anc:true,purposes:['commute','study'],sponsor:'Metro Audio',colour:'#4a67b5',priority:2},
  {id:'pulse',name:'Pulse Move',price:69,battery:26,anc:false,purposes:['exercise'],sponsor:'Pulse Audio',colour:'#37826c',priority:1}
]);

export function initialState(){return {budget:100,purpose:'general',hasQuery:false,ads:true,usePurposeForAds:false,revision:0};}
export function parseRequest(text){
  const q=String(text).trim().toLowerCase();
  if(!q || q.length>1000)return {kind:'clarify',message:'Use a short request about headphones, a budget, or one of the control phrases below.'};
  if(/^(hide|turn off|disable) (all )?(sponsored recommendations|sponsored results|ads)[.!]?$/.test(q))return {kind:'control',field:'ads',value:false};
  if(/^(show|turn on|enable) (sponsored recommendations|sponsored results|ads)[.!]?$/.test(q))return {kind:'control',field:'ads',value:true};
  if(/^(do not|don't|stop) (use|using) (my )?(commute|commuting|purpose|use case) (for|in) (ads|sponsored recommendations)[.!]?$/.test(q))return {kind:'control',field:'usePurposeForAds',value:false};
  if(/^use (my )?(purpose|use case) for ads[.!]?$/.test(q))return {kind:'control',field:'usePurposeForAds',value:true};
  if(/\b(hide|stop|disable|don't|do not|turn off|remove|forget|delete)\b/.test(q))return {kind:'clarify',message:'Which change do you want? Use “Hide sponsored recommendations” or “Do not use my purpose for ads”. No settings changed.'};
  const nums=[...q.matchAll(/(?:£\s*|(?:under|below|budget(?: is| of)?|up to|max(?:imum)?|less than)\s*£?\s*)(\d+(?:\.\d{1,2})?)/g)].map(m=>Number(m[1]));
  if(new Set(nums).size>1)return {kind:'clarify',message:'I found more than one budget. Give one maximum in pounds, for example “Headphones under £100 for commuting”. No settings changed.'};
  if(nums.length&&(nums[0]<1||nums[0]>1000))return {kind:'clarify',message:'This demo accepts a maximum budget from £1 to £1,000. No settings changed.'};
  const purposes=[];
  if(/\b(commut\w*|train|bus|travel)\b/.test(q))purposes.push('commute');
  if(/\b(study|studying|library|focus)\b/.test(q))purposes.push('study');
  if(/\b(exercise|running|run|gym|sport\w*)\b/.test(q))purposes.push('exercise');
  if(purposes.length>1)return {kind:'clarify',message:'Choose one main use: commuting, studying, or exercise. No settings changed.'};
  const nonHeadphones=/\b(laptop|phone|speaker|camera|shoe\w*|medicine|diagnos\w*)\b/.test(q);
  if(nonHeadphones||(!/\b(headphone\w*|earphone\w*|earbud\w*)\b/.test(q)&&!nums.length&&!purposes.length))return {kind:'clarify',message:'I can compare the fictional headphones in this demo. Try “Headphones under £100 for commuting”. I cannot answer general shopping questions.'};
  return {kind:'query',...(nums.length?{budget:nums[0]}:{}),...(purposes.length?{purpose:purposes[0]}:{})};
}

export function transition(state,event){
  if(event.kind==='clarify')return {...state};
  const next={...state,revision:state.revision+1};
  if(event.kind==='query'){
    if(event.budget!==undefined)next.budget=event.budget;
    if(event.purpose!==undefined)next.purpose=event.purpose;
    next.hasQuery=true;
  }else if(event.kind==='control'){
    if(!['ads','usePurposeForAds'].includes(event.field)||typeof event.value!=='boolean')throw new Error('Invalid control');
    next[event.field]=event.value;
  }else if(event.kind==='budget'){
    if(!Number.isFinite(event.value)||event.value<1||event.value>1000)throw new Error('Invalid budget');
    next.budget=event.value;next.hasQuery=true;
  }else if(event.kind==='purpose'){
    if(!['general','commute','study','exercise'].includes(event.value))throw new Error('Invalid purpose');
    next.purpose=event.value;next.hasQuery=true;
  }else throw new Error('Invalid event');
  return next;
}

export function recommendations(state,catalogue=PRODUCTS){
  const eligible=catalogue.filter(p=>p.price<=state.budget);
  const organic=eligible.filter(p=>!p.sponsor).map(p=>{
    const match=state.purpose!=='general'&&p.purposes.includes(state.purpose);
    return {...p,score:(match?10:0)+p.battery/100,usedFields:['category','budget',...(state.purpose!=='general'?['purpose']:[])],matchedPurpose:match};
  }).sort((a,b)=>b.score-a.score||a.price-b.price).slice(0,2);
  // Purpose is read only in the enabled branch. Budget is a hard affordability filter,
  // not an optional targeting signal; sponsorship never changes organic ranking.
  let sponsored=[];
  if(state.ads){
    sponsored=eligible.filter(p=>p.sponsor).map(p=>{
      const match=state.usePurposeForAds&&state.purpose!=='general'&&p.purposes.includes(state.purpose);
      return {...p,score:(match?10:0)+p.priority/10,usedFields:['category','budget',...(state.usePurposeForAds&&state.purpose!=='general'?['purpose']:[])],matchedPurpose:!!match};
    }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,1);
  }
  return {organic,sponsored,revision:state.revision};
}

export function explain(product,state){
  const sponsored=!!product.sponsor;
  const used=product.usedFields??[];
  return {
    title:sponsored?'Why this sponsored recommendation?':'Why this ordinary recommendation?',
    commercial:sponsored?`${product.sponsor} has a fictional sponsorship agreement. That makes this product eligible for the sponsored slot; it does not improve its ordinary ranking.`:'No sponsorship payment is associated with this product in the demo catalogue.',
    inputs:[{field:'category',label:'Headphones',source:'The supported product category',effect:'Limits the catalogue to headphones.'},{field:'budget',label:`Maximum £${state.budget}`,source:'Your visible shopping budget',effect:'Excludes products above your maximum. This limit always applies, including to ads.'},...(used.includes('purpose')?[{field:'purpose',label:state.purpose,source:'Your stated use case in this session',effect:sponsored?'Adds 10 ranking points to matching sponsored products.':'Adds 10 ranking points to matching ordinary products.'}]:[])],
    tieBreak:sponsored?'Then fixed demo campaign priority; no auction or real payment.':'Then battery hours divided by 100, then lower price.',
    purposeUsed:used.includes('purpose'),revision:state.revision
  };
}
