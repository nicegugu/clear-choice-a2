import {initialState,parseRequest,transition,recommendations,explain} from './engine.mjs';
let state=initialState(),history=[],events=[],messages=[{who:'assistant',text:'Tell me a budget and a main use. I will keep ordinary recommendations separate from sponsored ones. Your purpose is not used for ads unless you turn that on.'}],selected=null;
const $=id=>document.getElementById(id);
function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function log(type,detail){events.push({sequence:events.length+1,type,detail,state:{...state},results:recommendations(state)});}
function announce(text){$('status').textContent=text;}
function apply(event,feedback){
  const before={...state};
  try{state=transition(state,event);}catch(error){announce(error.message);return;}
  history.push(before);messages.push({who:'assistant',text:feedback});log('change',{event,feedback});selected=null;
  if($('explanation').open)$('explanation').close();render();announce(feedback);
}
function submit(text){
  messages.push({who:'user',text});const e=parseRequest(text);
  if(e.kind==='clarify'){messages.push({who:'assistant',text:e.message});log('clarification',{request:text,message:e.message});render();announce(e.message);return;}
  if(e.kind==='control')apply(e,e.field==='ads'?(e.value?'Sponsored recommendations are on.':'Sponsored recommendations are off. Ordinary recommendations are unchanged.'):(e.value?'Your purpose is now used for sponsored ranking.':'Your purpose is no longer used for sponsored ranking. It still helps your ordinary shortlist; your budget still applies.'));
  else apply(e,`Showing headphones up to £${e.budget??state.budget}${(e.purpose??state.purpose)!=='general'?` for ${e.purpose??state.purpose}`:''}. ${state.usePurposeForAds?'Your purpose is enabled for ad ranking.':'Your purpose is not used for ads.'}`);
}
function artwork(colour){
  // Original SVG product illustration; not a photograph of a real product.
  const box=node('div',undefined,'product-art');
  box.innerHTML=`<svg viewBox="0 0 180 145" fill="none" aria-hidden="true"><ellipse cx="90" cy="129" rx="47" ry="7" fill="#1c3154" opacity=".10"/><path d="M42 87V64a48 48 0 0 1 96 0v23" stroke="${colour}" stroke-width="15" stroke-linecap="round"/><path d="M42 62a48 48 0 0 1 96 0" stroke="white" stroke-opacity=".25" stroke-width="3"/><rect x="29" y="73" width="31" height="49" rx="13" fill="${colour}"/><rect x="120" y="73" width="31" height="49" rx="13" fill="${colour}"/><rect x="49" y="78" width="12" height="41" rx="6" fill="#172a3d" opacity=".75"/><rect x="119" y="78" width="12" height="41" rx="6" fill="#172a3d" opacity=".75"/><path d="M35 83v25M137 83v25" stroke="white" stroke-opacity=".25" stroke-width="3" stroke-linecap="round"/></svg>`;
  return box;
}
function productCard(p,sponsored){
  const card=node('article',undefined,`product-card${sponsored?' sponsored-card':''}`);card.dataset.product=p.id;
  const art=artwork(p.colour);art.append(node('span',sponsored?'SPONSORED':'ORDINARY PICK','tag'));card.append(art);
  const info=node('div',undefined,'product-info'),title=node('div',undefined,'product-title');title.append(node('h3',p.name),node('span',`£${p.price}`,'price'));info.append(title);
  info.append(node('p',sponsored?`Fictional sponsor: ${p.sponsor}`:'Not sponsored · selected from the demo catalogue'));
  const features=node('div',undefined,'feature-line');features.append(node('span',`${p.battery}h battery`,'feature'),node('span',p.anc?'Noise cancelling':'No noise cancelling','feature'));info.append(features);
  info.append(node('p',p.matchedPurpose?`Matches your stated ${state.purpose} use.`:(sponsored?'Selected using the active inputs shown in its explanation.':'Within your budget. Compare the details before choosing.')));
  card.append(info);const why=node('button','Why this recommendation?','why-button');why.addEventListener('click',()=>showExplanation(p));card.append(why);return card;
}
function showExplanation(p){
  selected=p.id;const data=explain(p,state);log('explanation',{product:p.id,explanation:data});const body=$('explanation-content');body.replaceChildren(node('h2',data.title),node('p',p.name),node('p',data.commercial));
  for(const input of data.inputs){const block=node('div',undefined,'input-evidence');block.append(node('h3',input.label),node('p',`Source: ${input.source}`),node('p',input.effect));body.append(block);}
  body.append(node('p',data.tieBreak));
  body.append(node('p',`${p.sponsor?(data.purposeUsed?'Your purpose IS used for this ad.':'Your purpose is NOT used for this ad. '):''}No external browsing history, inferred demographics or sensitive attributes are used. Explanation reflects results revision ${state.revision}.`,'explain-foot'));
  if(p.sponsor){const actions=node('div',undefined,'dialog-controls');if(state.usePurposeForAds){const b=node('button','Stop using my purpose for ads','secondary');b.onclick=()=>apply({kind:'control',field:'usePurposeForAds',value:false},'Your purpose is no longer used for ads. The sponsored selection has been recomputed.');actions.append(b);}const hide=node('button','Hide sponsored recommendations','secondary');hide.onclick=()=>apply({kind:'control',field:'ads',value:false},'Sponsored recommendations are off. Your ordinary shortlist is unchanged.');actions.append(hide);body.append(actions);}
  $('explanation').showModal();$('event-count').textContent=`${events.length} session events`;
}
function render(){
  $('budget').value=state.budget;$('purpose').value=state.purpose;$('ads').checked=state.ads;$('personalise').checked=state.usePurposeForAds;$('undo').disabled=!history.length;
  $('revision').textContent=`Results revision ${state.revision}`;
  $('messages').replaceChildren();for(const m of messages){const el=node('div',undefined,`message ${m.who==='user'?'user':''}`);el.append(node('small',m.who==='user'?'YOU':'CLEAR CHOICE'),node('span',m.text));$('messages').append(el);} $('messages').scrollTop=$('messages').scrollHeight;
  const result=recommendations(state);
  $('result-summary').textContent=state.hasQuery?`Maximum £${state.budget} · ${state.purpose==='general'?'Everyday listening':state.purpose} · Ordinary picks are ranked without sponsorship payments.`:'An everyday shortlist under £100 to start. Tell me what matters to you.';
  $('organic').replaceChildren(...result.organic.map(p=>productCard(p,false)));
  if(!result.organic.length)$('organic').append(node('div',`No ordinary products fit £${state.budget} in this small catalogue. Increase your budget to £39 or more, or keep your limit and stop here. I will not silently raise it.`,'empty'));
  $('sponsored').replaceChildren(...result.sponsored.map(p=>productCard(p,true)));
  if(!result.sponsored.length)$('sponsored').append(node('div',state.ads?'No sponsored product fits your budget. Your maximum has not changed.':'Sponsored recommendations are off. Your ordinary shortlist is still available.','empty'));
  const active=$('active-data');active.replaceChildren();for(const [a,b] of [['Category','Headphones'],['Budget',`£${state.budget} maximum`],['Purpose for ordinary picks',state.purpose],['Purpose for ads',state.ads?(state.usePurposeForAds?'On':'Off'):'Not used: ads off']]){const row=node('div',undefined,'data-row');row.append(node('span',a),node('b',b));active.append(row);}
  $('event-count').textContent=`${events.length} session events`;
}
$('request-form').onsubmit=e=>{e.preventDefault();const t=$('request').value.trim();if(!t)return;$('request').value='';submit(t);};
document.querySelectorAll('[data-example]').forEach(b=>b.onclick=()=>submit(b.dataset.example));
$('budget').onchange=()=>{const v=Number($('budget').value);if(!Number.isFinite(v)||v<1||v>1000){$('budget').value=state.budget;announce('Use a budget from £1 to £1,000. No settings changed.');return;}apply({kind:'budget',value:v},`Budget changed to £${v}. Every result has been checked against your maximum.`);};
$('purpose').onchange=()=>apply({kind:'purpose',value:$('purpose').value},'Use case updated. Results and explanations have been recomputed using your current settings.');
$('ads').onchange=()=>apply({kind:'control',field:'ads',value:$('ads').checked},$('ads').checked?'Sponsored recommendations are on.':'Sponsored recommendations are off. Ordinary recommendations are unchanged.');
$('personalise').onchange=()=>apply({kind:'control',field:'usePurposeForAds',value:$('personalise').checked},$('personalise').checked?'Your stated purpose is now allowed in ad ranking. It will only be used while sponsored recommendations are on.':'Your purpose is no longer used in ad ranking. Ordinary recommendations still use it.');
$('undo').onclick=()=>{if(!history.length)return;const n=state.revision+1;state={...history.pop(),revision:n};messages.push({who:'assistant',text:'Previous settings restored. Results have been recomputed.'});log('undo',{});render();announce('Previous settings restored.');};
$('reset').onclick=()=>{state=initialState();history=[];events=[];messages=[{who:'assistant',text:'Session reset. Your previous requests and settings have been cleared from this page. Purpose-based ad personalisation is off.'}];render();announce('Session reset.');};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({prototype:'Clear Choice v1',mode:'rule-based; fictional catalogue and sponsorship',events,currentState:state,currentResults:recommendations(state)},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=node('a');a.href=url;a.download='clear-choice-session.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Session evidence downloaded. Review requests before sharing.');};
$('about-open').onclick=()=>$('about').showModal();$('about-close').onclick=()=>$('about').close();$('explanation-close').onclick=()=>$('explanation').close();
render();
