document.addEventListener('DOMContentLoaded', () => {
    const yourNameInput = document.getElementById('yourName');
    const loverNameInput = document.getElementById('loverName');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDisplay = document.getElementById('result');
    // const visitorCountSpan = document.getElementById('visitor-count');
    const historyBody = document.getElementById('history-body');

    // Function to update and display visitor count
    // NOTE: Aapke original code mein do counter the. Main ek (CountAPI wala) use kar raha hu.
    function updateVisitorCount() {
        const namespace = 'love-calculator-your-unique-name'; 
        const key = 'visits';

        fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
            .then(res => res.json())
            .then(data => {
                if (visitorCountSpan) {
                    visitorCountSpan.textContent = data.value;
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
                if (visitorCountSpan) {
                    visitorCountSpan.textContent = '<a href="https://hits.sh/jangkhng.github.io/Love-Calculator/"><img alt="Hits" src="https://hits.sh/jangkhng.github.io/Love-Calculator.svg?color=ffffff"/></a>';
                }
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

    // --- History Logic ---

    // Load history from localStorage or initialize an empty array
    const loveHistory = JSON.parse(localStorage.getItem('loveHistory')) || [];

    // Function to render the history table
    function renderHistoryTable() {
        // Clear existing table rows
        historyBody.innerHTML = '';

        // Loop through history and create table rows
        loveHistory.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.yourName}</td>
                <td>${entry.loverName}</td>
                <td><strong>${entry.percentage}%</strong></td>
            `;
            historyBody.appendChild(row);
        });
    }
    
    // Render the table on initial page load
    renderHistoryTable();

    // --- End of History Logic ---


    // Existing Love Calculator Logic
    const usedNames = JSON.parse(localStorage.getItem('usedLoveCalculatorNames')) || [];

    calculateBtn.addEventListener('click', () => {
        const yourNameOriginal = yourNameInput.value.trim();
        const loverNameOriginal = loverNameInput.value.trim();

        // Use lowercase for calculation logic
        const yourName = yourNameOriginal.toLowerCase();
        const loverName = loverNameOriginal.toLowerCase();

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
        
        // --- Save the new result to history ---
        const newHistoryEntry = {
            yourName: yourNameOriginal,
            loverName: loverNameOriginal,
            percentage: lovePercentage
        };
        loveHistory.push(newHistoryEntry);
        localStorage.setItem('loveHistory', JSON.stringify(loveHistory));
        // --- End of saving logic ---

        // Re-render the table with the new entry
        renderHistoryTable();

        // Store the used names
        usedNames.push(nameCombination1);
        localStorage.setItem('usedLoveCalculatorNames', JSON.stringify(usedNames));

        // Clear input fields after calculation
        yourNameInput.value = '';
        loverNameInput.value = '';
    });
});
