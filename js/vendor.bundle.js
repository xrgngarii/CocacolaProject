(function ($) {
  var inviewObjects = {};
  var viewportSize;
  var viewportOffset;
  var d = document;
  var w = window;
  var documentElement = d.documentElement;
  var expando = $.expando;
  var timer;

  $.event.special.inview = {
    add: function (data) {
      inviewObjects[data.guid + "-" + this[expando]] = {
        data: data,
        $element: $(this)
      };

      if (!timer && !$.isEmptyObject(inviewObjects)) {
        timer = setInterval(checkInView, 250);
      }
    },
    remove: function (data) {
      try {
        delete inviewObjects[data.guid + "-" + this[expando]];
      } catch (e) {}

      if ($.isEmptyObject(inviewObjects)) {
        clearInterval(timer);
        timer = null;
      }
    }
  };

  function getViewportSize() {
    var mode;
    var domObject;
    var size = {
      height: w.innerHeight,
      width: w.innerWidth
    };

    mode = d.compatMode;

    if (mode || !$.support.boxModel) {
      domObject = mode === "CSS1Compat" ? documentElement : d.body;
      size = {
        height: domObject.clientHeight,
        width: domObject.clientWidth
      };
    }

    return size;
  }

  function getViewportOffset() {
    return {
      top: w.pageYOffset || documentElement.scrollTop || d.body.scrollTop,
      left: w.pageXOffset || documentElement.scrollLeft || d.body.scrollLeft
    };
  }

  function checkInView() {
    var $elements = $();
    var elementsLength;
    var i = 0;

    $.each(inviewObjects, function (_, inviewObject) {
      var selector = inviewObject.data.selector;
      var $element = inviewObject.$element;
      $elements = $elements.add(selector ? $element.find(selector) : $element);
    });

    elementsLength = $elements.length;

    if (!elementsLength) return;

    viewportSize = viewportSize || getViewportSize();
    viewportOffset = viewportOffset || getViewportOffset();

    for (; i < elementsLength; i++) {
      if (!$.contains(documentElement, $elements[i])) {
        continue;
      }

      var $element = $($elements[i]);
      var elementSize = {
        height: $element.height(),
        width: $element.width()
      };
      var elementOffset = $element.offset();
      var inView = $element.data("inview");
      var visiblePartX;
      var visiblePartY;
      var visiblePartsMerged;

      if (!viewportOffset || !viewportSize) {
        return;
      }

      if (
        elementOffset.top + elementSize.height > viewportOffset.top &&
        elementOffset.top < viewportOffset.top + viewportSize.height &&
        elementOffset.left + elementSize.width > viewportOffset.left &&
        elementOffset.left < viewportOffset.left + viewportSize.width
      ) {
        visiblePartX =
          viewportOffset.left > elementOffset.left
            ? "right"
            : viewportOffset.left + viewportSize.width < elementOffset.left + elementSize.width
            ? "left"
            : "both";

        visiblePartY =
          viewportOffset.top > elementOffset.top
            ? "bottom"
            : viewportOffset.top + viewportSize.height < elementOffset.top + elementSize.height
            ? "top"
            : "both";

        visiblePartsMerged = visiblePartX + "-" + visiblePartY;

        if (!inView || inView !== visiblePartsMerged) {
          $element
            .data("inview", visiblePartsMerged)
            .trigger("inview", [true, visiblePartX, visiblePartY]);
        }
      } else if (inView) {
        $element.data("inview", false).trigger("inview", [false]);
      }
    }
  }

  $(w).on("scroll resize", function () {
    viewportSize = null;
    viewportOffset = null;
  });

  if (!documentElement.addEventListener && documentElement.attachEvent) {
    documentElement.attachEvent("onfocusin", function () {
      viewportOffset = null;
    });
  }

  $.fn.swctallax = function (options) {
    var sets = $.extend({}, $.fn.swctallax.defaults, options);

    return this.each(function () {
      var $this = $(this);
      var mainPosition = ($this.css("background-position") || "").split(" ");
      var mainX = $this.css("background-position-x") || mainPosition[0] || "50%";
      var ticking = false;

      if (sets.background === "on") {
        $this.css({
          backgroundSize: "cover"
        });
      }

      if (sets.background === "on" && sets.full === true) {
        function resizeSection() {
          $this.css("min-height", window.innerHeight + "px");
        }

        resizeSection();
        $(window).on("resize.swctallaxSize", resizeSection);
      }

      $this.on("inview", function (event, visible) {
        $this.toggleClass("visible", !!visible);
      });

      function updateParallax() {
        var yMove = -$(window).scrollTop() * sets.jump;
        $this.css("background-position", mainX + " " + yMove + "px");
        ticking = false;
      }

      $(window).on("scroll.swctallax", function () {
        if (window.innerWidth <= 767) return;
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      });
    });
  };

  $.fn.swctallax.defaults = {
    startPoint: 0,
    endPoint: $(document).height(),
    jump: 0.1,
    background: "on",
    full: true
  };

  $(function () {
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scrollBehavior = prefersReduced ? "auto" : "smooth";

    var $quickLinks = $(".top_quick_nav .quick_link");
    var $actionLinks = $(".intro_chip[data-target]");
    var $toggleButtons = $(".doc_toggle, .preview_toggle");
    var $cardWraps = $(".card_wrap");
    var $revealItems = $(".reveal_left");
    var $introTitle = $(".intro_title_sequence");
    var $scrollProgress = $(".scroll_progress");
    var $topQuickNav = $(".top_quick_nav");
    var $heroPhoto = $(".hero_identity_photo");
    var sectionNodes = [];

    if ($.fn && typeof $.fn.swctallax === "function" && window.innerWidth > 767) {
      $(".swctallax").swctallax({ jump: 0.1 });
    }

    if (typeof parallax === "function") {
      parallax($(".work_card, .card"), 12, true);
    }

    $quickLinks.each(function () {
      var targetSelector = $(this).attr("data-target");
      var target = targetSelector ? document.querySelector(targetSelector) : null;
      if (target) {
        sectionNodes.push(target);
      }
    });

    function focusSection(section) {
      if (!section) return;
      section.setAttribute("tabindex", "-1");
      section.focus();
    }

    function setActiveNav(id) {
      $quickLinks.each(function () {
        var $link = $(this);
        var isActive = $link.attr("data-target") === "#" + id;

        $link.toggleClass("is-active", isActive);

        if (isActive) {
          $link.attr("aria-current", "true");
        } else {
          $link.removeAttr("aria-current");
        }
      });
    }

    function closeAllThumbs() {
      $toggleButtons.each(function () {
        var $button = $(this);
        var targetId = $button.attr("aria-controls");
        var $target = targetId ? $("#" + targetId) : $();

        $button.attr("aria-expanded", "false");

        if ($target.length) {
          $target.removeClass("is_open");
          $target.attr("aria-hidden", "true");
        }
      });
    }

    $actionLinks.add($quickLinks).on("click", function (e) {
      var targetSelector = $(this).attr("data-target") || $(this).attr("href");
      var target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: scrollBehavior,
        block: "start"
      });

      window.setTimeout(function () {
        focusSection(target);
      }, prefersReduced ? 0 : 250);
    });

    if ("IntersectionObserver" in window) {
      if (sectionNodes.length) {
        var sectionObserver = new IntersectionObserver(
          function (entries) {
            var visibleSections = entries
              .filter(function (entry) {
                return entry.isIntersecting;
              })
              .sort(function (a, b) {
                return b.intersectionRatio - a.intersectionRatio;
              });

            if (!visibleSections.length) return;
            setActiveNav(visibleSections[0].target.id);
          },
          {
            threshold: [0.3, 0.45, 0.6, 0.75]
          }
        );

        sectionNodes.forEach(function (section) {
          sectionObserver.observe(section);
        });
      }

      if ($revealItems.length) {
        if (prefersReduced) {
          $revealItems.addClass("is_inview");
        } else {
          var revealObserver = new IntersectionObserver(
            function (entries, observer) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                $(entry.target).addClass("is_inview");
                observer.unobserve(entry.target);
              });
            },
            {
              threshold: 0.18,
              rootMargin: "0px 0px -8% 0px"
            }
          );

          $revealItems.each(function () {
            revealObserver.observe(this);
          });
        }
      }

      if ($cardWraps.length) {
        if (window.innerWidth <= 767) {
          if (prefersReduced) {
            $cardWraps.addClass("is_inview");
          } else {
            var cardObserver = new IntersectionObserver(
              function (entries) {
                entries.forEach(function (entry) {
                  $(entry.target).toggleClass("is_inview", entry.isIntersecting);
                });
              },
              {
                threshold: 0.35
              }
            );

            $cardWraps.each(function () {
              cardObserver.observe(this);
            });
          }
        }
      }
    } else {
      if ($revealItems.length) {
        $revealItems.addClass("is_inview");
      }

      if ($cardWraps.length && window.innerWidth <= 767) {
        $cardWraps.addClass("is_inview");
      }

      if (sectionNodes.length) {
        setActiveNav(sectionNodes[0].id);
      }
    }

    if ($introTitle.length) {
      if (prefersReduced) {
        $introTitle.addClass("is_inview");
      } else {
        window.setTimeout(function () {
          $introTitle.addClass("is_inview");
        }, 180);
      }
    }

    $toggleButtons.on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $button = $(this);
      var targetId = $button.attr("aria-controls");
      var $target = targetId ? $("#" + targetId) : $();

      if (!$target.length) return;

      var willOpen = !$target.hasClass("is_open");

      if (willOpen) {
        $button.attr("aria-expanded", "true");
        $target.addClass("is_open");
        $target.attr("aria-hidden", "false");
      } else {
        $button.attr("aria-expanded", "false");
        $target.removeClass("is_open");
        $target.attr("aria-hidden", "true");
      }
    });

    $(document).on("click", function (e) {
      var $target = $(e.target);

      if (
        $target.closest(".work_card").length ||
        $target.closest(".top_quick_nav").length ||
        $target.closest(".intro_chip").length
      ) {
        return;
      }

      closeAllThumbs();
    });

    if ($quickLinks.length) {
      var firstTarget = $quickLinks.eq(0).attr("data-target");

      if (firstTarget) {
        var firstSection = document.querySelector(firstTarget);

        if (firstSection) {
          setActiveNav(firstSection.id);
        }
      }
    }

    $(window).on("scroll", function () {
      var scrollTop = $(window).scrollTop();
      var docHeight = $(document).height() - $(window).height();
      var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      $scrollProgress.css("width", scrollPercent + "%");
    });

    $(window).on("scroll", function () {
      var scrollTop = $(window).scrollTop();
      $topQuickNav.toggleClass("is-scrolled", scrollTop > 50);
    });

    if ($heroPhoto.length && !prefersReduced) {
      var $heroImg = $heroPhoto.find("img");

      $heroPhoto.on("mousemove", function (e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var width = rect.width;
        var height = rect.height;
        var rotateX = -((y / height) - 0.5) * 20;
        var rotateY = ((x / width) - 0.5) * 20;

        $heroImg.css(
          "transform",
          "perspective(1000px) scale(1.05) rotateX(" +
            rotateX +
            "deg) rotateY(" +
            rotateY +
            "deg)"
        );
      });

      $heroPhoto.on("mouseleave", function () {
        $heroImg.css(
          "transform",
          "perspective(1000px) scale(1) rotateX(0) rotateY(0)"
        );
      });
    }

    $(window).trigger("scroll");
  });
})(jQuery);