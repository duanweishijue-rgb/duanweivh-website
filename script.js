/* ============================================
   段位品牌战略 · 交互脚本（SPA 单页切换）
   ============================================ */

// ---------- 作品案例数据 ----------
const works = [
  { name: "小蓝帽增产药", tag: "农业", desc: "打造独特的品牌视觉识别系统，助力农业增产领域品牌快速崛起", g: 0 },
  { name: "彭世修脚", tag: "健康", desc: "以传统中医理念为基础，打造专业修脚服务品牌的视觉识别体系", g: 1 },
  { name: "云联牧场", tag: "畜牧", desc: "建立现代化畜牧品牌的视觉认知，提升品牌溢价能力", g: 2 },
  { name: "艾红象艾灸", tag: "养生", desc: "以大象为符号结合艾草元素，打造艾灸品类的强势品牌识别", g: 3 },
  { name: "猪太子教槽料", tag: "饲料", desc: "打造高端教槽料品牌的视觉形象，在竞争激烈的饲料市场中脱颖而出", g: 4 },
  { name: "相知鸟精品银饰", tag: "珠宝", desc: "以鸟儿为符号，打造精品银饰的高端品牌形象，强化品牌记忆点", g: 5 },
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
