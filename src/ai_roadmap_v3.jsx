import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.rm{font-family:'Geist',system-ui,sans-serif;background:#f8f8f8;min-height:100vh;padding:1.5rem 1rem;color:#111}
.mw{max-width:860px;margin:0 auto}
.rm h1{font-size:22px;font-weight:700;color:#0a0a0a;margin-bottom:4px;letter-spacing:-0.02em}
.sub{font-size:12px;color:#999;margin-bottom:1.5rem;font-family:'Geist Mono',monospace}
.tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:1.5rem}
.tab{padding:6px 13px;border-radius:6px;border:1px solid #e0e0e0;font-size:12px;font-weight:500;cursor:pointer;background:#fff;color:#888;transition:all 0.12s;white-space:nowrap;font-family:'Geist',sans-serif}
.tab:hover{border-color:#ccc;color:#444}
.lbl{font-family:'Geist Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:#bbb;margin:1.25rem 0 .55rem}
.ib{background:#fff;border-radius:10px;padding:.875rem 1rem;margin-bottom:1.25rem;border:1px solid #e8e8e8;font-size:13px;color:#555;line-height:1.65}
.sc{background:#fff;border:1px solid #e8e8e8;border-radius:12px;margin-bottom:14px;overflow:hidden}
.sh{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #f2f2f2}
.sn{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;font-family:'Geist Mono',monospace;color:#fff}
.st{font-size:14px;font-weight:600;color:#0a0a0a;flex:1;line-height:1.3}
.sd{font-family:'Geist Mono',monospace;font-size:11px;color:#bbb;white-space:nowrap;flex-shrink:0}
.sb{padding:14px 16px}
.fl{font-family:'Geist Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:#bbb;margin-bottom:5px;margin-top:12px}
.fl:first-child{margin-top:0}
.wt{font-size:13px;color:#555;line-height:1.65;padding:10px 12px;background:#fafafa;border-radius:8px;border:1px solid #f0f0f0;margin-bottom:2px}
.xt{font-size:13px;color:#333;line-height:1.65;margin-bottom:10px}
.ri{display:flex;align-items:flex-start;gap:10px;padding:8px 10px;border-radius:8px;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:5px}
.rb{flex:1}
.rn{font-size:13px;font-weight:600;color:#0a0a0a;margin-bottom:1px;line-height:1.35}
.rd{font-size:12px;color:#888;line-height:1.45}
.rm2{display:flex;gap:5px;margin-top:4px;flex-wrap:wrap}
.tg{font-family:'Geist Mono',monospace;font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600}
.tg-b{background:#ede9fe;color:#5b21b6}
.tg-c{background:#d1fae5;color:#065f46}
.tg-f{background:#dcfce7;color:#166534}
.tg-p{background:#fef3c7;color:#92400e}
.tg-l{background:#fce7f3;color:#9d174d}
.tg-d{background:#dbeafe;color:#1e40af}
.ub{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 12px;margin-top:12px}
.ul{font-family:'Geist Mono',monospace;font-size:10px;font-weight:700;color:#166534;letter-spacing:.07em;text-transform:uppercase;margin-bottom:3px}
.ut{font-size:13px;color:#15803d;line-height:1.55}
.pc{background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:14px 16px;margin-bottom:10px}
.pn{font-family:'Geist Mono',monospace;font-size:10px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
.pt{font-size:14px;font-weight:700;color:#0a0a0a;margin-bottom:6px;letter-spacing:-0.01em}
.pd{font-size:13px;color:#555;line-height:1.65}
.sr{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1.25rem}
.sp{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid}
.dg{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:8px;margin-bottom:.5rem}
.di{background:#fafafa;border:1px solid #e8e8e8;border-radius:8px;padding:10px 12px}
.dn{font-size:12px;font-weight:600;color:#555;margin-bottom:3px;display:flex;align-items:center;gap:5px}
.dr{font-size:11px;color:#aaa;line-height:1.4}
.tls{display:flex;gap:1.5rem;flex-wrap:wrap;background:#fff;border-radius:8px;padding:.875rem 1rem;margin-bottom:1.25rem;border:1px solid #e8e8e8}
.tli{display:flex;flex-direction:column;gap:2px}
.tlv{font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.02em}
.tll{font-size:11px;color:#aaa;font-family:'Geist Mono',monospace}
.trk{background:#fff;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:8px;overflow:hidden}
.trh{display:flex;align-items:center;gap:10px;padding:.75rem 1rem;border-bottom:1px solid #f2f2f2}
.trd{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.trn{font-size:13px;font-weight:600;color:#0a0a0a;flex:1}
.trw{font-family:'Geist Mono',monospace;font-size:11px;color:#aaa;margin-left:auto;white-space:nowrap}
.trb{padding:.75rem 1rem}
.trt{font-size:12px;color:#777;line-height:1.55;margin-bottom:6px}
.trbar{height:4px;border-radius:2px;margin-bottom:4px}
.trbl{display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:10px;color:#aaa;gap:8px;flex-wrap:wrap}
`;

const PACE = {
  1:{wk:"13 weeks",mo:"~3 months",done:"Sep 2026",t:["Week 0","Weeks 1–2","Week 3","Week 4","Weeks 5–6","Weeks 7–8","Weeks 9–10","Week 11","Week 12+"]},
  1.5:{wk:"9 weeks",mo:"~2 months",done:"Aug 2026",t:["Days 1–3","Weeks 1–2","Week 3","Week 3","Weeks 4–5","Weeks 5–6","Weeks 6–7","Week 8","Week 9+"]},
  2:{wk:"7 weeks",mo:"~1.5 months",done:"Jul 2026",t:["Days 1–2","Week 1","Week 2","Week 2","Weeks 3–4","Weeks 4–5","Weeks 5–6","Week 6","Week 7+"]}
};

const TRACKS = [
  {dot:"#f59e0b",n:"Step 0 — Pre-reading",bar:"#fef3c7",t:"Book Ch1, Ch5, Anthropic blog. Read the map before the journey.",l:"4–5 hours of reading",r:"Sets the mental frame for everything"},
  {dot:"#3b82f6",n:"Steps 1–3 — First builds + evaluation intro",bar:"#dbeafe",t:"Udemy Weeks 1–4 + Book Ch2, start Ch3–4. Two shipped projects, open-source models, start of proper evaluation thinking.",l:"~4 weeks",r:"2 real projects shipped"},
  {dot:"#059669",n:"Step 4 — RAG",bar:"#d1fae5",t:"Book Ch6 first half, then Udemy Week 5, then DL.AI Agentic RAG. The most important pattern in AI engineering.",l:"~1.5 weeks",r:"AI that answers from your own documents"},
  {dot:"#8b5cf6",n:"Step 5 — Fine-tuning + advanced RAG",bar:"#ede9fe",t:"Udemy Weeks 6–7 + Book Ch7 + Educative Advanced RAG. When to use fine-tuning vs RAG, plus production-grade retrieval.",l:"~2 weeks",r:"Production-quality RAG + fine-tuned models"},
  {dot:"#f97316",n:"Step 6 — Agents",bar:"#ffedd5",t:"Book Ch6 second half, then Udemy Week 8, then DL.AI LangGraph. AI that takes actions, built reliably.",l:"~1.5 weeks",r:"Multi-agent systems with real state management"},
  {dot:"#ef4444",n:"Step 7 — Evaluation",bar:"#fee2e2",t:"Finish Book Ch3+4 + three short reads + build an eval framework on your own project.",l:"~1 week",r:"Measurable, regression-proof AI systems"},
  {dot:"#64748b",n:"Step 8 — Production + ongoing",bar:"#f1f5f9",t:"Book Ch10 + Langfuse setup + two newsletters. The data flywheel and staying current without burning out.",l:"~1 week setup then ongoing",r:"Observable production AI practice"},
];

function R({icon, name, detail, tags}) {
  return (
    <div className="ri">
      <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{icon}</span>
      <div className="rb">
        <div className="rn">{name}</div>
        {detail && <div className="rd">{detail}</div>}
        {tags && <div className="rm2">{tags}</div>}
      </div>
    </div>
  );
}

function Step({num, color, title, dur, why, what, resources, unlocks}) {
  return (
    <div className="sc">
      <div className="sh">
        <div className="sn" style={{background:color}}>{num}</div>
        <div className="st">{title}</div>
        <div className="sd">{dur}</div>
      </div>
      <div className="sb">
        <div className="fl">Why this is here</div>
        <div className="wt">{why}</div>
        <div className="fl">What you are doing</div>
        <div className="xt">{what}</div>
        <div className="fl">Resources</div>
        {resources}
        <div className="ub">
          <div className="ul">After this you can...</div>
          <div className="ut">{unlocks}</div>
        </div>
      </div>
    </div>
  );
}

function WhyTab() {
  const dropped = [
    {n:"Karpathy Zero to Hero", r:"40+ hrs building backprop from scratch. You need to know what a model does, not how to build one. Book Ch2 covers the internals you actually need in 2 hrs of reading."},
    {n:"3Blue1Brown series", r:"Same purpose as Karpathy. Dropped for the same reason. Book Ch2 is faster and pairs better with the practical work."},
    {n:"IBM / Coursera specialisations", r:"Fully covered by Core Track and book together. Doing both is repetition, not learning."},
    {n:"Jay Alammar blog", r:"Good reference, but the book covers the same concepts more completely. Bookmark it for later if you want a visual refresher."},
    {n:"DL.AI Generative AI with LLMs", r:"Book Chapter 2 is a better version of this course. No need for both."},
    {n:"Coursera Multi-Agent Systems", r:"Core Track Week 8 and book Chapter 6 cover the same ground with better context around them."},
    {n:"Analytics Vidhya RAG guide", r:"Useful reference, not structured learning. The book handles this job better."},
  ];
  const principles = [
    {n:"Principle 1", t:"Read the map before you start the journey", d:"Opening a course cold and following the code is the worst way to learn. You execute instructions without understanding why the architecture was designed that way. Reading the book chapters before each Udemy section means every line of code has a reason behind it, not just a tutorial to copy."},
    {n:"Principle 2", t:"You are building products, not AI itself", d:"Karpathy and 3Blue1Brown are for people who want to build the models. You want to build with the models. Those are fundamentally different goals. You need to understand what happens when you call an AI model — not how to implement the mathematics that powers it. The book covers the first. Karpathy covers the second. Only the first is relevant here."},
    {n:"Principle 3", t:"Theory paired with practice, not theory then practice", d:"If you read the entire book first and then start building, you will have forgotten 80% of it by the time the relevant code arrives. Each book chapter is read alongside the Udemy week it maps to. Theory and code reinforce each other in real time rather than one fading before the other arrives."},
    {n:"Principle 4", t:"RAG before agents, because agents use RAG as a tool", d:"Agents are AI systems that take actions in the world. One of the most common actions they take is looking something up — which is exactly what RAG does. If you build an agent without first understanding how information retrieval works, you are building something you do not understand. RAG must come first."},
    {n:"Principle 5", t:"Evaluation comes after you have something real to evaluate", d:"Evaluation frameworks are meaningless in the abstract. You need real systems before the evaluation concepts land properly. Starting the evaluation chapters early and finishing them in Step 7 means you read the theory while you have actual code to apply it to — not as a thought experiment."},
    {n:"Principle 6", t:"Three supplements, each filling one specific gap", d:"The Agentic RAG course fills the gap between RAG as a pipeline and RAG as a tool an agent uses. The LangGraph course fills the stateful workflow gap the Core Track leaves open. The Advanced RAG course fills the production-technique gap (better chunking, smarter search, relevance reranking). Remove any one of these three and you have a real hole in your knowledge. Add anything else and you have redundancy."},
  ];
  return (
    <div>
      <div className="ib">This is not a generic AI course list. It is a specific path built around two things you already own — the Chip Huyen book and the Udemy Core Track. Every other resource is here because removing it would leave a real gap. Nothing is included because it sounds good.</div>
      <div className="lbl">Your complete stack</div>
      <div className="sr">
        {[
          {l:"AI Engineering — Chip Huyen",c:"#5b21b6",bg:"#ede9fe",bc:"#c4b5fd"},
          {l:"Udemy Core Track — 8 projects",c:"#065f46",bg:"#d1fae5",bc:"#6ee7b7"},
          {l:"DL.AI Agentic RAG — free",c:"#1e40af",bg:"#dbeafe",bc:"#93c5fd"},
          {l:"DL.AI LangGraph — free",c:"#1e40af",bg:"#dbeafe",bc:"#93c5fd"},
          {l:"Educative Advanced RAG — ~$15",c:"#92400e",bg:"#fef3c7",bc:"#fcd34d"},
        ].map((p,i) => <div key={i} className="sp" style={{background:p.bg,borderColor:p.bc,color:p.c}}>{p.l}</div>)}
      </div>
      <div className="lbl">What we dropped and why</div>
      <div className="dg">
        {dropped.map((d,i) => (
          <div key={i} className="di">
            <div className="dn"><span style={{color:"#ef4444"}}>✕</span>{d.n}</div>
            <div className="dr">{d.r}</div>
          </div>
        ))}
      </div>
      <div className="lbl">Why this specific order — first principles</div>
      {principles.map((p,i) => (
        <div key={i} className="pc">
          <div className="pn">{p.n}</div>
          <div className="pt">{p.t}</div>
          <div className="pd">{p.d}</div>
        </div>
      ))}
    </div>
  );
}

function Steps03Tab() {
  return (
    <div>
      <div className="ib">Steps 0 to 3 build your mental model before you write production code. By the end you will have two real shipped projects and a proper framework for measuring AI output — not just gut feel.</div>

      <Step num="0" color="#f59e0b" title="Pre-reading before you open the Udemy course" dur="4–5 hrs"
        why="If you open the course without context, you will follow code without understanding the landscape it lives in. These three short reads take 4–5 hours total and change how you interpret every single Udemy project that follows. Think of it as reading the recipe before you start cooking."
        what="Read Chip Huyen Chapter 1 — what AI engineering actually is and why it is different from traditional software engineering. Read Chapter 5 — how to write clear instructions to AI models, a skill you will use from your very first project. Read the Anthropic blog post called Building Effective Agents — one hour, but it defines the vocabulary and five patterns you will encounter throughout the entire agent half of the course."
        resources={<>
          <R icon="📖" name="AI Engineering Ch1 — Planning Applications" detail="What AI engineering is, how it differs from traditional ML, and why foundation models changed the landscape. Sets the mental frame for the entire path." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">read first</span></>} />
          <R icon="📖" name="AI Engineering Ch5 — Prompt Engineering" detail="How to write instructions that produce consistent, reliable outputs. You will be writing prompts from day one — having this chapter done before then matters." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">read first</span></>} />
          <R icon="🔗" name="Anthropic — Building Effective Agents" detail="The five patterns every agent system uses. One hour. Defines the vocabulary for everything in the second half of the Udemy course so you recognise what you are building while you build it." tags={<><span className="tg tg-l">blog</span><span className="tg tg-f">free</span></>} />
        </>}
        unlocks="You understand the landscape before you step into it. When the Udemy course introduces a concept, you already have a mental hook to hang it on rather than encountering it cold."
      />

      <Step num="1" color="#3b82f6" title="Udemy Weeks 1–2 + Book Chapter 2 in parallel" dur="~2 weeks"
        why="Your first two Udemy projects ship real code: an AI that scrapes websites and a chatbot that handles images and calls external functions. Book Chapter 2 is read alongside — ideally a section each evening. The chapter explains what is happening inside the models you are calling: how they generate text one word at a time, why longer prompts cost more, what the temperature setting actually controls. Reading this while you are actively building creates a direct connection between the theory and the code. Neither alone is as effective."
        what="Udemy Week 1: Build an AI brochure generator — give it a company website URL and it writes a professional brochure. Udemy Week 2: Build a multi-modal customer support chatbot that can look at images and call external functions like checking flight status. Book Chapter 2 each evening: how AI models actually work under the hood — training, how they pick the next word, what context length means, why the key-value cache determines your speed."
        resources={<>
          <R icon="🎓" name="Udemy Core Track — Weeks 1 & 2" detail="Project 1: AI brochure generator (scrapes websites, writes marketing copy). Project 2: Multi-modal chatbot with a real interface and function calling." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid</span></>} />
          <R icon="📖" name="AI Engineering Ch2 — Understanding Foundation Models" detail="How models generate text, what sampling means, context length trade-offs, the key-value cache. The practitioner internals — no maths, just the reasoning you need to make good decisions." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">read alongside</span></>} />
        </>}
        unlocks="You have shipped 2 real AI products and can explain what the model is doing when you call it — not just that it works."
      />

      <Step num="2" color="#3b82f6" title="Udemy Week 3 — open-source models" dur="~1 week"
        why="Before making architecture decisions, you need to see the full landscape of available models. Right now GPT-4 is not your only option, and for many tasks it is the wrong choice. Running models locally changes the cost equation dramatically — a RAG system that costs thousands per month on a cloud API might cost almost nothing on a self-hosted open-source model. You need this context before you start designing systems."
        what="Run AI models locally using Ollama and HuggingFace. Build a tool that converts meeting audio into structured minutes and action items, using both local and cloud models. Understand the practical trade-offs between open-source and commercial models: cost, speed, capability, and data privacy."
        resources={<>
          <R icon="🎓" name="Udemy Core Track — Week 3" detail="Project 3: Meeting minutes and action items from audio. Introduces HuggingFace, Ollama, and the decision framework for when to use open-source versus cloud models." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid</span></>} />
        </>}
        unlocks="You can make an informed model selection decision for any project instead of defaulting to the most expensive option."
      />

      <Step num="3" color="#3b82f6" title="Udemy Week 4 + start Book Chapters 3 and 4" dur="~1 week"
        why="Week 4 is the lightest in the course — model comparison and evaluation. It is the right time to start the two evaluation chapters in the book, which are the most important chapters in it. Starting them here means you read the theory while the evaluation concepts are fresh from the Week 4 comparison work. You will not finish them this week — you return to them in Step 7. The goal is to plant the seed so it grows as you build."
        what="Udemy Week 4: Compare different AI models side by side using blind tests and public benchmarks. Develop practical judgment for when model A is actually better than model B for a specific task and why. Start Book Chapters 3 and 4 on evaluation methodology — read as far as you can, bookmark where you stop, and carry on building."
        resources={<>
          <R icon="🎓" name="Udemy Core Track — Week 4" detail="Model evaluation, blind A/B testing, benchmarks, and the judgment for selecting the right model for a given task type." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid</span></>} />
          <R icon="📖" name="AI Engineering Ch3 + Ch4 — Evaluation Methodology (start)" detail="Two full chapters on measuring whether your AI system actually works. The most thorough evaluation resource in any format. Start here, finish in Step 7." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">start now, finish in step 7</span></>} />
        </>}
        unlocks="You stop judging AI output by gut feel and start building the habit of measuring it. You also have the vocabulary to understand every evaluation concept in the second half of the course."
      />
    </div>
  );
}

function Steps46Tab() {
  return (
    <div>
      <div className="ib">Steps 4 to 6 are the core engineering phase. RAG, fine-tuning, and agents — in that exact order, because each builds on the last. By the end you will have completed all 8 Udemy projects and have working implementations of every major AI engineering pattern.</div>

      <Step num="4" color="#059669" title="Book Ch6 RAG section, then Udemy Week 5, then DL.AI Agentic RAG" dur="~1.5 weeks"
        why="Retrieval-Augmented Generation — RAG — is the most important single pattern in AI engineering. It solves a fundamental problem: AI models are trained on fixed data, but the world keeps changing and every business has private information the model has never seen. RAG lets you give the model exactly the right information at the moment it needs it, rather than trying to retrain the entire model. The book section comes before the Udemy week — always read the architecture reasoning before writing the code, or you are just copying a tutorial. The DL.AI course directly after bridges from RAG-as-a-pipeline to RAG-as-a-tool-inside-an-agent, which sets up Step 6."
        what="Read Book Chapter 6 first half: what RAG is, why it remains necessary even as AI context windows grow larger, how to think about splitting documents and finding the right chunks. Then Udemy Week 5: build a full AI knowledge worker that can answer detailed questions about any company using only that company's own documents. Then DL.AI Agentic RAG with LlamaIndex (free, 4 hours): take that same RAG system and evolve it into an agent that uses retrieval as one tool among many."
        resources={<>
          <R icon="📖" name="AI Engineering Ch6 — RAG (first half)" detail="What RAG is, why it is necessary, how context construction works, and the key insight: RAG is for facts, fine-tuning is for style. Read this before starting Week 5." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">read first</span></>} />
          <R icon="🎓" name="Udemy Core Track — Week 5" detail="Project 5: AI knowledge worker using RAG. Reads company documents and answers questions about them accurately without hallucinating." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid</span></>} />
          <R icon="🎓" name="DL.AI — Agentic RAG with LlamaIndex" detail="Taught by the LlamaIndex founder. Evolves a RAG pipeline into an agent that uses retrieval as one tool among several. The conceptual bridge between RAG and agents." tags={<><span className="tg tg-c">course</span><span className="tg tg-f">free — 4 hrs</span></>} />
        </>}
        unlocks="You can build an AI that answers questions from your own documents rather than making things up. You also understand how that system naturally evolves into an agent, which sets up everything in Step 6."
      />

      <Step num="5" color="#8b5cf6" title="Udemy Weeks 6–7 + Book Ch7 + Educative Advanced RAG" dur="~2 weeks"
        why="Weeks 6 and 7 cover fine-tuning — taking an existing AI model and retraining it on your own data so it behaves differently. These are the least architecturally intense weeks in the course, which makes them the right time to top up your RAG knowledge with the production techniques the Core Track does not cover. Book Chapter 7 gives you the decision framework you will use for the rest of your career: when should you use better prompting, when should you use RAG, and when should you actually retrain the model?"
        what="Udemy Week 6: Use a frontier model to predict product prices from descriptions — this is the baseline. Udemy Week 7: Fine-tune an open-source model with QLoRA (a technique for efficient retraining on limited hardware) to compete with the frontier model at a fraction of the cost. Book Chapter 7 alongside: the RAG vs fine-tuning vs prompting decision framework. Educative Advanced RAG (4 hours, around $15): production techniques the Core Track does not cover — splitting documents at meaningful boundaries rather than arbitrary character counts, generating a hypothetical answer to improve search accuracy, re-scoring retrieved results with a more precise ranking model, and combining keyword search with semantic search."
        resources={<>
          <R icon="🎓" name="Udemy Core Track — Weeks 6 & 7" detail="Projects 6 & 7: Fine-tune a model on product price prediction. Teaches when and how to adapt a pre-built model to your specific domain using QLoRA." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid</span></>} />
          <R icon="📖" name="AI Engineering Ch7 — Finetuning" detail="When to fine-tune versus RAG versus prompt engineering. The decision framework that stops you reaching for the most expensive or complex solution by default." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">read alongside</span></>} />
          <R icon="🎓" name="Educative — Advanced RAG Techniques" detail="Production-grade techniques: semantic chunking, HyDE query transformation, cross-encoder reranking, hybrid keyword and semantic search. What makes the difference between a demo and a production system." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid — ~$15 — 4 hrs</span></>} />
        </>}
        unlocks="You understand all three ways to improve an AI system and when to use each. Your RAG systems work at production quality rather than demo quality."
      />

      <Step num="6" color="#f97316" title="Book Ch6 Agents section, then Udemy Week 8, then DL.AI LangGraph" dur="~1.5 weeks"
        why="Agents are AI systems that take actions in the real world — searching the web, running code, sending emails, calling external services — rather than just generating text. They are more powerful than plain AI responses and more dangerous, because each action can have real consequences and mistakes compound across multiple steps. Understanding how they fail and how to design them safely is not optional. Book Chapter 6 second half comes before Week 8 for exactly this reason. The DL.AI LangGraph course after fills the stateful workflow gap — the Core Track shows you how agents work, LangGraph shows you how to make them reliable across many steps."
        what="Read Book Chapter 6 second half: agent architecture, breaking complex tasks into smaller steps, separating planning from execution, running steps in parallel versus sequence, and why error probability multiplies with every additional step. Then Udemy Week 8: build an autonomous multi-agent system where several agents collaborate to find bargain deals and send you notifications. Then DL.AI AI Agents in LangGraph (free, 5 hours): build agents that remember what happened in previous steps using graph-based state management."
        resources={<>
          <R icon="📖" name="AI Engineering Ch6 — Agents (second half)" detail="Agent architecture, task decomposition, planning before executing, parallel versus sequential actions, and compounding failure risk. Read before Week 8." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">read first</span></>} />
          <R icon="🎓" name="Udemy Core Track — Week 8" detail="Project 8: Autonomous multi-agent system. Multiple agents collaborate to spot deals and send notifications. The capstone project of the course." tags={<><span className="tg tg-c">course</span><span className="tg tg-p">paid</span></>} />
          <R icon="🎓" name="DL.AI — AI Agents in LangGraph" detail="Taught by the LangChain founder. Stateful agent workflows where each step remembers what happened before. Fills the reliability gap the Core Track leaves open." tags={<><span className="tg tg-c">course</span><span className="tg tg-f">free — 5 hrs</span></>} />
        </>}
        unlocks="You can build systems where multiple AI agents collaborate on complex tasks across many steps. You understand how to handle failures, manage state, and design workflows that are reliable rather than just impressive in a demo."
      />
    </div>
  );
}

function Steps78Tab() {
  return (
    <div>
      <div className="ib">Steps 7 and 8 are about measuring what you built and running it properly. Step 7 answers: is my AI actually working? Step 8 answers: how do I observe it in production and keep improving it over time without starting from scratch?</div>

      <Step num="7" color="#ef4444" title="Evaluation deep dive + build your own eval framework" dur="~1 week"
        why="You now have 8 real projects. Evaluation theory that was abstract in Step 3 is now concrete — you have actual systems to measure. The most important thing to understand here: changing a prompt to fix one problem often silently breaks something else. Without systematic evaluation you are guessing. With it you are engineering. This is why the book dedicates two full chapters to evaluation and why the podcast that started this entire roadmap called it 70 percent of what makes an AI system succeed or fail."
        what="Finish Book Chapters 3 and 4 if not already done. Read the Evidently AI guide to RAG evaluation — it covers the specific metrics for measuring retrieval quality (what proportion of what you retrieved was actually useful), answer quality (whether the response was grounded in the documents rather than invented), and completeness (whether you found all the relevant information that existed). Read the Canva case study on systematic evaluation — how a real engineering team catches regressions automatically when prompts change. Read the Anthropic evaluation blog. Then apply it: take your Week 5 RAG project and build a basic evaluation framework on top of it — score whether answers are grounded in retrieved documents and whether the retrieval found what it needed to find."
        resources={<>
          <R icon="📖" name="AI Engineering Ch3 + Ch4 — Evaluation (finish)" detail="Two full chapters on measuring whether your AI system works. The most comprehensive evaluation resource in any format. Finish what you started in Step 3." tags={<><span className="tg tg-b">book</span><span className="tg tg-d">finish now</span></>} />
          <R icon="🔗" name="Evidently AI — Complete Guide to RAG Evaluation" detail="Specific metrics for measuring RAG quality in plain terms. Covers retrieval precision, answer faithfulness, and context relevance. Practical and directly applicable." tags={<><span className="tg tg-l">blog</span><span className="tg tg-f">free</span></>} />
          <R icon="🔗" name="ZenML — How Canva Evaluates AI Systems" detail="Real case study. How Canva built automated testing so every prompt change is checked against a full suite of quality metrics before it reaches users." tags={<><span className="tg tg-l">case study</span><span className="tg tg-f">free</span></>} />
          <R icon="🔗" name="Anthropic — Demystifying Evals for AI Agents" detail="How to evaluate an agent on whether it completed the task correctly, not just whether it called the right functions in the right sequence." tags={<><span className="tg tg-l">blog</span><span className="tg tg-f">free</span></>} />
        </>}
        unlocks="You can measure whether your AI system is actually working. When you change a prompt and something breaks, you catch it before users do. You make decisions based on data rather than instinct."
      />

      <Step num="8" color="#64748b" title="Architecture synthesis + observability + staying current" dur="~1 week setup, then ongoing"
        why="The final step ties everything together. Book Chapter 10 explains how a production AI system is not just built once — it improves over time through a cycle: the system produces outputs, users interact with those outputs, that interaction becomes data, the data improves the system. Understanding this cycle, called the data flywheel, is what separates AI products that get better from ones that stagnate. Langfuse gives you visibility into every decision your AI makes in production. The two newsletters are the minimum required to stay current without spending hours on it every week."
        what="Read Book Chapter 10: production architecture and how the data flywheel works in practice. Set up Langfuse on one of your existing projects — it gives you trace-level visibility into every AI call: what the model received, what it returned, how much it cost, how long it took. Read the Anthropic blog post on long-running agent sessions. Subscribe to two newsletters and nothing else."
        resources={<>
          <R icon="📖" name="AI Engineering Ch10 — Architecture and User Feedback" detail="How production AI systems improve over time. The data flywheel. Collecting structured user feedback. The capstone chapter where everything comes together." tags={<><span className="tg tg-b">book</span></>} />
          <R icon="🔗" name="Langfuse — observability for AI systems" detail="Free tool. Plug into your existing projects to see every AI call your system makes: cost, latency, what went in, what came out, where it failed. Start with your Week 5 RAG project." tags={<><span className="tg tg-l">tool</span><span className="tg tg-f">free tier</span></>} />
          <R icon="🔗" name="Anthropic — Harness Design for Long-Running Apps" detail="How to manage AI agent sessions that run for extended periods without accumulating errors or losing important context from earlier in the session." tags={<><span className="tg tg-l">blog</span><span className="tg tg-f">free</span></>} />
          <R icon="📰" name="Latent Space — weekly newsletter" detail="Written for AI engineers specifically. Covers how the teams building frontier AI think about architecture and engineering decisions. One of very few publications that treats AI engineering as its own discipline." tags={<><span className="tg tg-f">free</span></>} />
          <R icon="📰" name="TLDR AI — daily digest" detail="Five minutes per day. Use it as a discovery signal to know what to read more deeply. Read while commuting. Subscribe to nothing else beyond these two." tags={<><span className="tg tg-f">free</span></>} />
        </>}
        unlocks="You have a complete, observable AI engineering practice. You can build, measure, ship, and improve AI systems. You know what is worth reading to stay current and what to ignore."
      />
    </div>
  );
}

function TimelineTab({pace, setPace}) {
  const pd = PACE[pace];
  return (
    <div>
      <div className="ib">From where you are now to production-capable AI engineer. The original roadmap was 14 to 21 weeks. This path cuts that to 7 to 13 weeks because the book and Core Track replace 60-plus hours of foundational theory videos you no longer need to watch. You also end up with 8 real shipped projects, not just completed courses.</div>

      <div className="lbl">Select your daily commitment</div>
      <div style={{display:"flex",gap:6,marginBottom:"1rem"}}>
        {[1,1.5,2].map(h => (
          <button key={h} onClick={() => setPace(h)}
            style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${pace===h?"#059669":"#e0e0e0"}`,fontSize:13,fontWeight:500,cursor:"pointer",background:pace===h?"#ecfdf5":"#fff",color:pace===h?"#059669":"#888",transition:"all 0.12s",fontFamily:"'Geist',sans-serif"}}>
            {h} hr{h!==1?"s":""} / day
          </button>
        ))}
      </div>

      <div className="tls">
        <div className="tli"><div className="tlv">{pd.wk}</div><div className="tll">to complete</div></div>
        <div className="tli"><div className="tlv">{pd.mo}</div><div className="tll">calendar time</div></div>
        <div className="tli"><div className="tlv">{pd.done}</div><div className="tll">est. completion</div></div>
        <div className="tli"><div className="tlv">8 projects</div><div className="tll">actually shipped</div></div>
      </div>

      <div className="lbl">Step by step schedule</div>
      {TRACKS.map((t,i) => (
        <div key={i} className="trk">
          <div className="trh">
            <div className="trd" style={{background:t.dot}}></div>
            <div className="trn">{t.n}</div>
            <div className="trw">{pd.t[i]}</div>
          </div>
          <div className="trb">
            <div className="trt">{t.t}</div>
            <div className="trbar" style={{background:t.bar}}></div>
            <div className="trbl"><span>{t.l}</span><span>{t.r}</span></div>
          </div>
        </div>
      ))}

      <div style={{borderLeft:"3px solid #6366f1",background:"#eef2ff",borderRadius:"0 8px 8px 0",padding:".75rem 1rem",marginTop:"1.25rem",fontSize:13,color:"#3730a3",lineHeight:1.6}}>
        What to buy next after finishing this path: Course 2 (Complete Agentic AI Engineering) for MCP and AutoGen coverage. Course 3 (AI in Production) when you have something real to deploy. Both will mean significantly more after you have the foundation this path builds.
      </div>
    </div>
  );
}

const TABS = [
  {label:"Why this order", color:"#6366f1"},
  {label:"Steps 0–3 — Foundation", color:"#3b82f6"},
  {label:"Steps 4–6 — RAG & agents", color:"#059669"},
  {label:"Steps 7–8 — Eval & production", color:"#ef4444"},
  {label:"Timeline", color:"#64748b"},
];

export default function Roadmap() {
  const [tab, setTab] = useState(0);
  const [pace, setPace] = useState(1);
  const panels = [
    <WhyTab />,
    <Steps03Tab />,
    <Steps46Tab />,
    <Steps78Tab />,
    <TimelineTab pace={pace} setPace={setPace} />,
  ];
  return (
    <>
      <style>{css}</style>
      <div className="rm">
        <div className="mw">
          <h1>AI engineering roadmap</h1>
          <div className="sub">v3 · book + udemy core track + 3 supplements · 8 real projects · ~3 months</div>
          <div className="tabs">
            {TABS.map((t,i) => (
              <button key={i} className="tab" onClick={() => setTab(i)}
                style={tab===i?{borderColor:t.color,color:t.color,background:t.color+"10",fontWeight:600}:{}}>
                {t.label}
              </button>
            ))}
          </div>
          {panels[tab]}
        </div>
      </div>
    </>
  );
}
