

function Validator(options) {

    var selectorRules = {};
    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    // getParentElement
    function getParent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement;
        }
    }


    /**
     *  Hàm xử lí validate input element.
     * input : InputElement: , rule : 
     *  */
    function validate(inputElement,rule) {
        var errorMessage;
        var parentElement = getParent(inputElement,options.formGroupSelector);
        var errorElement = parentElement.querySelector(options.errorSelector);

        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; i++) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox' : 
                    errorMessage = rules[i](formElement.querySelector(rule.selector+':checked'));
                    break;
                default :  
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break;
        }
        if(errorMessage) {
            errorElement.textContent = errorMessage;
            parentElement.classList.add('invalid');
        }else {
            errorElement.textContent = '';
            parentElement.classList.remove('invalid');
        }
        return !errorMessage; 
    }

        if(formElement) {
            // Khi submit form
            formElement.onsubmit = function(e) {
                // Lặp qua từng rules và validate
                e.preventDefault();
                var isFormValid = true;
                options.rules.forEach(function(rule) {
                    var inputElement = formElement.querySelector(rule.selector);
                    var isValid = validate(inputElement,rule); 
                    if(!isValid) {
                        isFormValid = false;
                    }
                })
                if(isFormValid) {
                    var isFn =typeof options.onSubmit == 'function';
                    if(isFn) {
                        var enableInput = formElement.querySelectorAll('[name]:not([disable])');
                        // console.log(enableInput)
                        var formValue = Array.from(enableInput).reduce(function(values,input) {
                            switch (input.type) {
                                case  'checkbox' :
                                    if (input.matches(':checked')) {
                                        if (!Array.isArray(values[input.name])) {
                                            values[input.name] = [];
                                        }
                                        values[input.name].push(input.value);
                                    } else if (!values[input.name]) {
                                        values[input.name] = '';
                                    }
                                    break;
                                case  'radio' :
                                    if (input.matches(':checked')) {
                                        values[input.name] = input.value;
                                    } else if (!values[input.name]) {
                                        values[input.name] = '';
                                    }
                                    break;
                                case 'file' :
                                    values[input.name] = input.files;
                                default:
                                    values[input.name] = input.value;
                            }
                            return values;
                        }, {})
                        options.onSubmit(formValue);
                    }else {
                        formElement.submit();
                    }
                }
            }
            

            

            // Lặp và xử lí các sự kiện cho các rule
            // Rule : (selector , testFunction )
            options.rules.forEach(function(rule){
                //Lưu lại các rule cho mỗi input , selectRule object --> Array
                if(Array.isArray(selectorRules[rule.selector])){
                    selectorRules[rule.selector].push(rule.test)
                }else {
                    selectorRules[rule.selector] = [rule.test];
                }
                var inputElements = formElement.querySelectorAll(rule.selector);
                Array.from(inputElements).forEach(function(inputElement){
                    if(inputElement) {
                        // Xử lí blur ra khỏi input
                        inputElement.onblur = function() {  
                            validate(inputElement,rule);
                        }
                        //Xử lí khi nhập vào
                        inputElement.oninput = function() {
                            var parentElement = getParent(inputElement,options.formGroupSelector);
                            var errorElement = parentElement.querySelector(options.errorSelector);
                            errorElement.textContent = '';
                            parentElement.classList.remove('invalid');
                        }
                    }
                })
            }) 
        }

}

// Định nghĩa các rules
// Nguyên tắc của các rules
// 1. Khi có lỗi thì trả ve message lỗi 
// 2. Khi hợp lệ thì ko trả về cái gì cả (undefined)
Validator.isRequired = function(selector,message) {
    return {
        selector,
        test : function(value) {
            if(typeof value === 'string') {
                return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
            }
                return value ? undefined : message || 'Vui lòng nhập trường này';

        }
    };
}

Validator.isEmail = function(selector,message) {
    return {
        selector,
        test : function(value) {
            var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}
Validator.minLength = function(selector,message) {
    return {
        selector,
        test : function(value) {
            return value.length >=6 ? undefined : message || 'Vui lòng nhập ít nhất 6 kí tự';
        }
    };
}

Validator.isConfirm = function(selector,getConfirmValue,message) {
    return {
        selector,
        test : function(value) {
            return value ===  getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    };
}