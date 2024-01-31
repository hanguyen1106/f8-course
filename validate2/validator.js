
function Validator(formSelector) {
   
    var formRules = {}
    var _this = this;

    /**
     * Nếu có lỗi return errorMessage 
     * Nếu không có lỗi return `undefine`
     */
    var validatorRules = {
        required: function(value) {
            return value ? undefined: 'Vui lòng nhập trường này'
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  'Vui lòng nhập email';
        },
        min : function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`  ;
            }
        }
    }
    
    //Lấy ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector);

    //Chỉ xử lí khi có element trong DOM
    if(formElement) {

        var inputs = document.querySelectorAll('[name][rules]')

        for (var input of inputs) {

            var rules = input.getAttribute('rules').split('|');
            
            for (var rule of rules) {

                var isRuleHasValue = rule.includes(':');
                var ruleInfo;

                if(rule.includes(':')) {
                    var ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                }else {
                    formRules[input.name] = [ruleFunc];
                }
            }
            // Lắng nghe sự kiện để validate( blur change ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        function handleValidate(event) { 
            var rules = formRules[event.target.name];
            var errorMessage;

            for(var rule of rules) {
                errorMessage = rule(event.target.value);
                if(errorMessage) break;
            }
            // Nếu có lỗi thì hiển thị lỗi ra website
            if(errorMessage) {
                var formGroup = event.target.closest('.form-group');
                if(formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage){
                        formMessage.textContent = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }
        function handleClearError(event) {
            var formGroup = event.target.closest('.form-group');
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.textContent = '';
                }
            }
        }
        formElement.onsubmit = function(event) {
            event.preventDefault();
            var isFormValid = true;
            for(var input of inputs){
                if(!handleValidate({target:input})){
                    isFormValid = false;

                }
            }
            //Khi không có lỗi thì submit form 
            if(isFormValid) {
                if(_this.onSubmit) {
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
                        _this.onSubmit(formValue);
                }else {
                    formElement.submit();
                }
            }
        }

    }
}