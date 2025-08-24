document.addEventListener('DOMContentLoaded', () => {
    const yourNameInput = document.getElementById('yourName');
    const loverNameInput = document.getElementById('loverName');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDisplay = document.getElementById('result');
    // const visitorCountSpan = document.getElementById('visitor-count');

    // Function to update and display visitor count
    function updateVisitorCount() {
        // Aap yahan 'love-calculator-your-unique-name' ki jagah kuch bhi unique daal sakte hain
        // Taki aapka counter dusre projects se alag rahe.
        const namespace = 'love-calculator-your-unique-name'; 
        const key = 'visits';

        fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
            .then(res => res.json())
            .then(data => {
                visitorCountSpan.textContent = data.value;
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                visitorCountSpan.textContent = 'Unavailable';
            });
    }

    // Call the function to update count when the page loads
    updateVisitorCount();

    async function trackVisitor() {
      // Visitor IP get karna
      let ipData = await fetch("https://api64.ipify.org?format=json");
      let ipJson = await ipData.json();
      let visitorIP = ipJson.ip;

      // Local storage ya server pe store karo
      let storedIPs = JSON.parse(localStorage.getItem("visitors")) || [];
      if (!storedIPs.includes(visitorIP)) {
        storedIPs.push(visitorIP);
        localStorage.setItem("visitors", JSON.stringify(storedIPs));
      }

      // Show counter
      document.getElementById("visitor-count").innerText = storedIPs.length;
    }

    trackVisitor();

        // Existing Love Calculator Logic
    const usedNames = JSON.parse(localStorage.getItem('usedLoveCalculatorNames')) || [];

    calculateBtn.addEventListener('click', () => {
        const yourName = yourNameInput.value.trim().toLowerCase();
        const loverName = loverNameInput.value.trim().toLowerCase();

        if (!yourName || !loverName) {
            resultDisplay.textContent = "Please enter both names.";
            return;
        }

        const nameCombination1 = `${yourName}-${loverName}`;
        const nameCombination2 = `${loverName}-${yourName}`;

        if (usedNames.includes(nameCombination1) || usedNames.includes(nameCombination2)) {
            resultDisplay.textContent = "He has already been given this name.";
            return;
        }

        // Simple love calculation logic
        const combinedNames = yourName + loverName;
        let loveScore = 0;
        for (let i = 0; i < combinedNames.length; i++) {
            loveScore += combinedNames.charCodeAt(i);
        }
        const lovePercentage = (loveScore % 101); // To keep it under 101

        resultDisplay.innerHTML = `❤️ Your Love Percentage: <strong>${lovePercentage}%</strong> ❤️`;

        // Store the used names
        usedNames.push(nameCombination1);
        localStorage.setItem('usedLoveCalculatorNames', JSON.stringify(usedNames));

        // Clear input fields after calculation
        yourNameInput.value = '';
        loverNameInput.value = '';
    });
});