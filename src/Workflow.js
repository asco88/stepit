var today = new Date();
var { colors } = require('./util');


class Workflow {
    constructor(name, options, timeout) {
        this.options = options;
        this.timeout = timeout || 5000;
        this.name = name;

        this.setInitialData();

        this.errorHandler = (data) => {
            console.log('this is some default error handler ' + JSON.stringify(data));
        }

        this.responseHandler = () => {
            this.res.json({});
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

    setInitialData() {
        this.steps = [];
        this.pos = 0;
        this.flowComplete = false;
        this.timeoutms = this.timeout;
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

    resetData() {
        this.pos = 0;
        this.flowComplete = false;
        this.timeoutms = this.timeout;
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

    addStep(step) {
        this.steps.push(step);
    }

    addStepList(stepList) {
        this.steps = {...this.steps, ...stepList};
    }

    setErrorHandler(handler) {
        this.errorHandler = handler;
    }

    setResponseHandler(handler) {
        this.responseHandler = handler;
    }

    startWorkflow(req, res) {
        console.log(colors.fg.Yellow, `${this.getDateTime()} - Workflow '${this.name}' starting..`, colors.Reset);

        this.resetData();
        this.res = res;

        if (req) {
            this.copyRequestOnData(req);
        }

        this.startNextStep();

        return new Promise((r, j)=>{
            var check = () => {
                if(this.flowComplete) {
                    this.flowComplete = false;

                    if (this.options && this.options.responseBodyMask) {
                        this.options.responseBodyMask.forEach(mask => {
                            const maskedVariable = this.data.variables[mask];
                            this.data.response.body = {...this.data.response.body, ...maskedVariable};
                        })
                    }

                    if (this.res) {
                        this.res.status(this.data.response.status).json(this.data);
                    } else {
                        r(this.data);
                    }
                }
                else if((this.timeoutms -= 100) < 0)
                    j('timed out!')
                else
                    setTimeout(check, 100)
            }
            setTimeout(check, 100)
        })
    }

    copyRequestOnData(req) {
        this.data.request.body = req.body;
        this.data.request.params = req.params;
        this.data.request.query = req.query;
        this.data.request.headers = req.headers;
    }

    startNextStep() {
        console.log(colors.fg.Cyan, `  [${this.getDateTime()} | step: ${this.steps[this.pos].name}]`, colors.Reset);

        this.steps[this.pos].performAction(this.data, (nextPos) => {
            if (Object.keys(this.data.errors).length === 0) {
                this.pos = nextPos || this.pos + 1;
                if (this.pos === this.steps.length) {
                    this.flowComplete = true;
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

module.exports = Workflow;

