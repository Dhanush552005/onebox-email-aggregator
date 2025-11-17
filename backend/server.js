require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const es = require('./elasticsearch');
const { startImapSync } = require('./imap');

const app = express();
app.use(bodyParser.json());

app.get('/health', (req,res)=>res.json({ok:true}));

app.get('/emails', async (req,res)=>{
  try{
    const {q='',account='',folder='',page='1',size='20'} = req.query;
    const data = await es.searchEmails(q,account,folder,Number(page),Number(size));
    res.json(data);
  }catch(e){ res.status(500).json({error:'search failed'}); }
});

app.get('/emails/:id', async (req,res)=>{
  try{
    const d=await es.getEmailById(req.params.id);
    res.json(d);
  }catch(e){res.status(404).json({error:'not found'});}
});

app.post('/emails/:id/label', async (req,res)=>{
  try{
    await es.updateEmailLabel(req.params.id, req.body.label);
    res.json({ok:true});
  }catch(e){res.status(500).json({error:'update failed'});}
});

const port=process.env.PORT||3000;
app.listen(port, async ()=>{
  console.log("Server on",port);
  await es.ensureIndex();
  startImapSync();
});
