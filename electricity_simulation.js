document.addEventListener('DOMContentLoaded', () => {
    // Inputs - Usage
    const usageInput = document.getElementById('monthlyUsage');

    // Inputs - Plan A
    const basicCharge = document.getElementById('basicCharge');
    const tier1Limit = document.getElementById('tier1Limit');
    const tier1Price = document.getElementById('tier1Price');
    const tier2Limit = document.getElementById('tier2Limit');
    const tier2Price = document.getElementById('tier2Price');
    const tier3Price = document.getElementById('tier3Price');
    const fuelAdjust = document.getElementById('fuelAdjust');
    const renewLevy = document.getElementById('renewLevy');

    // Inputs - Plan B
    const planBPrice = document.getElementById('planBPrice');
    const planBDiscount = document.getElementById('planBDiscount');
    const planBFuelAdjust = document.getElementById('planBFuelAdjust');
    const planBRenewLevy = document.getElementById('planBRenewLevy');

    // Outputs
    const resultA = document.getElementById('resultA');
    const resultB = document.getElementById('resultB');
    const verdictText = document.getElementById('verdictText');
    const diffValue = document.getElementById('diffValue');
    const cardA = document.getElementById('planA');
    const cardB = document.getElementById('planB');

    // All input elements for event listener attachment
    const allInputs = document.querySelectorAll('input[type="number"]');

    function calculatePlanA(usage) {
        let total = parseFloat(basicCharge.value) || 0;
        const p1 = parseFloat(tier1Price.value) || 0;
        const p2 = parseFloat(tier2Price.value) || 0;
        const p3 = parseFloat(tier3Price.value) || 0;
        const l1 = parseFloat(tier1Limit.value) || 0;
        const l2 = parseFloat(tier2Limit.value) || 0;

        const fuel = parseFloat(fuelAdjust.value) || 0;
        const renew = parseFloat(renewLevy.value) || 0;

        // Energy Charge Calculation
        let energyCharge = 0;
        if (usage <= l1) {
            energyCharge = usage * p1;
        } else if (usage <= l2) {
            energyCharge = (l1 * p1) + ((usage - l1) * p2);
        } else {
            energyCharge = (l1 * p1) + ((l2 - l1) * p2) + ((usage - l2) * p3);
        }

        // Adjustments
        const adjustments = usage * (fuel + renew);

        // Floor to integer (standard for Japanese currency in billing usually)
        return Math.floor(total + energyCharge + adjustments);
    }

    function calculatePlanB(usage) {
        const price = parseFloat(planBPrice.value) || 0;
        const discount = parseFloat(planBDiscount.value) || 0;
        const fuel = parseFloat(planBFuelAdjust.value) || 0;
        const renew = parseFloat(planBRenewLevy.value) || 0;

        // Base calculation: (Usage * UnitPrice)
        let baseCost = usage * price;

        // Adjustments
        // Assuming fuel/renew applies to Plan B as well, though sometimes high-rate plans include them. 
        // Logic: Usually these are separate, so we add them. 
        // If the user didn't input them for Plan B, they default to 0.
        const adjustments = usage * (fuel + renew);

        let totalBeforeDiscount = baseCost + adjustments;

        // Apply discount
        let finalTotal = totalBeforeDiscount - discount;

        // Ensure not negative
        if (finalTotal < 0) finalTotal = 0;

        return Math.floor(finalTotal);
    }

    function updateSimulation() {
        const usage = parseFloat(usageInput.value) || 0;

        const valA = calculatePlanA(usage);
        const valB = calculatePlanB(usage);

        // Display results with commas
        resultA.textContent = valA.toLocaleString();
        resultB.textContent = valB.toLocaleString();

        // Comparison Logic
        cardA.classList.remove('winner');
        cardB.classList.remove('winner');

        if (valA < valB) {
            cardA.classList.add('winner');
            const diff = valB - valA;
            verdictText.textContent = `今の電力会社 (プランA) の方が安いです！`;
            verdictText.style.color = 'var(--plan-a-color)';
            diffValue.textContent = diff.toLocaleString();
        } else if (valB < valA) {
            cardB.classList.add('winner');
            const diff = valA - valB;
            verdictText.textContent = `乗り換え先 (プランB) の方が安いです！`;
            verdictText.style.color = 'var(--plan-b-color)';
            diffValue.textContent = diff.toLocaleString();
        } else {
            verdictText.textContent = `どちらも同じ金額です`;
            verdictText.style.color = '#777';
            diffValue.textContent = '0';
        }
    }

    // Attach listeners
    allInputs.forEach(input => {
        input.addEventListener('input', updateSimulation);
    });

    // Initial run
    updateSimulation();
});
