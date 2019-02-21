import Inputs from './Inputs';
import Outputs from './Outputs';
import Util from './Util';
const convnetjs = require('convnetjs');

class Brain {
  constructor ({ inputs = [], outputs = [], weights, recurrent = false }) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.recurrent = recurrent;
    this.net = new convnetjs.Net();
    this.net.makeLayers([
      {
        type: 'input',
        out_sx: 1,
        out_sy: 1,
        out_depth:
          this.inputs.length + (this.recurrent ? this.outputs.length : 0)
      },
      { type: 'fc', num_neurons: this.outputs.length, activation: 'tanh' }
    ]);
    if (weights) {
      Brain.pushGeneToNetwork(this.net, weights);
    } else {
      this.roundGeneWeights();
    }
  }
  compute (env, agent, entities) {
    let inputValues = this.inputs.map(i =>
      Inputs[i].process(env, agent, entities)
    );
    if (this.recurrent) {
      if (this.outputVol) {
        this.outputVol.w.map(o => inputValues.push(o));
      } else {
        this.outputs.map(() => inputValues.push(Math.random(-1, 1)));
      }
    }
    let inputVol = new convnetjs.Vol(inputValues);
    this.outputVol = this.net.forward(inputVol);
    this.outputs.map((o, index) =>
      Outputs[o].process(this.outputVol.w[index], agent)
    );
  }
  extract () {
    return {
      inputs: [...this.inputs],
      outputs: [...this.outputs],
      weights: [...Brain.getGeneFromNetwork(this.net)],
      recurrent: this.recurrent
    };
  }
  clone () {
    return new Brain(this.extract());
  }
  mate (partnerBrain) {
    let childOptions = Brain.crossover(
      Brain.getGeneFromNetwork(this.net),
      Brain.getGeneFromNetwork(partnerBrain.net)
    );
    let childWeights = childOptions[Util.random(1) < 0.5 ? 1 : 0];
    let childBrain = this.clone();
    Brain.pushGeneToNetwork(childBrain.net, childWeights);
    return childBrain;
  }
  mutate () {
    let data = Brain.getGeneFromNetwork(this.net);
    let swap1 = Math.floor(Util.random() * data.length);
    let swap2 = Math.floor(Util.random() * data.length);
    swap1 += swap1 === swap2 && swap1 > 0 ? -1 : 1;
    let temp = data[swap1];
    data[swap1] = data[swap2];
    data[swap2] = temp;
    Brain.pushGeneToNetwork(this.net, data);
  }
  roundGeneWeights () {
    let data = Brain.getGeneFromNetwork(this.net);
    data = data.map(w => Number(w.toFixed(2)));
    Brain.pushGeneToNetwork(this.net, data);
  }
  static pushGeneToNetwork (net, gene) {
    var count = 0;
    var layer = null;
    var filter = null;
    var bias = null;
    var w = null;
    var i, j, k;
    for (i = 0; i < net.layers.length; i++) {
      layer = net.layers[i];
      filter = layer.filters;
      if (filter) {
        for (j = 0; j < filter.length; j++) {
          w = filter[j].w;
          for (k = 0; k < w.length; k++) {
            w[k] = gene[count++];
          }
        }
      }
      bias = layer.biases;
      if (bias) {
        w = bias.w;
        for (k = 0; k < w.length; k++) {
          w[k] = gene[count++];
        }
      }
    }
  }
  static getGeneFromNetwork (net) {
    var gene = [];
    var layer = null;
    var filter = null;
    var bias = null;
    var w = null;
    var i, j, k;
    for (i = 0; i < net.layers.length; i++) {
      layer = net.layers[i];
      filter = layer.filters;
      if (filter) {
        for (j = 0; j < filter.length; j++) {
          w = filter[j].w;
          for (k = 0; k < w.length; k++) {
            gene.push(w[k]);
          }
        }
      }
      bias = layer.biases;
      if (bias) {
        w = bias.w;
        for (k = 0; k < w.length; k++) {
          gene.push(w[k]);
        }
      }
    }
    return gene;
  }
  static crossover (father, mother) {
    let len = mother.length;
    let cutLength = Math.floor(len / 3);
    let cutA = cutLength;
    let cutB = cutA + cutLength;
    if (cutA > cutB) {
      let tmp = cutB;
      cutB = cutA;
      cutA = tmp;
    }
    let child1 = [
      ...father.slice(0, cutA),
      ...mother.slice(cutA, cutB),
      ...father.slice(cutB, len)
    ];
    let child2 = [
      ...mother.slice(0, cutA),
      ...father.slice(cutA, cutB),
      ...mother.slice(cutB, len)
    ];
    return [child1, child2];
  }
}

export default Brain;
