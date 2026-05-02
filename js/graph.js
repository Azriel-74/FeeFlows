// graph.js — simple bar graph without Chart.js dependency
let graphMode = "current";

function setGraphMode(mode, btn) {
  graphMode = mode;
  document.querySelectorAll(".graph-tab").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
  renderGraph();
}

function renderGraph() {
  const canvas = document.getElementById("revenue-chart");
  if (!canvas) return;

  // Build month buckets
  const today = new Date();
  const months = [];
  let count = graphMode==="current"?1 : graphMode==="3months"?3 : graphMode==="6months"?6 : 12;

  for(let i=count-1; i>=0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth()-i, 1);
    months.push({ label: d.toLocaleString("en-IN",{month:"short",year:"2-digit"}), key: d.toISOString().slice(0,7), total:0 });
  }

  // Sum payments per month
  for(const s of window.students) {
    for(const p of (s.paymentLog||[])) {
      const monthKey = (p.date||"").split("/").reverse().join("-").slice(0,7) ||
                       new Date().toISOString().slice(0,7);
      const bucket = months.find(m=>m.key===monthKey);
      if(bucket) bucket.total += Number(p.amount||0);
    }
  }

  const max = Math.max(...months.map(m=>m.total), 1);
  const wrap = canvas.parentElement;
  wrap.innerHTML = `
    <div class="bar-graph">
      ${months.map(m=>`
        <div class="bar-col">
          <div class="bar-val">₹${fmt(m.total)}</div>
          <div class="bar-outer">
            <div class="bar-fill" style="height:${Math.round((m.total/max)*100)}%"></div>
          </div>
          <div class="bar-label">${m.label}</div>
        </div>`).join("")}
    </div>`;
}
