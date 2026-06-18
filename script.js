function generateReceipt() {
  let name = document.getElementById("name").value;
  let amount = document.getElementById("amount").value;
  let desc = document.getElementById("desc").value;

  if (!name || !amount || !desc) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("amount", amount);
  localStorage.setItem("desc", desc);

  window.location.href = "receipt.html";
}


// Run ONLY when page loads
document.addEventListener("DOMContentLoaded", function () {

  let box = document.getElementById("slipData");

  // If we're NOT on receipt page, stop here
  if (!box) return;

  let name = localStorage.getItem("name");
  let amount = localStorage.getItem("amount");
  let desc = localStorage.getItem("desc");

  let txnId = "TXN" + Math.floor(Math.random() * 99999999);

  let output = `
    <p><b>Transaction ID:</b> ${txnId}</p>
    <p><b>Sender:</b> ${name}</p>
    <p><b>Receiver:</b> Akinola Olukitibi</p>
    <p><b>Amount:</b> ₦${amount}</p>
    <p><b>Description:</b> ${desc}</p>
    <p><b>Date:</b> ${new Date().toLocaleString()}</p>
  `;

  box.innerHTML = output;
});

async function shareReceiptImage() {
  const receipt = document.getElementById("receiptCard");

  if (!receipt) {
    alert("Receipt not found");
    return;
  }

  try {
    const canvas = await html2canvas(receipt);
    
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "transaction-receipt.png", {
        type: "image/png",
      });

      // ✅ Check if sharing is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "Transaction Receipt",
            text: "Here is my transaction receipt",
            files: [file],
          });
        } catch (err) {
          console.log("Share cancelled or failed:", err);
        }
      } 
      
      // 🔁 fallback (VERY IMPORTANT)
      else {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transaction-receipt.png";
        document.body.appendChild(a);
        a.click();
        a.remove();

        alert("Sharing not supported on this device. Receipt downloaded instead.");
      }
    });

  } catch (error) {
    console.error(error);
    alert("Failed to generate receipt image");
  }
}