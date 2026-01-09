class NeuralNetworkConfig {
    constructor(modelName, learningRate, optimizer, epochs, agreedToTerms) {
        this.modelName = modelName;
        this.learningRate = learningRate;
        this.optimizer = optimizer;
        this.epochs = epochs;
        this.agreedToTerms = agreedToTerms;
    }

    logToConsole() {
        console.log("=== НАСТРОЙКИ НЕЙРОСЕТИ ===");
        console.log(`Название модели: ${this.modelName}`);
        console.log(`Learning rate: ${this.learningRate}`);
        console.log(`Оптимизатор: ${this.optimizer}`);
        console.log(`Количество эпох: ${this.epochs}`);
        console.log(`Согласие на обработку: ${this.agreedToTerms ? "Да" : "Нет"}`);
        console.log("=================================");
    }
}

const hyperForm = document.getElementById('hyperparams-form');
if (hyperForm) {
    hyperForm.addEventListener('input', (e) => {
        const id = e.target.id;
        const hint = document.getElementById(id + '-hint');
        if (!hint) return;

        const val = e.target.value.trim();
        let isValid = false;
        let msg = '';

        if (id === 'model-name') {
            isValid = val.length > 0;
            msg = isValid ? '' : 'Введите название';
        } else if (id === 'learning-rate') {
            isValid = Number(val) > 0;
            msg = isValid ? '' : 'Должно быть > 0';
        } else if (id === 'optimizer') {
            isValid = val !== '';
            msg = isValid ? '' : 'Выберите оптимизатор';
        } else if (id === 'epochs') {
            isValid = Number(val) > 0;
            msg = isValid ? '' : 'Должно быть > 0';
        }

        hint.textContent = msg;
        hint.className = isValid ? 'hint success' : 'hint error';
    });

    hyperForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const modelName = document.getElementById('model-name').value.trim();
        const learningRate = Number(document.getElementById('learning-rate').value);
        const optimizer = document.getElementById('optimizer').value;
        const epochs = Number(document.getElementById('epochs').value);
        const agreedToTerms = document.getElementById('agree').checked;

        const statusEl = document.getElementById('form-status');

        const isValid =
            modelName.length > 0 &&
            Number.isFinite(learningRate) && learningRate > 0 &&
            optimizer.length > 0 &&
            Number.isFinite(epochs) && epochs > 0 &&
            agreedToTerms;

        if (!isValid) {
            if (statusEl) {
                statusEl.textContent = "Error! Fill all the fields.";
            }
            return;
        }

        const config = new NeuralNetworkConfig(modelName, learningRate, optimizer, epochs, agreedToTerms);
        config.logToConsole();

        try {
            if (statusEl) {
                statusEl.textContent = "Sending configuration...";
            }

            const response = await fetch('http://localhost:8000/train-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            const data = result.data ?? result;

            if (statusEl) {
                statusEl.textContent = `${data.message} (taskId: ${data.taskId})`;
            } 
        }
        catch (err) {
            console.error("POST error:", err);
            if (statusEl) {
                statusEl.textContent = `POST error: ${err.message}`;
            }
        }
    });
}
async function loadMaterials() {
    const tbody = document.getElementById('materials-tbody');
    const errorEl = document.getElementById('materials-error');

    if (!tbody) return;

    try {
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }

        const response = await fetch('http://localhost:8000/materials');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        const items = result.data;

        if (!Array.isArray(items)) {
            throw new Error('Invalid server response: data is not an array');
        }

        tbody.innerHTML = '';

        for (const item of items) {
            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td><a href="${item.url}">Открыть</a></td>
            `;

            tbody.appendChild(tr);
        }
    } 
    catch (err) {
    console.error('GET /materials error:', err);

    if (errorEl) {
        errorEl.textContent = `Error loading materials: ${err.message}`;
        errorEl.style.display = 'block';
    }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('materials-tbody');
    if (!tbody) return;

    loadMaterials();

    setInterval(loadMaterials, 1 * 60 * 1000);
});
