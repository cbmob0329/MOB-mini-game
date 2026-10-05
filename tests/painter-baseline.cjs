// Scoring before the 2026-10-06 mild accuracy adjustment.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function painterTraceScore(points,targetPath){
  if(points.length<16)return 0;

  const samples=[];
  const total=targetPath.getTotalLength();
  const sampleCount=150;

  for(let i=0;i<sampleCount;i++){
    const pt=targetPath.getPointAtLength(total*i/(sampleCount-1));
    samples.push({x:pt.x,y:pt.y});
  }

  let distSum=0;

  for(const p of points){
    let best=9999;
    for(const t of samples){
      const d=Math.hypot(p.x-t.x,p.y-t.y);
      if(d<best)best=d;
    }
    distSum+=best;
  }

  const avgDist=distSum/points.length;
  const accuracy=clamp(100-avgDist*5.0,0,100);

  let covered=0;
  for(const t of samples){
    let best=9999;
    for(const p of points){
      const d=Math.hypot(p.x-t.x,p.y-t.y);
      if(d<best)best=d;
    }
    if(best<=13.5)covered++;
  }
  const coverage=covered/sampleCount*100;

  let strokeLen=0;
  for(let i=1;i<points.length;i++){
    strokeLen+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);
  }
  const lengthScore=clamp(100-Math.abs(strokeLen-total)/total*100,0,100);

  const closeDist=Math.hypot(
    points[0].x-points[points.length-1].x,
    points[0].y-points[points.length-1].y
  );
  const closure=clamp(100-closeDist/75*100,0,100);

  return clamp(
    accuracy*.50+
    coverage*.32+
    lengthScore*.10+
    closure*.08,
    0,100
  );
}


module.exports=painterTraceScore;
