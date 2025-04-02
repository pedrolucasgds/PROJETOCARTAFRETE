document.addEventListener('DOMContentLoaded', () => {
    IMask(document.getElementById('initialWeight'), {
        mask: Number,
        scale: 2,
        thousandsSeparator: '.',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ',',
        mapToRadix: ['.']
    });

    IMask(document.getElementById('finalWeight'), {
        mask: Number,
        scale: 2,
        thousandsSeparator: '.',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ',',
        mapToRadix: ['.']
    });

    IMask(document.getElementById('tolerance'), {
        mask: Number,
        scale: 2,
        thousandsSeparator: '.',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ',',
        mapToRadix: ['.']
    });

    IMask(document.getElementById('totalValue'), {
        mask: 'R$ num',
        blocks: {
            num: {
                mask: Number,
                scale: 2,
                thousandsSeparator: '.',
                padFractionalZeros: true,
                normalizeZeros: true,
                radix: ',',
                mapToRadix: ['.']
            }
        }
    });

    IMask(document.getElementById('driverRate'), {
        mask: 'R$ num',
        blocks: {
            num: {
                mask: Number,
                scale: 2,
                thousandsSeparator: '.',
                padFractionalZeros: true,
                normalizeZeros: true,
                radix: ',',
                mapToRadix: ['.']
            }
        }
    });
});

function calculateDifference() {
    const isPartial = document.getElementById('isPartial').checked;
    const initialWeight = parseFloat(document.getElementById('initialWeight').value.replace('.', '').replace(',', '.'));
    const finalWeight = parseFloat(document.getElementById('finalWeight').value.replace('.', '').replace(',', '.'));
    const toleranceType = document.getElementById('toleranceType').value;
    const tolerance = parseFloat(document.getElementById('tolerance').value.replace('.', '').replace(',', '.'));
    const totalValue = parseFloat(document.getElementById('totalValue').value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    const driverRate = parseFloat(document.getElementById('driverRate').value.replace('R$ ', '').replace('.', '').replace(',', '.'));

    if (isNaN(initialWeight) || isNaN(finalWeight) || initialWeight <= 0 || 
        isNaN(tolerance) || isNaN(totalValue) || isNaN(driverRate)) {
        document.getElementById('result').innerHTML = "Por favor, insira todos os valores válidos.";
        return;
    }

    const weightDiff = initialWeight - finalWeight;
    let toleranceInKg = tolerance;

    if (toleranceType === 'percent') {
        toleranceInKg = (tolerance / 100) * initialWeight;
    }

    let adjustedDiff = 0;
    if (weightDiff > toleranceInKg) {
        adjustedDiff = isPartial ? weightDiff - toleranceInKg : weightDiff;
    }

    const pricePerKg = totalValue / initialWeight;
    const discountValue = adjustedDiff * pricePerKg;
    const driverFee = finalWeight * driverRate - discountValue;

    const result = `
        <strong>Resultado:</strong><br>
        Tipo de frete: ${isPartial ? 'Parcial' : 'Integral'}<br>
        Diferença em peso: ${weightDiff.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg<br>
        Tolerância: ${toleranceInKg.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg (${toleranceType === 'percent' ? tolerance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : tolerance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kg'})<br>
        ${isPartial ? `Diferença ajustada: ${adjustedDiff.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg<br>` : ''}
        Preço por kg: R$ ${pricePerKg.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
        Valor a descontar: R$ ${discountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
        Tarifa do motorista: R$ ${driverFee.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    `;
    document.getElementById('result').innerHTML = result;
}
