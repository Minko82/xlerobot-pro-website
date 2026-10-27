/* XLeRobot-Pro site behaviour. Every feature here is an enhancement:
   pages stay fully readable with JavaScript off. */
(function () {
    'use strict';

    var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
    var headerHeight = function () {
        var h = document.querySelector('.site-header');
        return h ? h.offsetHeight : 0;
    };
    var onMedia = function (mq, fn) {
        if (mq.addEventListener) mq.addEventListener('change', fn);
        else if (mq.addListener) mq.addListener(fn);
    };

    /* ---- Mobile navigation ---- */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
        var setOpen = function (open) {
            toggle.setAttribute('aria-expanded', String(open));
            nav.classList.toggle('is-open', open);
        };
        toggle.addEventListener('click', function () {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setOpen(false);
                toggle.focus();
            }
        });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) setOpen(false);
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
        onMedia(window.matchMedia('(min-width: 1080px)'), function (e) { if (e.matches) setOpen(false); });
    }

    /* ---- Code blocks: dim prompts and comments, add a copy button ---- */
    each(document.querySelectorAll('.code'), function (block) {
        var pre = block.querySelector('pre');
        if (!pre) return;
        var code = pre.querySelector('code') || pre;
        var lines = code.innerHTML.replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
        var shell = lines.some(function (l) { return l.indexOf('$ ') === 0; });
        if (shell) {
            code.innerHTML = lines.map(function (l) {
                if (l.indexOf('$ ') === 0) return '<span class="p" aria-hidden="true">$ </span>' + l.slice(2);
                if (/^\s*#/.test(l)) return '<span class="c">' + l + '</span>';
                return l;
            }).join('\n');
        } else {
            code.innerHTML = lines.join('\n');
        }

        var head = block.querySelector('.code-head');
        if (!head) {
            head = document.createElement('div');
            head.className = 'code-head';
            head.innerHTML = '<span>' + (shell ? 'Terminal' : 'Code') + '</span>';
            block.insertBefore(head, pre);
        }
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy ' + (shell ? 'commands' : 'code') + ': ' + head.textContent.trim());
        head.appendChild(btn);

        btn.addEventListener('click', function () {
            var text = code.textContent;
            if (shell) {
                // Copy only the commands: drop prompts, comments, and output lines,
                // but keep the continuation of a command that ends in a backslash.
                var out = [];
                var continuing = false;
                text.split('\n').forEach(function (l) {
                    if (l.indexOf('$ ') === 0) { out.push(l.slice(2)); continuing = /\\\s*$/.test(l); }
                    else if (continuing) { out.push(l); continuing = /\\\s*$/.test(l); }
                });
                text = out.join('\n');
            }
            copyText(text).then(function () {
                btn.textContent = 'Copied';
                btn.classList.add('is-done');
                setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 2000);
            }, function () {
                btn.textContent = 'Select and copy';
            });
        });
    });

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy') ? resolve() : reject(); } catch (err) { reject(err); }
            document.body.removeChild(ta);
        });
    }

    /* ---- Stacked tables: give each cell its column name for the phone layout ---- */
    each(document.querySelectorAll('table.data--stack'), function (table) {
        var heads = Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) {
            return th.textContent.trim();
        });
        each(table.querySelectorAll('tbody tr'), function (tr) {
            each(tr.children, function (cell, i) {
                if (heads[i] && !cell.hasAttribute('data-label')) cell.setAttribute('data-label', heads[i]);
            });
        });
    });

    /* ---- "On this page" timeline, built from the page's sections ----
       Wide screens: a sticky sidebar with one marker per section. Finished
       sections fill in, the current one is ringed, and the line fills as you
       read. Narrow screens: a bar pinned under the header names the current
       section and shows progress; it opens the same timeline as a panel.
       Numbered steps that follow a .phase band are grouped under it, and only
       the phase you are in shows its steps, so a long guide stays short. */
    var tocHost = document.querySelector('[data-toc]');
    var content = document.querySelector('.doc-content');
    var wide = window.matchMedia('(min-width: 1100px)');
    var tocItems = [];
    var tocUpdate = null;
    if (tocHost && content) {
        tocHost.innerHTML =
            '<p class="toc-title">On this page</p>' +
            '<button type="button" class="toc-toggle" aria-expanded="false" aria-controls="toc-panel">' +
                '<span class="toc-where"><span class="toc-count"></span><span class="toc-current"></span></span>' +
                '<span class="toc-toggle-label">All sections</span>' +
            '</button>' +
            '<div class="toc-progress" aria-hidden="true"><span></span></div>' +
            '<div class="toc-panel" id="toc-panel">' +
                '<div class="timeline-wrap">' +
                    '<span class="timeline-track" aria-hidden="true"></span>' +
                    '<span class="timeline-fill" aria-hidden="true"></span>' +
                    '<ol class="timeline"></ol>' +
                '</div>' +
            '</div>';
        var list = tocHost.querySelector('.timeline');
        var phases = [];
        var phase = null;
        each(content.querySelectorAll('.doc-section[id], .phase[data-toc-group]'), function (el) {
            var li = document.createElement('li');
            if (el.classList.contains('phase')) {
                li.className = 'timeline-phase';
                li.innerHTML = '<a><span class="timeline-marker" aria-hidden="true"></span>' +
                    '<span class="timeline-text"></span></a><ol class="timeline-steps"></ol>';
                li.querySelector('.timeline-text').textContent = el.getAttribute('data-toc-group');
                list.appendChild(li);
                phase = { li: li, link: li.firstChild, steps: li.lastChild, items: [] };
                phases.push(phase);
                return;
            }
            if (el.hasAttribute('data-toc-skip')) return;
            var heading = el.querySelector('h2');
            var label = el.getAttribute('data-toc-label') || (heading ? heading.textContent.trim() : el.id);
            var numEl = el.querySelector('.step-num');
            var num = numEl ? numEl.textContent.trim() : '';
            var numbered = !num && label.match(/^(\d+)\.\s+(.+)$/);
            if (numbered) { num = numbered[1]; label = numbered[2]; }
            var a = document.createElement('a');
            a.href = '#' + el.id;
            a.innerHTML = '<span class="timeline-marker" aria-hidden="true"></span>' +
                (num ? '<span class="timeline-num"></span>' : '') + '<span class="timeline-text"></span>';
            if (num) a.querySelector('.timeline-num').textContent = num;
            a.lastChild.textContent = label;
            li.className = 'timeline-item';
            li.appendChild(a);
            // A section without a step number closes the phase above it
            if (!numEl) phase = null;
            var item = { li: li, link: a, section: el, label: label, num: num, isStep: !!numEl, phase: phase };
            if (phase) {
                li.classList.add('timeline-item--sub');
                phase.steps.appendChild(li);
                phase.items.push(item);
            } else {
                list.appendChild(li);
            }
            tocItems.push(item);
        });
        phases.forEach(function (ph) {
            if (!ph.items.length) { ph.li.remove(); return; }
            ph.link.href = '#' + ph.items[0].section.id;
        });
        var stepTotal = tocItems.filter(function (t) { return t.isStep; }).length;
        document.documentElement.classList.add('has-toc');

        var toggle = tocHost.querySelector('.toc-toggle');
        var panel = tocHost.querySelector('.toc-panel');
        var wrap = tocHost.querySelector('.timeline-wrap');
        var track = tocHost.querySelector('.timeline-track');
        var fill = tocHost.querySelector('.timeline-fill');
        var bar = tocHost.querySelector('.toc-progress span');
        var countEl = tocHost.querySelector('.toc-count');
        var currentEl = tocHost.querySelector('.toc-current');
        var lastActive = null;

        var setTocOpen = function (open) {
            toggle.setAttribute('aria-expanded', String(open));
            tocHost.classList.toggle('is-open', open);
            if (open) onScroll();
        };
        toggle.addEventListener('click', function () {
            setTocOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });
        list.addEventListener('click', function (e) {
            if (e.target.closest('a') && !wide.matches) setTocOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && tocHost.classList.contains('is-open')) {
                setTocOpen(false);
                toggle.focus();
            }
        });
        document.addEventListener('click', function (e) {
            if (tocHost.classList.contains('is-open') && !tocHost.contains(e.target)) setTocOpen(false);
        });
        onMedia(wide, function () { setTocOpen(false); onScroll(); });

        // A step inside a folded phase is drawn at its phase's marker
        var markerY = function (t) {
            var link = t.phase && !t.phase.li.classList.contains('is-open') ? t.phase.link : t.link;
            var r = link.firstChild.getBoundingClientRect();
            return r.top + r.height / 2 - wrap.getBoundingClientRect().top;
        };

        tocUpdate = function (line) {
            // Sections hidden by the troubleshooting filter drop out of the timeline too
            tocItems.forEach(function (t) { t.li.hidden = t.section.offsetParent === null; });
            var shown = tocItems.filter(function (t) { return !t.li.hidden; });
            if (!shown.length) return;

            var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            var current = shown[0];
            if (atBottom) current = shown[shown.length - 1];
            else shown.forEach(function (t) { if (t.section.getBoundingClientRect().top <= line) current = t; });
            var pos = shown.indexOf(current);
            var next = shown[pos + 1];

            // How far through the current section the reader is, 0 to 1
            var top = current.section.getBoundingClientRect().top;
            var end = next ? next.section.getBoundingClientRect().top : content.getBoundingClientRect().bottom;
            var frac = atBottom ? 1 : Math.min(1, Math.max(0, (line - top) / Math.max(1, end - top)));
            if (pos === 0 && top > line) frac = 0;

            shown.forEach(function (t, i) {
                t.li.classList.toggle('is-done', i < pos);
                t.li.classList.toggle('is-active', i === pos);
                if (i === pos) t.link.setAttribute('aria-current', 'location');
                else t.link.removeAttribute('aria-current');
            });
            phases.forEach(function (ph) {
                var here = ph.items.indexOf(current) !== -1;
                var lastShown = ph.items.filter(function (t) { return !t.li.hidden; }).pop();
                ph.li.classList.toggle('is-open', here);
                ph.li.classList.toggle('is-active', here);
                ph.li.classList.toggle('is-done', !here && !!lastShown && shown.indexOf(lastShown) < pos);
            });

            countEl.textContent = current.isStep ? 'Step ' + current.num + ' of ' + stepTotal
                : stepTotal ? '' : (pos + 1) + ' of ' + shown.length;
            currentEl.textContent = current.label;
            bar.style.transform = 'scaleX(' + ((pos + frac) / shown.length) + ')';

            var y0 = markerY(shown[0]);
            var yEnd = markerY(shown[shown.length - 1]);
            var yCur = markerY(current);
            var yNext = next ? markerY(next) : yCur;
            track.style.top = fill.style.top = y0 + 'px';
            track.style.height = Math.max(0, yEnd - y0) + 'px';
            fill.style.height = Math.max(0, yCur - y0 + (yNext - yCur) * frac) + 'px';

            // Keep the current entry in view when the timeline itself scrolls
            if (current !== lastActive) {
                lastActive = current;
                var scroller = wide.matches ? tocHost : panel;
                if (scroller.scrollHeight > scroller.clientHeight) {
                    var r = current.li.getBoundingClientRect();
                    var b = scroller.getBoundingClientRect();
                    if (r.top < b.top + 48 || r.bottom > b.bottom - 48) {
                        scroller.scrollTop += (r.top - b.top) - b.height / 3;
                    }
                }
            }
        };
    }

    /* ---- Scroll-dependent UI: timeline position and back-to-top ---- */
    var toTop = document.querySelector('.to-top');
    var ticking = false;
    function onScroll() {
        ticking = false;
        if (tocUpdate) {
            // The reading line sits just under everything pinned to the top of the screen
            var pinned = headerHeight() + (wide.matches ? 0 : tocHost.offsetHeight);
            tocUpdate(pinned + 24);
        }
        if (toTop) toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.5);
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    /* ---- Open any collapsed section that a link points into ---- */
    function revealHash() {
        var id = decodeURIComponent(location.hash.slice(1));
        if (!id) return;
        var el = document.getElementById(id);
        if (!el) return;
        var d = el.closest('details');
        while (d) {
            d.open = true;
            d = d.parentElement ? d.parentElement.closest('details') : null;
        }
    }
    window.addEventListener('hashchange', revealHash);
    revealHash();

    /* ---- Printing: expand every collapsed section, then restore ---- */
    var printed = [];
    window.addEventListener('beforeprint', function () {
        printed = [];
        each(document.querySelectorAll('details:not([open])'), function (d) { printed.push(d); d.open = true; });
    });
    window.addEventListener('afterprint', function () {
        printed.forEach(function (d) { d.open = false; });
    });

    /* ---- Short demo clips play muted only while on screen ---- */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clips = document.querySelectorAll('video[data-autoplay]');
    if (clips.length && 'IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (items) {
            items.forEach(function (it) {
                var v = it.target;
                if (it.isIntersecting && !v.dataset.userPaused) {
                    var p = v.play();
                    if (p && p.catch) p.catch(function () {});
                } else if (!it.isIntersecting) {
                    v.pause();
                }
            });
        }, { threshold: 0.5 });
        each(clips, function (v) {
            v.muted = true;
            v.addEventListener('pause', function () { if (isOnScreen(v)) v.dataset.userPaused = '1'; });
            v.addEventListener('play', function () { delete v.dataset.userPaused; });
            io.observe(v);
        });
    }
    function isOnScreen(el) {
        var r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight && !document.hidden;
    }

    /* ---- Assembly video chapter links ---- */
    each(document.querySelectorAll('a[data-video-start]'), function (link) {
        link.addEventListener('click', function (e) {
            var frame = document.getElementById(link.getAttribute('data-video'));
            if (!frame) return;
            e.preventDefault();
            frame.src = frame.getAttribute('data-embed') + '?start=' + link.getAttribute('data-video-start') + '&autoplay=1';
            frame.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        });
    });

    /* ---- Troubleshooting: filter by symptom ---- */
    var filter = document.querySelector('[data-filter-input]');
    if (filter) {
        var items = document.querySelectorAll('[data-filter-item]');
        var groups = document.querySelectorAll('[data-filter-group]');
        var status = document.querySelector('[data-filter-status]');
        var clearBtn = document.querySelector('[data-filter-clear]');
        var run = function () {
            if (clearBtn) clearBtn.hidden = !filter.value;
            var terms = filter.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
            var shown = 0;
            each(items, function (it) {
                var text = it.textContent.toLowerCase();
                var match = terms.every(function (t) { return text.indexOf(t) !== -1; });
                it.hidden = !match;
                if (match) shown++;
                if (it.tagName === 'DETAILS') it.open = terms.length > 0 && match;
            });
            each(groups, function (g) {
                g.hidden = terms.length > 0 && !g.querySelector('[data-filter-item]:not([hidden])');
            });
            // The first section still showing drops the divider above it
            var lead = null;
            each(document.querySelectorAll('.doc-content > .doc-section'), function (sec, i) {
                sec.classList.remove('is-lead');
                if (!lead && !sec.hidden) { lead = sec; if (i > 0) sec.classList.add('is-lead'); }
            });
            onScroll();
            if (!status) return;
            if (!terms.length) status.textContent = '';
            else if (shown) status.textContent = shown + (shown === 1 ? ' match' : ' matches');
            else status.textContent = 'No matches. Try one word, such as "bus", "camera", "torch", or "USB".';
        };
        filter.addEventListener('input', run);
        filter.addEventListener('search', run);
        if (filter.value) run();
        var clear = function () { filter.value = ''; run(); filter.focus(); };
        if (clearBtn) clearBtn.addEventListener('click', clear);
        document.addEventListener('keydown', function (e) {
            var el = document.activeElement;
            var typing = el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
            // "/" jumps to the search box, as on most documentation sites
            if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                filter.focus();
                filter.select();
            } else if (e.key === 'Escape' && el === filter && filter.value) {
                e.preventDefault();
                clear();
            }
        });
    }
})();
