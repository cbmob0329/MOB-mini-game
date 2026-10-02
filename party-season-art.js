/* Canvas scenery and feedback for the seasonal rounds; no external image downloads. */
(function(root){
  'use strict';
  function create(ctx,actor,crop){
    const C=ctx,TAU=Math.PI*2;
    function round(x,y,w,h,r,fill,stroke){C.beginPath();C.roundRect(x,y,w,h,r);if(fill){C.fillStyle=fill;C.fill();}if(stroke){C.strokeStyle=stroke;C.lineWidth=2;C.stroke();}}
    function line(x,y,x2,y2,color,width=2){C.strokeStyle=color;C.lineWidth=width;C.beginPath();C.moveTo(x,y);C.lineTo(x2,y2);C.stroke();}
    function circle(x,y,r,color){C.fillStyle=color;C.beginPath();C.arc(x,y,r,0,TAU);C.fill();}
    function text(value,x,y,size=14,color='#fff',align='center'){C.font=`900 ${size}px system-ui`;C.textAlign=align;C.fillStyle=color;C.fillText(value,x,y);}
    function gradient(w,h,top,bottom){const g=C.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bottom);C.fillStyle=g;C.fillRect(0,0,w,h);}
    function mob(x,y,size,angle=0){C.save();C.translate(x,y);C.rotate(angle);C.shadowColor='#061e3b55';C.shadowBlur=4;C.shadowOffsetY=3;if(actor.complete&&actor.naturalWidth){const b=crop();const scale=size/Math.max(b.w,b.h),dw=b.w*scale,dh=b.h*scale;C.drawImage(actor,b.x,b.y,b.w,b.h,-dw/2,-dh,dw,dh);}else{round(-size*.3,-size*.75,size*.6,size*.7,9,'#ffe060','#614c14');}C.restore();}
    function banana(x,y,size,angle=0){C.save();C.translate(x,y);C.rotate(angle);C.scale(size/24,size/24);C.beginPath();C.moveTo(-10,-9);C.bezierCurveTo(-6,3,5,8,12,-6);C.bezierCurveTo(9,14,-12,12,-10,-9);C.fillStyle='#ffe454';C.fill();C.lineWidth=1.7;C.strokeStyle='#a77113';C.stroke();line(-9,-8,-10,-12,'#654b21',3);line(11,-6,13,-9,'#654b21',3);C.restore();}
    function palm(x,y,size){C.save();C.translate(x,y);C.strokeStyle='#325a43';C.lineWidth=5;C.beginPath();C.moveTo(0,0);C.quadraticCurveTo(8,-size*.5,0,-size);C.stroke();for(let i=-2;i<=2;i++){C.fillStyle=i%2?'#217f68':'#329979';C.beginPath();C.moveTo(0,-size);C.quadraticCurveTo(i*size*.28,-size*1.3,i*size*.34,-size*.73);C.quadraticCurveTo(i*size*.14,-size*.87,0,-size);C.fill();}C.restore();}
    function ocean(s){const {w,h,time,boat,velocity,bananas,seaY,catchY,breeze}=s;gradient(w,h,'#ffe4a8','#86d6e3');circle(w*.77,h*.18,24,'#fff5ca');circle(w*.77,h*.18,32,'#fff3c533');
      C.fillStyle='#387b86';C.beginPath();C.moveTo(0,h*.40);C.quadraticCurveTo(w*.18,h*.21,w*.35,h*.42);C.lineTo(0,h*.46);C.fill();C.fillStyle='#eacf98';C.beginPath();C.ellipse(w*.03,h*.44,w*.27,h*.045,0,0,TAU);C.fill();palm(w*.13,h*.41,h*.20);palm(w*.02,h*.42,h*.15);
      const water=C.createLinearGradient(0,h*.4,0,h);water.addColorStop(0,'#43bfcd');water.addColorStop(.45,'#128eaf');water.addColorStop(1,'#07556e');C.fillStyle=water;C.fillRect(0,h*.44,w,h*.56);
      for(let n=0;n<9;n++){C.strokeStyle=n%3===0?'#b0f3e777':'#63d7d84d';C.lineWidth=1+n/7;C.beginPath();for(let x=0;x<=w;x+=7){const y=h*(.46+n*.061)+Math.sin(x/34-time*(1.3+n*.1)+n)*3.5;x?C.lineTo(x,y):C.moveTo(x,y);}C.stroke();}
      for(let n=0;n<5;n++){C.strokeStyle='#d5ffff55';C.lineWidth=2;C.beginPath();C.ellipse(boat*w-velocity*n*5,seaY+n*6,23+n*7,4+n*1.7,0,.1,Math.PI-.1);C.stroke();}
      // Tow rope, inflated banana hull, seat and handles.
      C.save();C.translate(boat*w,seaY);C.rotate(velocity*.065+Math.sin(time*3)*.035);line(-w*.11,0,-w*.20,9,'#e8dfbc',1);C.shadowColor='#00394b88';C.shadowBlur=6;C.shadowOffsetY=6;C.beginPath();C.moveTo(-w*.12,-12);C.bezierCurveTo(-w*.08,21,w*.13,20,w*.13,-18);C.quadraticCurveTo(w*.06,-1,-w*.12,-12);C.fillStyle='#ffc72e';C.fill();C.shadowBlur=0;C.shadowOffsetY=0;C.lineWidth=2;C.strokeStyle='#9b6313';C.stroke();line(-w*.07,4,w*.065,6,'#fff29b',3);round(-16,-8,32,9,4,'#087491');for(const x of [-15,15]){C.beginPath();C.arc(x,-7,5,Math.PI,0);C.strokeStyle='#273c3a';C.stroke();}mob(0,-8,Math.min(45,w*.135),velocity*.07);C.restore();
      C.setLineDash([3,4]);C.strokeStyle='#fff5b488';C.lineWidth=1;C.beginPath();C.ellipse(boat*w,catchY,w*.14,4,0,0,TAU);C.stroke();C.setLineDash([]);
      for(const b of bananas){if(!b.dead){line(b.x*w-b.vx*20,b.y*h-21,b.x*w,b.y*h-9,'#fff8d955',2);banana(b.x*w,b.y*h,24,Math.sin(time*6+b.id)*.3);}}
      round(w-93,10,82,26,13,'#063b5799');text(breeze===0?'風 おだやか':breeze>0?'風 → →':'風 ← ←',w-52,28,11,'#fff8d8');
    }
    function wall(s){const {w,h,time,level,phase,gauge,power,runner,pose,surface,result}=s,ground=h*.85,top=surface(1).y*h;
      gradient(w,h,'#0b2144','#417499');
      for(const x of [w*.08,w*.92]){C.fillStyle='#ccecff0d';C.beginPath();C.moveTo(x,15);C.lineTo(x-w*.25,ground);C.lineTo(x+w*.30,ground);C.fill();line(x,0,x,h*.5,'#bdd3df44',2);round(x-17,5,34,8,3,'#e6f5ff');}
      for(let row=0;row<3;row++){round(0,h*(.46+row*.075),w,h*.035,0,row%2?'#1d354e':'#294968');for(let n=0;n<25;n++)circle(n*w/24+(row%2)*5,h*(.47+row*.075),2.2,['#729cba','#efac89','#a3bcd0'][n%3]);}
      C.fillStyle='#253848';C.fillRect(0,ground,w,h-ground);for(let n=0;n<4;n++)line(0,ground+8+n*10,w,ground+8+n*10,'#7199ae44',1);
      for(let x=-40;x<w*.56;x+=36){const offset=phase==='run'?(time*90)%36:0;line(x-offset,ground+6,x+14-offset,ground+6,'#bde9ec',2);}
      const shell=C.createLinearGradient(w*.52,0,w,0);shell.addColorStop(0,'#308399');shell.addColorStop(.45,'#1c647b');shell.addColorStop(1,'#123b53');
      C.beginPath();for(let i=0;i<=50;i++){const p=surface(i/50);i?C.lineTo(p.x*w,p.y*h):C.moveTo(p.x*w,p.y*h);}C.lineTo(w,top);C.lineTo(w,ground);C.closePath();C.fillStyle=shell;C.fill();
      for(let i=0;i<=10;i++){const p=surface(i/10);line(p.x*w+2,p.y*h,w,p.y*h,'#95cad42b',1);}
      C.beginPath();for(let i=0;i<=50;i++){const p=surface(i/50);i?C.lineTo(p.x*w,p.y*h):C.moveTo(p.x*w,p.y*h);}C.strokeStyle='#96d5dd';C.lineWidth=4;C.stroke();
      round(w*.84,top-5,w*.16,10,3,'#f6e2b0');text(String(level+1).padStart(2,'0'),w*.93,top+36,23,'#91bac8');
      for(let n=0;n<4;n++)round(w*.84+n*w*.035,top-18,7,5,2,n<=level?'#ffb14d':'#284f65');
      const mark=.49*w;C.shadowBlur=12;C.shadowColor='#ff8e3a';line(mark,ground-8,mark,ground+18,'#ff9c47',6);C.shadowBlur=0;text('踏切',mark,ground+34,10,'#ffe2bf');
      const bx=w*.065,by=12,bw=w*.87;round(bx,by,bw,74,12,'#07192fe8','#7897ac');text(phase==='gauge'?'DASH POWER':'POWER LOCKED',bx+12,by+17,10,'#b2d0df','left');text(phase==='gauge'?`STAGE ${level+1}`:Math.round(power*100)+'%',bx+bw-12,by+17,12,'#ffdd82','right');
      const gx=bx+13,gy=by+31,gw=bw-26;round(gx,gy,gw,19,5,'#284860');round(gx+gw*.42,gy,gw*.16,19,0,'#347d86');line(gx+gw*.5,gy-5,gx+gw*.5,gy+24,'#fff',3);
      const marker=gx+gauge*gw;C.fillStyle='#ffbe49';C.beginPath();C.moveTo(marker,gy+3);C.lineTo(marker-6,gy-6);C.lineTo(marker+6,gy-6);C.fill();line(marker,gy,marker,gy+20,'#ffc452',3);text(phase==='gauge'?'白い線で止める':'押した瞬間の位置で確定',w*.5,by+66,10,'#c9e0ec');
      if(phase==='run'){for(let i=1;i<5;i++)line((runner-.045-i*.02)*w,ground-13-i*3,(runner-.02-i*.02)*w,ground-13-i*3,'#bfeaff66',2);}
      C.save();
      if(phase==='climb'){
        // Clip against the actual solid wall: hands/feet touch its skin, never show through it.
        C.beginPath();C.moveTo(0,0);C.lineTo(w,0);C.lineTo(w,top);for(let i=50;i>=0;i--){const p=surface(i/50);C.lineTo(p.x*w,p.y*h);}C.lineTo(0,ground);C.closePath();C.clip();
      }
      mob(pose.x*w,pose.y*h,Math.min(w*.12,43),pose.angle||0);C.restore();
      if(phase==='climb'&&result&&!result.clear&&pose.height>0){circle((pose.x+.045)*w,(pose.y-.045)*h,2,'#ffca6e');}
    }
    function gift(g,x,y,scale=1){const colors=[['#b63052','#ef6579'],['#2563a2','#60a6d0'],['#247766','#63b29b']],size=[37,29,23][g.type]*scale;
      C.save();C.translate(x,y);C.rotate(g.angle||0);C.fillStyle='#183d522b';C.beginPath();C.ellipse(3,size*.5,size*.6,4,0,0,TAU);C.fill();round(-size/2,-size/2,size,size,3,colors[g.type][0],'#ffffff99');C.fillStyle=colors[g.type][1];C.fillRect(-size/2+2,-size/2+2,size-4,6);C.fillStyle='#ffe6a5';C.fillRect(-3,-size/2,6,size);C.fillRect(-size/2,-2,size,4);C.strokeStyle='#ffe6a5';C.lineWidth=2;for(const side of [-1,1]){C.beginPath();C.ellipse(side*4,-size/2,5,3,side*.4,0,TAU);C.stroke();}C.restore();}
    function deer(x,y,scale){C.save();C.translate(x,y);C.scale(scale,scale);C.fillStyle='#a86f3e';C.beginPath();C.ellipse(0,0,12,7,0,0,TAU);C.fill();line(7,-3,11,-13,'#a86f3e',6);circle(12,-15,6,'#c5905b');circle(16,-16,1.5,'#271f26');for(const sx of [-8,6]){line(sx,4,sx-2,16,'#795130',3);line(sx+3,4,sx+6,14,'#a16b3b',2);}for(const sx of [8,14]){line(sx,-19,sx-3,-28,'#684630',2);line(sx-2,-24,sx-6,-24,'#684630',2);}line(-7,-5,7,-4,'#c93845',3);C.restore();}
    function snow(s){const {w,h,time,presents,selected,px,py,mode,buffer,delivered,score}=s;gradient(w,h,'#183e62','#87b6c1');
      C.fillStyle='#203b56';for(let n=0;n<8;n++){const x=n*w/7;C.beginPath();C.moveTo(x-22,h*.22);C.lineTo(x,h*.015);C.lineTo(x+25,h*.22);C.fill();}
      C.fillStyle='#e0edef';C.beginPath();C.moveTo(0,h*.24);C.quadraticCurveTo(w*.55,h*.16,w,h*.24);C.lineTo(w,h);C.lineTo(0,h);C.fill();
      for(let i=0;i<6;i++){C.strokeStyle='#bed8dc';C.lineWidth=1;C.beginPath();C.ellipse(w*(.15+(i%3)*.34),h*(.38+Math.floor(i/3)*.43),w*.12,h*.025,-.15,0,TAU);C.stroke();}
      // Lantern-lit sleigh with curled runners and two harnessed reindeer.
      C.shadowColor='#ffcf6488';C.shadowBlur=12;circle(w*.16,h*.13,5,'#ffe09a');C.shadowBlur=0;line(w*.16,h*.15,w*.16,h*.24,'#415668',2);
      const sx=w*.49,sy=h*.15;line(sx+w*.13,sy+2,w*.72,sy-3,'#c7aa70',1);deer(w*.76,h*.14,.75);deer(w*.89,h*.14,.66);
      C.save();C.translate(sx,sy);C.strokeStyle='#d9ad60';C.lineWidth=3;C.beginPath();C.moveTo(-w*.15,10);C.quadraticCurveTo(-w*.17,20,-w*.1,20);C.lineTo(w*.13,20);C.quadraticCurveTo(w*.18,20,w*.17,10);C.stroke();round(-w*.14,-15,w*.28,27,6,'#8a2845','#eab276');round(-w*.15,-24,9,34,3,'#b84459');round(w*.12,-16,7,26,3,'#b84459');for(let i=0;i<Math.min(delivered,5);i++)gift({type:i%3,angle:(i-2)*.08},(i-2)*10,-17-(i%2)*8,.45);C.restore();
      if(selected&&mode!=='choose'&&mode!=='unload'){C.setLineDash([4,5]);line(px*w,py*h,w*.49,h*.24,'#a48253aa',2);C.setLineDash([]);}
      for(const g of presents){if(!g.available)continue;if(g===selected){C.strokeStyle='#c58426';C.lineWidth=2;C.beginPath();C.ellipse(g.x*w,g.y*h+8,25,11,0,0,TAU);C.stroke();}gift(g,g.x*w,g.y*h);round(g.x*w-14,g.y*h+24,28,16,8,'#ffffffdb');text([25,12,7][g.type]+'',g.x*w,g.y*h+36,11,'#34485c');}
      // Footprints sit behind the carrier instead of covering the gifts.
      for(let i=1;i<4;i++)circle(px*w+(i%2?3:-3),py*h+i*7,1.5,'#7a9da855');
      mob(px*w,py*h,Math.min(w*.13,43),mode==='carry'?Math.sin(time*14)*.04:0);if(mode==='carry'){gift({...selected,angle:Math.sin(time*14)*.04},px*w+11,py*h-20,.72);round(px*w-19,py*h+5,38,5,3,'#9eb9c4');round(px*w-19,py*h+5,38*clamp(buffer/.24),5,3,'#c18a39');}
      for(let i=0;i<32;i++)circle((i*67+time*9)%w,(i*37+time*(10+i%3))%h,i%4===0?1.7:1,'#ffffff9c');
    }
    const clamp=v=>Math.max(0,Math.min(1,v));
    function effects(s){for(const p of s.particles){const life=clamp(p.life/p.max);C.globalAlpha=life;if(p.text){text(p.text,p.x*s.w,p.y*s.h,17,p.color);}else{circle(p.x*s.w,p.y*s.h,p.size*life,p.color);}}C.globalAlpha=1;if(s.ended){round(s.w*.12,s.h*.39,s.w*.76,64,13,'#071d36eb','#f0cc86');text(s.endTitle,s.w/2,s.h*.39+25,19,'#ffdc8b');text(s.score+' pt',s.w/2,s.h*.39+50,23,'#fff');}}
    return {ocean,wall,snow,effects};
  }
  root.MobSeasonArt={create};
})(window);
