/* Mob White's visual commentary. Speech advances only on the player's tap. */
(()=>{
 const lines={opening:'さあ！タッグバトルリーグの始まりです！',round:'先ほどのゲームの順位は\nこっちらです！！',standings:'さあさあ！気になる・・\n総合順位はこっちらです！！',qualified:'おっめでとうです！\n決勝への切符をつかんだタッグは、こっちらです！',ignition:'ナイッスです！ 点灯です！\n次の1位でチャンピオンです！',bonus:'はいです！ 得点アップの大チャンスです！',suspense:'さあ！ これで決まるですか！？\n運命の結果は、こっちらです！！',continuing:'惜しかったです・・！\n勝負はまだまだ続くです！',champions:'おっめでとうです！\nあなたたちがチャンピオンです！！',award:'ナイッスです！ 活躍した選手に拍手です！',versus:'対戦するタッグは、こっちらです！\nレッツゴー！です！',matchups:'はいです！ 対戦カードの発表です！','next-game':'次のゲームは、こっちらです！\nレッツゴー！です！','stage-entry':'さあ！ 次のステージへ出発です！',broadcast:'はいです！ 次の勝負も見逃せないです！'};
 // Keep Japanese words, particles and sentence endings together in every speech bubble.
 const segmenter=new Intl.Segmenter('ja',{granularity:'word'});
 function speech(html){
  const template=document.createElement('template');template.innerHTML=html;
  const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
   const units=[];
   for(const {segment} of segmenter.segment(node.textContent)){
    if(units.length&&(/^(?:です|ます|でした|ました|でしょ|か|は|が|を|に|の|と|も|へ|で|ね|よ|から|まで)$/.test(segment)||/^[！!？?。、，…・]+$/.test(segment)))units[units.length-1]+=segment;
    else units.push(segment);
   }
   const fragment=document.createDocumentFragment();
   units.forEach(unit=>{if(/^\s+$/.test(unit)){fragment.append(document.createTextNode(unit));return;}const span=document.createElement('span');span.className='mob-speech-unit';span.textContent=unit;fragment.append(span,document.createElement('wbr'));});node.replaceWith(fragment);
  }
  return template.innerHTML;
 }
 function markup(kind,detail=''){const line=lines[kind]||lines.broadcast;return `<aside class="mob-commentary" aria-label="モブホワイトの実況"><div class="mob-commentator"><img src="assets/commentary/mob-white.png" alt="実況 モブホワイト"><b>モブホワイト<small>LIVE / 実況</small></b></div><div class="mob-speech"><strong>${speech(line.replaceAll('\n','<br>'))}</strong>${detail?`<div class="mob-speech-detail">${speech(detail)}</div>`:''}</div></aside>`;}
 function fireworks(){return `<div class="mob-fireworks" aria-hidden="true">${Array.from({length:3},(_,j)=>`<div class="mob-firework" style="--burst:${j}"><b>MOB</b>${Array.from({length:12},(_,i)=>`<i style="--ray:${i}"></i>`).join('')}</div>`).join('')}</div>`;}
 window.MobCommentary={markup,fireworks};
})();
