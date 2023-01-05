var awzaan = {};
var Symbols = ' ،.-*/?!؟:';

var bo7oor = ['waafer', 'hazaj', 'mota9aarab', 'motadaarak', 'ramal', 'kaamel', 'rajaz', 'taweel', 'baseet', 'khafeef', 'monsarih', 'saree3', 'madeed', 'mojtath', 'mo9tadhab', 'modhaare3'];
var randomBa7r = $.cookie('Ba7r');

if (randomBa7r == undefined) {
    randomBa7r = bo7oor[Math.floor(Math.random() * bo7oor.length)] + '1';
    $.cookie('Ba7r', randomBa7r, {
        expires: 30,
        path: '/'
    });
}

var nums = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
var harakaat = ['َ', 'ِ', 'ُ', 'ً', 'ٍ', 'ٌ', 'ْ', 'ّ'];

var bp = '<div class="card"><div class="card-header text-white bg-success">نبذة عن البحر</div><div class="card-body">';
var tp = '<div class="card"><div class="card-header text-white bg-info">التغيير الطارئ على البحر</div><div class="card-body">';
var cp = '</div></div><br>';

function ta9seem(wazn) {
    wazn = wazn ? wazn : randomBa7r;
    var taf3eelah = awzaan[wazn]['taf3eelah'];
    var result = '';
    var td = 0;
    var col = 3;
    if (taf3eelah.length == 2 || taf3eelah.length == 4) {
        col = 6;
    } else if (taf3eelah.length == 3 || taf3eelah.length == 6) {
        col = 4;
    } else if (taf3eelah.length == 8) {
        col = 6;
    }
    $.each(taf3eelah, function (key, val) {
        if (this['Key'].length && this['Value'].length) {
            var intArr = this['Key'];
            result += '<div class="col-md-' + col + ' col-sm-12"><table class="ta9seem table table-striped" id="orig-' + key + '">';
            var Value = this['Value'];
            var colspan = this['Key'].length;

            if (this['Key'] == 'x' && $.isArray(this['Value']) == true) {
                intArr = this['Value'][0]['K'];
                colspan = this['Value'][0]['K'].length;
                Value = '<select class="selectpicker" data-width="100%" onchange="ChangeTaf3eelah($(this), $(this).val())">';
                $.each(this['Value'], function (k, v) {
                    Value += '<option value="' + v['K'] + '">' + v['V'] + '</option>';
                });
                Value += '</select>';
            }

            result += '<tr class="table-primary"><th class="th" colspan="' + colspan + '">';

            result += Value;
            result += '</th></tr>';

            result += Harakaat(intArr);

            result += '</table></div>';
            if (taf3eelah.length >= 4 && taf3eelah.length / 2 == key + 1) {
                result += '</div><div class="row">';
            }
        }
    });
    $('#ta9seem').html('<div class="row">' + result + '</div>');
    $('select').selectpicker('refresh');
    $("td.ch").each(function (i) {
        $(this).attr('id', 'td_' + i);
    });
}

function Harakaat(intArr) {
    intArr = Array.from(String(intArr));
    var result = '<tr class="orig table-warning">';
    $.each(intArr, function (k, v) {
        result += '<td>';
        result += v == 1 ? '<b>/</b>' : '0';
        result += '</td>';
    });
    result += '</tr>';

    result += '<tr class="new table-danger">';
    $.each(intArr, function (k, v) {
        result += '<td class="ch new-' + k + '" data-orig="' + v + '" data-new="-">';
        result += '➖';
        result += '</td>';
    });
    result += '</tr>';

    return result;
}

function ChangeTaf3eelah(that, intArr) {
    that = that.closest('table');
    that.find('.orig, .new').remove();
    that.find('tr').after(Harakaat(intArr));
    $("td.ch").each(function (i) {
        $(this).prop('id', 'td_' + i);
    });
    checkIt();
}

function Nobdhah(wazn) {
    wazn = wazn ? wazn : randomBa7r;
    var orig = '● ' + awzaan[wazn]['type'] + ', ' +
        awzaan[wazn]['desc'] + '.<br />' +
        awzaan[wazn]['orig'] + '.';
    $('#nobdhah').html(awzaan[wazn]['nobdhah'].replace('{ORIG}', orig));
}

function ChangeBa7r(wazn) {
    ta9seem(wazn);
    Nobdhah(wazn);
    checkIt();
}

function checkIt(chi3r) {
    chi3r = chi3r ? chi3r : $('#chi3r').val();
    var wazn = '';
    if (chi3r) {
        var chakl = '';
        $.each(chi3r.split(''), function (k, v) {
            if ($.inArray(v, Symbols.split('')) === -1) {
                if ($.inArray(v, harakaat) !== -1) {
                    if (v == 'ْ') {
                        chakl = chakl.slice(0, -1) + v;
                    }
                } else {
                    chakl += 'َ';
                }
            }
        });
    }
    if (chakl) {
        $.each(chakl.split(''), function (k, v) {
            wazn += (v == 'ْ') ? "0" : "1";
        });
        if (wazn) {
            wazn = wazn.split('');
            $.each(wazn, function (k, v) {
                $('#td_' + k).attr('data-new', v);
            });
            $(".new td").each(function (i) {
                if (wazn.length - 1 < i) $('#td_' + i).text('➖').attr('data-new', '-');
            });
        }
    }
    if (!chi3r) {
        $(".new td").text('➖').attr('data-new', '-');
    }
    $("tr.new td").each(function (i) {
        $(this).text($(this).attr('data-orig') == $(this).attr('data-new') ? '✔️' : ($(this).attr('data-new') == '-' ? '➖' : '❌'));
    });
    var inValid = 0;
    $("tr.new").each(function () {
        if ($(this).is(":contains('❌')") || $(this).is(":contains('➖')")) {
            $(this).removeClass('table-success').addClass('table-danger');
            inValid++;
        } else {
            $(this).removeClass('table-danger').addClass('table-success');
        }
    });
    if (inValid) {
        $('#chi3r').removeClass('is-valid').addClass('is-invalid');
        $('#chi3r').css({
            'border-color': '#ed969e',
            'background-color': '#f5c6cb'
        });
    } else {
        $('#chi3r').removeClass('is-invalid').addClass('is-valid');
        $('#chi3r').css({
            'border-color': '#8fd19e',
            'background-color': '#c3e6cb'
        });
    }
}

function Happend(text) {
    var input = document.getElementById('chi3r');
    if (!input) return;
    var scrollPos = input.scrollTop;
    var strPos = 0;
    var br = ((input.selectionStart || input.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false));
    if (br == "ie") {
        input.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -input.value.length);
        strPos = range.text.length;
    } else if (br == "ff") {
        strPos = input.selectionStart;
    }

    var front = (input.value).substring(0, strPos);
    var back = (input.value).substring(strPos, input.value.length);

    input.value = Tansee9(text, front) + back;
    strPos = strPos + text.length;

    if ($.inArray(text, ['ً', 'ٍ', 'ٌ', 'ّ']) !== -1) strPos++;

    if (br == "ie") {
        input.focus();
        var ieRange = document.selection.createRange();
        ieRange.moveStart('character', -input.value.length);
        ieRange.moveStart('character', strPos);
        ieRange.moveEnd('character', 0);
        ieRange.select();
    } else if (br == "ff") {
        input.selectionStart = strPos;
        input.selectionEnd = strPos;
        input.focus();
    }

    input.scrollTop = scrollPos;
    checkIt();
}

function Tansee9(text, front) {
    if (text == 'ّ') {
        var lastCh = front.substr(front.length - 1);
        front += 'ْ' + lastCh + text.substr(front.length - 1);
    } else if ($.inArray(text, ['ً', 'ٍ', 'ٌ']) !== -1) {
        front = front + 'نْ';
    } else {
        switch (text) {
            case 'ﻷ':
                text = 'لْأ';
                break;
            case 'ﻹ':
                text = 'لْإ';
                break;
            case 'آ':
                text = 'أاْ';
                break;
            default:
                var lastCh = front.substr(front.length - 1);
                if ($.inArray(lastCh, ['ا', 'ي', 'و', 'ى']) !== -1 && text == ' ') front += 'ْ';
        }

        front = front + text;
    }

    return front;
}

function setSelect() {
    var select = '<select class="selectpicker" data-width="100%" onchange="ChangeBa7r($(this).val())" data-live-search="true" data-focus-off="true">';
    var lastBa7r = '';

    $.each(awzaan, function (Key, Value) {
        if (lastBa7r && Value['name'] != lastBa7r) select += '</optgroup>';
        if (Value['name'] != lastBa7r) select += '<optgroup label="' + Value['name'] + '">';
        var title = '<img src=\'https://alnadom.github.io/Nadm/img/numbers/' + Key.substr(Key.length - 1) + '.png\' class=\'img-fluid\' width=\'30\' /> ' + Value['name'] + ': ' + Value['type'];
        var content = '<div class=\'text-black title\'>' + title + '</div>';
        content += '<small class=\'text-secondary\'>' + Value['desc'] + '</small><br>';
        content += '<sub class=\'text-secondary orig\'>' + Value['orig'] + '</sub>';
        select += '<option data-content="' + content + '" value="' + Key + '"' + (randomBa7r == Key ? ' selected' : '') + '>' + title + '</option>';
        lastBa7r = Value['name'];
    });
    select += '</optgroup></select>';

    $('#ba7r').html(select);
    $('select').selectpicker('refresh');
}

function setInter() {
    var ba7rBtn = $('#ba7r .btn.dropdown-toggle.btn-light');
    var bSmall = ba7rBtn.find('small').text();
    var bSub = ba7rBtn.find('sub').text();
    ba7rBtn.find('.title').after('<div class="bToggle">...</div>');
    var bToggle = ba7rBtn.find('.bToggle');
    bToggle.text(bSmall);

    if (typeof setInter != 'undefined') clearInterval(setInter);

    var setInter = window.setInterval(function () {
        bToggle.text(bToggle.text() == bSmall ? bSub : bSmall);
        checkIt();
    }, 2000);
}
(function ($) {
    $.fn.arabicOnly = function () {
        return this.each(function () {
            $(this).keypress(function (e) {
                var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                var Allowed = [32, 33, 42, 45, 46, 47, 48, 58, 63, 1548, 1567];
                if (key != 8) {
                    if (key < 0x0600 || key > 0x06FF) {
                        if ($.inArray(key, Allowed) === -1) return false;
                    }
                }
            });
        });
    };
})(jQuery);
