(function(){
const data={
  name:"Jimmel Bermudez",
  role:"Solutions Architect & Cloud Engineer",
  company:"Sagesoft Solutions Inc.",
  location:"Quezon City, Philippines",
  email:"jimmelbermudez@gmail.com",
  linkedin:"https://www.linkedin.com/in/jimmelber/"
};

const qa=[
  {k:["hi","hello","hey","good morning","good afternoon","good evening","sup","yo"],r:`Hey there! 👋 I'm Jim's virtual assistant. How can I help you today?\n\nYou can ask me about:\n• Skills & tech stack\n• Work experience\n• Certifications\n• Services offered\n• Portfolio projects\n• Contact info`},
  {k:["who","about","introduce","tell me","info","background","highlight","summary","overview","know about"],r:`${data.name} is a ${data.role} at ${data.company}, based in ${data.location}.\n\n🔑 Highlights:\n• 5+ years in IT & cloud infrastructure\n• AWS Certified Solutions Architect & Cloud Practitioner\n• Specializes in government & enterprise cloud migrations\n• Experienced in DevOps, IaC, and container architectures\n• Handles multi-account AWS environments with Identity Center\n• Passionate about automation and Well-Architected best practices`},
  {k:["skill","tech","stack","tool","expert","know","proficien","capabil","good at","strong"],r:`🛠 Core Skills:\n• AWS — EC2, S3, RDS, Lambda, ECS, CloudFront, IAM, Organizations\n• Infrastructure as Code — CloudFormation, Terraform, CDK\n• CI/CD — CodePipeline, GitHub Actions\n• Containers — Docker, ECS Fargate\n• Scripting — Python, Bash, PHP/Laravel\n• Monitoring — CloudWatch, CloudTrail\n• Security — IAM Identity Center, WAF, GuardDuty\n• Well-Architected Framework reviews`},
  {k:["experience","work","career","job","role","position","employ","history","done","did"],r:`💼 Work Experience:\n\n🔹 Solutions Architect — Sagesoft Solutions Inc. (Current)\n• Designs cloud architecture for government & enterprise clients\n• Leads AWS migrations, modernization, and DevOps implementations\n• Manages multi-account environments with Control Tower & Identity Center\n• Conducts Well-Architected reviews and cost optimization\n\n🔹 Previous roles in web development and system administration`},
  {k:["certif","cert","badge","credential","aws cert","license","accredit","exam"],r:`🏅 Certifications:\n• AWS Certified Solutions Architect – Associate\n• AWS Certified Cloud Practitioner\n• AWS Certified AI Practitioner (Scheduled)\n\nJim continuously pursues AWS certifications and attends industry summits and workshops.`},
  {k:["service","offer","do you do","help with","provide","engage","can he","what does","deliver"],r:`🚀 Services Offered:\n• Cloud Architecture & Design\n• AWS Migration & Modernization\n• Infrastructure Automation (IaC)\n• DevOps & CI/CD Pipeline Setup\n• Cost Optimization & Well-Architected Reviews\n• AI/ML Solution Architecture\n• Container & Microservices Architecture\n• Security & Compliance Implementation`},
  {k:["contact","email","reach","hire","connect","get in touch","message","talk"],r:`📬 Let's connect!\n• Email: ${data.email}\n• LinkedIn: ${data.linkedin}\n• Location: ${data.location}\n\nFeel free to reach out for project inquiries or collaborations!`},
  {k:["portfolio","project","work sample","case stud","built","architect","design"],r:`📁 Portfolio Highlights:\n• Cloud Architecture for Government Agencies (LGU, DOF)\n• Microservices Migration to ECS Fargate (Cypher)\n• AI Chatbot Solutions for Public Sector\n• High-Availability Infrastructure Design\n• Multi-Account AWS Organization Setup\n• CI/CD Pipeline Automation\n\n👆 Check the Portfolio section above for architecture diagrams!`},
  {k:["education","school","degree","university","study","college","graduat"],r:`🎓 Education:\n• Studied in the Philippines\n• Consistent learner — attends AWS re:Invent, summits, and workshops\n• Pursues continuous professional development through certifications`},
  {k:["location","where","based","country","city","from"],r:`📍 Based in ${data.location}.\nAvailable for remote work and on-site engagements across the Philippines.`},
  {k:["age","old","birthday","born","birth"],r:`I don't have Jim's personal details like age, but I can tell you he's an experienced Solutions Architect with 5+ years in the industry! 😊\n\nWant to know about his skills or experience instead?`},
  {k:["thank","thanks","appreciate","awesome","great","cool","nice"],r:`You're welcome! 😊 Feel free to ask anything else or reach out directly at ${data.email}`},
  {k:["bye","goodbye","see you","later","take care"],r:`Goodbye! 👋 Thanks for visiting Jim's portfolio. Have a great day!`},
  {k:["aws","cloud","amazon"],r:`☁️ Jim is deeply experienced with AWS:\n• Certified Solutions Architect & Cloud Practitioner\n• Works with 15+ AWS services daily\n• Specializes in Well-Architected Framework reviews\n• Handles migrations, security, cost optimization\n• Experienced with Control Tower, Organizations, Identity Center`},
  {k:["price","cost","rate","budget","how much","pricing","fee"],r:`💰 For pricing and project inquiries, please reach out directly:\n• Email: ${data.email}\n• LinkedIn: ${data.linkedin}\n\nJim provides custom quotes based on project scope and requirements.`}
];

function fuzzy(a,b){
  if(a===b)return 1;
  if(a.length<2||b.length<2)return 0;
  let matches=0;
  for(let i=0;i<a.length-1;i++){
    const bi=a.substring(i,i+2);
    for(let j=0;j<b.length-1;j++){
      if(bi===b.substring(j,j+2)){matches++;break}
    }
  }
  return(2*matches)/(a.length+b.length-2);
}

function match(msg){
  const m=msg.toLowerCase().replace(/[?!.,]/g,'');
  const words=m.split(/\s+/);
  let best=null,bestScore=0;
  for(const q of qa){
    let score=0;
    for(const k of q.k){
      // exact substring
      if(m.includes(k)){score+=10;continue}
      // fuzzy match each word
      for(const w of words){
        const f=fuzzy(w,k);
        if(f>0.6)score+=f*5;
      }
    }
    if(score>bestScore){bestScore=score;best=q}
  }
  if(bestScore>=3)return best.r;
  return `🤔 I'm not sure about that, but I'll try to help!\n\nHere's what I can tell you about Jim:\n• "skills" — Tech stack & expertise\n• "experience" — Work history\n• "certifications" — AWS certs\n• "services" — What he offers\n• "portfolio" — Project highlights\n• "contact" — How to reach him\n• "about" — Quick overview`;
}

function createBot(){
  const css=document.createElement('style');
  css.textContent=`
  #jbot-toggle{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#e1b382,#c9a06c);color:#1a1a2e;border:none;cursor:pointer;padding:14px 24px;border-radius:50px;font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;box-shadow:0 4px 24px rgba(225,179,130,.4);transition:.3s;animation:jbot-pulse 2s infinite}
  #jbot-toggle:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(225,179,130,.5)}
  #jbot-toggle.active{border-radius:50%;padding:14px;width:52px;height:52px;justify-content:center}
  #jbot-toggle.active span{display:none}
  @keyframes jbot-pulse{0%,100%{box-shadow:0 4px 24px rgba(225,179,130,.4)}50%{box-shadow:0 4px 30px rgba(225,179,130,.7)}}
  #jbot-window{position:fixed;bottom:90px;right:24px;width:370px;max-height:520px;background:#1a1a2e;border:1px solid rgba(225,179,130,.2);border-radius:16px;z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.4);font-family:'Poppins',sans-serif}
  #jbot-window.open{display:flex;animation:jbot-slide .3s ease}
  @keyframes jbot-slide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  #jbot-header{background:linear-gradient(135deg,#1a1a2e,#16213e);padding:16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(225,179,130,.15)}
  #jbot-header .avatar{width:36px;height:36px;border-radius:50%;background:#e1b382;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#1a1a2e;flex-shrink:0}
  #jbot-header .info h4{color:#e1b382;font-size:.85rem;margin:0;font-weight:600}
  #jbot-header .info p{color:#94a3b8;font-size:.7rem;margin:2px 0 0}
  #jbot-header .dot{width:8px;height:8px;background:#22c55e;border-radius:50%;display:inline-block;margin-left:4px}
  #jbot-close{margin-left:auto;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;padding:4px 8px;border-radius:6px;transition:.2s}
  #jbot-close:hover{background:rgba(255,255,255,.05);color:#e2e8f0}
  #jbot-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;max-height:350px;scrollbar-width:thin;scrollbar-color:#2d2d5e #1a1a2e}
  #jbot-messages::-webkit-scrollbar{width:4px}
  #jbot-messages::-webkit-scrollbar-thumb{background:#2d2d5e;border-radius:4px}
  .jbot-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:.8rem;line-height:1.6;white-space:pre-line;word-wrap:break-word;animation:jbot-fade .3s ease}
  @keyframes jbot-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .jbot-bot{background:#16213e;color:#e2e8f0;align-self:flex-start;border-bottom-left-radius:4px}
  .jbot-user{background:linear-gradient(135deg,#e1b382,#c9a06c);color:#1a1a2e;align-self:flex-end;border-bottom-right-radius:4px;font-weight:500}
  .jbot-typing{align-self:flex-start;background:#16213e;padding:12px 18px;border-radius:12px;border-bottom-left-radius:4px}
  .jbot-typing span{display:inline-block;width:6px;height:6px;background:#94a3b8;border-radius:50%;margin:0 2px;animation:jbot-dot 1.4s infinite}
  .jbot-typing span:nth-child(2){animation-delay:.2s}
  .jbot-typing span:nth-child(3){animation-delay:.4s}
  @keyframes jbot-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
  #jbot-quick{display:flex;gap:6px;flex-wrap:wrap;padding:0 16px 12px}
  .jbot-chip{background:#16213e;border:1px solid rgba(225,179,130,.2);color:#e1b382;padding:6px 12px;border-radius:20px;font-size:.72rem;cursor:pointer;font-family:'Poppins',sans-serif;transition:.2s}
  .jbot-chip:hover{background:#e1b382;color:#1a1a2e}
  #jbot-input-wrap{display:flex;padding:12px;gap:8px;border-top:1px solid rgba(225,179,130,.15);background:#16213e}
  #jbot-input{flex:1;background:#1a1a2e;border:1px solid rgba(225,179,130,.2);border-radius:8px;padding:10px 12px;color:#e2e8f0;font-size:.82rem;font-family:'Poppins',sans-serif;outline:none;transition:.2s}
  #jbot-input::placeholder{color:#64748b}
  #jbot-input:focus{border-color:#e1b382}
  #jbot-send{background:linear-gradient(135deg,#e1b382,#c9a06c);border:none;border-radius:8px;padding:0 16px;cursor:pointer;color:#1a1a2e;font-weight:600;font-size:.85rem;transition:.3s;font-family:'Poppins',sans-serif}
  #jbot-send:hover{opacity:.85}
  @media(max-width:480px){#jbot-window{width:calc(100vw - 32px);right:16px;bottom:84px}#jbot-toggle span{display:none}#jbot-toggle{border-radius:50%;padding:14px;width:52px;height:52px;justify-content:center}}
  `;
  document.head.appendChild(css);

  const div=document.createElement('div');
  div.innerHTML=`
  <button id="jbot-toggle">💬 <span>Chat with Jim's AI</span></button>
  <div id="jbot-window">
    <div id="jbot-header">
      <div class="avatar">JB</div>
      <div class="info"><h4>Jim's Assistant <span class="dot"></span></h4><p>Online — Ask me anything</p></div>
      <button id="jbot-close">✕</button>
    </div>
    <div id="jbot-messages"></div>
    <div id="jbot-quick"></div>
    <div id="jbot-input-wrap">
      <input id="jbot-input" placeholder="Type a message..." autocomplete="off"/>
      <button id="jbot-send">Send</button>
    </div>
  </div>`;
  document.body.appendChild(div);

  const toggle=document.getElementById('jbot-toggle');
  const win=document.getElementById('jbot-window');
  const close=document.getElementById('jbot-close');
  const msgs=document.getElementById('jbot-messages');
  const input=document.getElementById('jbot-input');
  const send=document.getElementById('jbot-send');
  const quick=document.getElementById('jbot-quick');

  const chips=['Skills','Experience','Services','Certifications','Portfolio','Contact'];

  function addMsg(text,type){
    const d=document.createElement('div');
    d.className=`jbot-msg jbot-${type}`;
    d.textContent=text;
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function showTyping(){
    const d=document.createElement('div');
    d.className='jbot-typing';
    d.id='jbot-typing';
    d.innerHTML='<span></span><span></span><span></span>';
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function hideTyping(){const t=document.getElementById('jbot-typing');if(t)t.remove()}

  function showChips(){
    quick.innerHTML='';
    chips.forEach(c=>{
      const b=document.createElement('button');
      b.className='jbot-chip';
      b.textContent=c;
      b.onclick=()=>handleSend(c);
      quick.appendChild(b);
    });
  }

  function handleSend(text){
    const v=text||input.value.trim();
    if(!v)return;
    addMsg(v,'user');
    input.value='';
    showTyping();
    const delay=300+Math.random()*400;
    setTimeout(()=>{hideTyping();addMsg(match(v),'bot');showChips()},delay);
  }

  toggle.onclick=()=>{
    win.classList.toggle('open');
    toggle.classList.toggle('active');
    if(win.classList.contains('open')&&!msgs.children.length){
      addMsg("Hi! 👋 I'm Jim's virtual assistant. How can I help you today?\n\nTap a topic below or type your question!",'bot');
      showChips();
    }
    input.focus();
  };
  close.onclick=()=>{win.classList.remove('open');toggle.classList.remove('active')};
  send.onclick=()=>handleSend();
  input.onkeydown=e=>{if(e.key==='Enter')handleSend()};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',createBot);
else createBot();
})();
