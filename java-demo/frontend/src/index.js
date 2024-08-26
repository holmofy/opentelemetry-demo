import "./openobserve";
import "./opentelemetry";

//////////////////////////////////////app/////////////////////////////////////////////
async function send_req() {
  const resp = await fetch("/");
  const text = await resp.text();
  const content = document.getElementById("content");
  content.innerHTML = content.innerHTML + "<br/>content:req" + text;
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btn");
  btn.addEventListener("click", () => send_req());
});