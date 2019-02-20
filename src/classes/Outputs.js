import Util from './Util';

let Outputs = {
  desiredForceX: {
    displayName: 'Desired Force X',
    process: (val, agent) => {
      agent.applyForce(Util.createVector(val, 0));
    }
  },
  desiredForceY: {
    displayName: 'Desired Force Y',
    process: (val, agent) => {
      agent.applyForce(Util.createVector(0, val));
    }
  },
  acceleration: {
    displayName: 'Acceleration',
    process: (val, agent) => {
      agent.applyForce(agent.acceleration.mult(val));
    }
  },
  agro: {
    displayName: 'Agro',
    process: (val, agent) => {
      agent.isAgro = val < agent.agroRate;
    }
  }
};

export default Outputs;
