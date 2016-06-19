
function NameGeneratorExtensionForm(document) {
    this.document = document;
    this.valuesMap = {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email',
        password: 'password'
    };
    this.init();
};

NameGeneratorExtensionForm.prototype.init = function () {
    for (var valueKey in this.valuesMap) {
        this['get' + (valueKey.charAt(0).toUpperCase() + valueKey.slice(1)) + 'Field'] = this.createGetFieldFunction(valueKey);
        this[valueKey] = this.createGetSetFunction(valueKey);
    }
};

NameGeneratorExtensionForm.prototype.createGetFieldFunction = function (valueKey) {
    return function () {
        if (this[valueKey + 'Field'] == null) {
            this[valueKey + 'Field'] = this.getElement(this.valuesMap[valueKey]);
        }

        return this[valueKey + 'Field'];
    };
};

NameGeneratorExtensionForm.prototype.createGetSetFunction = function (valueKey) {
    return function (value) {
        if (value != null) {
            this['get' + (valueKey.charAt(0).toUpperCase() + valueKey.slice(1)) + 'Field']().value = value;
        }

        return this['get' + (valueKey.charAt(0).toUpperCase() + valueKey.slice(1)) + 'Field']().value;
    };
};

NameGeneratorExtensionForm.prototype.getGeneratorOption = function () {
    return this.getElement('generatortype').value;
};

NameGeneratorExtensionForm.prototype.getLoadOption = function () {
    return this.getElement('savednames').value;
};

NameGeneratorExtensionForm.prototype.fill = function (fakeNameInfo) {
    this.firstName(fakeNameInfo.firstName);
    this.lastName(fakeNameInfo.lastName);
    this.email(fakeNameInfo.email);
    this.password(fakeNameInfo.password);
};

NameGeneratorExtensionForm.prototype.fillSavedNamesSelector = function (savedNames) {
    var select = this.getElement("savednames");
    this.clearSelect(select);
    for (var key in savedNames) {
        if (savedNames.hasOwnProperty(key)) {
            var element = savedNames[key];
            var option = document.createElement("option");
            option.text = key;
            option.value = key;
            select.add(option);
        }
    }
};

NameGeneratorExtensionForm.prototype.clearSelect = function (select) {
    while (select.options.length > 0) {
        select.remove(0);
    }
};

NameGeneratorExtensionForm.prototype.getElement = function (id) {
    return this.document.getElementById(id);
};