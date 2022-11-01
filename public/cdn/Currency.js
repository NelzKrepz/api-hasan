/*
Original by https://github.com/ihsandulu/rupiahnumerik
Modified by NelzKrepz
*/

"use strict";

class CurrencyFormat {
    num = null;
    prefix = '';
    thousands_sep = '.' // Use dot by default
    /**
     * 
     * @param {string} string A number.
     * @param {string} prefix A prefix currency. 
     */
    constructor(string, prefix) {
        this.num = string;
        this.prefix = prefix;

        var number_string = this.num.replace(/[^,\d]/g, '').toString(),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            currency = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    
        if (ribuan) {
            let separator = sisa ? '.' : '';
            currency += separator + ribuan.join('.');
        }
    
        currency = split[1] != undefined ? currency + ',' + split[1] : currency;
        this.formatted = (this.prefix == undefined ? currency : (this.prefix + currency));
    }
    
    toCurrency() {
        return this.formatted;
    }

    /**
     * Assign formatter to the DOM `<input>` element
     * @param {string} element DOM Element but as string.
     * @requires JQuery 
     * @example
     * ```js
     * new CurrencyFormat(null, 'Rp. ').assignElement('#harga');
     * ```
     */
    assignElement(element) {
        let run = () => {
            function number_format(number, decimals, dec_point, thousands_sep) {
                var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                    toFixedFix = function (n, prec) {
                        var k = Math.pow(10, prec);
                        return Math.round(n * k) / k;
                    },
                    s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
                if (s[0].length > 3) {
                    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                }
                if ((s[1] || '').length < prec) {
                    s[1] = s[1] || '';
                    s[1] += new Array(prec - s[1].length + 1).join('0');
                }
                return s.join(dec);
            }

            this.num = $(element).val();
            var currency;
            $(element).attr('type', 'text');
            var id1 = $(element).attr('id') + '1';
            var name = $(element).attr('name');
            var txt1 = "<input type='hidden' id='" + id1 + "' class='" + name + "' name='" + name + "' value=''>";
    
    
            if ($(element).attr('name') == $(element).attr('id')) {
                $(element).after(txt1);
                $(element).attr('name', '');
                currency = number_format(this.num, 2, '', this.thousands_sep);
                if (this.num <= 0) { currency = ''; }
                $(element).val(currency);
                $("#" + id1).val(this.num);
            } else {
                currency = this.toCurrency();
    
                var pecahkoma = currency.split(',');
                var koma;
                if (pecahkoma.length > 1) {
                    koma = '.' + pecahkoma[1];
                } else {
                    koma = '';
                }
                var awal = pecahkoma[0].replace(/\./g, "");
                var gabung = (awal + koma).slice(this.prefix.length-1);
    
                $(element).val(currency);
                $("#" + id1).val(gabung);
            }
        }
        run();
        $(element).keyup(run);
        
    }
}

String.prototype.currencyFormat = function(prefix) {
    return new CurrencyFormat(this.toString(), prefix).toCurrency();
}
