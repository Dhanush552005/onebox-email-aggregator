const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL });
const INDEX = process.env.ES_INDEX;

async function ensureIndex(){
  const exists = await client.indices.exists({ index: INDEX });
  if(!exists){
    await client.indices.create({index:INDEX,body:{mappings:{properties:{
      account:{type:'keyword'}, folder:{type:'keyword'}, subject:{type:'text'},
      from:{type:'text'}, to:{type:'text'}, date:{type:'date'}, text:{type:'text'},
      category:{type:'keyword'}
    }}}});
  }
}

async function indexEmail(doc){
  await ensureIndex();
  const id = doc.id || `${doc.account}-${doc.messageId||doc.uid}`;
  await client.index({index:INDEX,id,body:doc,refresh:'wait_for'});
  return id;
}

async function searchEmails(q,account,folder,page,size){
  const must=[];
  if(q) must.push({multi_match:{query:q,fields:['subject^3','from','to','text']}});
  if(account) must.push({term:{account}});
  if(folder) must.push({term:{folder}});
  const body={query:must.length?{bool:{must}}:{match_all:{}},from:(page-1)*size,size};
  const r=await client.search({index:INDEX,body});
  return r.hits.hits.map(h=>({id:h._id,...h._source}));
}

async function getEmailById(id){
  const r=await client.get({index:INDEX,id});
  return r._source;
}

async function updateEmailLabel(id,label){
  await client.update({index:INDEX,id,body:{doc:{category:label}},refresh:'wait_for'});
}

module.exports={ensureIndex,indexEmail,searchEmails,getEmailById,updateEmailLabel};
