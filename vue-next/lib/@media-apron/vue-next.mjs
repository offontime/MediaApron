import { defineComponent as R, ref as s, watch as N, openBlock as v, createElementBlock as h, createElementVNode as d, normalizeStyle as x, onMounted as I, resolveComponent as z, normalizeClass as D, createBlock as P, toDisplayString as E, createVNode as S, createCommentVNode as T, unref as B, Fragment as U, renderList as X } from "vue";
const j = /* @__PURE__ */ R({
  __name: "progress",
  props: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  emits: ["change"],
  setup(l, { emit: c }) {
    const o = s(), a = s(0), p = l, u = s(!1), m = c, r = s(0), i = s(0);
    N(() => p.current, (n) => {
      i.value = n / p.total * 100, a.value = n;
    }, { deep: !0 });
    const y = (n) => {
      const e = w(n);
      k(e), u.value && b(e);
    }, V = () => {
      u.value = !0;
    };
    document.addEventListener("mousemove", (n) => {
      u.value && y(n);
    }), document.addEventListener("mouseup", () => {
      const n = u.value;
      u.value = !1, n && M();
    });
    const k = (n) => {
      r.value = n;
    }, b = (n) => {
      i.value = n, a.value = p.total * n / 100;
    }, M = () => {
      m("change", a.value);
    }, w = (n) => {
      const e = o.value.getBoundingClientRect(), g = e.width, t = (n.clientX - e.left) / g * 100;
      return t <= 0 ? 0 : t >= 100 ? 100 : t;
    };
    return (n, e) => (v(), h("div", {
      class: "progress-container",
      onMouseout: e[0] || (e[0] = () => {
        r.value = 0;
      }),
      onMousedown: V,
      onClick: e[1] || (e[1] = (g) => {
        b(w(g)), M();
      })
    }, [
      d("div", {
        class: "progress",
        ref_key: "progressRef",
        ref: o
      }, [
        d("div", {
          class: "real-progress",
          style: x({ width: i.value + "%" })
        }, null, 4),
        d("div", {
          class: "target-progress",
          style: x({ width: r.value + "%" })
        }, null, 4)
      ], 512)
    ], 32));
  }
}), q = (l, c) => {
  const o = l.__vccOpts || l;
  for (const [a, p] of c)
    o[a] = p;
  return o;
}, G = /* @__PURE__ */ q(j, [["__scopeId", "data-v-14e9195d"]]), H = { class: "volume-value" }, J = { class: "volume-text" }, K = /* @__PURE__ */ R({
  __name: "volume",
  props: {
    modelValue: { type: Number, default: 100 },
    isMuted: { type: Boolean, default: !1 }
  },
  emits: ["change", "mutedToggle", "modelValue"],
  setup(l, { emit: c }) {
    const o = c, a = l, p = s(), u = s(!1), m = s(2), r = s(a.modelValue || 100), i = s(a.isMuted || !1);
    N(() => a.isMuted, (e) => {
      i.value = e;
    }, { deep: !0 }), I(() => {
      n(a.modelValue);
    });
    const y = (e) => {
      const g = w(e);
      u.value && k(g);
    }, V = () => {
      u.value = !0;
    };
    document.addEventListener("mousemove", (e) => {
      u.value && y(e);
    }), document.addEventListener("mouseup", () => {
      const e = u.value;
      u.value = !1, e && M();
    });
    const k = (e) => {
      r.value = e, n(e), o("change", { value: e }), e > 0 && i.value && (o("mutedToggle", !1), i.value = !1);
    }, b = () => {
      const e = !i.value;
      i.value = e, o("mutedToggle", e);
    }, M = () => {
    }, w = (e) => {
      const g = p.value.getBoundingClientRect(), _ = g.width, f = (e.clientX - g.left) / _ * 100;
      return f <= 0 ? 0 : f >= 100 ? 100 : f;
    }, n = (e) => {
      e <= 30 && (m.value = 0), e > 30 && e <= 65 && (m.value = 1), e > 65 && (m.value = 2);
    };
    return (e, g) => {
      const _ = z("ap-icon");
      return v(), h("div", {
        class: D(["volume-container", u.value ? "volume-isdraging" : ""])
      }, [
        d("div", {
          class: "volume-button",
          onClick: b
        }, [
          i.value || r.value <= 0 ? (v(), P(_, {
            key: 0,
            name: "volume-mute",
            color: "#FFFFFF"
          })) : (v(), P(_, {
            key: 1,
            name: `volume-${m.value}`,
            color: "#FFFFFF"
          }, null, 8, ["name"]))
        ]),
        d("div", {
          class: "volume-value-container",
          ref_key: "progressRef",
          ref: p,
          onMousemove: y,
          onMousedown: V,
          onClick: g[0] || (g[0] = (t) => {
            k(w(t));
          })
        }, [
          d("div", H, [
            d("div", {
              class: "real-volume-value",
              style: x(`width: ${i.value ? 0 : r.value}%`)
            }, null, 4)
          ])
        ], 544),
        d("div", J, E(i.value ? 0 : parseInt(r.value.toString())) + "% ", 1)
      ], 2);
    };
  }
}), Q = /* @__PURE__ */ q(K, [["__scopeId", "data-v-59c5327d"]]), L = (l) => {
  const c = Math.round(l), o = Math.floor(c / 3600), a = c % 3600, p = Math.floor(a / 60), u = a % 60;
  let m = "";
  return o > 0 && (m += `${o.toString().padStart(2, "0")}:`), m += `${p.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}`, m;
}, W = ["src", "playsinline", "muted", "autoplay", "poster"], Y = { class: "controls-container" }, Z = { class: "video-control" }, ee = { class: "main-controls" }, te = { class: "element" }, oe = { class: "append-controls" }, ne = ["onClick"], le = ["src"], A = /* @__PURE__ */ R({
  name: "ApVideo",
  __name: "video",
  props: {
    source: {
      type: String || Array,
      default: ""
    },
    poster: {
      type: String || null,
      default: null
    },
    mode: {
      type: String,
      default: "contain"
    },
    playsinline: {
      type: Boolean,
      default: !1
    },
    muted: {
      type: Boolean,
      default: !1
    },
    autoplay: {
      type: Boolean,
      default: !1
    },
    volume: {
      type: Number,
      default: 100
    },
    buttons: {
      type: Array,
      default: [
        "fullscreen"
      ]
    },
    nextCallback: {
      type: Function || null,
      default: null
    }
  },
  setup(l) {
    const c = l, o = s();
    s(!0);
    const a = s("");
    s(0);
    const p = s([]), u = s(!0), m = s(c.volume || 100), r = s(c.autoplay || !1), i = s(0), y = s(0);
    ((t) => {
      const f = c.source;
      if (typeof f == "string") {
        a.value = f, u.value = !0;
        return;
      }
      if (f.length === 1 && typeof f[0] == "string") {
        a.value = f[0], u.value = !0;
        return;
      }
      p.value = f, a.value = f[0].url, u = !1;
    })();
    const k = () => {
      const t = !r.value;
      r.value = t, t ? o.value.play() : o.value.pause();
    }, b = () => {
      i.value = o.value.duration, y.value = o.value.currentTime;
    }, M = (t) => {
      y.value = t, o.value.currentTime = t;
    }, w = ({ value: t }) => {
      o.value.volume = t / 100, m.value = t;
    }, n = (t) => {
      o.value.muted = t;
    }, e = () => {
      r.value = c.autoplay || !1;
    }, g = () => {
    };
    document.addEventListener("keydown", ({ key: t }) => {
      t === " " && k();
    });
    const _ = () => {
      const t = o.value;
      document.fullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen && t.webkitRequestFullscreen();
    };
    return (t, f) => {
      const C = z("ap-icon");
      return v(), h("div", {
        class: D(["apron-video", r.value ? "apron-playing-video" : "apron-pausing-video"]),
        onDblclick: _
      }, [
        d("video", {
          ref_key: "videoRef",
          ref: o,
          src: a.value,
          style: x({
            objectFit: l.mode
          }),
          playsinline: l.playsinline,
          muted: l.muted,
          autoplay: l.autoplay,
          poster: l.poster,
          onEnded: e,
          onLoadedmetadata: b,
          onTimeupdate: b,
          controlslist: "nodownload"
        }, null, 44, W),
        d("div", {
          class: "center-play-button",
          style: x(`opacity: ${r.value ? 0 : 1}; cursor: ${r.value ? "" : "pointer"}`),
          onClick: k
        }, [
          S(C, {
            name: "play",
            color: "#FFFFFF",
            size: 30
          })
        ], 4),
        d("div", Y, [
          S(G, {
            style: { "margin-bottom": "10px" },
            current: y.value,
            total: i.value,
            onChange: M
          }, null, 8, ["current", "total"]),
          d("div", Z, [
            d("div", ee, [
              d("div", {
                class: "element button",
                onClick: k
              }, [
                r.value ? (v(), P(C, {
                  key: 0,
                  name: "pause",
                  color: "#FFFFFF"
                })) : (v(), P(C, {
                  key: 1,
                  name: "play",
                  color: "#FFFFFF"
                }))
              ]),
              l.nextCallback ? (v(), h("div", {
                key: 0,
                class: "element button",
                onClick: g
              }, [
                S(C, {
                  name: "next",
                  color: "#FFFFFF"
                })
              ])) : T("", !0),
              d("div", te, E(B(L)(y.value)) + "/" + E(B(L)(i.value)), 1)
            ]),
            d("div", oe, [
              S(Q, {
                "is-muted": l.muted,
                modelValue: m.value,
                "onUpdate:modelValue": f[0] || (f[0] = (F) => m.value = F),
                onChange: w,
                onMutedToggle: n,
                class: "element"
              }, null, 8, ["is-muted", "modelValue"]),
              (v(!0), h(U, null, X(l.buttons, (F, O) => (v(), h("div", {
                class: "element",
                key: `video-button-${O}`
              }, [
                (F.hasOwnProperty("icon") || F.hasOwnProperty("image")) && F.hasOwnProperty("callback") ? (v(), h("div", {
                  key: 0,
                  class: "button",
                  onClick: F.callback
                }, [
                  F.image ? (v(), h("img", {
                    key: 0,
                    src: F.image
                  }, null, 8, le)) : F.icon ? (v(), P(C, {
                    key: 1,
                    name: F.icon,
                    color: "#FFFFFF"
                  }, null, 8, ["name"])) : (v(), P(C, {
                    key: 2,
                    name: "flame",
                    color: "#FFFFFF"
                  }))
                ], 8, ne)) : T("", !0),
                F === "fullscreen" ? (v(), h("div", {
                  key: 1,
                  class: "element button",
                  onClick: _
                }, [
                  S(C, {
                    name: "fullscreen",
                    color: "#FFFFFF"
                  })
                ])) : T("", !0)
              ]))), 128))
            ])
          ])
        ])
      ], 34);
    };
  }
}), se = [
  A
], $ = function(l) {
  if ($.installed)
    return !1;
  se.map((c) => l.component(c.name, c));
};
typeof window < "u" && window.Vue && $(window.Vue);
const ue = {
  install: $,
  Video: A
};
export {
  ue as default
};
