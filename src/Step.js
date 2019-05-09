var today = new Date();
var { colors } = require('./util');


class Step {
    constructor(name, action, workflow) {
        this.name = name;
        this.action = action;

        if (workflow) {
            this.subWorkflow(workflow);
        }
    }

    getDateTime() {
        var date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        var time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        var dateTime = `${date} ${time}`;

        return dateTime;
    }

    setName(name) {
        this.name = name;
    }

    setPrintStepRunningHandler(handler) {
        this.printStepRunningHandler = handler;
    }

    printStepRunning() {
        if (this.printStepRunningHandler) {
            this.printStepRunningHandler();
        } else {
            console.log(colors.fg.Cyan, `  [${this.getDateTime()} | step: ${this.name}]`, colors.Reset);
        }
    }

    performAction(done, data) {
        if (!this.workflow) {
            this.action(done, data);
        } else {
            this.workflow.startWorkflow()
            .then(() => {
                done();
            })
        }
    }

    subWorkflow(workflow) {
        this.action = (done, data) => done();
        this.workflow = workflow;
    }
}

module.exports = Step;

