class Brain {
    constructor({ inputs = [], outputs = [], midLayerNodes = 4, weights }) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.midLayerNodes = midLayerNodes;
        this.network = ENCOG.BasicNetwork.create([
            ENCOG.BasicLayer.create(ENCOG.ActivationTANH.create(), this.inputs.length, 1),
            ENCOG.BasicLayer.create(ENCOG.ActivationTANH.create(), this.midLayerNodes, 1),
            ENCOG.BasicLayer.create(ENCOG.ActivationTANH.create(), this.outputs.length, 0)
        ]);
        if (weights) {
            this.network.weights = weights;
        } else {
            this.network.randomize();
            this.network.weights = this.network.weights.map(i => Util.roundToDecimal(i));
        }
    }
    compute(env, agent, entities) {
        let inputValues = this.inputs.map(i => Inputs[i].process(env, agent, entities));
        let outputValues = [];
        this.network.compute(inputValues, outputValues);
        this.outputs.map((o, index) => Outputs[o].process(outputValues[index], agent));
    }
    extract() {
        return {
            inputs: [...this.inputs],
            outputs: [...this.outputs],
            midLayerNodes: this.midLayerNodes,
            weights: [...this.network.weights]
        };
    }
    clone() {
        return new Brain(this.extract());
    }
    mate(partnerBrain) {
        let childOptions = Brain.crossover(this.network.weights, partnerBrain.network.weights);
        let childWeights = childOptions[Util.random(1) < 0.5 ? 1 : 0];
        let childBrain = this.clone();
        childBrain.network.weights = childWeights;
        return childBrain;
    }
    mutate() {
        let data = this.network.weights;
        let swap1 = Math.floor(Util.random() * data.length);
        let swap2 = Math.floor(Util.random() * data.length);
        swap1 += (swap1 === swap2 && swap1 > 0) ? -1 : 1;
        let temp = data[swap1];
        data[swap1] = data[swap2];
        data[swap2] = temp;
    }
    static crossover(father, mother) {
        let len = mother.length;
        let cutLength = Math.floor(len / 3);
        let cutA = cutLength;
        let cutB = cutA + cutLength;
        if (cutA > cutB) {
            let tmp = cutB;
            cutB = cutA;
            cutA = tmp;
        }
        let child1 = [...father.slice(0, cutA), ...mother.slice(cutA, cutB), ...father.slice(cutB, len)];
        let child2 = [...mother.slice(0, cutA), ...father.slice(cutA, cutB), ...mother.slice(cutB, len)];
        return [child1, child2];
    }
}

export default Brain;
