const capitalize = require('lodash').capitalize;
const pluralize = require('pluralize');

module.exports = function addCrud(modelName, context) {
  context[`create${capitalize(modelName)}`] = function(inModelObject) {
    const pluralized = pluralize(modelName);
    const modelObjects = Object.assign([], this.state[pluralized]);
    modelObjects.push(inModelObject);
    const newStateObject = {};
    newStateObject[pluralized] = modelObjects
    this.setState(newStateObject);
  }

  context[`update${capitalize(modelName)}`] = function(inModelObject) {
    const pluralized = pluralize(modelName);
    const modelObjects = Object.assign([], this.state[pluralized]);
    let updated = false;

    modelObjects.forEach((modelObject, i) => {
      if (Number(inModelObject.id) === Number(modelObject.id)) {
        modelObjects[i] = inModelObject;
        updated = true;
      }
    });

    if (updated) {
      const newStateObject = {};
      newStateObject[pluralized] = modelObjects
      this.setState(newStateObject);
    }
  }

  context[`destroy${capitalize(modelName)}`] = function(inModelObject) {
    const pluralized = pluralize(modelName);
    const modelObjects = Object.assign([], this.state[pluralized]);
    let updated = false;

    modelObjects.forEach((modelObject, i) => {
      if (Number(inModelObject.id) === Number(modelObject.id)) {
        modelObjects.splice(i, 1);
        updated = true;
      }
    });

    if (updated) {
      const newStateObject = {};
      newStateObject[pluralized] = modelObjects
      this.setState(newStateObject);
    }
  }

  context[`create${capitalize(modelName)}`] = context[`create${capitalize(modelName)}`].bind(context);
  context[`update${capitalize(modelName)}`] = context[`update${capitalize(modelName)}`].bind(context);
  context[`destroy${capitalize(modelName)}`] = context[`destroy${capitalize(modelName)}`].bind(context);

  const originalComponentWillMount = context.componentWillMount;
  context.componentWillMount = () => {
    context.state.io.socket.on(modelName, (socketObject) => {
      if (socketObject.verb === 'created') {
        context[`create${capitalize(modelName)}`](socketObject.data, context);
      } else if (socketObject.verb === 'updated') {
        context[`update${capitalize(modelName)}`](socketObject.data, context);
      } else if (socketObject.verb === 'destroyed') {
        context[`destroy${capitalize(modelName)}`](socketObject.previous, context);
      }
    });

    context.state.io.socket.get(`/${modelName}`, (modelObjects) => {
      const pluralized = pluralize(modelName);
      const newStateObject = {};
      newStateObject[pluralized] = modelObjects
      context.setState(newStateObject);
    });

    originalComponentWillMount.apply(context, arguments);
  }
  context.state[pluralize(modelName)] = [];
}
