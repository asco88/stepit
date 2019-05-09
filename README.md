# stepit

Creating a businness flow is as simple as defining it's business steps
Create simple steps to implement small tasks.
Create Workflow and attach the right steps
Manage express api using an existing Workflow


## Usage

Install the package using npm:

    npm install stepit --save

Example of usage with Express

	const { Workflow, Step } = require('stepit');

	app.post('/steps', (req, res) => {
	    const workflow = new Workflow();
	    const step = new Step('step', (done, data) => {
			// do some stuff
	        done();
	    });

	    workflow.addStep(step);
	    workflow.startWorkflow(req, res);
	})

The workflow final data is accessible theough Promise:

    const w = workflow.startWorkflow();
    w.then(result => {
        res.send(result);
    });


You can add mask for the response, each mask will be taken from data.variables straight into the response body

    const options = {
        responseBodyMask: ['user']
    }

    const workflow = new Workflow(options);
    const getUserStep = new Step('get-user', (done, data) => {

        const userid = data.request.params.userId;

        someUserFindingMethod(userid, (user) => {
        	data.variables = {...data.variables, user: clonedUser}
            done();
        })
    });

The response will contain the user as was added to data.variables

Each step can start a new 'subworkflow', it can be defined when creating new Step instance:

    workflow.addStep(new Step('step2', undefined, workflow2));

Or to be added explicitly:

    step.subWorkflow(workflow);

in both cases, the step itself will execute the workflow instead of any action of it's own



You can add as many steps as you like.
They will be executed in the same order they were added.
The Workflow guarantees a synchronous execution of each step after the previuos one

## License

ISC