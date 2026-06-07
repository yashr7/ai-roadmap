import { useState, useEffect, useMemo, useCallback, useRef } from "react";

const UDEMY_COURSE_URL = "https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/learn/lecture/52939977#overview";

// ===================================================================
// CONSTANTS — extracted outside component to avoid re-creation
// ===================================================================

const PARENT_TO_CHILD = {
  "s0_book_ch1": ["book_ch1_1", "book_ch1_2", "book_ch1_3", "book_ch1_4"],
  "s0_book_ch5": ["book_ch5_1", "book_ch5_2", "book_ch5_3"],
  "s1_book_ch2": ["book_ch2_1", "book_ch2_2", "book_ch2_3", "book_ch2_4"],
  "s3_book_ch3": ["book_ch3_1", "book_ch3_2", "book_ch3_3"],
  "s3_book_ch4": ["book_ch4_1", "book_ch4_2"],
  "s4_book_ch6": ["book_ch6_1"],
  "s5_book_ch7": ["book_ch7_1", "book_ch7_2", "book_ch7_3", "book_ch7_4"],
  "s6_book_ch6": ["book_ch6_2", "book_ch6_3"],
  "s7_book_ch3": ["book_ch3_4", "book_ch3_5"],
  "s7_book_ch4": ["book_ch4_3"],
  "s8_book_ch10": ["book_ch10_1", "book_ch10_2"],
  "s1_udemy_w1": [
    "week1_day1", "week1_day2", "week1_day4", "week1_day5",
    "week1_scraper", "week1_solution", "week1_exercise"
  ],
  "s1_udemy_w2": [
    "week2_day1", "week2_day2", "week2_day3", "week2_day4",
    "week2_day5", "week2_extra", "week2_revealer", "week2_scraper", "week2_exercise"
  ],
  "s2_udemy_w3": [
    "week3_day1", "week3_day2", "week3_day3", "week3_day4", "week3_day5", "week3_visualizer"
  ],
  "s3_udemy_w4": [
    "week4_day3", "week4_day4", "week4_day5", "week4_styles", "week4_system_info"
  ],
  "s4_udemy_w5": [
    "week5_day1", "week5_day2", "week5_day3", "week5_day4", "week5_day5", "week5_app", "week5_evaluator"
  ],
  "s5_udemy_w6": [
    "week6_day1", "week6_day2", "week6_day3", "week6_day4", "week6_day5",
    "week6_redemption_run", "week6_redemption_train", "week6_results"
  ],
  "s5_udemy_w7": [
    "week7_day1", "week7_day2", "week7_day3_4", "week7_day5", "week7_results", "week7_util"
  ],
  "s6_udemy_w8": [
    "week8_day1", "week8_day2", "week8_day3", "week8_day4", "week8_day5",
    "week8_deal_agent_framework", "week8_hello", "week8_llama", "week8_log_utils",
    "week8_price_is_right", "week8_pricer_ephemeral", "week8_pricer_service",
    "week8_pricer_service2", "week8_results"
  ]
};

const CHILD_TO_PARENTS = {};
Object.entries(PARENT_TO_CHILD).forEach(([parent, children]) => {
  children.forEach(child => {
    if (!CHILD_TO_PARENTS[child]) CHILD_TO_PARENTS[child] = [];
    CHILD_TO_PARENTS[child].push(parent);
  });
});

const STANDALONE_TASKS = [
  "s0_anthropic_agents_blog",
  "s4_supp_agentic_rag",
  "s5_supp_advanced_rag",
  "s6_supp_langgraph",
  "s7_supp_evidently_rag", "s7_supp_canva_eval", "s7_supp_anthropic_eval",
  "s8_supp_langfuse", "s8_supp_long_running", "s8_supp_latent_space", "s8_supp_tldr_ai",
  "book_ch8_1", "book_ch8_2", "book_ch8_3",
  "book_ch9_1", "book_ch9_2"
];

// Pre-compute all checkpoint IDs once
const ALL_CHECKPOINT_IDS = (() => {
  const list = new Set();
  Object.values(PARENT_TO_CHILD).forEach(children => {
    children.forEach(c => list.add(c));
  });
  STANDALONE_TASKS.forEach(s => list.add(s));
  return Array.from(list);
})();

const STEP_TASKS_MAP = {
  "0": ["s0_book_ch1", "s0_book_ch5", "s0_anthropic_agents_blog"],
  "1": ["s1_book_ch2", "s1_udemy_w1", "s1_udemy_w2"],
  "2": ["s2_udemy_w3"],
  "3": ["s3_book_ch3", "s3_book_ch4", "s3_udemy_w4"],
  "4": ["s4_book_ch6", "s4_udemy_w5", "s4_supp_agentic_rag"],
  "5": ["s5_book_ch7", "s5_udemy_w6", "s5_udemy_w7", "s5_supp_advanced_rag"],
  "6": ["s6_book_ch6", "s6_udemy_w8", "s6_supp_langgraph"],
  "7": ["s7_book_ch3", "s7_book_ch4", "s7_supp_evidently_rag", "s7_supp_canva_eval", "s7_supp_anthropic_eval"],
  "8": ["s8_book_ch10", "s8_supp_langfuse", "s8_supp_long_running", "s8_supp_latent_space", "s8_supp_tldr_ai"]
};

// Pre-compute flattened child lists for step progress calculation
const STEP_CHILD_IDS = {};
Object.entries(STEP_TASKS_MAP).forEach(([stepNum, parents]) => {
  const childList = [];
  parents.forEach(p => {
    if (PARENT_TO_CHILD[p]) childList.push(...PARENT_TO_CHILD[p]);
    else childList.push(p);
  });
  STEP_CHILD_IDS[stepNum] = childList;
});

const TRACK_TASKS = {
  0: ["book_ch1_1", "book_ch1_2", "book_ch1_3", "book_ch1_4", "book_ch5_1", "book_ch5_2", "book_ch5_3", "s0_anthropic_agents_blog"],
  1: [
    "book_ch2_1", "book_ch2_2", "book_ch2_3", "book_ch2_4",
    "week1_day1", "week1_day2", "week1_day4", "week1_day5", "week1_scraper", "week1_solution", "week1_exercise",
    "week2_day1", "week2_day2", "week2_day3", "week2_day4", "week2_day5", "week2_extra", "week2_revealer", "week2_scraper", "week2_exercise",
    "week3_day1", "week3_day2", "week3_day3", "week3_day4", "week3_day5", "week3_visualizer",
    "book_ch3_1", "book_ch3_2", "book_ch3_3", "book_ch4_1", "book_ch4_2",
    "week4_day3", "week4_day4", "week4_day5", "week4_styles", "week4_system_info"
  ],
  2: [
    "book_ch6_1",
    "week5_day1", "week5_day2", "week5_day3", "week5_day4", "week5_day5", "week5_app", "week5_evaluator",
    "s4_supp_agentic_rag"
  ],
  3: [
    "book_ch7_1", "book_ch7_2", "book_ch7_3", "book_ch7_4",
    "week6_day1", "week6_day2", "week6_day3", "week6_day4", "week6_day5", "week6_redemption_run", "week6_redemption_train", "week6_results",
    "week7_day1", "week7_day2", "week7_day3_4", "week7_day5", "week7_results", "week7_util",
    "s5_supp_advanced_rag"
  ],
  4: [
    "book_ch6_2", "book_ch6_3",
    "week8_day1", "week8_day2", "week8_day3", "week8_day4", "week8_day5",
    "week8_deal_agent_framework", "week8_hello", "week8_llama", "week8_log_utils",
    "week8_price_is_right", "week8_pricer_ephemeral", "week8_pricer_service", "week8_pricer_service2", "week8_results",
    "s6_supp_langgraph"
  ],
  5: [
    "book_ch3_4", "book_ch3_5", "book_ch4_3",
    "s7_supp_evidently_rag", "s7_supp_canva_eval", "s7_supp_anthropic_eval"
  ],
  6: [
    "book_ch10_1", "book_ch10_2",
    "s8_supp_langfuse", "s8_supp_long_running", "s8_supp_latent_space", "s8_supp_tldr_ai"
  ]
};

const TABS = [
  { label: "Roadmap Steps" },
  { label: "Book Outline" },
  { label: "Timeline Planner" },
  { label: "Why This Order" }
];

const PACE_SETTINGS = {
  1: { wk: "13 weeks", mo: "~3 months", done: "Sep 2026", t: ["Week 0", "Weeks 1–2", "Week 3", "Week 4", "Weeks 5–6", "Weeks 7–8", "Weeks 9–10", "Week 11", "Week 12+"] },
  1.5: { wk: "9 weeks", mo: "~2 months", done: "Aug 2026", t: ["Days 1–3", "Weeks 1–2", "Week 3", "Week 3", "Weeks 4–5", "Weeks 5–6", "Weeks 6–7", "Week 8", "Week 9+"] },
  2: { wk: "7 weeks", mo: "~1.5 months", done: "Jul 2026", t: ["Days 1–2", "Week 1", "Week 2", "Week 2", "Weeks 3–4", "Weeks 4–5", "Weeks 5–6", "Week 6", "Week 7+"] }
};

const TRACKS_INFO = [
  { id: 0, color: "#cc785c", name: "Step 0 — Pre-reading", t: "Book Ch1, Ch5, Anthropic blog. Read the map before the journey.", l: "4–5 hours of reading", r: "Sets the mental frame for everything" },
  { id: 1, color: "#5db8a6", name: "Steps 1–3 — First builds + evaluation intro", t: "Udemy Weeks 1–4 + Book Ch2, start Ch3–4. Two shipped projects, open-source models, start of proper evaluation thinking.", l: "~4 weeks", r: "2 real projects shipped" },
  { id: 2, color: "#cc785c", name: "Step 4 — RAG", t: "Book Ch6 first half, then Udemy Week 5, then DL.AI Agentic RAG. The most important pattern in AI engineering.", l: "~1.5 weeks", r: "AI that answers from your own documents" },
  { id: 3, color: "#e8a55a", name: "Step 5 — Fine-tuning + advanced RAG", t: "Udemy Weeks 6–7 + Book Ch7 + Educative Advanced RAG. When to use fine-tuning vs RAG, plus production-grade retrieval.", l: "~2 weeks", r: "Production-quality RAG + fine-tuned models" },
  { id: 4, color: "#cc785c", name: "Step 6 — Agents", t: "Book Ch6 second half, then Udemy Week 8, then DL.AI LangGraph. AI that takes actions, built reliably.", l: "~1.5 weeks", r: "Multi-agent systems with real state management" },
  { id: 5, color: "#c64545", name: "Step 7 — Evaluation", t: "Finish Book Ch3+4 + three short reads + build an eval framework on your own project.", l: "~1 week", r: "Measurable, regression-proof AI systems" },
  { id: 6, color: "#8e8b82", name: "Step 8 — Production + ongoing", t: "Book Ch10 + Langfuse setup + two newsletters. The data flywheel and staying current without burning out.", l: "~1 week setup then ongoing", r: "Observable production AI practice" },
];

const BOOK_OUTLINE = [
  { num: 1, title: "Introduction to Building AI Applications with Foundation Models", sections: [
    { id: "book_ch1_1", name: "The Rise of AI Engineering" },
    { id: "book_ch1_2", name: "Foundation Model Use Cases" },
    { id: "book_ch1_3", name: "Planning AI Applications" },
    { id: "book_ch1_4", name: "The AI Engineering Stack" }
  ]},
  { num: 2, title: "Understanding Foundation Models", sections: [
    { id: "book_ch2_1", name: "Training Data" },
    { id: "book_ch2_2", name: "Modeling" },
    { id: "book_ch2_3", name: "Post-Training" },
    { id: "book_ch2_4", name: "Sampling" }
  ]},
  { num: 3, title: "Evaluation Methodology", sections: [
    { id: "book_ch3_1", name: "Challenges of Evaluating Foundation Models" },
    { id: "book_ch3_2", name: "Understanding Language Modeling Metrics" },
    { id: "book_ch3_3", name: "Exact Evaluation (Similarity & Embeddings)" },
    { id: "book_ch3_4", name: "AI as a Judge" },
    { id: "book_ch3_5", name: "Ranking Models with Comparative Evaluation" }
  ]},
  { num: 4, title: "Evaluate AI Systems", sections: [
    { id: "book_ch4_1", name: "Evaluation Criteria (Capability, Latency, Cost)" },
    { id: "book_ch4_2", name: "Model Selection Build vs. Buy" },
    { id: "book_ch4_3", name: "Design Your Evaluation Pipeline" }
  ]},
  { num: 5, title: "Prompt Engineering", sections: [
    { id: "book_ch5_1", name: "Introduction to Prompting (In-Context Learning)" },
    { id: "book_ch5_2", name: "Prompt Engineering Best Practices" },
    { id: "book_ch5_3", name: "Defensive Prompt Engineering (Jailbreaks, Defenses)" }
  ]},
  { num: 6, title: "RAG and Agents", sections: [
    { id: "book_ch6_1", name: "Retrieval-Augmented Generation (RAG)" },
    { id: "book_ch6_2", name: "Agents (Tools & Planning)" },
    { id: "book_ch6_3", name: "Memory Tiers" }
  ]},
  { num: 7, title: "Finetuning", sections: [
    { id: "book_ch7_1", name: "Finetuning Overview & When to Finetune" },
    { id: "book_ch7_2", name: "Memory Bottlenecks & Numerical Math" },
    { id: "book_ch7_3", name: "Parameter-Efficient Finetuning (PEFT/QLoRA)" },
    { id: "book_ch7_4", name: "Model Merging & Finetuning Tactics" }
  ]},
  { num: 8, title: "Dataset Engineering", sections: [
    { id: "book_ch8_1", name: "Data Curation (Quality, Quantity, Annotation)" },
    { id: "book_ch8_2", name: "Data Augmentation & Synthesis (Distillation)" },
    { id: "book_ch8_3", name: "Data Processing (Cleaning, Filtering, Formatting)" }
  ]},
  { num: 9, title: "Inference Optimization", sections: [
    { id: "book_ch9_1", name: "Performance Metrics & Hardware Accelerators" },
    { id: "book_ch9_2", name: "Model Optimization & Inference Service Optimization" }
  ]},
  { num: 10, title: "AI Engineering Architecture and User Feedback", sections: [
    { id: "book_ch10_1", name: "AI Engineering Architecture (Gateway, Cache, Tracing)" },
    { id: "book_ch10_2", name: "User Feedback Loops & Data Flywheels" }
  ]}
];

const PDF_PATH = "/Users/yash/Documents/Dev/RoadMaps/ai-roadmap/20260328_ai-engineering-building-applications-with-foundation-models-chip-huyen-z-library.pdf";
const COURSE_BASE = "/Users/yash/Documents/Dev/llm_engineering";

// Step data: avoids re-creating these arrays inside JSX
const STEP_COLORS = ["#cc785c", "#5db8a6", "#5db8a6", "#5db8a6", "#cc785c", "#e8a55a", "#cc785c", "#c64545", "#8e8b82"];

const NOTEBOOK_DATA = {
  week1: [
    { id: "week1_day1", file: "day1.ipynb", label: "Ollama Quickstart" },
    { id: "week1_day2", file: "day2.ipynb", label: "Model Calling & Prompts" },
    { id: "week1_day4", file: "day4.ipynb", label: "Website Scraping" },
    { id: "week1_day5", file: "day5.ipynb", label: "Generating brochures" },
    { id: "week1_scraper", file: "scraper.py", label: "Scraper script" },
    { id: "week1_solution", file: "solution.py", label: "Final assembly solution" },
    { id: "week1_exercise", file: "week1 EXERCISE.ipynb", label: "Week 1 Challenge Exercise" }
  ],
  week2: [
    { id: "week2_day1", file: "day1.ipynb", label: "State management & System instructions" },
    { id: "week2_day2", file: "day2.ipynb", label: "Function Calling / Tool Use basics" },
    { id: "week2_day3", file: "day3.ipynb", label: "Multi-modal (Image) inputs" },
    { id: "week2_day4", file: "day4.ipynb", label: "Database / State tracking" },
    { id: "week2_day5", file: "day5.ipynb", label: "Building support dashboard UI" },
    { id: "week2_extra", file: "extra.ipynb", label: "Advanced context packing" },
    { id: "week2_revealer", file: "revealer.py", label: "UI revealer utility" },
    { id: "week2_scraper", file: "scraper.py", label: "Link scraper utility" },
    { id: "week2_exercise", file: "week2 EXERCISE.ipynb", label: "Week 2 Challenge" }
  ],
  week3: [
    { id: "week3_day1", file: "day1.ipynb", label: "Ollama APIs & custom systems" },
    { id: "week3_day2", file: "day2.ipynb", label: "HuggingFace Hub & local weights" },
    { id: "week3_day3", file: "day3.ipynb", label: "Audio Transcriptions (Whisper)" },
    { id: "week3_day4", file: "day4.ipynb", label: "Combining Audio & LLMs" },
    { id: "week3_day5", file: "day5.ipynb", label: "Structured audio summaries" },
    { id: "week3_visualizer", file: "visualizer.py", label: "Visualizer util" }
  ],
  week4: [
    { id: "week4_day3", file: "day3.ipynb", label: "Llama vs GPT side-by-side evals" },
    { id: "week4_day4", file: "day4.ipynb", label: "Automated scoring setups" },
    { id: "week4_day5", file: "day5.ipynb", label: "Public Benchmark comparisons" },
    { id: "week4_styles", file: "styles.py", label: "Styles helper" },
    { id: "week4_system_info", file: "system_info.py", label: "Diagnostic info" }
  ],
  week5: [
    { id: "week5_day1", file: "day1.ipynb", label: "Semantic Embeddings & Indexing" },
    { id: "week5_day2", file: "day2.ipynb", label: "ChromaDB Vector Store setups" },
    { id: "week5_day3", file: "day3.ipynb", label: "RAG Retrieval pipelines" },
    { id: "week5_day4", file: "day4.ipynb", label: "Managing Context Window boundaries" },
    { id: "week5_day5", file: "day5.ipynb", label: "Dynamic PDF QA Chat interface" },
    { id: "week5_app", file: "app.py", label: "Vite stream app server" },
    { id: "week5_evaluator", file: "evaluator.py", label: "RAG retriever evaluator script" }
  ],
  week6: [
    { id: "week6_day1", file: "day1.ipynb", label: "Dataset preprocessing" },
    { id: "week6_day2", file: "day2.ipynb", label: "Baseline prompt testing" },
    { id: "week6_day3", file: "day3.ipynb", label: "Inference pipelines" },
    { id: "week6_day4", file: "day4.ipynb", label: "Evaluating predictions" },
    { id: "week6_day5", file: "day5.ipynb", label: "Analyzing baseline margins" },
    { id: "week6_redemption_run", file: "redemption_run.ipynb", label: "Batch runner" },
    { id: "week6_redemption_train", file: "redemption_train.ipynb", label: "Price model trainer" },
    { id: "week6_results", file: "results.ipynb", label: "Baseline result summary" }
  ],
  week7: [
    { id: "week7_day1", file: "day1.ipynb", label: "Formatting datasets for training" },
    { id: "week7_day2", file: "day2.ipynb", label: "PEFT/QLoRA config setups" },
    { id: "week7_day3_4", file: "day3 and 4.ipynb", label: "GPU Training loop execution" },
    { id: "week7_day5", file: "day5.ipynb", label: "Local model evaluation tests" },
    { id: "week7_results", file: "results.ipynb", label: "Post-training comparison summaries" },
    { id: "week7_util", file: "util.py", label: "Training utility helpers" }
  ],
  week8: [
    { id: "week8_day1", file: "day1.ipynb", label: "Multi-agent planning concepts" },
    { id: "week8_day2", file: "day2.ipynb", label: "Tool creation & parameters validation" },
    { id: "week8_day3", file: "day3.ipynb", label: "Agent task delegation loops" },
    { id: "week8_day4", file: "day4.ipynb", label: "Execution runs & callbacks" },
    { id: "week8_day5", file: "day5.ipynb", label: "Testing complete agent deals locator" },
    { id: "week8_deal_agent_framework", file: "deal_agent_framework.py", label: "Agent Orchestration module" },
    { id: "week8_hello", file: "hello.py", label: "Intro setup check" },
    { id: "week8_llama", file: "llama.py", label: "Llama wrapper utilities" },
    { id: "week8_log_utils", file: "log_utils.py", label: "Logging & console print handlers" },
    { id: "week8_price_is_right", file: "price_is_right.py", label: "Mock deal engine" },
    { id: "week8_pricer_ephemeral", file: "pricer_ephemeral.py", label: "Ephemeral state pricer" },
    { id: "week8_pricer_service", file: "pricer_service.py", label: "Local pricer endpoint" },
    { id: "week8_pricer_service2", file: "pricer_service2.py", label: "Alternative local pricer" },
    { id: "week8_results", file: "results.ipynb", label: "Capstone execution outputs" }
  ]
};

// ===================================================================
// SUB-COMPONENTS
// ===================================================================

/** Notebook file sub-list inside a task item */
function NotebookList({ notebooks, completed, onToggle }) {
  return (
    <div className="notebook-list">
      {notebooks.map(nb => (
        <div key={nb.id} className="notebook-row">
          <input
            type="checkbox"
            className="notebook-checkbox"
            checked={!!completed[nb.id]}
            onChange={() => onToggle(nb.id)}
          />
          <span className={`notebook-label ${completed[nb.id] ? "completed" : ""}`}>
            {nb.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A single resource/task item with checkbox, name, tags, and optional link */
function TaskItem({ id, name, detail, tags, link, synced, completed, onToggle, children }) {
  return (
    <div className={`task-item ${completed ? "completed" : ""}`}>
      <div className="task-checkbox-container" onClick={() => onToggle(id)}>
        <input type="checkbox" className="task-checkbox" checked={completed} readOnly />
      </div>
      <div className="task-body">
        <div className="task-header-row">
          <span className="task-name">{name}</span>
          {link}
        </div>
        {detail && <span className="task-detail">{detail}</span>}
        <div className="task-tags">
          {tags.map((tag, i) => (
            <span key={i} className={`task-tag ${tag.cls}`}>{tag.label}</span>
          ))}
          {synced && <span className="synced-badge">Synced outline</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

// ===================================================================
// MAIN APP COMPONENT
// ===================================================================

export default function App() {
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem("ai-engineering-roadmap-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.selectedTab !== undefined) return parsed.selectedTab;
      } catch (e) {
        console.error("Could not parse saved state:", e);
      }
    }
    return 0;
  });

  const [pace, setPace] = useState(() => {
    const saved = localStorage.getItem("ai-engineering-roadmap-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.dailyPace !== undefined) return parsed.dailyPace;
      } catch (e) {
        console.error("Could not parse saved state:", e);
      }
    }
    return 1;
  });

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("ai-engineering-roadmap-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completedTasks) return parsed.completedTasks;
      } catch (e) {
        console.error("Could not parse saved state:", e);
      }
    }
    return {};
  });

  const [collapsedSteps, setCollapsedSteps] = useState({
    "0": false, "1": false, "2": false, "3": false,
    "4": true, "5": true, "6": true, "7": true, "8": true
  });

  const [diskStatus, setDiskStatus] = useState("idle");
  const [exporting, setExporting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load state from disk on mount ──
  useEffect(() => {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      setDiskStatus("cloud");
      setIsLoaded(true);
      return;
    }

    fetch("/api/load-state")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Could not load local disk state");
      })
      .then(diskData => {
        if (diskData && diskData.completedTasks !== undefined) {
          setCompleted(diskData.completedTasks);
          if (diskData.dailyPace !== undefined) setPace(diskData.dailyPace);
          if (diskData.selectedTab !== undefined) setTab(diskData.selectedTab);
          setDiskStatus("saved");
        }
        setIsLoaded(true);
      })
      .catch(err => {
        // Fall back to localStorage (state values are already initialized to localStorage values)
        console.log("Using localStorage fallback:", err.message);
        setIsLoaded(true);
      });
  }, []);

  // ── Save state on change ──
  useEffect(() => {
    if (!isLoaded) return;

    const stateData = { completedTasks: completed, dailyPace: pace, selectedTab: tab };
    localStorage.setItem(
      "ai-engineering-roadmap-state",
      JSON.stringify(stateData)
    );

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      setDiskStatus("cloud");
      return;
    }

    setDiskStatus("saving");
    fetch("/api/save-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stateData)
    })
      .then(res => {
        if (res.ok) {
          setDiskStatus("saved");
        } else {
          setDiskStatus("error");
        }
      })
      .catch(err => {
        console.error("Failed to save state to local disk:", err);
        setDiskStatus("error");
      });
  }, [completed, pace, tab, isLoaded]);



  // ── Reset ──
  const handleResetProgress = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your current progress? This cannot be undone.")) {
      setCompleted({});
    }
  }, []);

  // ── Export State ──
  const handleExportState = useCallback(() => {
    const stateData = { completedTasks: completed, dailyPace: pace, selectedTab: tab };
    navigator.clipboard.writeText(JSON.stringify(stateData))
      .then(() => {
        setExporting(true);
        setTimeout(() => setExporting(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy state:", err);
      });
  }, [completed, pace, tab]);

  // ── Toggle with parent↔child propagation ──
  const handleToggleTask = useCallback((id) => {
    setCompleted(prev => {
      const next = { ...prev };
      const isChecking = !prev[id];
      next[id] = isChecking;

      // Parent→Child: cascade to children
      if (PARENT_TO_CHILD[id]) {
        PARENT_TO_CHILD[id].forEach(childId => { next[childId] = isChecking; });
      }

      // Child→Parent: re-evaluate parents
      const evaluateParents = (childId) => {
        const parents = CHILD_TO_PARENTS[childId];
        if (parents) {
          parents.forEach(parentId => {
            const siblings = PARENT_TO_CHILD[parentId];
            next[parentId] = siblings.every(s => next[s]);
          });
        }
      };

      evaluateParents(id);
      if (PARENT_TO_CHILD[id]) {
        PARENT_TO_CHILD[id].forEach(evaluateParents);
      }

      return next;
    });
  }, []);

  // ── Collapse toggle ──
  const toggleStepCollapse = useCallback((stepNum) => {
    setCollapsedSteps(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  }, []);

  // ── Computed progress ──
  const totalItems = ALL_CHECKPOINT_IDS.length;
  const completedItemsCount = useMemo(() => {
    return ALL_CHECKPOINT_IDS.filter(id => !!completed[id]).length;
  }, [completed]);
  const progressPercentage = totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;

  const stepProgressMap = useMemo(() => {
    const progressMap = {};
    Object.entries(STEP_CHILD_IDS).forEach(([stepNum, childList]) => {
      const done = childList.filter(id => !!completed[id]).length;
      progressMap[stepNum] = Math.round((done / childList.length) * 100);
    });
    return progressMap;
  }, [completed]);

  const trackPercentages = useMemo(() => {
    const percentages = {};
    Object.entries(TRACK_TASKS).forEach(([trackId, tasks]) => {
      const done = tasks.filter(t => !!completed[t]).length;
      percentages[trackId] = Math.round((done / tasks.length) * 100);
    });
    return percentages;
  }, [completed]);

  // ── Link helpers ──
  const webLink = (url, label = "Web ↗") => (
    <a href={url} className="task-link" target="_blank" rel="noopener noreferrer">{label}</a>
  );

  const courseLink = webLink(UDEMY_COURSE_URL, "Udemy ↗");

  // ── Step renderer helper ──
  const renderStep = (num, color, title, duration, whyText, doingText, unlocksText, tasks) => (
    <div className={`step-card ${collapsedSteps[String(num)] ? "collapsed" : ""}`}>
      <div className="step-header" onClick={() => toggleStepCollapse(String(num))}>
        <div className="step-badge" style={{ background: color }}>{num}</div>
        <div className="step-title">{title}</div>
        <div className="step-meta">
          <span className="step-duration">{duration}</span>
          <span className="step-percent">{stepProgressMap[String(num)]}%</span>
          <span className="collapse-icon">▲</span>
        </div>
      </div>
      <div className="step-content">
        <div className="section-label">Why this is here</div>
        <div className="why-box">{whyText}</div>
        <div className="section-label">What you are doing</div>
        <div className="doing-box">{doingText}</div>
        <div className="section-label">Resources & Tasks</div>
        <div className="checklist-section">{tasks}</div>
        <div className="unlocks-box">
          <div className="unlocks-title">After this you can...</div>
          <div className="unlocks-text">{unlocksText}</div>
        </div>
      </div>
    </div>
  );

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <>
      <div className="app-container">
        {/* Header */}
        <header>
          <div className="header-top">
            <h1>AI Engineering Roadmap</h1>
            <div className="header-actions">
              <span className="version-tag">V3 · Interactive</span>
              {diskStatus === "cloud" && <span className="sync-status status-cloud">☁ Cloud Mode</span>}
              {diskStatus === "saved" && <span className="sync-status status-saved">● Disk Synced</span>}
              {diskStatus === "saving" && <span className="sync-status status-saving">○ Saving...</span>}
              {diskStatus === "error" && <span className="sync-status status-error">▲ Disk Error</span>}
              <button className="reset-btn" onClick={handleExportState}>
                {exporting ? "✓ Copied!" : "Export Progress"}
              </button>
              <button className="reset-btn" onClick={handleResetProgress}>Reset Progress</button>
            </div>
          </div>
          <div className="tagline">Interactive curriculum mapping Chip Huyen's AI Engineering book and Edward Donner's LLM course.</div>
        </header>

        {/* Stats Dashboard */}
        <section className="stats-dashboard">
          <div className="stat-progress-col">
            <div className="stat-progress-header">
              <span className="stat-progress-title">Overall Roadmap Progress</span>
              <span className="stat-progress-percent">{progressPercentage}%</span>
            </div>
            <div className="progress-track-bg">
              <div className="progress-track-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{completedItemsCount} <span className="stat-value-secondary">/ {totalItems}</span></div>
            <div className="stat-label">Tasks Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{totalItems - completedItemsCount}</div>
            <div className="stat-label">Tasks Remaining</div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="tabs-nav">
          {TABS.map((t, i) => (
            <button key={i} className={`tab-btn ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* ─────────────────────── TAB 0: ROADMAP STEPS ─────────────────────── */}
        {tab === 0 && (
          <div>
            <div className="intro-banner">
              <strong>Interactive Guide:</strong> Click steps to expand them. Check off individual notebooks, chapters, and blogs as you complete them to automatically update your progress logs. Checked items are saved to your browser.
            </div>

            {/* Step 0 */}
            {renderStep(0, STEP_COLORS[0], "Pre-reading: Landscape & Foundational Logic", "4–5 hrs",
              "Opening a course cold and copying code is the worst way to learn. Reading chapters beforehand provides context, so every line of code has a design reason. These reads define the vocab and agentic patterns.",
              "Reading Chip Huyen Chapter 1 (AI Engineering fundamentals), Chapter 5 (Instruction & Prompt design), and the Anthropic Agents blog post to define your mental framing.",
              "Navigate prompt strategies intelligently and recognize agent structures before coding them.",
              <>
                <TaskItem id="s0_book_ch1" name="Book Ch1 — Planning AI Applications" detail="What AI engineering is, how it differs from traditional ML, and stack planning." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s0_book_ch1"]} onToggle={handleToggleTask} />
                <TaskItem id="s0_book_ch5" name="Book Ch5 — Prompt Engineering" detail="How to write prompts for consistent outputs, defensive prompting, jailbreaks." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s0_book_ch5"]} onToggle={handleToggleTask} />
                <TaskItem id="s0_anthropic_agents_blog" name="Anthropic Blog — Building Effective Agents" detail="The five patterns every agent system uses. Defines the vocabulary for the agent tracks." tags={[{cls:"tag-blog",label:"Blog"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s0_anthropic_agents_blog"]} onToggle={handleToggleTask} link={webLink("https://www.anthropic.com/research/building-effective-agents")} />
              </>
            )}

            {/* Step 1 */}
            {renderStep(1, STEP_COLORS[1], "First Builds: Website Scraper & Multi-modal Chatbots", "~2 weeks",
              "Shipped code maps directly to book theory. Reading Chapter 2 explains what is happening under the hood (word generation, tokens, cache, temperatures) as you build your first chatbot.",
              "Building an AI brochure generator (Week 1) and a multi-modal support chatbot with function calling (Week 2). Reading Chapter 2 concurrently to reinforce theory.",
              "Build full chatbot applications that read images, trigger database writes/reads, and handle multi-turn history.",
              <>
                <TaskItem id="s1_book_ch2" name="Book Ch2 — Understanding Foundation Models" detail="Word generation, context lengths, cache mechanics, sampling." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s1_book_ch2"]} onToggle={handleToggleTask} />
                <TaskItem id="s1_udemy_w1" name="Udemy Week 1 — AI Brochure Generator Project" detail="Scrapes websites and prints structural markdown brochure copies." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s1_udemy_w1"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week1} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
                <TaskItem id="s1_udemy_w2" name="Udemy Week 2 — Multi-modal support Chatbot" detail="Chatbot that views image inputs and runs function tools (e.g. checks flights)." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s1_udemy_w2"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week2} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
              </>
            )}

            {/* Step 2 */}
            {renderStep(2, STEP_COLORS[2], "Open-Source & Local Models", "~1 week",
              "Before making architectural decisions, you need to understand cost trade-offs. Running models locally (e.g. Ollama, HuggingFace) is often more cost-effective and secure than calling cloud API wrappers.",
              "Converting audio meeting recordings to formatted minutes/action items using local and cloud open models.",
              "Host open-source models, compute transcriptions locally, and assess when a local model is suitable for data privacy needs.",
              <>
                <TaskItem id="s2_udemy_w3" name="Udemy Week 3 — Open-Source Models" detail="Installing local models using Ollama and HuggingFace. Meeting minutes converter." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s2_udemy_w3"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week3} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
              </>
            )}

            {/* Step 3 */}
            {renderStep(3, STEP_COLORS[3], "Evaluation Foundations", "~1 week",
              "Week 4 is the lightest Udemy week, making it the perfect time to start Chapters 3 & 4 (the evaluation methodology theory). Planting the seed early ensures you think about how to measure output, not just write code.",
              "Comparing model performance side-by-side using A/B testing and public benchmarks. Beginning the book chapters on metric selection and validation methodologies.",
              "Avoid guessing model improvements and implement structured scoring tests to choose models based on data.",
              <>
                <TaskItem id="s3_book_ch3" name="Book Ch3 — Evaluation Methodology (Start)" detail="Challenges, exact evaluation (similarity metrics), embeddings, perplexity metrics." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s3_book_ch3"]} onToggle={handleToggleTask} />
                <TaskItem id="s3_book_ch4" name="Book Ch4 — Evaluate AI Systems (Start)" detail="Criteria (Latency/Cost), model selection workflows, build vs buy." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s3_book_ch4"]} onToggle={handleToggleTask} />
                <TaskItem id="s3_udemy_w4" name="Udemy Week 4 — Model Comparison & Evals" detail="Blind A/B testing and public benchmarks analysis." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s3_udemy_w4"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week4} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
              </>
            )}

            {/* Step 4 */}
            {renderStep(4, STEP_COLORS[4], "Retrieval-Augmented Generation (RAG)", "~1.5 weeks",
              "RAG is the single most important pattern in AI engineering. It connects models to private business data. Reading the architecture concepts (chunk boundaries, semantic split indexes) prepares you to write clean retrieval code.",
              "Building an AI knowledge worker that answers questions from custom uploaded corporate docs (Week 5). Upgrading it to an agentic retriever using DL.AI.",
              "Implement custom RAG databases that safely ingest custom formats and answers queries accurately.",
              <>
                <TaskItem id="s4_book_ch6" name="Book Ch6 — RAG Architecture (First Half)" detail="What RAG is, split sizes, vector math, search index strategies." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s4_book_ch6"]} onToggle={handleToggleTask} />
                <TaskItem id="s4_udemy_w5" name="Udemy Week 5 — AI Knowledge Worker Project" detail="Builds a complete corporate document QA bot." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s4_udemy_w5"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week5} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
                <TaskItem id="s4_supp_agentic_rag" name="DL.AI — Agentic RAG with LlamaIndex" detail="Evolves a plain RAG retrieval into a stateful routing agent that calls queries." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s4_supp_agentic_rag"]} onToggle={handleToggleTask} link={webLink("https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/")} />
              </>
            )}

            {/* Step 5 */}
            {renderStep(5, STEP_COLORS[5], "Fine-Tuning & Advanced RAG", "~2 weeks",
              "Fine-tuning changes model style/formatting behavior, while RAG injects specific facts. Doing both allows you to customize outputs. We also top up advanced production RAG techniques (HyDE, Cross-encoder ranking).",
              "Fine-tuning an open-source model with QLoRA to predict price estimates. Learning semantic chunk splits and re-ranking vectors.",
              "Adapt small open-source models to follow highly specific domain formatting instructions.",
              <>
                <TaskItem id="s5_book_ch7" name="Book Ch7 — Finetuning" detail="When to finetune vs RAG, memory math bottlenecks, quantization, PEFT methods." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s5_book_ch7"]} onToggle={handleToggleTask} />
                <TaskItem id="s5_udemy_w6" name="Udemy Week 6 — Price Prediction Baseline" detail="Build price prediction endpoints using standard frontier model prompts." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s5_udemy_w6"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week6} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
                <TaskItem id="s5_udemy_w7" name="Udemy Week 7 — Fine-tune model with QLoRA" detail="Train local weights to outperform GPT-4 on structured tasks at lower cost." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s5_udemy_w7"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week7} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
                <TaskItem id="s5_supp_advanced_rag" name="Educative — Advanced RAG Techniques" detail="Covers semantic split chunk boundary maps, HyDE query transformations, cross-encoder ranking." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid (~$15)"}]} completed={!!completed["s5_supp_advanced_rag"]} onToggle={handleToggleTask} link={webLink("https://www.educative.io/courses/advanced-rag-techniques")} />
              </>
            )}

            {/* Step 6 */}
            {renderStep(6, STEP_COLORS[6], "Autonomous Agents & Workflows", "~1.5 weeks",
              "Agents represent stateful models taking real actions (web searches, files, emails). Errors accumulate across steps, making loops dangerous. Reading the failure modes theory helps you design safe orchestrations.",
              "Building a multi-agent comparison system where agents find product deals (Week 8). Building graph-based state machines using LangGraph.",
              "Build resilient workflows that recover from API failures and execute multi-file changes safely.",
              <>
                <TaskItem id="s6_book_ch6" name="Book Ch6 — Agent & Memory Sections (Second Half)" detail="Agent loops, tools, execution planning, context compaction, state stores." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s6_book_ch6"]} onToggle={handleToggleTask} />
                <TaskItem id="s6_udemy_w8" name="Udemy Week 8 — Autonomous multi-agent capstone" detail="Builds a multi-agent framework that scrapes, calculates prices, and emails deals." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-paid",label:"Paid Track"}]} completed={!!completed["s6_udemy_w8"]} onToggle={handleToggleTask} link={courseLink}>
                  <NotebookList notebooks={NOTEBOOK_DATA.week8} completed={completed} onToggle={handleToggleTask} />
                </TaskItem>
                <TaskItem id="s6_supp_langgraph" name="DL.AI — AI Agents in LangGraph" detail="Builds structured stateful agents with nodes, edges, and conditional routing." tags={[{cls:"tag-course",label:"Course"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s6_supp_langgraph"]} onToggle={handleToggleTask} link={webLink("https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/")} />
              </>
            )}

            {/* Step 7 */}
            {renderStep(7, STEP_COLORS[7], "Enterprise-Grade Evaluation", "~1 week",
              "Generative models are probabilistic. Changing a prompt to fix one edge case often silently breaks another. Continuous, automated evaluations are what separate demos from enterprise software.",
              "Completing Chapters 3 & 4. Studying RAG evaluation guides and case studies. Building an eval scorer on top of your Week 5 RAG code.",
              "Deploy automated prompts and know exactly whether quality metrics improved or degraded.",
              <>
                <TaskItem id="s7_book_ch3" name="Book Ch3 — Evaluation Methodology (Finish)" detail="Completing AI-as-a-judge topics, comparative Elo ranking." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s7_book_ch3"]} onToggle={handleToggleTask} />
                <TaskItem id="s7_book_ch4" name="Book Ch4 — Evaluate AI Systems (Finish)" detail="Designing automated pipeline steps, guidelines, ground truth data creation." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s7_book_ch4"]} onToggle={handleToggleTask} />
                <TaskItem id="s7_supp_evidently_rag" name="Evidently AI — Complete Guide to RAG Evaluation" detail="Specific metrics for RAG quality: precision, recall, faithfulness, relevance." tags={[{cls:"tag-blog",label:"Guide"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s7_supp_evidently_rag"]} onToggle={handleToggleTask} link={webLink("https://www.evidentlyai.com/llm-guide/rag-evaluation")} />
                <TaskItem id="s7_supp_canva_eval" name="ZenML — How Canva Evaluates AI Systems" detail="Real case study: automated regression check pipelines when prompts change." tags={[{cls:"tag-blog",label:"Case Study"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s7_supp_canva_eval"]} onToggle={handleToggleTask} link={webLink("https://www.zenml.io/llmops-database/systematic-llm-evaluation-framework-for-content-generation")} />
                <TaskItem id="s7_supp_anthropic_eval" name="Anthropic — Demystifying Evals for AI Agents" detail="How to measure final outcomes instead of checking rigid function call ordering." tags={[{cls:"tag-blog",label:"Guide"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s7_supp_anthropic_eval"]} onToggle={handleToggleTask} link={webLink("https://www.anthropic.com/news/evaluating-ai-agents")} />
              </>
            )}

            {/* Step 8 */}
            {renderStep(8, STEP_COLORS[8], "Production observability & continuous improvement", "Ongoing",
              "Observability closes the loop: gathering production telemetry lets you discover real user feedback. Newsletters help you filter out noise without burning out.",
              "Reading Chapter 10 (User feedback loops). Setting up Langfuse telemetry on one of your existing RAG apps.",
              "Observe production prompts, catch latency spikes, and stay updated without feeling overwhelmed by noise.",
              <>
                <TaskItem id="s8_book_ch10" name="Book Ch10 — Architecture & User Feedback" detail="Telemetry gateway configs, routing strategies, extracting conversational feedback." tags={[{cls:"tag-book",label:"Book"}]} synced completed={!!completed["s8_book_ch10"]} onToggle={handleToggleTask} />
                <TaskItem id="s8_supp_langfuse" name="Langfuse — Observability Setup" detail="Connect OpenTelemetry to trace input prompts, latency, and tokens in real time." tags={[{cls:"tag-tool",label:"Tool"},{cls:"tag-free",label:"Free Tier"}]} completed={!!completed["s8_supp_langfuse"]} onToggle={handleToggleTask} link={webLink("https://langfuse.com")} />
                <TaskItem id="s8_supp_long_running" name="Anthropic — Harness Design for Long-Running Apps" detail="Structured context resets and compaction rules to prevent runaway token costs." tags={[{cls:"tag-blog",label:"Guide"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s8_supp_long_running"]} onToggle={handleToggleTask} link={webLink("https://www.anthropic.com/news/harnessing-agents")} />
                <TaskItem id="s8_supp_latent_space" name="Latent Space Weekly Newsletter" detail="The primary publication focused specifically on AI Engineering." tags={[{cls:"tag-blog",label:"Newsletter"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s8_supp_latent_space"]} onToggle={handleToggleTask} link={webLink("https://www.latent.space")} />
                <TaskItem id="s8_supp_tldr_ai" name="TLDR AI Daily Digest" detail="5-minute daily summary to discover new models, libraries, and benchmarks." tags={[{cls:"tag-blog",label:"Newsletter"},{cls:"tag-free",label:"Free"}]} completed={!!completed["s8_supp_tldr_ai"]} onToggle={handleToggleTask} link={webLink("https://tldr.tech/ai")} />
              </>
            )}
          </div>
        )}

        {/* ─────────────────────── TAB 1: BOOK OUTLINE ─────────────────────── */}
        {tab === 1 && (
          <div className="book-container">
            <div className="intro-banner">
              <strong>Chip Huyen Book Outline:</strong> Below is the full table of contents for <em>AI Engineering: Building Applications with Foundation Models</em>. Checkboxes here are synced with the book reading milestones in the roadmap tabs.
            </div>
            {BOOK_OUTLINE.map((chapter) => {
              const checkedCount = chapter.sections.filter(s => !!completed[s.id]).length;
              const chapterProgress = Math.round((checkedCount / chapter.sections.length) * 100);
              return (
                <div key={chapter.num} className="book-chapter-card">
                  <div className="book-chapter-header">
                    <span className="book-chapter-title">Chapter {chapter.num}. {chapter.title}</span>
                    <span className="book-chapter-progress">{chapterProgress}% ({checkedCount}/{chapter.sections.length})</span>
                  </div>
                  <div className="book-subsections-list">
                    {chapter.sections.map(section => (
                      <div key={section.id} className={`book-sub-item ${completed[section.id] ? "completed" : ""}`}>
                        <input
                          type="checkbox"
                          className="book-sub-checkbox"
                          checked={!!completed[section.id]}
                          onChange={() => handleToggleTask(section.id)}
                        />
                        <span>{section.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─────────────────────── TAB 2: TIMELINE PLANNER ─────────────────────── */}
        {tab === 2 && (
          <div>
            <section className="timeline-pacing-sec">
              <div className="stat-progress-title">Select Study Commitment</div>
              <div className="timeline-btn-group">
                {[1, 1.5, 2].map(h => (
                  <button key={h} className={`timeline-btn ${pace === h ? "active" : ""}`} onClick={() => setPace(h)}>
                    {h} hr{h !== 1 ? "s" : ""} / day
                  </button>
                ))}
              </div>
              <div className="timeline-stats">
                <div className="timeline-stat-item">
                  <div className="timeline-stat-value">{PACE_SETTINGS[pace].wk}</div>
                  <div className="timeline-stat-label">to complete</div>
                </div>
                <div className="timeline-stat-item">
                  <div className="timeline-stat-value">{PACE_SETTINGS[pace].mo}</div>
                  <div className="timeline-stat-label">calendar time</div>
                </div>
                <div className="timeline-stat-item">
                  <div className="timeline-stat-value">{PACE_SETTINGS[pace].done}</div>
                  <div className="timeline-stat-label">est. completion</div>
                </div>
                <div className="timeline-stat-item">
                  <div className="timeline-stat-value">8 projects</div>
                  <div className="timeline-stat-label">actually shipped</div>
                </div>
              </div>
            </section>

            <div className="section-label" style={{ marginBottom: "12px" }}>Schedule and Tracks progress</div>
            {TRACKS_INFO.map((track) => {
              const currentPercent = trackPercentages[track.id] || 0;
              return (
                <div key={track.id} className="timeline-track-card" style={{ borderLeftColor: track.color }}>
                  <div className="track-header">
                    <div className="track-dot" style={{ background: track.color }} />
                    <div className="track-name">{track.name}</div>
                    <div className="track-timeline">{PACE_SETTINGS[pace].t[track.id]}</div>
                  </div>
                  <div className="track-desc">{track.t}</div>
                  <div className="track-progress-bar">
                    <div className="track-progress-fill" style={{ width: `${currentPercent}%`, background: track.color }} />
                  </div>
                  <div className="track-bottom">
                    <span>{track.l}</span>
                    <span className={currentPercent === 100 ? "track-complete" : ""}>{currentPercent}% completed</span>
                  </div>
                </div>
              );
            })}

            <div className="timeline-buy-box">
              What to buy next after finishing this path: Course 2 (Complete Agentic AI Engineering) for MCP and AutoGen coverage. Course 3 (AI in Production) when you have something real to deploy. Both will mean significantly more after you have the foundation this path builds.
            </div>
          </div>
        )}

        {/* ─────────────────────── TAB 3: WHY THIS ORDER ─────────────────────── */}
        {tab === 3 && (
          <div>
            <div className="intro-banner">
              This is not a generic AI course list. It is a specific path built around two things you already own — the Chip Huyen book and the Udemy Core Track. Every other resource is here because removing it would leave a real gap. Nothing is included because it sounds good.
            </div>

            <div className="section-label" style={{ marginBottom: "12px" }}>Your Complete Stack</div>
            <div className="stack-pills">
              {[
                { l: "AI Engineering — Chip Huyen", bg: "rgba(139, 92, 246, 0.08)", c: "#7c3aed" },
                { l: "Udemy Core Track — 8 projects", bg: "rgba(93, 184, 166, 0.08)", c: "#3d9e89" },
                { l: "DL.AI Agentic RAG — free", bg: "rgba(204, 120, 92, 0.06)", c: "#cc785c" },
                { l: "DL.AI LangGraph — free", bg: "rgba(204, 120, 92, 0.06)", c: "#cc785c" },
                { l: "Educative Advanced RAG — ~$15", bg: "rgba(232, 165, 90, 0.08)", c: "#c78a3f" }
              ].map((p, i) => (
                <span key={i} className="stack-pill" style={{ color: p.c, background: p.bg }}>{p.l}</span>
              ))}
            </div>

            <div className="section-label" style={{ marginBottom: "12px" }}>What We Dropped and Why</div>
            <div className="dropped-grid">
              {[
                { n: "Karpathy Zero to Hero", r: "40+ hrs building backprop from scratch. You need to know what a model does, not how to build one. Book Ch2 covers the internals you actually need in 2 hrs of reading." },
                { n: "3Blue1Brown series", r: "Same purpose as Karpathy. Dropped for the same reason. Book Ch2 is faster and pairs better with the practical work." },
                { n: "IBM / Coursera specialisations", r: "Fully covered by Core Track and book together. Doing both is repetition, not learning." },
                { n: "Jay Alammar blog", r: "Good reference, but the book covers the same concepts more completely. Bookmark it for later if you want a visual refresher." },
                { n: "DL.AI Generative AI with LLMs", r: "Book Chapter 2 is a better version of this course. No need for both." },
                { n: "Coursera Multi-Agent Systems", r: "Core Track Week 8 and book Chapter 6 cover the same ground with better context around them." },
                { n: "Analytics Vidhya RAG guide", r: "Useful reference, not structured learning. The book handles this job better." }
              ].map((d, i) => (
                <div key={i} className="dropped-card">
                  <div className="dropped-header">
                    <span>✕</span>
                    <span>{d.n}</span>
                  </div>
                  <div className="dropped-desc">{d.r}</div>
                </div>
              ))}
            </div>

            <div className="section-label" style={{ marginBottom: "12px" }}>First Principles — Why this specific order</div>
            {[
              { n: "Principle 1", t: "Read the map before you start the journey", d: "Opening a course cold and following the code is the worst way to learn. You execute instructions without understanding why the architecture was designed that way. Reading the book chapters before each Udemy section means every line of code has a reason behind it, not just a tutorial to copy." },
              { n: "Principle 2", t: "You are building products, not AI itself", d: "Karpathy and 3Blue1Brown are for people who want to build models. You want to build with the models. Those are fundamentally different goals. You need to understand what happens when you call an AI model — not how to implement the mathematics that powers it. The book covers the first. Karpathy covers the second. Only the first is relevant here." },
              { n: "Principle 3", t: "Theory paired with practice, not theory then practice", d: "If you read the entire book first and then start building, you will have forgotten 80% of it by the time the relevant code arrives. Each book chapter is read alongside the Udemy week it maps to. Theory and code reinforce each other in real time rather than one fading before the other arrives." },
              { n: "Principle 4", t: "RAG before agents, because agents use RAG as a tool", d: "Agents are AI systems that take actions in the world. One of the most common actions they take is looking something up — which is exactly what RAG does. If you build an agent without first understanding how information retrieval works, you are building something you do not understand. RAG must come first." },
              { n: "Principle 5", t: "Evaluation comes after you have something real to evaluate", d: "Evaluation frameworks are meaningless in the abstract. You need real systems before the evaluation concepts land properly. Starting the evaluation chapters early and finishing them in Step 7 means you read the theory while you have actual code to apply it to — not as a thought experiment." },
              { n: "Principle 6", t: "Three supplements, each filling one specific gap", d: "The Agentic RAG course fills the gap between RAG as a pipeline and RAG as a tool an agent uses. The LangGraph course fills the stateful workflow gap the Core Track leaves open. The Advanced RAG course fills the production-technique gap (better chunking, smarter search, relevance reranking). Remove any one of these three and you have a real hole in your knowledge. Add anything else and you have redundancy." }
            ].map((p, i) => (
              <div key={i} className="principle-card">
                <div className="principle-num">{p.n}</div>
                <div className="principle-title">{p.t}</div>
                <div className="principle-desc">{p.d}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </>
  );
}
