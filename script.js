// BUMP — minimal JS for copy + document ledger rendering
(function(){
  const CONFIG = {
    CA: "DNS1178svmi3LEvVFLzKiZpTUeR4aeGU3GHsTdkVpump", // <- replace with your real contract address
    TWITTER_URL: "https://x.com/bumpbump",
    TOTAL_SUPPLY: 1000000000, // <- replace with your actual total supply (number)
    TIMEZONE: "Asia/Seoul"
  };

  // Example burns (replace with real data)
  const BURNS = [
    // { time_iso: "2025-09-03T21:14:00+09:00", burned_bump: 125000.0, remaining_supply: 999875000.0, tx_url: "#" },
    // { time_iso: "2025-09-02T10:02:00+09:00", burned_bump: 75000.25, remaining_supply: 1000000000 - 125000 - 75000.25, tx_url: "#" }
  ];

  const $ = (sel)=>document.querySelector(sel);

  function fmtNumber(n, frac=4){
    if (n === null || n === undefined || isNaN(n)) return "–";
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: frac }).format(n);
  }
  function fmtInt(n){
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  }
  function fmtTimeISO(iso){
    try{
      const d = new Date(iso);
      return new Intl.DateTimeFormat(undefined, {
        timeZone: CONFIG.TIMEZONE,
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit'
      }).format(d) + " KST";
    }catch(e){ return iso; }
  }

  function render(){
    // Landing
    const caNode = $("#ca");
    const copyBtn = $("#copyCA");
    const twitterBtn = $("#twitterBtn");
    if (caNode) caNode.textContent = CONFIG.CA;
    if (twitterBtn) twitterBtn.href = CONFIG.TWITTER_URL;

    if (copyBtn){
      copyBtn.addEventListener("click", async () => {
        try{
          await navigator.clipboard.writeText(CONFIG.CA);
          showToast("Copied Contract Address");
        }catch(e){
          showToast("Copy failed");
        }
      });
    }

    // Document summary + rows
    const rows = $("#rows");
    const empty = $("#emptyState");
    const totalBurned = BURNS.reduce((sum,b)=> sum + (Number(b.burned_bump)||0), 0);
    const lastBurnISO = BURNS.length ? BURNS[0].time_iso : null; // assuming newest first; if not, sort below

    // If data unsorted, sort desc by time:
    BURNS.sort((a,b)=> new Date(b.time_iso) - new Date(a.time_iso));

    const remaining = CONFIG.TOTAL_SUPPLY - totalBurned;

    $("#totalBurned").textContent = fmtNumber(totalBurned);
    $("#remaining").textContent   = fmtInt(remaining);
    $("#lastBurn").textContent    = lastBurnISO ? fmtTimeISO(BURNS[0].time_iso) : "–";

    if (!BURNS.length){
      empty.hidden = false;
      rows.innerHTML = "";
      return;
    } else {
      empty.hidden = true;
    }

    rows.innerHTML = "";
    BURNS.forEach(ev => {
      const tr = document.createElement("tr");

      const tdTime = document.createElement("td");
      tdTime.textContent = fmtTimeISO(ev.time_iso);

      const tdBurn = document.createElement("td");
      tdBurn.textContent = fmtNumber(ev.burned_bump);

      const tdRemain = document.createElement("td");
      const remain = (typeof ev.remaining_supply === "number") ? ev.remaining_supply : null;
      tdRemain.textContent = remain !== null ? fmtInt(remain) : "–";

      const tdTx = document.createElement("td");
      tdTx.className = "tx-col";
      if (ev.tx_url){
        const a = document.createElement("a");
        a.href = ev.tx_url;
        a.target = "_blank"; a.rel = "noopener";
        a.className = "tx-link"; a.title = "View transaction";
        a.textContent = "↗";
        tdTx.appendChild(a);
      } else {
        tdTx.textContent = "";
      }

      tr.appendChild(tdTime);
      tr.appendChild(tdBurn);
      tr.appendChild(tdRemain);
      tr.appendChild(tdTx);
      rows.appendChild(tr);
    });
  }

  function showToast(msg){
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.hidden = true; }, 1800);
  }

  document.addEventListener("DOMContentLoaded", render);
})();
