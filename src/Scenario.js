const Workflow = require('./Workflow');
const Step = require('./Step');

class Scenario {

    static createWorkflow() {
        return new Workflow();
    }

}

module.exports = Scenario;
