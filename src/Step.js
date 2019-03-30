class Step {
    constructor(name, action, workflow) {
        this.name = name;
        this.action = action;

        if (workflow) {
            this.subWorkflow(workflow);
        }
    }

    setName(name) {
        this.name = name;
    }

    performAction(data, done) {
        if (!this.workflow) {
            this.action(data, done);
        } else {
            this.workflow.startWorkflow()
            .then(() => {
                done();
            })
        }
    }

    subWorkflow(workflow) {
        this.action = (data, done) => done();
        this.workflow = workflow;
    }
}

module.exports = Step;

