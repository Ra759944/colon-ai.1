import { NextRequest, NextResponse } from "next/server";

type SourceMatch = { date:string; time?:string; round?:string; team1:string; team2:string; score?:{ht?:number[];ft?:number[]}|number[] };
const LEAGUES:Record<string,string>={"en.1":"Premier League (Angleterre)","en.2":"EFL Championship (Angleterre)","de.1":"Bundesliga (Allemagne)","es.1":"LaLiga (Espagne)","fr.1":"Ligue 1 (France)","it.1":"Serie A (Italie)"};
function seasonFor(date:string){const [y,m]=date.split("-").map(Number);return m>=7?String(y)+"-"+String(y+1).slice(-2):String(y-1)+"-"+String(y).slice(-2);}
export async function GET(request:NextRequest){
 const date=request.nextUrl.searchParams.get("date");const league=request.nextUrl.searchParams.get("league")??"en.1";const seasonParam=request.nextUrl.searchParams.get("season");
 if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))return NextResponse.json({error:"INVALID_DATE",message:"Date attendue : AAAA-MM-JJ."},{status:400});
 if(!Object.hasOwn(LEAGUES,league))return NextResponse.json({error:"UNSUPPORTED_LEAGUE",supportedLeagues:Object.keys(LEAGUES)},{status:400});
 const reference=date??new Date().toISOString().slice(0,10);const season=seasonParam??seasonFor(reference);
 if(!/^\d{4}-\d{2}$/.test(season))return NextResponse.json({error:"INVALID_SEASON"},{status:400});
 const sourceUrl="https://raw.githubusercontent.com/openfootball/football.json/master/"+season+"/"+league+".json";
 try{
  const response=await fetch(sourceUrl,{next:{revalidate:3600}});
  if(!response.ok)return NextResponse.json({error:"DATASET_NOT_AVAILABLE",message:"Championnat ou saison indisponible dans la source gratuite.",source:"openfootball/football.json",competition:LEAGUES[league],season},{status:404});
  const dataset=await response.json() as {name?:string;matches?:SourceMatch[]};
  const matches=(dataset.matches??[]).filter(m=>!date||m.date===date).map(m=>{
   const score=Array.isArray(m.score)?m.score:m.score?.ft;const ht=!Array.isArray(m.score)?m.score?.ht:undefined;const finished=Array.isArray(score)&&score.length>=2;
   return {id:[league,season,m.date,m.team1,m.team2].join(":"),date:m.date,time:m.time??null,round:m.round??null,competition:dataset.name??LEAGUES[league],homeTeam:m.team1,awayTeam:m.team2,status:finished?"finished":"scheduled",goals:finished?{home:score[0],away:score[1]}:null,halftime:ht?.length===2?{home:ht[0],away:ht[1]}:null,statistics:null};
  });
  return NextResponse.json({provider:"OpenFootball",sourceUrl,license:"Public domain",season,league,competition:dataset.name??LEAGUES[league],date:date??null,count:matches.length,liveScores:false,statisticsAvailable:false,matches,notice:"Calendrier et résultats communautaires. Pas de scores en direct, de cotes, de compositions ni de statistiques détaillées dans cette source.",fetchedAt:new Date().toISOString()},{headers:{"Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"}});
 }catch{return NextResponse.json({error:"DATA_SOURCE_UNAVAILABLE",message:"Source OpenFootball temporairement inaccessible."},{status:502});}
}