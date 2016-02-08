var ModAPI = require('modapi')
var _ = require('lodash')
var fs = require('fs')
var path = require('path')

var readLocalFile = function(name) {
  return fs.readFileSync(path.join(__dirname, name))
}

var qml = ModAPI.QMLFileV2("Controls/SelfSwitchBox.qml")
var node = qml.root

node.type = "LabeledEditableComboBox"
node.set("currentCharacter", "model.get(currentIndex).name")
node.set("model", ModAPI.QMLCompileV2("ListModel { id: listModel }"))
node.set("textRole", '"name"')

node.set("onEditTextChanged", [
  '{',
  '    var character = editText;',
  '    setCharacter(character, true);',
  '    if (member.length && DataManager.setObjectValue(object, member, character)) {',
  '        helper.setModified();',
  '        modified();',
  '    }',
  '}',
].join("\n"))

node.set("onCurrentIndexChanged", [
  '{',
  '    var character = model.get(currentIndex).name.toString();',
  '    if (member.length && DataManager.setObjectValue(object, member, character)) {',
  '        helper.setModified();',
  '        modified();',
  '    }',
  '}',
].join("\n"))

node.set("Component.onCompleted", [
  '{',
  '    initModel();',
  '}',
].join("\n"))

node.def("setCharacter", "Function", [
  'function setCharacter(character, notForce) {',
  '    initModel();',
  '    if (!notForce) currentIndex = 0;',
  '    for (var i = 0; i < model.count; i++) {',
  '        if (model.get(i).name === character) {',
  '            if (!notForce || (notForce && currentIndex !== i)) currentIndex = i;',
  '            return;',
  '        }',
  '    }',
  '    if (!model.get(model.count - 1).input) {',
  '        model.append({"name": "", "input": true});',
  '    }',
  '    model.get(model.count - 1).name = character;',
  '    if (!notForce || (notForce && currentIndex !== model.count - 1)) currentIndex = model.count - 1;',
  '}',
].join("\n"))

var x = node.def("initModel", "Function", [
  'function initModel() {',
  '    if (model.count == 0) {',
  '        model.append({"name": "A"});',
  '        model.append({"name": "B"});',
  '        model.append({"name": "C"});',
  '        model.append({"name": "D"});',
  '    }',
  '}',
].join("\n"))

qml.save()
