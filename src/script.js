class NeuralNetworkConfig {
    constructor(modelName, learningRate, optimizer, epochs, agreedToTerms) {
        this.modelName = modelName;
        this.learningRate = learningRate;
        this.optimizer = optimizer;
        this.epochs = epochs;
        this.agreedToTerms = agreedToTerms;
        this.timestamp = new Date().toLocaleString();
    }

    logToConsole() {
        console.log("=== НАСТРОЙКИ НЕЙРОСЕТИ ===");
        console.log(`Название модели: ${this.modelName}`);
        console.log(`Learning rate: ${this.learningRate}`);
        console.log(`Оптимизатор: ${this.optimizer}`);
        console.log(`Количество эпох: ${this.epochs}`);
        console.log(`Согласие на обработку: ${this.agreedToTerms ? "Да" : "Нет"}`);
        console.log(`Время создания: ${this.timestamp}`);
        console.log("=================================");
    }
}

document.getElementById('hyperparams-form').addEventListener('submit', function(event) {    
    event.preventDefault()
    const modelName = document.getElementById('model-name').value;
    const learningRate = document.getElementById('learning-rate').value;
    const optimizer = document.getElementById('optimizer').value;
    const epochs = document.getElementById('epochs').value;
    const agreedToTerms = document.getElementById('agree').checked;
    
    const config = new NeuralNetworkConfig(
        modelName,
        learningRate,
        optimizer,
        epochs,
        agreedToTerms
    );
    
    config.logToConsole();
});