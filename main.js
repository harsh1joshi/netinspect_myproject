let severityChart = null;
let currentScanId = null;

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="history") loadHistory();
}

function startScan(){
  const target = document.getElementById("target").value.trim();
  const mode = document.getElementById("scanMode").value;

  if(!target){ alert("Enter target"); return; }

  scanStatus.innerText = "Scanning…";

  fetch("/scan",{
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded" },
    body:`target=${encodeURIComponent(target)}&mode=${mode}`
  })
  .then(r=>r.json())
  .then(res=>{
    currentScanId = res.scan_id;
    scanTime.innerText = res.time + "s";
    renderResults(res.data);
  });
}

function renderResults(data){
  if(!data || data.length === 0){
    scanStatus.innerText = "No hosts found";
    tableBody.innerHTML = "";
    hostOS.innerText = "-";
    return;
  }

  const host = data[0];
  const ports = host.ports;

  scanStatus.innerText = "Completed";
  hostOS.innerText = host.os || "Unknown";

  if(!ports || ports.length === 0){
    tableBody.innerHTML = "<tr><td colspan='5'>No open ports found</td></tr>";
    return;
  }

  tableBody.innerHTML = ports.map(p=>`
    <tr>
      <td>${p.port}</td>
      <td>${p.service}</td>
      <td>${p.version}</td>
      <td>${p.vulnerability}</td>
      <td><span class="pill ${p.severity.toLowerCase()}">${p.severity}</span></td>
    </tr>
  `).join("");

  renderChart(ports);
}

function renderChart(ports){
  const canvas = document.getElementById("severityChart");
  const ctx = canvas.getContext("2d");

  const counts = { High:0, Medium:0, Low:0, Info:0 };
  ports.forEach(p=>counts[p.severity]++);

  if(severityChart) severityChart.destroy();

  severityChart = new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:Object.keys(counts),
      datasets:[{ data:Object.values(counts) }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false
    }
  });
}

function loadHistory(){
  fetch("/history")
  .then(r=>r.json())
  .then(list=>{
    historyTable.innerHTML = list.map(s=>`
      <tr onclick="openOld(${s.id})">
        <td>${s.target}</td>
        <td>${s.mode}</td>
        <td>${s.timestamp}</td>
      </tr>
    `).join("");
  });
}

function openOld(id){
  fetch(`/scan/${id}`)
  .then(r=>r.json())
  .then(d=>{
    currentScanId=id;
    showSection("dashboard");
    renderResults(d);
  });
}

function exportFile(type){
  if(!currentScanId){
    alert("Run a scan first");
    return;
  }

  if(type==="csv"){
    window.location = `/export/csv/${currentScanId}`;
    return;
  }

  if(type==="word"){
    const img = severityChart.toBase64Image("image/png",1);

    fetch(`/export/word/${currentScanId}`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ chart: img })
    })
    .then(r=>r.blob())
    .then(b=>{
      const a=document.createElement("a");
      a.href=URL.createObjectURL(b);
      a.download=`scan_${currentScanId}.docx`;
      a.click();
    });
  }
}

