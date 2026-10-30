/* ============================================
   段位品牌战略 · 交互脚本（SPA 单页切换）
   ============================================ */

// ---------- 作品案例数据 ----------
const works = [
  { name: "小蓝帽增产药", tag: "农业", desc: "打造独特的品牌视觉识别系统，助力农业增产领域品牌快速崛起", g: 0, img: "images/cases/case-1.jpg" },
  { name: "彭世修脚", tag: "健康", desc: "以传统中医理念为基础，打造专业修脚服务品牌的视觉识别体系", g: 1, img: "images/cases/case-2.jpg" },
  { name: "云联牧场", tag: "畜牧", desc: "建立现代化畜牧品牌的视觉认知，提升品牌溢价能力", g: 2, img: "images/cases/case-3.jpg" },
  { name: "艾红象艾灸", tag: "养生", desc: "以大象为符号结合艾草元素，打造艾灸品类的强势品牌识别", g: 3, img: "images/cases/case-4.jpg" },
  { name: "猪太子教槽料", tag: "饲料", desc: "打造高端教槽料品牌的视觉形象，在竞争激烈的饲料市场中脱颖而出", g: 4, img: "images/cases/case-5.jpg" },
  { name: "相知鸟精品银饰", tag: "珠宝", desc: "以鸟儿为符号，打造精品银饰的高端品牌形象，强化品牌记忆点", g: 5, img: "images/cases/case-6.jpg" },
];

function thumbSVG(g) {
  const grays = ["#1b4db1", "#0c0c0c", "#e8e8e4", "#143a86", "#d9d9d4", "#2a5fc0"];
  const shapes = [
    '<circle cx="50%" cy="50%" r="30%" fill="%C%" />',
    '<polygon points="50%,14% 88%,80% 12%,80%" fill="%C%" />',
    '<rect x="20%" y="28%" width="60%" height="8%" fill="%C%" /><rect x="20%" y="44%" width="46%" height="8%" fill="%C%" /><rect x="20%" y="60%" width="30%" height="8%" fill="%C%" />',
    '<circle cx="50%" cy="50%" r="28%" fill="none" stroke="%C%" stroke-width="16%" />',
    '<rect x="34%" y="34%" width="32%" height="32%" fill="%C%" />',
    '<path d="M20% 70% A 30% 30% 0 0 1 80% 70% Z" fill="%C%" />',
  ];
  const c = grays[g % grays.length];
  const inner = shapes[g % shapes.length].split("%C%").join(c);
  return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
         '<rect width="400" height="300" fill="#f0f0ed"/>' + inner + '</svg>';
}

const grid = document.getElementById("worksGrid");
if (grid) {
  grid.innerHTML = works.map((w) => `
    <a class="work-card">
      <div class="work-frame">
        <div class="work-thumb">${thumbSVG(w.g)}<div class="overlay"><span>查看案例</span></div></div>
        <div class="work-meta">
          <span class="work-name">${w.name}</span>
          <span class="work-tag">${w.tag}</span>
        </div>
        <p class="work-desc">${w.desc}</p>
      </div>
    </a>
  `).join("");
}

// ---------- 面板切换（SPA）----------
const navLinks = document.querySelectorAll(".side-link");
const panels = document.querySelectorAll(".panel");

function showPanel(id) {
  // 隐藏所有面板，显示目标面板
  panels.forEach((p) => p.classList.toggle("active", p.id === "panel-" + id));
  // 更新导航高亮
  navLinks.forEach((l) => l.classList.toggle("active", l.dataset.nav === id));
}

navLinks.forEach((l) => {
  l.addEventListener("click", () => showPanel(l.dataset.nav));
});

// 首页按钮跳转
document.querySelectorAll("[data-goto]").forEach((b) => {
  b.addEventListener("click", () => showPanel(b.dataset.goto));
});

// 侧边栏 Logo 点击回首页
document.querySelector(".logo")?.addEventListener("click", (e) => {
  e.preventDefault();
  showPanel("home");
});

// ---------- 数字滚动（进入关于我们时触发）----------
const counters = document.querySelectorAll("[data-count]");
let counted = false;
function runCounters() {
  if (counted) return;
  counted = true;
  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
// 监听面板切换，切到 about 时触发计数
const aboutObserver = new MutationObserver(() => {
  const about = document.getElementById("panel-about");
  if (about && about.classList.contains("active")) runCounters();
});
panels.forEach((p) => aboutObserver.observe(p, { attributes: true, attributeFilter: ["class"] }));

// 首次加载若在首页则不计数；若直达 about 则计数
if (document.getElementById("panel-about").classList.contains("active")) runCounters();


/* ============ 段位方法 · 立体书架 + 可翻页的书 ============ */
const books = [
  {
    title: "洞察定位", sub: "找到品牌真正可占据的位置", paras: [
      "定位不是一句口号，而是一个阵地。动手做创意之前，先弄清楚：这块市场里，哪个位置还没有人站，或者站得不稳。",
      "我们从市场、竞品、用户三条线同时切入：看品类的真实格局，看对手的强弱之处，看用户嘴上说的与心里要的差距。",
      "洞察的产出必须能指导动作——一句定位语，一组人群画像，一张竞争坐标图。含糊的结论，我们不给。"
    ]
  },
  {
    title: "策略架构", sub: "把定位搭成一座能住人的房子", paras: [
      "定位定了方向，架构解决「往哪儿走、说什么、怎么排兵布阵」。我们为品牌搭建话语体系与价值模型，让每一个传播动作都往同一个地方使劲。",
      "从品牌故事到口号体系，从产品线逻辑到内容支柱，策略架构是品牌的地基与梁柱——看不见，但决定能盖多高。"
    ]
  },
  {
    title: "设计表达", sub: "让策略长出看得见的样子", paras: [
      "设计不是美化，是翻译——把策略翻译成消费者三秒就能读懂的视觉语言。",
      "标志、色彩、字体、辅助图形，我们做减法多于做加法：克制，但每一样都有存在的理由。",
      "目标是建立统一而有个性的识别系统，让人在货架上、在街边、在手机屏幕里，一眼认出你。"
    ]
  },
  {
    title: "落地生长", sub: "在真实场景里持续积累势能", paras: [
      "方案不会自己落地。我们贯穿到包装、空间、传播与电商等真实场景，盯着每一个执行细节不被走样。",
      "品牌不是一次交付，而是一段陪伴——上线只是开始，我们和客户一起复盘数据、迭代动作，让品牌随时间越站越稳。"
    ]
  },
  {
    title: "视觉锤", sub: "一记钉进心智的锤子", paras: [
      "语言钉子要靠视觉锤来钉。我们善用六种锤：颜色锤、符号锤、包装锤、动物锤、形状锤、动态锤。",
      "一个好锤子同时满足两个条件：与定位强关联，且能被低成本地重复。重复产生记忆，记忆产生资产。",
      "视觉锤不是玄学，而是可检验的工具——放进货架、放进信息流，测一测它能不能在三秒内被记住。"
    ]
  },
  {
    title: "创意的目的", sub: "为生意服务，为段位服务", paras: [
      "创意不为了好看，也不为了获奖。它的唯一目的，是让品牌的生意更有效，让品牌在人心中的段位更高。",
      "我们评判创意只有两把尺子：是否贴合策略，是否便于传播。脱离这两条的精彩，我们宁可不要。"
    ]
  }
];

const shelfEl = document.getElementById("bookshelf");
const bookModal = document.getElementById("bookModal");
const flipbookEl = document.getElementById("flipbook");
const bookCloseBtn = document.getElementById("bookClose");

function coverInner(b) {
  return `
    <div class="bc-logo">段位<span class="bc-r">&reg;</span><em>品 牌 创 意</em></div>
    <div class="bc-mark"><b></b></div>
    <div class="bc-title">${b.title}</div>
    <p class="bc-sub">${b.sub}</p>
    <p class="bc-note">${b.paras[0]}</p>`;
}

shelfEl.innerHTML = books
  .map((b, i) => `
    <div class="book3d" data-i="${i}">
      <div class="bk-shadow"></div>
      <div class="bk-back"></div>
      <div class="bk-spine"></div>
      <div class="bk-pages"></div>
      <div class="bk-top"></div>
      <div class="bk-cover">${coverInner(b)}</div>
    </div>`)
  .join("");

/* ---- 翻页书 ---- */
function openBook(i) {
  const b = books[i];
  const cn = ["一", "二", "三", "四", "五", "六", "七", "八"][i] || String(i + 1);
  flipbookEl.innerHTML = `
    <div class="fb-left">
      <div class="fb-cover">
        <div class="bc-logo">段位<span class="bc-r">&reg;</span><em>品 牌 创 意</em></div>
        <div class="bc-mark"><b></b></div>
        <div class="bc-title">${b.title}</div>
        <p class="bc-sub">${b.sub}</p>
        <p class="bc-note">${b.paras[0]}</p>
      </div>
    </div>
    <div class="fb-right">
      <div class="md-no">段位方法 · 第 ${cn} 册</div>
      <h3 class="md-title">${b.title}</h3>
      <p class="md-sub">${b.sub}</p>
      <div class="md-rule"></div>
      <div class="md-body">${b.paras.map((p) => `<p>${p}</p>`).join("")}</div>
    </div>`;
  bookModal.classList.add("open");
  bookModal.setAttribute("aria-hidden", "false");
}

function closeBook() {
  bookModal.classList.remove("open");
  bookModal.setAttribute("aria-hidden", "true");
}

shelfEl.addEventListener("click", (e) => {
  const item = e.target.closest(".book3d");
  if (item) openBook(Number(item.dataset.i));
});
bookCloseBtn.addEventListener("click", closeBook);
bookModal.addEventListener("click", (e) => { if (e.target === bookModal) closeBook(); });
// ---------- 案例详情（第二界面 · 图片呈现） ----------
const caseViewerEl = () => document.getElementById("caseViewer");

function ensureViewer() {
  let v = caseViewerEl();
  if (v) return v;
  // 兜底：若页面 HTML 是旧缓存（没有查看器容器），脚本自动创建
  v = document.createElement("div");
  v.className = "case-viewer";
  v.id = "caseViewer";
  v.setAttribute("aria-hidden", "true");
  v.innerHTML = '<div class="cv-bar"><button class="cv-close" id="caseClose" aria-label="关闭">关闭 ✕</button></div>'
    + '<div class="cv-scroll"><img id="caseImg" alt=""></div>';
  // 兜底样式（旧缓存 CSS 也不影响观看）
  v.style.cssText = "position:fixed;inset:0;z-index:9999;background:#f5f5f3;";
  const sc = v.querySelector(".cv-scroll");
  sc.style.cssText = "position:absolute;inset:0;overflow-y:auto;display:flex;justify-content:center;padding:64px 24px 56px;";
  const im = v.querySelector("#caseImg");
  im.style.cssText = "width:min(860px,92vw);height:auto;align-self:flex-start;background:#fff;";
  const cb = v.querySelector(".cv-close");
  cb.style.cssText = "position:absolute;top:18px;right:28px;z-index:3;background:#fff;border:1px solid rgba(0,0,0,.1);padding:9px 20px;font-size:12px;letter-spacing:.18em;cursor:pointer;";
  document.body.appendChild(v);
  v.querySelector("#caseClose").addEventListener("click", closeCase);
  v.querySelector(".cv-scroll").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeCase();
  });
  return v;
}

function openCase(i) {
  const w = works[i];
  if (!w || !w.img) return;
  const v = ensureViewer();
  const img = v.querySelector("#caseImg");
  img.src = w.img;
  img.alt = w.name + " 品牌案例";
  v.classList.add("open");
  v.style.display = "block";
  v.setAttribute("aria-hidden", "false");
}

function closeCase() {
  const v = caseViewerEl();
  if (!v) return;
  v.classList.remove("open");
  v.style.display = "none";
  v.setAttribute("aria-hidden", "true");
}

if (grid) {
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".work-card");
    if (!card) return;
    e.preventDefault();
    openCase([...grid.children].indexOf(card));
  });
  const closeBtn = document.getElementById("caseClose");
  if (closeBtn) closeBtn.addEventListener("click", closeCase);
  const scroll = document.querySelector("#caseViewer .cv-scroll");
  if (scroll) scroll.addEventListener("click", (e) => { if (e.target === scroll) closeCase(); });
}

// Esc 关闭（书 + 案例查看器）
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeBook(); closeCase(); }
});
