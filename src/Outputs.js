let Outputs = {
    desiredForceX: {
        displayName: 'Desired Force X',
        process: (val, agent) => {
            agent.applyForce(_p5.createVector(val, 0).mult(agent.maxSpeed));
        }
    },
    desiredForceY: {
        displayName: 'Desired Force Y',
        process: (val, agent) => {
            agent.applyForce(_p5.createVector(0, val).mult(agent.maxSpeed));
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
