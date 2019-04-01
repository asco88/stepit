const { Workflow, Step } = require('../src');

const workflow = new Workflow();
const step1 = new Step('step1', (data, done) => {
    data.variables['one'] = 1;
    // console.log(data);
    console.log('1.5')

    done();
});
const step2 = new Step('step2', (data, done) => {
    console.log('1.7')
    setTimeout(() => {
        console.log('here');
        done();
    }, 3000);
})
const step3 = new Step('step3', (data, done) => {
    data.variables['one'] = 1;
    // console.log(data);
    console.log('1.9')

    done();
});

workflow.addStep(step1);
workflow.addStep(step2);
workflow.addStep(step3);
const w = workflow.startWorkflow()
w.then(console.log);

