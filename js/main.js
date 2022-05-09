const slideDown = [{
        transform: 'rotateX(0deg)',
        visibility: 'visible',
        backgroundColor: 'hsl(237, 21 % , 22 % )'
    },
    {
        transform: 'rotateX(-90deg)',
        visibility: 'hidden',
        backgroundColor: 'hsl(237, 21 % , 8 % )'
    },
]

const slideUp = [{
        transform: 'rotateX(90deg)',
        visibility: 'visible'
    },
    {
        transform: 'rotateX(0deg)'
    }

]

const timingDown = {
    duration: 400,
    fill: 'forwards',
    timing: 'easy-out'
}

const timingUp = {
    duration: 250,
    fill: 'forwards',
}

formatData = (data) => data < 10 ? `0${data}` : data

function elmWithClass(elm, cls) {
    let e = document.createElement(elm);
    cls.forEach(c => e.classList.add(c));
    return e
}

let field = {
    init: function (name, data = 0) {
        this.name = name;
        this.data = data;
        this.createNextTile = this.createNextTile.bind(this);
        this.changeNext = this.changeNext.bind(this);
    },
    initRender: function () {
        const cont = document.querySelector('#countdown');
        let fieldDiv = elmWithClass('div', ['field', `field__${this.label}`, 'field__tile__current']);
        let fieldBox = elmWithClass('div', ['field__box']);
        let tileUp = elmWithClass('div', ['tile', 'tile__up']);
        let tileDown = elmWithClass('div', ['tile', 'tile__down']);
        let labelDiv = elmWithClass('div', ['field__label']);
        let fieldName = elmWithClass('div', ['field__name']);
        fieldName.innerText = this.name
        console.log(this.name)
        labelDiv.innerText = formatData(this.data);

        tileUp.appendChild(labelDiv.cloneNode(true));
        tileDown.appendChild(labelDiv.cloneNode(true));

        fieldDiv.appendChild(tileUp);
        fieldDiv.appendChild(tileDown);

        fieldBox.appendChild(fieldDiv);

        this.box = fieldBox;

        cont.appendChild(fieldBox);
        fieldBox.appendChild(fieldDiv);
        fieldBox.appendChild(this.createNextTile());
        fieldBox.appendChild(fieldName);

    },
    createNextTile: function () {
        let fieldDiv = elmWithClass('div', ['field', `field__${this.name}`, 'field__tile__next']);
        let tileUp = elmWithClass('div', ['tile', 'tile__up']);
        let tileDown = elmWithClass('div', ['tile', 'tile__down']);
        let labelDiv = elmWithClass('div', ['field__label']);
        let data = "" + formatData(this.data);
        data.split('').forEach(d => {
            let e = elmWithClass('span', ['field__label__digit']);
            e.innerText = d;
            labelDiv.appendChild(e);
        })

        tileUp.appendChild(labelDiv.cloneNode(true));
        tileDown.appendChild(labelDiv.cloneNode(true));

        fieldDiv.appendChild(tileUp);
        fieldDiv.appendChild(tileDown);

        return fieldDiv

    },
    changeNext_1: function (event) {
        let b = this.box.querySelector('.field__tile__next .tile__down').animate(slideUp, timingUp);
        // console.log(event);
        this.box.querySelector('.field__tile__current').setAttribute('style', 'z-index: -1');
        b.addEventListener('finish', this.changeNext.bind(this))
    },
    changeNext: function () {
        let elm = this.box.querySelector('.field__tile__current');
        // elm.getEventListeners();
        elm.parentNode.removeChild(elm);
        let nextElm = this.box.querySelector('.field__tile__next');
        nextElm.classList.replace('field__tile__next', 'field__tile__current');
        let nextTile = this.createNextTile();
        this.box.appendChild(nextTile);
    },
    update: function (data) {
        if (this.data !== data) {
            this.data = data;
            let a = this.box.querySelector('.field__tile__current .tile__up').animate(slideDown, timingDown);
            a.addEventListener('finish', this.changeNext_1.bind(this))
            a.commitStyles('transform: rotateX(-90deg)');
        }
    }
}

let countDown = {
    init: function () {
        let now = new Date();
        let targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 9);
        console.log('now', targetDate - now)

        this.targetDate = targetDate;
        this.parseDateDiff();
    },
    initRender: function () {
        const cont = document.querySelector('#countdown');
        Object.keys(this.fields).forEach(key => {
            this.fields[key] = Object.create(field);
            field.name = key;
            field.data = this.date[key];
            this.fields[key].initRender();
        })
    },
    parseDateDiff: function () {
        let targetDate = this.targetDate;
        let diff = targetDate - new Date();
        //difference between now and target date in seconds
        diff = Math.trunc(diff / 1000);
        this.date.days = Math.floor(diff / (60 * 60 * 24));
        diff -= 60 * 60 * 24 * this.date.days
        this.date.hours = Math.floor(diff / (60 * 60));
        diff -= 60 * 60 * this.date.hours;
        this.date.minutes = Math.floor(diff / 60);
        diff -= 60 * this.date.minutes;
        this.date.seconds = diff;

    },
    update: function () {
        this.parseDateDiff();
        Object.keys(this.fields).forEach(key => {
            this.fields[key].update(this.date[key]);
        })
    },
    fields: {
        'days': null,
        'hours': null,
        'minutes': null,
        'seconds': null
    },
    date: {
        'days': null,
        'hours': null,
        'minutes': null,
        'seconds': null
    },
}

countDown.init();
countDown.initRender();
// setTimeout(() => countDown.update(), 2000)
setInterval(() => countDown.update(), 1000)