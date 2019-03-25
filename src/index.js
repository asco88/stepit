var today = new Date();


class Step {
    constructor(name, action) {
        this.name = name;
        this.action = action;
    }

    performAction(data, done) {
        this.action(data, done);
    }
}

class Workflow {
    constructor(options) {
        this.options = options;

        this.setInitialData();

        this.errorHandler = (data) => {
            console.log('this is some default error handler ' + JSON.stringify(data));
        }

        this.responseHandler = () => {
            this.res.json({});
        }
    }

    setInitialData() {
        this.steps = [];
        this.pos = 0;
        this.data = {
            variables: {},
            errors: {},
            response: {
                status: 200,
                body: {}
            },
            request: {
                body: {},
                headers: {},
                params: {},
                query: {}
            }
        }
    }

    setResponse(response) {
        this.response = response;
    }

    setPromise(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }

    addStep(step) {
        this.steps.push(step);
    }

    setErrorHandler(handler) {
        this.errorHandler = handler;
    }

    setResponseHandler(handler) {
        this.responseHandler = handler;
    }

    startWorkflow(req, res) {
        this.res = res;

        this.copyRequestOnData(req);

        this.startNextStep();
    }

    sendResponse() {
        if (this.options && this.options.responseBodyMask) {
            this.options.responseBodyMask.forEach(mask => {
                const maskedVariable = this.data.variables[mask];
                this.data.response.body = {...this.data.response.body, ...maskedVariable};
            })
        }

        this.res.status(this.data.response.status).json(this.data.response.body);
    }

    copyRequestOnData(req) {
        this.data.request.body = req.body;
        this.data.request.params = req.params;
        this.data.request.query = req.query;
        this.data.request.headers = req.headers;
    }

    copyDataOnResponse() {

    }

    startNextStep() {
        var date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        var time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        var dateTime = `${date} ${time}`;

        console.log(`[${dateTime} | step: ${this.steps[this.pos].name}]`);

        this.steps[this.pos].performAction(this.data, (nextPos) => {

            console.log(4);

            if (Object.keys(this.data.errors).length === 0) {
                this.pos = nextPos || this.pos + 1;
                if (this.pos === this.steps.length) {
                    this.sendResponse();
                } else {
                    this.startNextStep();
                }

            } else {
                console.log(`[${dateTime} | error]`);
                this.errorHandler(this.data);
            }
        });
    }
}

module.exports = {
    Step, Workflow
}
