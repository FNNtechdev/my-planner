(function() {
    "use strict";

    /*CONSTANTS & DATA*/
    const PASSWORD = "Do It Today";
    const EXAM_START = new Date("2026-04-13T00:00:00");
    const EXAM_END = new Date("2026-04-24T23:59:59");

    const UNIT_COLORS = {
        "Algebraic Structures": "#00d4ff",
        "Real Analysis 1": "#a855f7",
        "Internet Application Programming": "#22c55e",
        "Ordinary Differential Equations 1": "#f59e0b",
        "Operating Systems 1 & 2": "#ef4444",
        "System Analysis and Design": "#ec4899"
    };

    const TIMETABLE = {
        1: [ // Monday
            { name: "Algebraic Structures", time: "7:00 AM - 10:00 AM" },
            { name: "Real Analysis 1", time: "10:00 AM - 1:00 PM" }
        ],
        2: [ // Tuesday
            { name: "Internet Application Programming", time: "10:00 AM - 1:00 PM" }
        ],
        3: [ // Wednesday
            { name: "Ordinary Differential Equations 1", time: "10:00 AM - 1:00 PM" }
        ],
        5: [ // Friday
            { name: "Operating Systems 1 & 2", time: "7:00 AM - 10:00 AM" },
            { name: "System Analysis and Design", time: "10:00 AM - 1:00 PM" }
        ]
    };

    const TIMETABLE_DAYS = [
        { dayNum: 1, label: "MON" },
        { dayNum: 2, label: "TUE" },
        { dayNum: 3, label: "WED" },
        { dayNum: 4, label: "THU" },
        { dayNum: 5, label: "FRI" }
    ];

    const BOOKS = [
        { title: "The 48 Laws of Power", author: "Robert Greene", start: "2026-01-01", end: "2026-02-28", color: "#ef4444" },
        { title: "Good Vibes, Good Life", author: "Vex King", start: "2026-03-01", end: "2026-03-19", color: "#22c55e" },
        { title: "Grit", author: "Angela Duckworth", start: "2026-03-20", end: "2026-03-31", color: "#f97316" },
        { title: "Focus", author: "Daniel Goleman", start: "2026-04-01", end: "2026-04-30", color: "#3b82f6" }
    ];

    const FRONTEND_START = new Date("2026-01-01");
    const FRONTEND_END = new Date("2026-04-30");

    const QUOTES = [
        { text: "Eat a live frog first thing in the morning, and nothing worse will happen to you the rest of the day.", author: "Mark Twain" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Engineering is not only study of 45 subjects but it is moral studies of intellectual life.", author: "Prakhar Srivastav" },
        { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
        { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
        { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
        { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
        { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
        { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
        { text: "Great things never come from comfort zones.", author: "Unknown" },
        { text: "It always seems impossible until it\u2019s done.", author: "Nelson Mandela" },
        { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
        { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
        { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
        { text: "Don\u2019t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "You don\u2019t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss" },
        { text: "The mind is everything. What you think you become.", author: "Buddha" },
        { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { text: "Do it today or regret it tomorrow.", author: "Unknown" },
        { text: "The best investment you can make is in yourself.", author: "Warren Buffett" },
        { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
        { text: "Hard work beats talent when talent doesn\u2019t work hard.", author: "Tim Notke" },
        { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" }
    ];

    const CONGRATS = [
        "Amazing work, Engineer Faith!",
        "You\u2019re building greatness, one step at a time!",
        "That\u2019s the spirit of a true engineer!",
        "Consistency is your superpower!",
        "Another frog eaten! Keep devouring them!",
        "You\u2019re on fire! Unstoppable!",
        "Excellence in progress!",
        "The world needs more engineers like you!",
        "One step closer to those perfect grades!",
        "That discipline is paying off!"
    ];

    /*DATABASE (IndexedDB)*/
    let db = null;
    const DB_NAME = "FaithCommandCenter";
    const DB_VERSION = 1;

    function openDB() {
        return new Promise(function(resolve, reject) {
            var request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = function(e) {
                var d = e.target.result;
                if (!d.objectStoreNames.contains("dailyLogs")) {
                    d.createObjectStore("dailyLogs", { keyPath: "date" });
                }
                if (!d.objectStoreNames.contains("profile")) {
                    d.createObjectStore("profile", { keyPath: "id" });
                }
            };
            request.onsuccess = function(e) {
                db = e.target.result;
                resolve(db);
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function dbPut(storeName, data) {
        return new Promise(function(resolve, reject) {
            if (!db) { resolve(); return; }
            var tx = db.transaction(storeName, "readwrite");
            var store = tx.objectStore(storeName);
            var req = store.put(data);
            req.onsuccess = function() { resolve(); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function dbGet(storeName, key) {
        return new Promise(function(resolve, reject) {
            if (!db) { resolve(null); return; }
            var tx = db.transaction(storeName, "readonly");
            var store = tx.objectStore(storeName);
            var req = store.get(key);
            req.onsuccess = function() { resolve(req.result || null); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function dbGetAll(storeName) {
        return new Promise(function(resolve, reject) {
            if (!db) { resolve([]); return; }
            var tx = db.transaction(storeName, "readonly");
            var store = tx.objectStore(storeName);
            var req = store.getAll();
            req.onsuccess = function() { resolve(req.result || []); };
            req.onerror = function() { reject(req.error); };
        });
    }

    /*HELPERS*/
    function dateStr(d) {
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, "0");
        var day = String(d.getDate()).padStart(2, "0");
        return y + "-" + m + "-" + day;
    }

    function todayStr() { return dateStr(new Date()); }

    function getTasksForDay(dayOfWeek) {
        var tasks = [];
        var units = TIMETABLE[dayOfWeek];
        if (units) {
            units.forEach(function(u) {
                tasks.push({ key: "review_" + u.name.toLowerCase().replace(/[^a-z0-9]/g, "_"), label: "Review: " + u.name, cat: "review" });
            });
        }
        tasks.push({ key: "book", label: "Read today\u2019s book", cat: "book" });
        tasks.push({ key: "frontend", label: "Frontend Web Development practice", cat: "code" });
        return tasks;
    }

    function isAllDone(log, dayOfWeek) {
        var tasks = getTasksForDay(dayOfWeek);
        return tasks.every(function(t) { return log && log[t.key] === true; });
    }

    function countDone(log, dayOfWeek) {
        var tasks = getTasksForDay(dayOfWeek);
        var count = 0;
        tasks.forEach(function(t) { if (log && log[t.key]) count++; });
        return { done: count, total: tasks.length };
    }

    function getDayOfWeekForDate(dateString) {
        return new Date(dateString + "T12:00:00").getDay();
    }

    /* UI ELEMENTS*/
    var els = {};
    function $(id) { return document.getElementById(id); }

    function initEls() {
        els.loginScreen = $("loginScreen");
        els.app = $("app");
        els.passwordInput = $("passwordInput");
        els.loginBtn = $("loginBtn");
        els.loginError = $("loginError");
        els.profileArea = $("profileArea");
        els.profileDisplay = $("profileDisplay");
        els.profileInput = $("profileInput");
        els.liveClock = $("liveClock");
        els.liveDate = $("liveDate");
        els.logoutBtn = $("logoutBtn");
        els.greetingBar = $("greetingBar");
        els.quoteText = $("quoteText");
        els.quoteAuthor = $("quoteAuthor");
        els.countdownLabel = $("countdownLabel");
        els.countdownDigits = $("countdownDigits");
        els.cDays = $("cDays");
        els.cHours = $("cHours");
        els.cMins = $("cMins");
        els.cSecs = $("cSecs");
        els.scheduleContent = $("scheduleContent");
        els.checklistContent = $("checklistContent");
        els.allDoneBanner = $("allDoneBanner");
        els.currentStreak = $("currentStreak");
        els.bestStreak = $("bestStreak");
        els.totalComplete = $("totalComplete");
        els.timetableContent = $("timetableContent");
        els.booksContent = $("booksContent");
        els.frontendPct = $("frontendPct");
        els.frontendBar = $("frontendBar");
        els.frontendElapsed = $("frontendElapsed");
        els.frontendRemaining = $("frontendRemaining");
        els.calMonth = $("calMonth");
        els.calGrid = $("calGrid");
        els.calPrev = $("calPrev");
        els.calNext = $("calNext");
    }

    /* AUTH*/
    function doLogin() {
        var pw = els.passwordInput.value.trim();
        if (pw === PASSWORD) {
            els.loginScreen.classList.add("hidden");
            els.app.classList.remove("hidden");
            els.loginError.textContent = "";
            initDashboard();
        } else {
            els.loginError.textContent = "Incorrect access code. Try again, Engineer!";
            els.passwordInput.value = "";
            els.passwordInput.focus();
        }
    }

    function doLogout() {
        els.app.classList.add("hidden");
        els.loginScreen.classList.remove("hidden");
        els.passwordInput.value = "";
        els.passwordInput.focus();
    }

    /*CLOCK & COUNTDOWN */
    function updateClock() {
        var now = new Date();
        els.liveClock.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
        els.liveDate.textContent = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    }

    function updateCountdown() {
        var now = new Date();
        if (now >= EXAM_START && now <= EXAM_END) {
            els.countdownDigits.innerHTML = '<div class="countdown-status-msg"><i class="fas fa-bolt"></i> EXAMS IN PROGRESS &mdash; Give it your all!</div>';
            els.countdownLabel.innerHTML = '<i class="fas fa-fire"></i> EXAM MODE ACTIVE';
            return;
        }
        if (now > EXAM_END) {
            els.countdownDigits.innerHTML = '<div class="countdown-status-msg"><i class="fas fa-trophy"></i> EXAMS COMPLETED &mdash; Well done, Engineer!</div>';
            els.countdownLabel.innerHTML = '<i class="fas fa-check-circle"></i> SEMESTER COMPLETE';
            return;
        }
        var diff = EXAM_START - now;
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        els.cDays.textContent = String(d).padStart(2, "0");
        els.cHours.textContent = String(h).padStart(2, "0");
        els.cMins.textContent = String(m).padStart(2, "0");
        els.cSecs.textContent = String(s).padStart(2, "0");
    }

    /*GREETING */
    function updateGreeting() {
        var h = new Date().getHours();
        var g;
        if (h >= 5 && h < 12) g = "Good Morning, Engineer Faith! &#9728;&#65039; Rise and build!";
        else if (h >= 12 && h < 17) g = "Good Afternoon, Engineer Faith! &#127774; Keep the momentum going!";
        else if (h >= 17 && h < 21) g = "Good Evening, Engineer Faith! &#127751; Finish strong today!";
        else g = "Burning the midnight oil, Engineer Faith! &#127769; Rest is important too!";
        els.greetingBar.innerHTML = g;
    }

    /* QUOTE*/
    function updateQuote() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var dayOfYear = Math.floor(diff / 86400000);
        var q = QUOTES[dayOfYear % QUOTES.length];
        els.quoteText.innerHTML = "&ldquo;" + q.text + "&rdquo;";
        els.quoteAuthor.textContent = "\u2014 " + q.author;
    }

    /*TODAY'S SCHEDULE */
    function renderSchedule() {
        var day = new Date().getDay();
        var units = TIMETABLE[day];
        if (!units || units.length === 0) {
            els.scheduleContent.innerHTML = '<div class="no-class-msg"><i class="fas fa-coffee"></i> No classes today. Rest or catch up on reviews!</div>';
            return;
        }
        var html = "";
        units.forEach(function(u) {
            var c = UNIT_COLORS[u.name] || "#00d4ff";
            html += '<div class="schedule-item" style="border-left-color:' + c + '">';
            html += '<span class="schedule-time">' + u.time + '</span>';
            html += '<span class="schedule-name" style="color:' + c + '">' + u.name + '</span>';
            html += '</div>';
        });
        els.scheduleContent.innerHTML = html;
    }

    /* DAILY CHECKLIST */
    var todayLog = {};

    async function loadTodayLog() {
        var ds = todayStr();
        var log = await dbGet("dailyLogs", ds);
        todayLog = log || { date: ds };
        renderChecklist();
    }

    function renderChecklist() {
        var day = new Date().getDay();
        var tasks = getTasksForDay(day);
        var html = "";
        tasks.forEach(function(t) {
            var done = todayLog[t.key] === true;
            var catClass = "cat-" + t.cat;
            var catLabel = t.cat === "review" ? "REVIEW" : (t.cat === "book" ? "BOOK" : "CODE");
            html += '<div class="task-item' + (done ? " done" : "") + '" data-key="' + t.key + '">';
            html += '<div class="task-checkbox">' + (done ? '<i class="fas fa-check"></i>' : '') + '</div>';
            html += '<span class="task-label">' + t.label + '</span>';
            html += '<span class="task-cat ' + catClass + '">' + catLabel + '</span>';
            html += '</div>';
        });
        els.checklistContent.innerHTML = html;

        // Bind click events
        var items = els.checklistContent.querySelectorAll(".task-item");
        items.forEach(function(item) {
            item.addEventListener("click", function() {
                toggleTask(item.getAttribute("data-key"));
            });
        });

        // Check if all done
        var allDone = tasks.every(function(t) { return todayLog[t.key] === true; });
        if (allDone && tasks.length > 0) {
            els.allDoneBanner.innerHTML = '<div class="all-done-banner"><div class="emoji">&#127881;&#127942;&#127881;</div><p>PERFECT DAY! All frogs eaten, Engineer Faith!</p></div>';
        } else {
            els.allDoneBanner.innerHTML = "";
        }
    }

    async function toggleTask(key) {
        var wasDone = todayLog[key] === true;
        todayLog[key] = !wasDone;
        todayLog.date = todayStr();
        await dbPut("dailyLogs", todayLog);
        renderChecklist();

        if (!wasDone) {
            var msg = CONGRATS[Math.floor(Math.random() * CONGRATS.length)];
            showToast(msg, "success");

            // Check if all tasks now done
            var day = new Date().getDay();
            var tasks = getTasksForDay(day);
            var allDone = tasks.every(function(t) { return todayLog[t.key] === true; });
            if (allDone) {
                launchConfetti();
                setTimeout(function() {
                    showToast("ALL FROGS DEVOURED! Perfect day!", "fire");
                }, 600);
            }
        }

        updateStreaks();
        renderCalendar();
    }

    /*STREAKS */
    async function updateStreaks() {
        var allLogs = await dbGetAll("dailyLogs");
        var logMap = {};
        allLogs.forEach(function(l) { logMap[l.date] = l; });

        var today = new Date();
        var currentStreak = 0;
        var bestStreak = 0;
        var totalComplete = 0;
        var tempStreak = 0;

        // Go back 200 days to calculate
        for (var i = 0; i < 200; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var ds = dateStr(d);
            var dayOfWeek = d.getDay();
            var log = logMap[ds];
            var complete = isAllDone(log, dayOfWeek);

            if (i === 0 && !complete) {
                // Today not done yet, don't count for current streak start
                // But check from yesterday
                continue;
            }

            if (complete) {
                tempStreak++;
                totalComplete++;
            } else if (i > 0) {
                break;
            }
        }
        currentStreak = tempStreak;

        // Calculate best streak
        tempStreak = 0;
        for (var j = 0; j < 200; j++) {
            var d2 = new Date(today);
            d2.setDate(d2.getDate() - j);
            var ds2 = dateStr(d2);
            var dow2 = d2.getDay();
            var log2 = logMap[ds2];
            if (isAllDone(log2, dow2)) {
                tempStreak++;
                if (tempStreak > bestStreak) bestStreak = tempStreak;
            } else {
                tempStreak = 0;
            }
        }

        // Count total complete
        totalComplete = 0;
        allLogs.forEach(function(l) {
            var dow = getDayOfWeekForDate(l.date);
            if (isAllDone(l, dow)) totalComplete++;
        });

        els.currentStreak.textContent = currentStreak;
        els.bestStreak.textContent = bestStreak;
        els.totalComplete.textContent = totalComplete;
    }

    /* TIMETABLE */
    function renderTimetable() {
        var todayDow = new Date().getDay();
        var isMobile = window.innerWidth <= 768;

        if (isMobile) {
            var html = "";
            TIMETABLE_DAYS.forEach(function(td) {
                var isToday = td.dayNum === todayDow;
                var units = TIMETABLE[td.dayNum];
                html += '<div class="tt-day-col">';
                html += '<div class="tt-day-header' + (isToday ? " today-col" : "") + '">' + td.label + (isToday ? " &#128204;" : "") + '</div>';
                html += '<div class="tt-day-cells">';
                if (units && units.length > 0) {
                    units.forEach(function(u) {
                        var c = UNIT_COLORS[u.name] || "#00d4ff";
                        html += '<div class="tt-cell" style="border-left-color:' + c + '">';
                        html += '<div class="tt-cell-name" style="color:' + c + '">' + u.name + '</div>';
                        html += '<div class="tt-cell-time">' + u.time + '</div>';
                        html += '</div>';
                    });
                } else {
                    html += '<div class="tt-empty">Free day</div>';
                }
                html += '</div></div>';
            });
            els.timetableContent.innerHTML = html;
        } else {
            var htmlD = '<div class="timetable-grid">';
            // Headers
            TIMETABLE_DAYS.forEach(function(td) {
                var isToday = td.dayNum === todayDow;
                htmlD += '<div class="tt-day-header' + (isToday ? " today-col" : "") + '">' + td.label + (isToday ? " &#128204;" : "") + '</div>';
            });
            // Slot 1: 7-10 AM
            TIMETABLE_DAYS.forEach(function(td) {
                var units = TIMETABLE[td.dayNum];
                var earlyUnit = units ? units.find(function(u) { return u.time.startsWith("7"); }) : null;
                if (earlyUnit) {
                    var c = UNIT_COLORS[earlyUnit.name] || "#00d4ff";
                    htmlD += '<div class="tt-cell" style="border-left-color:' + c + '">';
                    htmlD += '<div class="tt-cell-name" style="color:' + c + '">' + earlyUnit.name + '</div>';
                    htmlD += '<div class="tt-cell-time">' + earlyUnit.time + '</div></div>';
                } else {
                    htmlD += '<div class="tt-empty">&mdash;</div>';
                }
            });
            // Slot 2: 10-1 PM
            TIMETABLE_DAYS.forEach(function(td) {
                var units = TIMETABLE[td.dayNum];
                var lateUnit = units ? units.find(function(u) { return u.time.startsWith("10"); }) : null;
                if (lateUnit) {
                    var c = UNIT_COLORS[lateUnit.name] || "#00d4ff";
                    htmlD += '<div class="tt-cell" style="border-left-color:' + c + '">';
                    htmlD += '<div class="tt-cell-name" style="color:' + c + '">' + lateUnit.name + '</div>';
                    htmlD += '<div class="tt-cell-time">' + lateUnit.time + '</div></div>';
                } else {
                    htmlD += '<div class="tt-empty">&mdash;</div>';
                }
            });
            htmlD += '</div>';
            els.timetableContent.innerHTML = htmlD;
        }
    }

    /*BOOKS */
    function renderBooks() {
        var now = new Date();
        var html = "";
        BOOKS.forEach(function(b) {
            var start = new Date(b.start + "T00:00:00");
            var end = new Date(b.end + "T23:59:59");
            var status, statusClass, pct;

            if (now < start) {
                status = "UPCOMING";
                statusClass = "status-upcoming";
                pct = 0;
            } else if (now > end) {
                status = "COMPLETED";
                statusClass = "status-completed";
                pct = 100;
            } else {
                status = "IN PROGRESS";
                statusClass = "status-progress";
                var total = end - start;
                var elapsed = now - start;
                pct = Math.min(100, Math.round((elapsed / total) * 100));
            }

            var startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            var endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            html += '<div class="book-card">';
            html += '<span class="book-status ' + statusClass + '">' + status + '</span>';
            html += '<div class="book-title" style="color:' + b.color + '">' + b.title + '</div>';
            html += '<div class="book-author">by ' + b.author + '</div>';
            html += '<div class="book-dates">' + startLabel + ' \u2013 ' + endLabel + '</div>';
            html += '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%;background:' + b.color + '"></div></div>';
            html += '<div class="progress-pct" style="color:' + b.color + '">' + pct + '%</div>';
            html += '</div>';
        });
        els.booksContent.innerHTML = html;
    }

    /* FRONTEND PROGRESS */
    function renderFrontend() {
        var now = new Date();
        var total = FRONTEND_END - FRONTEND_START;
        var elapsed = Math.max(0, now - FRONTEND_START);
        var pct = Math.min(100, Math.round((elapsed / total) * 100));
        var daysElapsed = Math.floor(elapsed / 86400000);
        var daysRemaining = Math.max(0, Math.ceil((FRONTEND_END - now) / 86400000));

        els.frontendPct.textContent = pct + "%";
        els.frontendBar.style.width = pct + "%";
        els.frontendElapsed.textContent = daysElapsed + " days in";
        els.frontendRemaining.textContent = daysRemaining + " days left";
    }

    /*CALENDAR / ACTIVITY HISTORY */
    var calYear, calMonth;

    function initCalendar() {
        var now = new Date();
        calYear = now.getFullYear();
        calMonth = now.getMonth();
        renderCalendar();
    }

    async function renderCalendar() {
        var allLogs = await dbGetAll("dailyLogs");
        var logMap = {};
        allLogs.forEach(function(l) { logMap[l.date] = l; });

        var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        els.calMonth.textContent = monthNames[calMonth] + " " + calYear;

        var firstDay = new Date(calYear, calMonth, 1).getDay();
        // Adjust: make Monday = 0
        var startOffset = (firstDay + 6) % 7;
        var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        var today = new Date();
        var todayDs = todayStr();

        var html = "";
        var dayLabels = ["MO","TU","WE","TH","FR","SA","SU"];
        dayLabels.forEach(function(l) {
            html += '<div class="cal-day-label">' + l + '</div>';
        });

        // Empty cells before first day
        for (var e = 0; e < startOffset; e++) {
            html += '<div class="cal-cell empty"></div>';
        }

        for (var d = 1; d <= daysInMonth; d++) {
            var ds = calYear + "-" + String(calMonth + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
            var cellDate = new Date(calYear, calMonth, d);
            var dow = cellDate.getDay();
            var log = logMap[ds];
            var cls = "cal-cell";

            if (ds === todayDs) {
                cls += " today";
            }

            if (cellDate > today) {
                cls += " future";
            } else {
                var info = countDone(log, dow);
                if (info.done === info.total && info.total > 0) {
                    cls += " all-done";
                } else if (info.done > 0) {
                    cls += " some-done";
                } else {
                    cls += " none-done";
                }
            }

            html += '<div class="' + cls + '">' + d + '</div>';
        }

        els.calGrid.innerHTML = html;
    }

    /*PROFILE PICTURE */
    async function loadProfile() {
        var data = await dbGet("profile", "profilePic");
        if (data && data.imageData) {
            showProfileImage(data.imageData);
        }
    }

    function showProfileImage(src) {
        els.profileDisplay.outerHTML = '<img class="profile-pic" id="profileDisplay" src="' + src + '" alt="Faith">';
        els.profileDisplay = $("profileDisplay");
    }

    function handleProfileUpload(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = async function(ev) {
            var src = ev.target.result;
            showProfileImage(src);
            await dbPut("profile", { id: "profilePic", imageData: src });
            showToast("Profile picture updated!", "info");
        };
        reader.readAsDataURL(file);
    }

    /*TOAST & CONFETTI */
    function showToast(message, type) {
        type = type || "success";
        var container = $("toastContainer");
        var toast = document.createElement("div");
        toast.className = "toast toast-" + type;
        var icon = type === "success" ? "check-circle" : (type === "fire" ? "fire" : "info-circle");
        toast.innerHTML = '<i class="fas fa-' + icon + '"></i> ' + message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.classList.add("toast-exit");
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

    function launchConfetti() {
        var container = $("confettiContainer");
        var colors = ["#00d4ff","#ff6b35","#a855f7","#22c55e","#ec4899","#f59e0b","#ef4444","#3b82f6"];
        for (var i = 0; i < 70; i++) {
            var piece = document.createElement("div");
            piece.className = "confetti-piece";
            piece.style.left = Math.random() * 100 + "%";
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = (Math.random() * 0.8) + "s";
            piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + "s";
            piece.style.width = (Math.random() * 8 + 5) + "px";
            piece.style.height = (Math.random() * 12 + 6) + "px";
            piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
            container.appendChild(piece);
        }
        setTimeout(function() { container.innerHTML = ""; }, 3500);
    }

    /*INITIALIZE */
    async function initDashboard() {
        updateClock();
        updateCountdown();
        updateGreeting();
        updateQuote();
        renderSchedule();
        await loadTodayLog();
        await updateStreaks();
        renderTimetable();
        renderBooks();
        renderFrontend();
        initCalendar();
        await loadProfile();

        // Start intervals
        setInterval(updateClock, 1000);
        setInterval(updateCountdown, 1000);

        // Check for date change every 30s
        var lastDate = todayStr();
        setInterval(async function() {
            if (todayStr() !== lastDate) {
                lastDate = todayStr();
                todayLog = {};
                renderSchedule();
                await loadTodayLog();
                updateGreeting();
                updateQuote();
                renderBooks();
                renderFrontend();
                renderCalendar();
            }
        }, 30000);
    }

    /* EVENT LISTENERS & BOOT */
    document.addEventListener("DOMContentLoaded", async function() {
        initEls();

        // Auth
        els.loginBtn.addEventListener("click", doLogin);
        els.passwordInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") doLogin();
        });
        els.logoutBtn.addEventListener("click", doLogout);

        // Profile
        els.profileArea.addEventListener("click", function() {
            els.profileInput.click();
        });
        els.profileInput.addEventListener("change", handleProfileUpload);

        // Calendar nav
        els.calPrev.addEventListener("click", function() {
            calMonth--;
            if (calMonth < 0) { calMonth = 11; calYear--; }
            renderCalendar();
        });
        els.calNext.addEventListener("click", function() {
            calMonth++;
            if (calMonth > 11) { calMonth = 0; calYear++; }
            renderCalendar();
        });

        // Resize handler for timetable
        window.addEventListener("resize", function() {
            if (!els.app.classList.contains("hidden")) {
                renderTimetable();
            }
        });

        // Open DB
        try {
            await openDB();
        } catch (err) {
            console.log("IndexedDB not available: " + String(err));
        }

        // Focus password
        els.passwordInput.focus();
    });

})();
