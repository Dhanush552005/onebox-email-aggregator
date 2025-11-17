require('dotenv').config();
const { ImapFlow } = require('imapflow');
const simpleParser = require('./lib/simpleParser');
const es = require('./elasticsearch');
const { categorizeEmail } = require('./ai');
const { notifySlack, triggerWebhook } = require('./notifiers');

const accounts = JSON.parse(process.env.IMAP_ACCOUNTS_JSON||'[]');

async function startImapSync(){
  for(const acct of accounts){
    startForAccount(acct).catch(e=>console.error(e));
  }
}

async function startForAccount(acct){
  const client = new ImapFlow({host:acct.host,port:acct.port,secure:acct.secure,auth:acct.auth});
  await client.connect();
  console.log("IMAP connected:",acct.id);
  await client.mailboxOpen("INBOX");

  const since=new Date(); since.setDate(since.getDate()-30);
  const uids=await client.search({since});
  for(const uid of uids){
    const msg=await client.fetchOne(uid,{source:true,uid:true});
    const parsed = simpleParser(msg.source);
    await handle(parsed,acct.id,msg.uid,'INBOX');
  }

  client.on("exists", async ()=>{
    const latest=await client.fetchOne('last',{source:true,uid:true});
    if(latest){
      const parsed = simpleParser(latest.source);
      await handle(parsed,acct.id,latest.uid,'INBOX');
    }
  });
}

async function handle(parsed,accountId,uid,folder){
  const doc={
    account:accountId, folder, uid,
    messageId:parsed.messageId, subject:parsed.subject||'',
    from:parsed.from?.text||'', to:parsed.to?.text||'',
    date:parsed.date, text:parsed.text||parsed.html||''
  };
  const id=await es.indexEmail(doc);
  const category = await categorizeEmail(doc.subject+"\n"+doc.text);
  await es.indexEmail({...doc,id,category});
  if(category==="Interested"){
    await notifySlack(doc);
    await triggerWebhook(doc);
  }
}

module.exports={startImapSync};
