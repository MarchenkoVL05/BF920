function t142_checkSize(recid) {
    var el = document.querySelector('#rec' + recid).querySelector('.t142__submit');
    if (el.length) {
        var btnheight = el.clientHeight + 5;
        var textheight = el[0].scrollHeight;
        if (btnheight < textheight) {
            el.classList.add('t142__submit-overflowed');
        }
    }
}
  
function t862_init(recid) {
    var rec = document.querySelector('#rec' + recid);
    var quizWrapper = rec.querySelector('.t862__quiz-wrapper');
    var form = rec.querySelector('.t862 .t-form');
    var quizQuestion = rec.querySelectorAll('.t862 .t-input-group');
    var prevBtn = rec.querySelector('.t862__btn_prev');
    var nextBtn = rec.querySelector('.t862__btn_next');
    var resultBtn = rec.querySelector('.t862__btn_result');
    var errorBoxMiddle = rec.querySelector('.t-form__errorbox-middle .t-form__errorbox-wrapper');
    var captureFormHTML = '<div class="t862__capture-form"></div>';
    rec.querySelector('.t862 .t-form__errorbox-middle').insertAdjacentHTML('beforebegin', captureFormHTML);
    var quizQuestionNumber = 0;
    form.classList.remove('js-form-proccess');
    quizQuestion[quizQuestionNumber].style.display = 'block';
    quizQuestion[quizQuestionNumber].classList.add('t-input-group-step_active');
    rec.setAttribute('data-animationappear', 'off');
    rec.style.opacity = '1';
    t862_workWithAnswerCode(rec);
    for (var i = 0; i < quizQuestion.length; i++) {
        quizQuestion[i].setAttribute('data-question-number', i);
    }
    t862_wrapCaptureForm(rec);
    var captureForm = rec.querySelector('.t862__capture-form');
    var resultText = rec.querySelector('.t862__result-title').textContent;
    t862_showCounter(rec, quizQuestionNumber);
    t862_disabledPrevBtn(rec, quizQuestionNumber);
    t862_checkLength(rec);
    t862_openToHook(rec, form, quizQuestion, captureForm);
    prevBtn.addEventListener('click', function (event) {
        if (quizQuestionNumber > 0) {
            quizQuestionNumber--;
        }
        t862_setProgress(rec, -1);
        t862_lazyLoad();
        t862_awayFromResultScreen(rec);
        t862_showCounter(rec, quizQuestionNumber);
        t862_hideError(rec, quizQuestionNumber);
        t862_disabledPrevBtn(rec, quizQuestionNumber);
        t862_switchQuestion(rec, quizQuestionNumber);
        t862_resizePopup(rec);
        event.preventDefault();
    });
    nextBtn.addEventListener('click', function (event) {
        var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
        if (showErrors) {
            errorBoxMiddle.style.display = 'none';
        }
        if (!showErrors) {
            quizQuestionNumber++;
            prevBtn.disabled = false;
            t862_setProgress(rec, 1);
            t862_showCounter(rec, quizQuestionNumber);
            t862_switchQuestion(rec, quizQuestionNumber);
            t862_resizePopup(rec);
        }
        t862_lazyLoad();
        event.preventDefault();
    });
    for (var i = 0; i < quizQuestion.length; i++) {
        quizQuestion[i].addEventListener('keypress', function (event) {
            var activeStep = form.querySelector('.t-input-group-step_active');
            if (
                event.keyCode === 13 &&
                !form.classList.contains('js-form-proccess') &&
                !activeStep.classList.contains('t-input-group_ta')
            ) {
                var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
                var questionArr = t862_createQuestionArr(rec);
                if (showErrors) {
                    errorBoxMiddle.style.display = 'none';
                }
                prevBtn.disabled = false;
                if (!showErrors) {
                    quizQuestionNumber++;
                    t862_setProgress(rec, 1);
                    t862_showCounter(rec, quizQuestionNumber);
                    if (quizQuestionNumber < questionArr.length) {
                        t862_switchQuestion(rec, quizQuestionNumber);
                    } else {
                        t862_switchResultScreen(rec);
                        form.classList.add('js-form-proccess');
                    }
                    t862_disabledPrevBtn(rec, quizQuestionNumber);
                }
                t862_lazyLoad();
                event.preventDefault();
            }
        });
    }
    resultBtn.addEventListener('click', function (event) {
        var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
        if (showErrors) {
            errorBoxMiddle.style.display = 'none';
        }
        if (!showErrors) {
            quizQuestionNumber++;
            t862_setProgress(rec, 1);
            form.classList.add('js-form-proccess');
            t862_disabledPrevBtn(rec, quizQuestionNumber);
            if (captureForm.innerHTML === '' && resultText === '') {
                t862_showCounter(rec, quizQuestionNumber);
                t862_switchQuestion(rec, quizQuestionNumber);
            } else {
                t862_switchResultScreen(rec);
            }
        }
        event.preventDefault();
    });
}
  
function t862_workWithAnswerCode(rec) {
    var groupRi = rec.querySelector('.t-input-group_ri').querySelectorAll('input');
    for (var i = 0; i < groupRi.length; i++) {
        if (groupRi[i]) {
            t862_setAnswerCode(groupRi[i]);
            var label = groupRi[i].parentNode.querySelector('.t-img-select__text');
            label.textContent = label.textContent.split('value::')[0].trim();
        }
    }
    var groupRd = rec.querySelector('.t-input-group_rd').querySelectorAll('input');
    for (var i = 0; i < groupRd.length; i++) {
        if (groupRd[i]) {
            t862_setAnswerCode(groupRd[i]);
            var label = groupRd[i];
            var html = groupRd[i].innerHTML.split('value::')[0].trim();
            label.innerHTML = html;
        }
    }
}
  
function t862_setAnswerCode(group) {
    var parameter = group.value.trim();
    group.value = parameter;
}
  
function t862_openToHook(rec, form, quizQuestion, captureForm) {
    var popup = rec.querySelector('.t-popup');
    var hook = popup.getAttribute('data-tooltip-hook');
    var analitics = popup.getAttribute('data-track-popup');
    if (hook !== '') {
        document.querySelector('.r').addEventListener('click', function (event) {
            t862_showPopup(rec, form, quizQuestion, captureForm);
            setTimeout(function () {
                t862_resizePopup(rec);
            }, 50);
            event.preventDefault();
            if (window.lazy === 'y' || document.querySelector('#allrecords').getAttribute('data-tilda-lazy') === 'yes') {
                t_onFuncLoad('t_lazyload_update', function () {
                    t_lazyload_update();
                });
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7);
                }
                Tilda.sendEventToStatistics(analitics, virtTitle);
            }
        });
    }
}
  
function t862_showError(rec, quizWrapper, quizQuestionNumber) {
    if (quizWrapper.classList.contains('t862__quiz-published')) {
        var errors = t862_setError(rec, quizQuestionNumber);
        return errors;
    }
}

function t862_lazyLoad() {
    if (typeof document.querySelector('.t-records').getAttribute('data-tilda-mode') == 'object') {
        if (window.lazy === 'y' || document.querySelector('#allrecords').getAttribute('data-tilda-lazy') === 'yes') {
            t_onFuncLoad('t_lazyload_update', function () {
                t_lazyload_update();
            });
        }
    }
}

function t862_setHeight(rec, form, quizQuestion, captureForm) {
    var questions = [];
    var questionsHeight = [];
    var descrHeight = rec.querySelector('.t862__quiz-description').offsetHeight;
    var titleHeight = rec.querySelector('.t862__result-title').offsetHeight;
    for (var i = 0; i < quizQuestion.length; i++) {
        if (quizQuestion[i].classList.contains('t862__t-input-group_capture')) {
            questions.push(quizQuestion[i]);
        }
    }
    for (var i = 0; i < questions.length; i++) {
        questionsHeight.push(questions[i].offsetHeight);
    }
    var maxHeightQuestion = Math.max.apply(null, questionsHeight);
    var captureFormHeight = captureForm.offsetHeight;
    var height = maxHeightQuestion > captureFormHeight ? maxHeightQuestion : captureFormHeight;
    for (var i = 0; i < questions.length; i++) {
        questions[i].style.minHeight = height;
    }
    captureForm.style.minHeight = height;
    rec.querySelector('.t862__quiz-form-wrapper').minHeight = height;
    var headerHeight = titleHeight > descrHeight ? titleHeight : descrHeight;
    var quizWrapperHeight = rec.querySelector('.t862__quiz-form-wrapper').offsetHeight;
    var btnHeight = rec.querySelector('.t862__btn-wrapper').offsetHeight;
    rec.querySelector('.t862__wrapper').style.minHeight = headerHeight + quizWrapperHeight + btnHeight;
}

function t862_setMobileHeight() {
    t862_calcVH();
    window.addEventListener('resize', function () {
        t862_calcVH();
    });
}

function t862_calcVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

function t862_checkLength(rec) {
    var nextBtn = rec.querySelector('.t862__btn_next');
    var resultBtn = rec.querySelector('.t862__btn_result');
    var questionArr = t862_createQuestionArr(rec);
    var submitBtnWrapper = rec.querySelector('.t862 .t-form__submit');
    var captureForm = rec.querySelector('.t862__capture-form');
    var resultText = rec.querySelector('.t862__result-title').textContent;
    if (captureForm.innerHTML === '' && resultText === '' && questionArr.length < 2) {
        nextBtn.style.display = 'none';
        resultBtn.style.display = 'none';
        submitBtnWrapper.style.display = 'block';
    } else if (questionArr.length < 2) {
        nextBtn.style.display = 'none';
        resultBtn.style.display = 'block';
    }
}

function t862_showCounter(rec, quizQuestionNumber) {
    var counter = rec.querySelector('.t862__quiz-description-counter');
    var questionArr = t862_createQuestionArr(rec);
    counter.innerHTML = quizQuestionNumber + 1 + '/' + questionArr.length;
}

function t862_setError(rec, quizQuestionNumber) {
    var questionArr = t862_createQuestionArr(rec);
    var currentQuestion = questionArr[quizQuestionNumber];
    var showErrors;
    if (typeof window.tildaForm !== 'object') return showErrors;
    var arErrors = window.tildaForm.validate(currentQuestion);
    currentQuestion.classList.add('js-error-control-box');
    var errorsTypeObj = arErrors[0];
    if (errorsTypeObj != undefined) {
        var errorType = errorsTypeObj.type[0];
        if (errorType === "emptyfill") {
            errorType = "req";
        }
        var errorTextCustom = rec
            .querySelector('.t862 .t-form')
            .querySelector('.t-form__errorbox-middle')
            .querySelector('.js-rule-error-' + errorType).textContent;
        var sError = '';
        if (errorTextCustom != '') {
            sError = errorTextCustom;
        } else {
            t_onFuncLoad('t_form_dict', function () {
                sError = t_form_dict(errorType);
            });
        }
        showErrors = errorType == 'emptyfill' ? !1 : window.tildaForm.showErrors(currentQuestion, arErrors);
        currentQuestion.querySelector('.t-input-error').innerHTML = sError;
    }
    return showErrors;
}

function t862_hideError(rec, quizQuestionNumber) {
    var questionArr = t862_createQuestionArr(rec);
    var currentQuestion = questionArr[quizQuestionNumber];
    currentQuestion.classList.remove('js-error-control-box');
    currentQuestion.querySelector('.t-input-error').innerHTML;
}

function t862_setProgress(rec, index) {
    var progress = rec.querySelector('.t862__progress');
    var progressbarWidth = rec.querySelector('.t862__progressbar').clientWidth;
    var questionCount = t862_createQuestionArr(rec).length;
    var captureForm = rec.querySelector('.t862__capture-form');
    var resultText = rec.querySelector('.t862__result-title').textContent;
    if (captureForm.innerHTML === '' && resultText === '' && questionCount > 0) {
        questionCount--;
    }
    var progressWidth = progress.getAttribute('data-progress-bar');
    if (progressWidth === undefined) {
        progressWidth = 0;
        progress.setAttribute('data-progress-bar', '0');
    }
    var progressStep = progressbarWidth / questionCount;
    var percentProgress = ((parseFloat(progressWidth) + index * progressStep) / progressbarWidth) * 100;
    if (isNaN(percentProgress) || percentProgress === -Infinity) {
        percentProgress = 0;
        progress.setAttribute('data-progress-bar', percentProgress);
    } else if (percentProgress === Infinity) {
        percentProgress = progressbarWidth;
        progress.setAttribute('data-progress-bar', percentProgress);
    } else {
        progress.setAttribute('data-progress-bar', (progressbarWidth / 100) * percentProgress);
    }
    if (percentProgress > 100) {
        percentProgress = 100;
    } else if (percentProgress < 0) {
        percentProgress = 0;
    }
    var percentProgressWidth = percentProgress + '%';
    progress.style.width = percentProgressWidth;
}

function t862_wrapCaptureForm(rec) {
    var captureForm = rec.querySelector('.t862__capture-form');
    var quizQuestion = rec.querySelectorAll('.t862 .t-input-group');
    var quizFormWrapper = rec.querySelector('.t862__quiz-form-wrapper');
    for (var i = 0; i < quizQuestion.length; i++) {
        var currentQuizQuestion = quizQuestion[i];
        var emailInputExist = currentQuizQuestion.classList.contains('t-input-group_em');
        var nameInputExist = currentQuizQuestion.classList.contains('t-input-group_nm');
        var phoneInputExist = currentQuizQuestion.classList.contains('t-input-group_ph');
        var checkboxInputExist = currentQuizQuestion.classList.contains('t-input-group_cb');
        var quizQuestionNumber = currentQuizQuestion.getAttribute('data-question-number');
        var maxCountOfCaptureFields = quizFormWrapper.classList.contains('t862__quiz-form-wrapper_withcheckbox') ? 4 : 3;
        if (quizQuestionNumber >= quizQuestion.length - maxCountOfCaptureFields) {
            var isCaptureGroup = !0;
            if (quizFormWrapper.classList.contains('t862__quiz-form-wrapper_newcapturecondition')) {
                isCaptureGroup =
                    quizQuestion[i].classList.contains('t-input-group_cb') ||
                    quizQuestion[i].classList.contains('t-input-group_em') ||
                    quizQuestion[i].classList.contains('t-input-group_nm') ||
                    quizQuestion[i].classList.contains('t-input-group_ph');
            }
            if (isCaptureGroup) {
                if (quizFormWrapper.classList.contains('t862__quiz-form-wrapper_withcheckbox')) {
                    if (emailInputExist || nameInputExist || phoneInputExist || checkboxInputExist) {
                        currentQuizQuestion.classList.add('t862__t-input-group_capture');
                        captureForm.appendChild(currentQuizQuestion);
                    }
                } else {
                    if (emailInputExist || nameInputExist || phoneInputExist) {
                        currentQuizQuestion.classList.add('t862__t-input-group_capture');
                        captureForm.appendChild(currentQuizQuestion);
                    }
                }
            }
        }
    }
}

function t862_createQuestionArr(rec) {
    var quizQuestion = rec.querySelectorAll('.t862 .t-input-group');
    var questionArr = [];
    for (var i = 0; i < quizQuestion.length; i++) {
        if (!quizQuestion[i].classList.contains('t862__t-input-group_capture')) {
            questionArr.push(quizQuestion[i]);
        }
    }
    return questionArr;
}

function t862_disabledPrevBtn(rec, quizQuestionNumber) {
    var prevBtn = rec.querySelector('.t862__btn_prev');
    quizQuestionNumber == 0 ? prevBtn.disabled = true : prevBtn.disabled = false;
}

function t862_switchQuestion(rec, quizQuestionNumber) {
    var nextBtn = rec.querySelector('.t862__btn_next');
    var resultBtn = rec.querySelector('.t862__btn_result');
    var questionArr = t862_createQuestionArr(rec);
    var submitBtnWrapper = rec.querySelector('.t862 .t-form__submit');
    var captureForm = rec.querySelector('.t862__capture-form');
    var resultText = rec.querySelector('.t862__result-title').textContent;
    for (var i = 0; i < questionArr.length; i++) {
        questionArr[i].style.display = 'none';
        questionArr[i].classList.remove('t-input-group-step_active');
        questionArr[quizQuestionNumber].style.display = 'block';
        questionArr[quizQuestionNumber].classList.add('t-input-group-step_active');
    }
    var $range = questionArr[quizQuestionNumber].querySelectorAll('.t-range');
    var range = $range[0];
    if (range) {
        var triggerChangeEvent;
        if (/msie|trident/.test(navigator.userAgent)) {
            triggerChangeEvent = document.createEvent('Event');
            triggerChangeEvent.initEvent('displayChanged', !0, !1);
        } else {
            triggerChangeEvent = new Event('displayChanged');
        }
        range.dispatchEvent(triggerChangeEvent);
    }
    if (captureForm.innerHTML === '' && resultText === '' && quizQuestionNumber === questionArr.length - 2) {
        nextBtn.style.display = 'none';
        resultBtn.style.display = 'block';
        submitBtnWrapper.style.display = 'none';
    } else if ((captureForm.style.display = 'none' === '' && resultText === '' && quizQuestionNumber === questionArr.length - 1)) {
        nextBtn.style.display = 'none';
        resultBtn.style.display = 'none';
        submitBtnWrapper.style.display = 'block';
    } else if (quizQuestionNumber === questionArr.length - 1) {
        nextBtn.style.display = 'none';
        resultBtn.style.display = 'block';
        submitBtnWrapper.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
        resultBtn.style.display = 'none';
        submitBtnWrapper.style.display = 'none';
    }
}

function t862_switchResultScreen(rec) {
    var resultBtn = rec.querySelector('.t862__btn_result');
    var submitBtnWrapper = rec.querySelector('.t862 .t-form__submit');
    var captureForm = rec.querySelector('.t862__capture-form');
    var resultTitle = rec.querySelector('.t862__result-title');
    if (captureForm.innerHTML !== '' || resultTitle.textContent !== '') {
        var quizDescription = rec.querySelector('.t862__quiz-description');
        var questionArr = t862_createQuestionArr(rec);
        for (var i = 0; i < questionArr.length; i++) {
            questionArr[i].style.display = 'none';
        }
        captureForm.style.display = 'block';
        quizDescription.style.display = 'none';
        resultTitle.style.display = 'block';
    }
    resultBtn.style.display = 'none';
    submitBtnWrapper.style.display = 'block';
}

function t862_awayFromResultScreen(rec) {
    var captureForm = rec.querySelector('.t862__capture-form');
    var quizDescription = rec.querySelector('.t862__quiz-description');
    var resultTitle = rec.querySelector('.t862__result-title');
    var submitBtnWrapper = rec.querySelector('.t862 .t-form__submit');
    submitBtnWrapper.style.display = 'none';
    captureForm.style.display = 'none';
    quizDescription.style.display = 'block';
    resultTitle.style.display = 'none';
}

function t862_onSuccess(form) {
    var inputsWrapper = form.querySelector('.t-form__inputsbox');
    var inputsHeight = inputsWrapper.clientHeight;
    var rect = inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
    var inputsOffset = rect;
    var inputsBottom = inputsHeight + inputsOffset;
    var targetOffset = form.querySelector('.t-form__successbox').getBoundingClientRect().top + window.pageYOffset;
    var prevBtn = form.closest('.t862').querySelector('.t862__btn_prev');
    var target;
    if (window.document.documentElement.clientHeight > 960) {
        target = targetOffset - 200;
    } else {
        target = targetOffset - 100;
    }
    var body = document.body;
    var html = document.documentElement;
    var documentHeight = Math.max(body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
    if (targetOffset > document.body.scrollTop || documentHeight - inputsBottom < window.innerHeight - 100) {
        inputsWrapper.classList.add('t862__inputsbox_hidden');
        setTimeout(function () {
            if (window.innerHeight > document.querySelector('.t-body').clientHeight) {
                document.querySelector('.t-tildalabel').style.transition = 'all ' + 50 + 'ms';
                document.querySelector('.t-tildalabel').style.opacity = '0';
            }
        }, 300);
    } else {
        document.querySelector('body').style.transition = 'all ' + 400 + 'ms';
        document.querySelector('body').style.scrollTop = target;

        setTimeout(function () {
            inputsWrapper.classList.add('t862__inputsbox_hidden');
        }, 400);
    }
    var successurl = form.getAttribute('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function () {
            window.location.href = successurl;
        }, 500);
    }
    prevBtn.style.display = 'none';
}

function t862_lockScroll() {
    var body = document.querySelector('body');
    if (!body.classList.contains('t-body_scroll-locked')) {
        var bodyScrollTop =
            typeof window.pageYOffset !== 'undefined'
                ? window.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        body.classList.add('t-body_scroll-locked');
        body.style.top = '-' + bodyScrollTop + 'px';
        body.setAttribute('data-popup-scrolltop', bodyScrollTop);
    }
}

function t862_unlockScroll() {
    var body = document.querySelector('body');
    if (body.classList.contains('t-body_scroll-locked')) {
        body.classList.remove('t-body_scroll-locked');
        body.style.top = '';
        body.removeAttribute('data-popup-scrolltop');
        (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    }
}

function t862_showPopup(rec, form, quizQuestion, captureForm) {
    var popup = rec.querySelector('.t-popup');
    var quiz = rec.querySelector('.t862__quiz');
    popup.style.display = 'block';
    var $range = rec.querySelector('.t-range');
    var range = $range[0];
    if (range) {
        var triggerChangeEvent;
        if (/msie|trident/.test(navigator.userAgent)) {
            triggerChangeEvent = document.createEvent('Event');
            triggerChangeEvent.initEvent('popupOpened', !0, !1);
        } else {
            triggerChangeEvent = new Event('popupOpened');
        }
        range.dispatchEvent(triggerChangeEvent);
    }
    if (window.lazy === 'y' || document.querySelector('#allrecords').getAttribute('data-tilda-lazy') === 'yes') {
        t_onFuncLoad('t_lazyload_update', function () {
            t_lazyload_update();
        });
    }
    setTimeout(function () {
        popup.querySelector('.t-popup__container').classList.add('t-popup__container-animated');
        popup.classList.add('t-popup_show');
        if ($(window).width() > 640 && quiz.classList.contains('t862__quiz_fixedheight')) {
            t862_setHeight(rec, form, quizQuestion, captureForm);
        }
        if ($(window).width() <= 640) {
            t862_setMobileHeight();
        }
        t862__showJivo(popup, '1', '1');
    }, 50);
    document.querySelector('body').classList.add('t-body_popupshowed', 't862__body_popupshowed');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        setTimeout(function () {
            t862_lockScroll();
        }, 500);
    }
    rec.querySelector('.t-popup').addEventListener('click', function (event) {
        var windowWidth = window.document.documentElement.clientWidth;
        var maxScrollBarWidth = 17;
        var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
        if (event.clientX > windowWithoutScrollBar) {
            return;
        }
        if (event.target == this) {
            t862_closePopup(rec);
        }
    });
    rec.querySelector('.t-popup__close').addEventListener('click', function () {
        t862_closePopup(rec);
    });
    var links = rec.querySelectorAll('a[href*="#"]');
    if (links) {
        for (var i = 0; i < links.length; i++) {
            console.log(links[i]);
            links[i].addEventListener('click', function (event) {
                var url = event.target.getAttribute('href');
                if (!url || url.substring(0, 7) != '#price:') {
                    t862_closePopup(rec);
                    if (!url || url.substring(0, 7) == '#popup:') {
                        setTimeout(function () {
                            document.querySelector('body').classList.add('t-body_popupshowed');
                        }, 300);
                    }
                }
            });
        }
    }
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 27) {
            t862_closePopup(rec);
        }
    });
}

function t862_closePopup(rec) {
    document.querySelector('body').classList.remove('t-body_popupshowed', 't862__body_popupshowed');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        t862_unlockScroll();
    }
    rec.querySelector('.t-popup').classList.remove('t-popup_show');
    t862__showJivo(document.querySelector('.t-popup'), '2147483647', '2147483648');
    setTimeout(function () {
        document.querySelector('.t-popup').style.display = 'none';
    }, 300);
}

function t862_resizePopup(rec) {
    var div = rec.querySelector('.t-popup__container').clientHeight;
    var win = window.document.documentElement.clientHeight - 120;
    var popup = rec.querySelector('.t-popup__container');
    if (div > win) {
        popup.classList.add('t-popup__container-static');
    } else {
        popup.classList.remove('t-popup__container-static');
    }
}

function t862__showJivo(popup, indexMobile, indexDesktop) {
    if (
        document.querySelector('._show_1e.wrap_mW.__jivoMobileButton') &&
        document.querySelector('._show_1e.wrap_mW.__jivoMobileButton').length != 0
    ) {
        document.querySelector('._show_1e.wrap_mW.__jivoMobileButton').style.zIndex = indexMobile;
    }
    if (document.querySelector('.label_39#jvlabelWrap') && document.querySelector('.label_39#jvlabelWrap').length != 0) {
        document.querySelector('.label_39#jvlabelWrap').style.zIndex = indexDesktop;
    }
}

function t862_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7);
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {
                    hitType: 'pageview',
                    page: virtPage,
                    title: virtTitle,
                });
            }
        }
        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {
                title: virtTitle,
                referer: window.location.href,
            });
        }
    }
}