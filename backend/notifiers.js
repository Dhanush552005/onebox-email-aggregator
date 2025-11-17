async function notifySlack(email){
  const url=process.env.SLACK_WEBHOOK_URL;
  if(!url) return;
  await fetch(url,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({text:`Interested Lead: ${email.subject}`})
  });
}

async function triggerWebhook(email){
  const url=process.env.INTERESTED_WEBHOOK_URL;
  if(!url) return;
  await fetch(url,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({event:"interested_email",email})
  });
}

module.exports={notifySlack,triggerWebhook};
