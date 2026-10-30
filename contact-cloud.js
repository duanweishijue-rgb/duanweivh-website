/* 云服务接入 · 官网咨询留言写入云数据库 */
var CLOUD_PUBLIC_CONFIG = {
  endpoint: "https://duanwei-brand.app.workbuddy.host",
  oauthRelayBaseUrl: "https://www.workbuddy.cn/v2/as/genie-baas/oauth",
  publishableKey: "wbpk_jBe5Lfh4BflbfRqRFDoW4B_mlWq3YF2yBo0fz1z3wNoadMTV4Ficw9z",
};

var cloudClient = null;
function getCloud() {
  if (cloudClient) return cloudClient;
  var W = window.WorkBuddyCloud;
  if (!W || typeof W.createWorkBuddyCloud !== "function") return null;
  cloudClient = W.createWorkBuddyCloud({
    endpoint: CLOUD_PUBLIC_CONFIG.endpoint,
    oauthRelayBaseUrl: CLOUD_PUBLIC_CONFIG.oauthRelayBaseUrl,
    publishableKey: CLOUD_PUBLIC_CONFIG.publishableKey,
  });
  return cloudClient;
}

function cloudErrorMessage(err) {
  var code = err && err.code;
  var status = err && err.status;
  if (code === "42P01") return "数据表尚未创建，请先在云服务里初始化 contact_messages 表。";
  if (code === "42501") return "当前身份没有写入权限，请检查该表的行级安全策略（RLS）。";
  if (code === "23505") return "这条留言已经提交过了，请勿重复提交。";
  if (status === 403)
    return "当前访问域名未与云服务绑定，在线表单暂不可用。请发送邮件至 contact@duanweicehua.cn，或致电 138 0000 0000。";
  if (status === 401)
    return "云服务凭证校验未通过。请发送邮件至 contact@duanweicehua.cn，或致电 138 0000 0000。";
  return (err && err.message) || "提交失败，请稍后重试。";
}

function setContactStatus(text, type) {
  var el = document.getElementById("contactStatus");
  if (!el) return;
  el.textContent = text;
  el.className = "cf-status" + (type ? " " + type : "");
}

var contactForm = document.getElementById("contactForm");
var contactSubmit = document.getElementById("contactSubmit");

if (contactForm && contactSubmit) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var fd = new FormData(contactForm);
    var name = String(fd.get("name") || "").trim();
    var phone = String(fd.get("phone") || "").trim();
    var company = String(fd.get("company") || "").trim();
    var need = String(fd.get("need") || "其他");
    var message = String(fd.get("message") || "").trim();

    if (!name) return setContactStatus("请填写您的称呼。", "err");
    if (!/^[0-9+\-() ]{7,20}$/.test(phone)) return setContactStatus("请填写有效的联系电话。", "err");
    if (message.length < 5) return setContactStatus("请简单描述一下项目（至少 5 个字）。", "err");

    var cloud = getCloud();
    if (!cloud) {
      setContactStatus("云服务组件未加载成功，请检查网络后重试，或直接致电 138 0000 0000。", "err");
      return;
    }

    contactSubmit.disabled = true;
    setContactStatus("正在提交...", "");

    cloud.database
      .from("contact_messages")
      .insert({ name: name, phone: phone, company: company, need: need, message: message, source: "官网-联系我们" })
      .select()
      .then(function (res) {
        if (res && res.error) {
          setContactStatus(cloudErrorMessage(res.error), "err");
          return;
        }
        var row = res && Array.isArray(res.data) ? res.data[0] : null;
        setContactStatus(
          row
            ? "已收到您的咨询（编号 #" + row.id + "），我们会在一个工作日内联系您。"
            : "已收到您的咨询，我们会在一个工作日内联系您。",
          "ok"
        );
        contactForm.reset();
      })
      .catch(function (err) {
        setContactStatus(cloudErrorMessage(err), "err");
      })
      .then(function () {
        contactSubmit.disabled = false;
      });
  });
}