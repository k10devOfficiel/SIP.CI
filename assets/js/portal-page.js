/**
 * Interface locale : prix carburants + actualités → fichiers JSON via api/pw-z8kq.php
 */
(function () {
    var SESSION_KEY = 'sip_pt_k';

    function basePath() {
        return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
    }

    function getPortalKey() {
        return sessionStorage.getItem(SESSION_KEY) || '';
    }

    function setPortalKey(value) {
        if (value) {
            sessionStorage.setItem(SESSION_KEY, value);
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }

    function $(id) {
        return document.getElementById(id);
    }

    function showStatus(el, message, kind) {
        el.hidden = !message;
        el.textContent = message || '';
        el.className = 'portal-status' + (kind ? ' portal-status--' + kind : '');
    }

    function loadJson(rel) {
        return fetch(basePath() + rel, { cache: 'no-store' }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        });
    }

    function savePortal(payload) {
        var key = getPortalKey();
        if (!key) return Promise.reject(new Error('Saisissez et mémorisez la clé d’accès.'));

        var body = JSON.stringify(Object.assign({ key: key }, payload));

        return fetch(basePath() + 'api/pw-z8kq.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: body,
        }).then(function (res) {
            return res.json().then(function (data) {
                if (!res.ok || !data.ok) {
                    throw new Error(data.error || res.statusText || 'Erreur serveur');
                }
                return data;
            });
        });
    }

    function fillFuelForm(data) {
        $('fuel-super').value = data.super != null ? data.super : '';
        $('fuel-gasoil').value = data.gasoil != null ? data.gasoil : '';
        $('fuel-petrole').value = data.petrole != null ? data.petrole : '';
        $('fuel-date').value = data.date != null ? data.date : '';
    }

    function readFuelForm() {
        return {
            super: $('fuel-super').value,
            gasoil: $('fuel-gasoil').value,
            petrole: $('fuel-petrole').value,
            date: $('fuel-date').value.trim(),
        };
    }

    function slugId(title) {
        var s = String(title || '').toLowerCase();
        try {
            s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        } catch (e) {
            /* normalize absent sur très vieux navigateurs */
        }
        var base = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (!base) base = 'actu';
        return base + '-' + Date.now().toString(36);
    }

    function tbodyClear(tb) {
        while (tb.firstChild) tb.removeChild(tb.firstChild);
    }

    function addNewsRow(tb, item) {
        var tr = document.createElement('tr');
        item = item || { id: '', date: '', dateLabel: '', title: '', image: '', readMoreUrl: '', excerpt: '' };

        function tdInput(value, name, opts) {
            opts = opts || {};
            var td = document.createElement('td');
            var inp = document.createElement(opts.multiline ? 'textarea' : 'input');
            if (!opts.multiline) {
                inp.type = opts.type || 'text';
            }
            inp.value = value || '';
            inp.setAttribute('data-field', name);
            if (opts.placeholder) inp.setAttribute('placeholder', opts.placeholder);
            if (opts.multiline) inp.rows = 2;
            td.appendChild(inp);
            return td;
        }

        tr.appendChild(tdInput(item.id, 'id'));
        tr.appendChild(tdInput(item.date, 'date', { type: 'text' }));
        tr.appendChild(tdInput(item.dateLabel, 'dateLabel'));
        tr.appendChild(tdInput(item.title, 'title'));
        tr.appendChild(tdInput(item.image, 'image', { placeholder: 'assets/images/…' }));
        tr.appendChild(tdInput(item.readMoreUrl, 'readMoreUrl', { placeholder: 'contact.html' }));
        tr.appendChild(tdInput(item.excerpt, 'excerpt', { multiline: true }));

        var tdAct = document.createElement('td');
        var btnGen = document.createElement('button');
        btnGen.type = 'button';
        btnGen.className = 'btn-gen-id';
        btnGen.textContent = 'Id';
        btnGen.title = 'Générer un identifiant à partir du titre';
        btnGen.addEventListener('click', function () {
            var titleInp = tr.querySelector('[data-field="title"]');
            var idInp = tr.querySelector('[data-field="id"]');
            if (titleInp && idInp) idInp.value = slugId(titleInp.value || 'actu');
        });

        var btnDel = document.createElement('button');
        btnDel.type = 'button';
        btnDel.className = 'btn-del-row';
        btnDel.textContent = '×';
        btnDel.title = 'Supprimer cette ligne';
        btnDel.addEventListener('click', function () {
            tr.remove();
        });

        tdAct.appendChild(btnGen);
        tdAct.appendChild(btnDel);
        tr.appendChild(tdAct);

        tb.appendChild(tr);
    }

    function collectNewsItems() {
        var tb = $('news-body');
        var rows = tb.querySelectorAll('tr');
        var items = [];

        rows.forEach(function (tr) {
            function val(name) {
                var el = tr.querySelector('[data-field="' + name + '"]');
                return el ? String(el.value).trim() : '';
            }

            var row = {
                id: val('id'),
                date: val('date'),
                dateLabel: val('dateLabel'),
                title: val('title'),
                image: val('image'),
                readMoreUrl: val('readMoreUrl'),
                excerpt: val('excerpt'),
            };

            if (
                !row.id &&
                !row.title &&
                !row.excerpt &&
                !row.date &&
                !row.dateLabel &&
                !row.image &&
                !row.readMoreUrl
            ) {
                return;
            }

            items.push(row);
        });

        return items;
    }

    function reloadAll() {
        var st = $('portal-feedback');
        showStatus(st, 'Chargement…', 'info');

        Promise.all([loadJson('data/fuel-prices.json'), loadJson('data/actualites.json')])
            .then(function (results) {
                fillFuelForm(results[0] || {});
                var tb = $('news-body');
                tbodyClear(tb);
                var items = (results[1] && results[1].items) || [];
                if (!items.length) {
                    addNewsRow(tb, null);
                } else {
                    items.forEach(function (it) {
                        addNewsRow(tb, it);
                    });
                }
                showStatus(st, 'Données chargées.', 'ok');
            })
            .catch(function (err) {
                console.error(err);
                showStatus(st, err.message || 'Impossible de charger les fichiers.', 'err');
            });
    }

    document.addEventListener('DOMContentLoaded', function () {
        $('portal-key').value = getPortalKey();

        $('btn-key-save').addEventListener('click', function () {
            var k = $('portal-key').value.trim();
            setPortalKey(k);
            showStatus($('portal-feedback'), k ? 'Clé mémorisée pour cette session.' : 'Clé effacée.', 'ok');
        });

        $('btn-key-clear').addEventListener('click', function () {
            $('portal-key').value = '';
            setPortalKey('');
            showStatus($('portal-feedback'), 'Clé effacée.', 'info');
        });

        $('btn-reload').addEventListener('click', reloadAll);

        $('btn-add-news').addEventListener('click', function () {
            addNewsRow($('news-body'), null);
        });

        $('btn-save-fuel').addEventListener('click', function () {
            var st = $('portal-feedback');
            showStatus(st, 'Enregistrement…', 'info');
            savePortal({ fuel: readFuelForm() })
                .then(function (data) {
                    showStatus(st, 'Enregistré : ' + data.saved.join(', '), 'ok');
                })
                .catch(function (err) {
                    showStatus(st, err.message || 'Erreur', 'err');
                });
        });

        $('btn-save-news').addEventListener('click', function () {
            var st = $('portal-feedback');
            showStatus(st, 'Enregistrement…', 'info');
            savePortal({ actualites: { items: collectNewsItems() } })
                .then(function (data) {
                    showStatus(st, 'Enregistré : ' + data.saved.join(', '), 'ok');
                })
                .catch(function (err) {
                    showStatus(st, err.message || 'Erreur', 'err');
                });
        });

        $('btn-save-all').addEventListener('click', function () {
            var st = $('portal-feedback');
            showStatus(st, 'Enregistrement…', 'info');
            savePortal({
                fuel: readFuelForm(),
                actualites: { items: collectNewsItems() },
            })
                .then(function (data) {
                    showStatus(st, 'Enregistré : ' + data.saved.join(', '), 'ok');
                })
                .catch(function (err) {
                    showStatus(st, err.message || 'Erreur', 'err');
                });
        });

        reloadAll();
    });
})();
