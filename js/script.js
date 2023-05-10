document.addEventListener('DOMContentLoaded', function () {
  function isSafari() {
    return (
      ~navigator.userAgent.indexOf('Safari') &&
      navigator.userAgent.indexOf('Chrome') < 0
    );
  }

  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    document.querySelector('body').classList.add('v-mobile');
    document.querySelector('html').classList.add('v-mobile');
  } else {
    document.querySelector('body').classList.add('v-desktop');
    document.querySelector('html').classList.add('v-desktop');
  }

  function stopAnimation(idAnimation) {
    cancelAnimationFrame(idAnimation);
  }

  function lerp(current, target, ease, approximationLeft = 0.001) {
    const val = current * (1 - ease) + target * ease;
    const diff = Math.abs(target - val);
    if (diff <= approximationLeft) {
      return target;
    }
    return val;
  }

  //normal vh
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    if (vh === window.innerHeight * 0.01 || document.body.clientWidth < 900) {
      return;
    }

    vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  });

  //header height
  const headerHeight = document.querySelector('.header');
  document.body.style.setProperty(
    '--header',
    `${headerHeight ? headerHeight.getBoundingClientRect().height : 100}px`
  );

  //blog-section items count
  // const blogItems = document.querySelectorAll('.blog-section-list__item');
  // document.body.style.setProperty(
  //   '--blog-items-count',
  //   `${document.body.clientWidth > 900 ? blogItems.length + 1 : 0}`
  // );

  // menu global open
  const doWhenMenuOpen = () => {
    document.querySelector('.cd-panel__header').classList.add('_opened');
    document.querySelector('.menu').classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  document
    .querySelector('.menu__burger')
    .addEventListener('click', function (e) {
      e.preventDefault();
      this.classList.add('_opened');
      document.querySelector('.btn-menu-fixed').classList.add('_hide');
      doWhenMenuOpen();
    });

  document
    .querySelector('.btn-menu-fixed')
    .addEventListener('click', function (e) {
      e.preventDefault();
      this.classList.add('_hide');
      document.querySelector('.menu__burger').classList.add('_opened');
      doWhenMenuOpen();
    });

  // menu global close
  const closeAll = (arr) => {
    if (arr.length !== 0) {
      Array.from(arr).forEach((item) => {
        item.classList.remove('_opened');
      });
    }
  };

  const doWhenMenuClose = () => {
    document.querySelector('.cd-panel__header').classList.remove('_opened');
    document.querySelector('.menu__burger').classList.remove('_opened');
    document.querySelector('.menu').classList.remove('_opened');
    document.querySelector('.btn-menu-fixed').classList.remove('_hide');
    document.querySelector('.slimmenu-submenu').classList.remove('_lock');
    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');

    document.querySelector('.custom-select').classList.remove('_opened');

    const arrLevel1 = document.querySelectorAll('.level1');
    const arrLevel2 = document.querySelectorAll('.level2');
    closeAll(arrLevel1);
    closeAll(arrLevel2);
  };

  document
    .querySelector('.cd-panel__close')
    .addEventListener('click', function (e) {
      e.preventDefault();
      doWhenMenuClose();
    });

  //menu level 2,3 open/close
  const sbmenusLevel = document.querySelectorAll(
    '.has-submenu, .custom-select'
  );
  Array.from(sbmenusLevel).forEach((submenu) => {
    const submenuOpen =
      submenu.classList[0] === 'custom-select'
        ? submenu.querySelector('.custom-select__additional')
        : submenu.querySelector('.has-submenu__additional');

    const submenuClose =
      submenu.classList[0] === 'custom-select'
        ? submenu.querySelector('.custom-options__back')
        : submenu.querySelector('.sub-toggle-back');

    submenuOpen.addEventListener('click', function (e) {
      e.preventDefault();
      submenu.classList.add('_opened');
      let parent;

      if (Array.from(submenu.classList).includes('level2')) {
        //console.log(1);
        parent = submenu.parentElement;
      } else {
        parent = submenu.parentElement.parentElement;
      }

      //console.log(parent.scrollTop);

      parent.scrollTop = 0;
      setTimeout(() => {
        parent.classList.add('_lock');
      }, 300);
      // parent.scrollTo({
      //   top: 0,
      //   behavior: 'smooth',
      // });
    });

    submenuClose.addEventListener('click', function (e) {
      e.preventDefault();
      submenu.classList.remove('_opened');

      if (Array.from(submenu.classList).includes('level2')) {
        parent = submenu.parentElement;
      } else {
        parent = submenu.parentElement.parentElement;
      }

      parent.classList.remove('_lock');
    });
  });

  //menu open level 3 in the desktops
  // const submenuAdditionalDesk = document.querySelectorAll(
  //   '.has-submenu__additional__desk'
  // );

  // if (submenuAdditionalDesk.length !== 0) {
  //   Array.from(submenuAdditionalDesk).forEach((item) => {
  //     item.addEventListener('click', function (e) {
  //       if (document.body.clientWidth <= 1199) {
  //         return;
  //       }

  //       e.preventDefault();
  //       this.parentElement.classList.add('_opened');
  //       //$('.menu').addClass('_lock')
  //     });
  //   });
  // }

  //menu anchors
  const anchors = document.querySelectorAll('header ._anchor');
  if (anchors.length !== 0) {
    Array.from(anchors).forEach((anchor) => {
      anchor.addEventListener('click', (evt) => {
        evt.preventDefault();

        const sectionClass = evt.target.dataset.anchor;
        const section = document.querySelector(sectionClass);

        if (!section) {
          return null;
        }
        const paddingTop = parseInt(
          (section.currentStyle || window.getComputedStyle(section)).paddingTop
        );

        window.scrollTo({
          top: section.offsetTop + paddingTop / 2,
          behavior: 'smooth',
        });
      });
    });
  }

  //separate section
  const separateArr = document.querySelectorAll('[data-separate-section]');

  //animation of appearing
  const makeTimelineSeparate = (item) => {
    if (!item) {
      return;
    }

    const timeline = gsap.timeline({
      defaults: { duration: 0.03, ease: 'power4.inOut' },
    });
    //timeline.set(item, { display: 'none' });
    timeline
      //.from(item, { display: 'none', opacity: '0', duration: 2 })
      //.to(item, { display: 'block' })
      //.from(item, { opacity: 0, duration: 2 }, '<')
      .to(item, { opacity: 1 });

    return timeline;
  };

  //add timelines to blocks
  const addAnimationsToSeparate = (blocks, timelinesSeparate) => {
    blocks.forEach((block) => {
      const data = block.dataset.separate;
      timelinesSeparate[data] = makeTimelineSeparate(block);
      timelinesSeparate[data].pause();

      if (block.classList.contains('_active')) {
        timelinesSeparate[data].play();
        console.log(data);
      }
    });
  };

  //event onclick handler for buttons in Separate
  const separateEventHandler = (button, buttons, blocks, timelinesSeparate) => {
    if (button.classList.contains('_active')) {
      return;
    }

    const blockData = button.dataset.open;
    let block;

    buttons.forEach((item) => {
      item.classList.remove('_active');
    });

    blocks.forEach((item) => {
      if (item.classList.contains('_active')) {
        item.classList.remove('_active');
        const dataPrevActive = item.dataset.separate;
        //console.log(dataPrevActive);
        //timelinesSeparate[dataPrevActive].reverse();
        gsap.to(item, { opacity: 0, duration: 0.3 });
      }

      if (item.dataset.separate === blockData) {
        block = item;
      }
    });

    button.classList.add('_active');
    block.classList.add('_active');
    gsap.to(block, { opacity: 1, duration: 0.15 });

    //timelinesSeparate[blockData].play();
  };

  //add actions to all separate buttons
  const addEventSeparate = (section) => {
    if (!section) {
      return;
    }
    const timelinesSeparate = {};

    const buttons = section.querySelectorAll(
      '.separate-header__item[data-open]'
    );
    const blocks = section.querySelectorAll(
      '.separate-main__block[data-separate]'
    );

    if (!buttons || !blocks) {
      return;
    }

    //addAnimationsToSeparate(blocks, timelinesSeparate);
    //console.log(buttons, blocks);
    buttons.forEach((button, index, arr) => {
      button.addEventListener('click', () => {
        separateEventHandler(button, arr, blocks, timelinesSeparate);
      });
    });
  };

  if (separateArr.length !== 0) {
    Array.from(separateArr).forEach((item, index) => {
      addEventSeparate(item);
    });
  }

  function lerp(current, target, ease, approximationLeft = 0.001) {
    const val = current * (1 - ease) + target * ease;
    const diff = Math.abs(target - val);
    if (diff <= approximationLeft) {
      return target;
    }
    return val;
  }

  //FAQ
  const faqBtns = document.querySelectorAll('.faq-list__summary');
  const faqDetails = document.querySelectorAll('.faq-list__details');
  const animations = [];

  const makeTimeline = (item) => {
    const timelineFaq = gsap.timeline({
      defaults: { duration: 0.6, ease: 'power4.inOut' },
    });
    timelineFaq.to(item, { height: 'auto' }).to(item, { opacity: 1 }, '<0.3');

    return timelineFaq;
  };

  if (faqDetails.length !== 0) {
    Array.from(faqDetails).forEach((item) => {
      const itemAnimation = makeTimeline(item);
      itemAnimation.pause();
      animations.push(itemAnimation);
    });
  }

  if (faqBtns.length !== 0) {
    faqBtns.forEach((item, index) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        const parent = item.parentElement.parentElement;
        if (!parent) {
          return;
        }

        if (parent.classList.contains('_active')) {
          animations[index].reverse();
        } else {
          animations[index].play();
        }
        parent.classList.toggle('_active');
      });
    });
  }

  //additional footer accordion
  const accordionBtns = document.querySelectorAll('.footer-accordion__summary');
  const accordionDetails = document.querySelectorAll(
    '.footer-accordion__details'
  );
  const accordionAnimations = [];
  const accordionButtonListeners = [];

  const initAccordionAnimations = () => {
    if (accordionDetails.length === 0) {
      return;
    }
    accordionDetails.forEach((item) => {
      const itemAnimation = makeTimeline(item);
      itemAnimation.pause();
      accordionAnimations.push(itemAnimation);
    });
  };

  const accordionButtonHandler = (evt) => {
    evt.preventDefault();
    //console.log('listener!', evt.target);
    const parent = evt.target.parentElement.parentElement.parentElement;
    if (!parent) {
      return;
    }

    const index = parent.dataset.index;
    //console.log(index);

    if (parent.classList.contains('_active')) {
      accordionAnimations[index].reverse();
    } else {
      accordionAnimations[index].play();
    }
    parent.classList.toggle('_active');
  };

  const initAccordionButtonListeners = () => {
    if (accordionBtns.length === 0) {
      return;
    }

    accordionBtns.forEach((item) => {
      item.addEventListener('click', accordionButtonHandler);
    });
  };

  const resetAccordionAnimations = () => {
    if (accordionBtns.length === 0 && accordionDetails.length === 0) {
      return;
    }

    accordionDetails.forEach((item) => {
      item.style = '';
    });

    accordionBtns.forEach((item, index) => {
      const parent = item.parentElement.parentElement.parentElement;
      if (!parent) {
        return;
      }
      //console.log(accordionAnimations);
      accordionAnimations[index].kill();
      //console.log(accordionButtonListeners);
      item.removeEventListener('click', accordionButtonHandler);

      parent.classList.remove('_active');
    });

    accordionAnimations.splice(0, accordionAnimations.length);
  };

  const footerAccordionBreakpoint = '(max-width: 899px)';
  const footerAccrdionBreakpointList = window.matchMedia(
    footerAccordionBreakpoint
  );

  if (document.body.clientWidth < 900) {
    initAccordionAnimations();
    initAccordionButtonListeners();
  }

  footerAccrdionBreakpointList.addEventListener('change', (evt) => {
    if (evt.matches) {
      initAccordionAnimations();
      initAccordionButtonListeners();
    } else {
      resetAccordionAnimations();
    }
  });

  //popup
  const makeTimelinePopup = (item) => {
    const popupInner = item.querySelector('.popup__scroll');
    if (!popupInner) {
      return;
    }

    const timelinePopup = gsap.timeline({
      defaults: { duration: 0.3, ease: 'power4.inOut' },
    });
    timelinePopup
      .from(item, { display: 'none' })
      .to(item, { display: 'flex', duration: 0.01 })
      .from(item, { opacity: 0 })
      .to(item, { opacity: 1 });

    return timelinePopup;
  };

  const popupAnimations = {};
  const popups = document.querySelectorAll('.popup');

  if (popups.length !== 0) {
    popups.forEach((popup) => {
      const timeline = makeTimelinePopup(popup);
      timeline.pause();
      popupAnimations[popup.dataset.popupname] = timeline;
    });
  }

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);

    //console.log(popupAnimations, popupClass, evt.target);
    popupAnimations[popupClass].play();

    popup.classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  if (popupOpenBtns.length !== 0) {
    popupOpenBtns.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        openPopup(evt);
      });
    });
  }

  //close popup
  const popupCloseBtns = document.querySelectorAll('.popup__close');
  const popupArr = document.querySelectorAll('.popup');

  const closePopup = (popup) => {
    if (!popup.classList.contains('_opened')) {
      return;
    }

    popup.classList.remove('_opened');
    const popupClass = popup.dataset.popupname;
    //console.dir(popup.dataset.popupname);
    popupAnimations[popupClass].reverse();

    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');
  };

  if (popupCloseBtns) {
    Array.from(popupCloseBtns).forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup = this.parentElement.parentElement.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr) {
    Array.from(popupArr).forEach((popup) => {
      const wrapper = popup.querySelector('.popup__wrapper');
      if (!wrapper) {
        return;
      }

      const listener = (event) => {
        if (!wrapper.contains(event.target) && event.which === 1) {
          closePopup(popup);
        }
      };

      document.addEventListener('mousedown', listener);
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        const popup = document.querySelector('.popup._opened');
        if (popup) {
          closePopup(popup);
        }
      }
    });
  }

  //price carKey animation
  const priceSection = document.querySelector('.price');
  const progressPrice = {
    currentX: 0,
    targetX: 0,
    currentY: 0,
    targetY: 0,
  };
  let priceImg;
  let idAnimationPrice = null;

  const priceImgMove = (targetX, targetY) => {
    if (!priceImg || !priceSection) {
      return;
    }
    if (isMobile.any()) {
      priceImg.style.transform = '';
      return;
    }
    const imgWidth = priceImg.getBoundingClientRect().width;
    const imgHeight = priceImg.getBoundingClientRect().height;

    progressPrice.targetX = targetX;
    progressPrice.targetY = targetY;

    progressPrice.currentX = lerp(
      progressPrice.currentX,
      progressPrice.targetX,
      0.15,
      0.01
    );

    progressPrice.currentY = lerp(
      progressPrice.currentY,
      progressPrice.targetY,
      0.15,
      0.01
    );

    priceImg.style.transform = `translate3d(${-progressPrice.currentX * 10}%, ${
      -progressPrice.currentY * 10
    }%, 0)`;

    if (
      priceImg.currentX === priceImg.targetX &&
      priceImg.currentY === priceImg.targetY
    ) {
      stopAnimation(idAnimationPrice);
    } else {
      priceImgMove(progressPrice.targetX, progressPrice.targetY);
    }
  };

  if (priceSection) {
    priceImg = priceSection.querySelector('.price__img__bg img');

    priceSection.addEventListener('mousemove', (evt) => {
      if (!priceImg || isMobile.any()) {
        return;
      }
      const rect = priceSection.getBoundingClientRect();
      const startY = rect.top;
      const startX = rect.left;

      const y =
        Math.min(Math.max(evt.clientY - startY, 0), rect.height) /
        (rect.height * 2);
      const x =
        Math.min(Math.max(evt.clientX - startX, 0), rect.width) /
        (rect.width * 2);

      idAnimationPrice = window.requestAnimationFrame(() => {
        priceImgMove(x, y);
      });
    });
  }

  //make table hover effect
  // const tableWrappers = document.querySelectorAll('[data-line-effect]');
  // let isTableEffectFinished = true;
  // tableWrappers.length && !isMobile.any() ? tableEffect() : null;

  // function tableEffect() {
  //   tableWrappers.forEach((tableWrapper) => {
  //     const tableRows = tableWrapper.querySelectorAll(
  //       '.price-list__row:not(._header)'
  //     );

  //     const effectSpeed = tableWrapper.dataset.lineEffect
  //       ? tableWrapper.dataset.lineEffect
  //       : 200;

  //     tableRows.length ? tableEffectItem(tableRows, effectSpeed) : null;
  //   });

  //   function tableEffectItem(tableRows, effectSpeed) {
  //     const effectTransition = `transition: transform ${effectSpeed}ms ease;`;
  //     const effectHover = `transform: translate3d(0px, 0%, 0px);`;
  //     const effectTop = `transform: translate3d(0px, -105%, 0px);`;
  //     const effectBottom = `transform: translate3d(0px, 105%, 0px);`;

  //     tableRows.forEach((tableRow) => {
  //       const innerContent = tableRow.innerHTML;
  //       tableRow.insertAdjacentHTML(
  //         'beforeend',
  //         `
  //       <div style="transform: translate3d(0px, 105%, 0px);" class="hover-table">
  //           <div style="transform: translate3d(0px, -105%, 0px);" class="hover-table__content">
  //               ${innerContent}
  //           </div>
  //       </div>
  //       `
  //       );

  //       tableRow.onmouseenter = tableRow.onmouseleave = tableRowActions;
  //     });

  //     function tableRowActions(e) {
  //       const tableRow = e.target;
  //       const tableRowItem = tableRow.querySelector('.hover-table');
  //       const tableRowContent = tableRow.querySelector('.hover-table__content');

  //       const tableRowHeight = tableRow.offsetHeight / 2;
  //       const tableRowPos =
  //         e.pageY - (tableRow.getBoundingClientRect().top + scrollY);

  //       if (!isTableEffectFinished) {
  //         return;
  //       }

  //       if (e.type === 'mouseenter') {
  //         isTableEffectFinished = false;
  //         tableRowItem.style.cssText =
  //           tableRowPos > tableRowHeight ? effectBottom : effectTop;
  //         tableRowContent.style.cssText =
  //           tableRowPos > tableRowHeight ? effectTop : effectBottom;

  //         setTimeout(() => {
  //           isTableEffectFinished = true;

  //           tableRowItem.style.cssText = effectHover + effectTransition;
  //           tableRowContent.style.cssText = effectHover + effectTransition;
  //         }, 5);
  //       }

  //       if (e.type === 'mouseleave') {
  //         setTimeout(() => {
  //           isTableEffectFinished = true;

  //           tableRowItem.style.cssText =
  //             tableRowPos > tableRowHeight
  //               ? effectBottom + effectTransition
  //               : effectTop + effectTransition;
  //           tableRowContent.style.cssText =
  //             tableRowPos > tableRowHeight
  //               ? effectTop + effectTransition
  //               : effectBottom + effectTransition;
  //         }, 2.5);
  //       }
  //     }
  //   }
  // }

  //swipers
  let swiperPractics = new Swiper('.practics-slider.swiper', {
    // autoplay: {
    //   delay: 4500,
    //   disableOnInteraction: false,
    // },
    // loopedSlides: 5,
    loop: true,
    navigation: {
      nextEl: '.practics__content .practics-slider__next',
      prevEl: '.practics__content .practics-slider__prev',
    },
    slidesPerView: 1,
    spaceBetween: 10,

    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      899: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1199: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  });

  let swiperClients = new Swiper('.clients-slider.swiper', {
    // autoplay: {
    //   delay: 4500,
    //   disableOnInteraction: false,
    // },
    // loopedSlides: 5,
    loop: true,
    navigation: {
      nextEl: '.clients .clients__btn__container .clients-slider__next',
      prevEl: '.clients .clients__btn__container .clients-slider__prev',
    },
    slidesPerView: 1,
    spaceBetween: 10,

    // breakpoints: {
    //   768: {
    //     slidesPerView: 2,
    //     spaceBetween: 15,
    //   },
    //   899: {
    //     slidesPerView: 3,
    //     spaceBetween: 20,
    //   },
    //   1199: {
    //     slidesPerView: 3,
    //     spaceBetween: 40,
    //   },
    // },
  });

  let swiperTeam = new Swiper('.team-slider.swiper', {
    pagination: {
      el: '.team-slider.swiper .team-slider-pagination',
      clickable: true,
    },
    loop: false,
    slidesPerView: 1,
    spaceBetween: 10,

    breakpoints: {
      768: {
        //slidesPerGroup: 2,
        slidesPerView: 2,
        spaceBetween: 15,
      },
      899: {
        //slidesPerGroup: 3,
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1199: {
        //slidesPerGroup: 4,
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});
