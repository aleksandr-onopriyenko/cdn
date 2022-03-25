class Carousel {
  constructor(o) {
    const settings = {
      ...{
        containerId: '.slider',
        slideId: '.slider-item',
        interval: 5000,
        isPlaying: true,
        style: 'circle',
        dots: true,
      }, ...o
    }

    this.carousel = document.querySelector(settings.containerId);
    this.sliderContainer = this.carousel.querySelector('.slider-container')
    this.slides = this.carousel.querySelectorAll(settings.slideId);

    this.currentSlide = 0;
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
    this.isStyle = settings.style;
    this.isDots = settings.dots;
  }


  _initProps() {
    this.SLIDES__COUNT = this.slides.length;
    this.CODE_LEFT_ARROW = 'ArrowLeft';
    this.CODE_RIGHT_ARROW = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="fa-solid fa-opacity fa-pause"></i>'
    this.FA_PLAY = '<i class="fa-solid fa-opacity fa-play"></i>'
    this.FA_NEXT = '<i class="fa-solid fa-angle-right"></i>'
    this.FA_PREV = '<i class="fa-solid fa-angle-left"></i>'

    this.timerId = null;
    this.pointer = null;
    this.swipeStartX = null;
    this.swipeEndX = null;
    this.isTarget = false;
  }


  _initControls() {
    const controls = document.createElement('div')
    const PREV = `<button class="btn btn-prev">${this.FA_PREV}</button>`,
      PAUSE = `<button class="btn btn-play">${this.FA_PLAY + this.FA_PAUSE}</button>`,
      NEXT = `<button class="btn btn-next">${this.FA_NEXT}</button>`;

    controls.setAttribute('class', 'slider-controls')
    controls.innerHTML = PREV + PAUSE + NEXT;

    this.carousel.append(controls)

    this.controls = this.carousel.querySelectorAll(".slider-controls .btn");
    this.pauseButton = this.carousel.querySelector(".btn-play");
    this.prevButton = this.carousel.querySelector(".btn-prev");
    this.nextButton = this.carousel.querySelector(".btn-next");

    this.faOpacity = this.carousel.querySelectorAll(".fa-opacity");
    this.faPlay = this.carousel.querySelector(".fa-play");
    this.faPause = this.carousel.querySelector(".fa-pause");
    this._showIcon()
  }

  _initIndicators() {
    this.isDots && this._createIndicators()
  }

  _initListeners() {
    this.pauseButton.addEventListener("click", this.pausePlay.bind(this));
    this.prevButton.addEventListener("click", this.prev.bind(this));
    this.nextButton.addEventListener("click", this.next.bind(this));
    this.isDots && this.indicatorContainer.addEventListener("click", this._indicate.bind(this));
    document.addEventListener('keydown', this._pressKey.bind(this))
    this.slides.forEach((el) => {
      el.addEventListener('mouseenter', this._pause.bind(this))
      el.addEventListener('mouseleave', this._play.bind(this))
    })
  }

  _createIndicators() {
    const indicatorClass = 'slider-pagination__item'
    const indicators = document.createElement('ul')
    indicators.setAttribute('class', 'slider-pagination')
    for (let i = 0; i < this.SLIDES__COUNT; i++) {
      let indicator = document.createElement('li')
      indicator.dataset.slide = i;
      indicators.append(indicator)
    }
    this.carousel.append(indicators)
    this.indicatorContainer = this.carousel.querySelector(".slider-pagination");
    this.indicator = this.indicatorContainer.querySelectorAll('li');
    this.indicator[0].classList.add('active')
    this._createIndicatorsStyle(indicatorClass)
  }

  _createIndicatorsStyle(cls) {
    this.indicator.forEach(el => {
      this.isStyle == 'line' && this.isDots ? el.classList.add(cls, 'line')
        : this.isStyle == 'squad' && this.isDots ? el.classList.add(cls, 'squad')
          : this.isStyle === 'circle' && this.isDots ? el.classList.add(cls, 'circle')
            : el.classList.add(cls);
    })
  }

  _pause() {
    this.isPlaying = false;
    this._showIcon()
    clearInterval(this.timerId);
  }

  _play() {
    this.isPlaying = true;
    this._showIcon()
    this._tik(this.isPlaying)
  }

  _pressKey(e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay()
  }

  _indicate(e) {
    let target = e.target;
    if (target.nodeName === 'LI' && !target.classList.contains("active")) {
      this.goToSlide(+target.dataset.slide)
      this._pause()
      if (this.pointer) {
        this.pointer.classList.remove("active");
      }
      this.pointer = target;
    }
  }

  _tik(flag) {
    if (!flag) return
    this.timerId = setInterval(() => this._goToNext(), this.interval)
  }

  goToSlide(n) {
    if (!this.isDots) this.goToSlideDefault(n)
    this.goToSlideViaId(n)
  }

  goToSlideDefault(n) {
    this.slides[this.currentSlide].classList.remove("active");
    this.currentSlide = (n + this.SLIDES__COUNT) % this.SLIDES__COUNT;
    this.slides[this.currentSlide].classList.add("active");
  }

  goToSlideViaId(n) {
    this.indicator[this.currentSlide].classList.remove('active')
    this.goToSlideDefault(n)
    this.indicator[this.currentSlide].classList.add("active");
  }

  _goToNext() {
    this.goToSlide(this.currentSlide + 1);
  }

  _goToPrev() {
    this.goToSlide(this.currentSlide - 1);
  }

  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  }

  prev() {
    this._pause();
    this._goToPrev();
  }

  next() {
    this._pause();
    this._goToNext();
  }

  _showIcon() {
    this.faOpacity[0].style.opacity = this.isPlaying ? 0 : 1;
    this.faOpacity[1].style.opacity = this.isPlaying ? 1 : 0;
  }

  init() {
    this._initProps()
    this._initIndicators()
    this._initControls()
    this._initListeners()
    this._tik(this.isPlaying)
  }
}

class SwiperCarousel extends Carousel {
  _initListeners() {
    super._initListeners();
    this.carousel.addEventListener('touchstart', this._swipeStart.bind(this))
    this.carousel.addEventListener('touchend', this._swipeEnd.bind(this))
  }

  _swipeStart(e) {
    this.swipeStartX = e.changedTouches[0].pageX;
  }

  _swipeEnd(e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX < -100 && this.prev()
    this.swipeStartX - this.swipeEndX > 100 && this.next()
  }
}