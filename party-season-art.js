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
      C.setLineDash([3,4]);C.strokeStyle='#fff5b488';C.lineWidth=1;C.beginPath();C.ellipse(boat*w,catchY,w*.15,4,0,0,TAU);C.stroke();C.setLineDash([]);
      for(const b of bananas){if(!b.dead){line(b.x*w-b.vx*20,b.y*h-21,b.x*w,b.y*h-9,'#fff8d955',2);banana(b.x*w,b.y*h,24,Math.sin(time*6+b.id)*.3);}}
      round(w-93,10,82,26,13,'#063b5799');text(breeze===0?'風 おだやか':breeze>0?'風 → →':'風 ← ←',w-52,28,11,'#fff8d8');
    }
    function wall(s){const {w,h,time,level,phase,pose,camera,clears,surface,riseAt}=s;
      gradient(w,h,'#091c37','#497e98');
      circle(w*.78,h*.15,24,'#f6dda2');
      for(let row=0;row<3;row++){round(0,h*(.42+row*.08),w,h*.036,0,row%2?'#1d354e':'#294968');for(let n=0;n<25;n++)circle(n*w/24,h*(.43+row*.08),2,['#729cba','#efac89','#a3bcd0'][n%3]);}
      for(const x of [w*.08,w*.94]){line(x,0,x,h,'#9fc2d922',2);C.fillStyle='#b3dcf00a';C.beginPath();C.moveTo(x,0);C.lineTo(x-w*.32,h);C.lineTo(x+w*.35,h);C.fill();}
      const X=x=>(x-camera.x)*w,Y=y=>(y-camera.y)*h;
      const path=()=>{C.beginPath();C.moveTo(X(-1),Y(.85));for(let n=0;n<6;n++){C.lineTo(X(n+.57),Y(.85-riseAt(n)));for(let i=1;i<=50;i++){const p=surface(i/50,n);C.lineTo(X(n+p.x),Y(p.y-riseAt(n)));}}C.lineTo(X(7),Y(.85-riseAt(6)));};
      path();C.lineTo(X(7),h*10);C.lineTo(X(-1),h*10);C.closePath();const shell=C.createLinearGradient(0,0,w,h);shell.addColorStop(0,'#3f91a1');shell.addColorStop(1,'#123a50');C.fillStyle=shell;C.fill();
      path();C.strokeStyle='#a9dce2';C.lineWidth=4;C.stroke();
      for(let n=Math.max(0,level-1);n<Math.min(6,level+2);n++){
        const base=.85-riseAt(n),top=surface(1,n).y-riseAt(n);
        for(let j=1;j<=8;j++){const p=surface(j/8,n);line(X(n+p.x)+2,Y(p.y-riseAt(n)),X(n+1.56),Y(p.y-riseAt(n)),'#a0d8df24',1);}
        round(X(n+.85),Y(top)-4,w*.18,8,3,n<clears?'#92e9b3':'#f6d395');
        text((n+1)*5+'m',X(n+.98),Y(top)+28,20,'#e8f4f7');
        const mark=X(n+.49),ground=Y(base);C.fillStyle='#ff9b382b';C.fillRect(X(n+.40),ground-5,w*.18,20);C.shadowBlur=10;C.shadowColor='#ff8e3a';line(mark,ground-8,mark,ground+18,'#ffad52',5);C.shadowBlur=0;text('TAP',mark,ground+33,10,'#ffe5bb');
        for(let j=0;j<5;j++)line(X(n+.1+j*.075),ground+6,X(n+.125+j*.075),ground+6,'#bde9ec66',2);
      }
      C.save();path();C.lineTo(X(7),-h*10);C.lineTo(X(-1),-h*10);C.closePath();C.clip();
      if(phase==='run'||phase==='climb'){for(let i=1;i<4;i++)line(X(pose.x)-i*8-6,Y(pose.y)-i*5-8,X(pose.x)-i*8,Y(pose.y)-i*5-8,'#c6effa77',2);}
      mob(X(pose.x),Y(pose.y),Math.min(w*.12,43),pose.angle||0);C.restore();
      round(10,10,w-20,39,11,'#07192fea','#607f94');
      for(let n=0;n<6;n++){const x=10+(n+.5)*(w-20)/6;text((n+1)*5+'m',x,29,11,n<clears?'#a9f4c4':n===level?'#ffe2a0':'#c0d0df');round(x-13,36,26,3,1,n<clears?'#7fdda3':n===level?'#ffb34e':'#486178');}
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
