'use strict';
// Shared calculations. No generated inventory and no implied legal rules.
window.DFM=(()=>{
 const heritage=['Unbekannt','Kein Merkmal erfasst','Denkmal','Ehrengrab','Kriegsgrab'];
 function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 function isDate(s){if(s==='')return true;if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const t=Date.parse(s+'T00:00:00Z');return Number.isFinite(t)&&new Date(t).toISOString().slice(0,10)===s;}
 function days(s,now=today()){if(!s||!isDate(s)||!isDate(now))return null;return Math.round((Date.parse(s+'T00:00:00Z')-Date.parse(now+'T00:00:00Z'))/86400000);}
 function deadline(g,now=today()){if(g.status==='Aufgelöst')return 'inactive';const d=days(g.end,now);return d===null?'unknown':d<0?'expired':d<=90?'soon':'later';}
 function summary(graves,tasks=[],now=today()){
 const counts=Object.fromEntries(['Unbekannt','Frei','Belegt','Reserviert','Aufgelöst'].map(k=>[k,graves.filter(g=>g.status===k).length]));
 const known=counts.Frei+counts.Belegt+counts.Reserviert;
 return {total:graves.length,counts,known,occupancy:known?Math.round(counts.Belegt/known*100):null,expired:graves.filter(g=>deadline(g,now)==='expired').length,soon:graves.filter(g=>deadline(g,now)==='soon').length,unknownDates:graves.filter(g=>deadline(g,now)==='unknown').length,heritage:graves.filter(g=>['Denkmal','Ehrengrab','Kriegsgrab'].includes(g.heritage)).length,open:tasks.filter(t=>!t.done).length,overdue:tasks.filter(t=>!t.done&&days(t.due,now)!==null&&days(t.due,now)<0).length};}
 function validExtensions(s){return s.graves.every(g=>isDate(g.end)&&['birth','death','burial'].every(k=>g[k]===undefined||isDate(g[k]))&&(g.heritage===undefined||heritage.includes(g.heritage))&&(g.heritageSource===undefined||typeof g.heritageSource==='string')&&(!g.birth||!g.death||g.birth<=g.death)&&(!g.death||!g.burial||g.death<=g.burial))&&s.tasks.every(t=>isDate(t.due)&&(t.assignee===undefined||typeof t.assignee==='string')&&(t.phase===undefined||['Offen','In Arbeit','Erledigt'].includes(t.phase)&&t.done===(t.phase==='Erledigt')));}
 function matchRecord(g,mode){return !mode||mode==='heritage'&&['Denkmal','Ehrengrab','Kriegsgrab'].includes(g.heritage)||mode===deadline(g);}
 return {today,isDate,days,deadline,summary,validExtensions,heritage,matchRecord};
})();
