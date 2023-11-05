(ns ymir.main
  (:require [ndarray]
            [ymir.frontend :as front]
            [ymir.rendering :as rend]))


; General Utilities -----------------------------------------------------------
(defmacro when [condition & body]
  `(if ~condition
     (do ~@body)))

(defmacro when-not [condition & body]
  `(when (not ~condition)
     ~@body))

(defmacro -> [& operations]
  (reduce
    (fn [form operation]
      (cons (first operation)
            (cons form (rest operation))))
    (first operations)
    (rest operations)))


(defn inc [x]
  (+ x 1))

(defn dec [x]
  (- x 1))


(defmacro do-times [varname limit & body]
  (let [end (gensym)]
    `(let [~end ~limit]
       (loop [~varname 0]
         (when (< ~varname ~end)
           ~@body
           (recur (inc ~varname)))))))

(defmacro do-stride [varnames start-form end-form stride-form & body]
  (let [stride (gensym "stride")
        start (gensym "start")
        end (gensym "end")
        build (fn build [vars]
                (if (empty? vars)
                  `(do ~@body)
                  (let [varname (first vars)]
                    `(loop [~varname ~start]
                       (when (< ~varname ~end)
                         ~(build (rest vars))
                         (recur (+ ~varname ~stride)))))))]
    ; Fix the numbers once outside the nested loops,
    ; and then build the guts.
    `(let [~start ~start-form
           ~end ~end-form
           ~stride ~stride-form]
       ~(build varnames))))


(defmacro do-ndarray [vars array-form & body]
  (let [array-var (gensym "array")
        build (fn build [vars n]
                (if (empty? vars)
                  `(do ~@body)
                  `(do-times ~(first vars) (aget (.-shape ~array-var) ~n)
                     ~(build (rest vars) (inc n)))))]
    `(let [~array-var ~array-form]
       ~(build vars 0))))

(defmacro do-ndarray-el [element array-form & body]
  (let [index (gensym "index")
        array (gensym "array")]
    `(let [~array ~array-form]
       (do-times ~index (.-length (.-data ~array))
         (let [~element (aget (.-data ~array) ~index)]
           ~@body)))))


(defmacro inc! [place]
  `(set! ~place (inc ~place)))

(defmacro add! [place amount]
  `(set! ~place (+ ~place ~amount)))


(defmacro l [& forms]
  `(console.log ~@forms))

(defmacro time [& body]
  (let [start (gensym)
        end (gensym)
        result (gensym)]
    `(let [~start (.getTime (new Date))
           ~result (do ~@body)
           ~end (.getTime (new Date))]
       (l (+ "Elapsed time: " (- ~end ~start) "ms."))
       ~result)))


(defn midpoint [a b]
  (/ (+ a b) 2))

(defn average2 [a b]
  (/ (+ a b) 2))

(defn average4 [a b c d]
  (/ (+ a b c d) 4))

(defn safe-average [a b c d]
  (let [total 0 count 0]
    (when a (add! total a) (inc! count))
    (when b (add! total b) (inc! count))
    (when c (add! total c) (inc! count))
    (when d (add! total d) (inc! count))
    (/ total count)))


(defn even? [n]
  (== 0 (mod n 2)))

(defn odd? [n]
  (== 1 (mod n 2)))


; Randomness ------------------------------------------------------------------
(defn rand []
  (Math.random))

(defn rand-around-zero [spread]
  (- (* spread (rand) 2) spread))

(defn jitter [value spread]
  (+ value (rand-around-zero spread)))


; Heightmap Helpers -----------------------------------------------------------
(defn heightmap-resolution [heightmap]
  (aget heightmap.shape 0))

(defn heightmap-last-index [heightmap]
  (dec (heightmap-resolution heightmap)))

(defn heightmap-center-index [heightmap]
  (midpoint 0 (heightmap-last-index heightmap)))


(defn heightmap-get [heightmap x y]
  (.get heightmap x y))

(defn heightmap-get-safe [heightmap x y]
  (let [last (heightmap-last-index heightmap)]
    (when (and (<= 0 x last)
               (<= 0 y last))
      (heightmap-get heightmap x y))))

(defn heightmap-set! [heightmap x y val]
  (.set heightmap x y val))

(defn heightmap-set-if-unset! [heightmap x y val]
  (when (== 0 (heightmap-get heightmap x y))
    (heightmap-set! heightmap x y val)))


(defn heightmap-max [heightmap]
  (let [max (- Infinity)]
    (do-ndarray-el el heightmap
      (when (< max el) (set! max el)))
    max))

(defn heightmap-min [heightmap]
  (let [min Infinity]
    (do-ndarray-el el heightmap
      (when (> min el) (set! min el)))
    min))


(defn normalize [heightmap]
  (let [max (- Infinity)
        min Infinity]
    (do-ndarray-el el heightmap
      (when (< max el) (set! max el))
      (when (> min el) (set! min el)))
    (let [span (- max min)]
      (do-ndarray [x y] heightmap
        (heightmap-set! heightmap x y
                        (/ (- (heightmap-get heightmap x y) min)
                           span))))))

(defn clamp-low [heightmap]
  (let [min (heightmap-min heightmap)
        fix (- min)]
    (when (< min 0)
      (do-ndarray [x y] heightmap
        (heightmap-set! heightmap x y
                        (+ (heightmap-get heightmap x y) fix))))))

(defn clamp-high [heightmap]
  (let [max (heightmap-max heightmap)]
    (when (> max 1)
      (do-ndarray [x y] heightmap
        (heightmap-set! heightmap x y
                        (/ (heightmap-get heightmap x y) max))))))

(defn clamp [heightmap]
  (clamp-low heightmap)
  (clamp-high heightmap))


(defn sanitize [heightmap]
  (if (front/get-input-boolean "main-settings" "normalize")
    (normalize heightmap)
    (clamp heightmap)))


(defn make-heightmap [exponent]
  (let [resolution (+ (Math.pow 2 exponent) 1)]
    (let [heightmap (ndarray (new Float64Array (* resolution resolution))
                             [resolution resolution])]
      (set! heightmap.exponent exponent)
      (set! heightmap.resolution resolution)
      (set! heightmap.last (dec resolution))
      heightmap)))


(defn top-left-corner [heightmap]
  (let [center (heightmap-center-index heightmap)]
    (-> heightmap
      (.lo 0 0)
      (.hi (inc center) (inc center)))))

(defn top-right-corner [heightmap]
  (let [center (heightmap-center-index heightmap)]
    (-> heightmap
      (.lo center 0)
      (.hi (inc center) (inc center)))))

(defn bottom-left-corner [heightmap]
  (let [center (heightmap-center-index heightmap)]
    (-> heightmap
      (.lo 0 center)
      (.hi (inc center) (inc center)))))

(defn bottom-right-corner [heightmap]
  (let [center (heightmap-center-index heightmap)]
    (-> heightmap
      (.lo center center)
      (.hi (inc center) (inc center)))))


; Random Noise ----------------------------------------------------------------
(defn random-noise [heightmap]
  (do-ndarray [x y] heightmap
    (heightmap-set! heightmap x y (rand))))


; Midpoint Displacement -------------------------------------------------------
(defn mpd-init-corners [heightmap]
  (let [last (heightmap-last-index heightmap)]
    (heightmap-set! heightmap 0    0    (rand))
    (heightmap-set! heightmap 0    last (rand))
    (heightmap-set! heightmap last 0    (rand))
    (heightmap-set! heightmap last last (rand))))

(defn mpd-displace [heightmap spread spread-reduction]
  (let [last (heightmap-last-index heightmap)
        c (midpoint 0 last)

        bottom-left  (heightmap-get heightmap 0    0)
        bottom-right (heightmap-get heightmap last 0)
        top-left     (heightmap-get heightmap 0    last)
        top-right    (heightmap-get heightmap last last)

        top    (average2 top-left top-right)
        left   (average2 bottom-left top-left)
        bottom (average2 bottom-left bottom-right)
        right  (average2 bottom-right top-right)
        center (average4 top left bottom right)

        next-spread (* spread spread-reduction)]
    (heightmap-set-if-unset! heightmap c    0    (jitter bottom spread))
    (heightmap-set-if-unset! heightmap c    last (jitter top spread))
    (heightmap-set-if-unset! heightmap 0    c    (jitter left spread))
    (heightmap-set-if-unset! heightmap last c    (jitter right spread))
    (heightmap-set-if-unset! heightmap c    c    (jitter center spread))
    (when-not (== 3 (heightmap-resolution heightmap))
      (mpd-displace (top-left-corner heightmap) next-spread spread-reduction)
      (mpd-displace (top-right-corner heightmap) next-spread spread-reduction)
      (mpd-displace (bottom-left-corner heightmap) next-spread spread-reduction)
      (mpd-displace (bottom-right-corner heightmap) next-spread spread-reduction))))

(defn midpoint-displacement [heightmap]
  (let [initial-spread (front/get-input-number "midpoint-displacement-settings"
                                               "initial-spread")
        spread-reduction (front/get-input-number "midpoint-displacement-settings"
                                                 "spread-reduction")]
    (mpd-init-corners heightmap)
    (mpd-displace heightmap initial-spread spread-reduction)
    (sanitize heightmap)))


; Diamond-Square --------------------------------------------------------------
(defn ds-init-corners [heightmap]
  (let [last (heightmap-last-index heightmap)]
    (heightmap-set! heightmap 0    0    (rand))
    (heightmap-set! heightmap 0    last (rand))
    (heightmap-set! heightmap last 0    (rand))
    (heightmap-set! heightmap last last (rand))))

(defn ds-square [heightmap x y radius spread]
  (let [new-height (jitter
                     (average4
                       (heightmap-get heightmap (- x radius) (- y radius))
                       (heightmap-get heightmap (- x radius) (+ y radius))
                       (heightmap-get heightmap (+ x radius) (- y radius))
                       (heightmap-get heightmap (+ x radius) (+ y radius)))
                     spread)]
    (heightmap-set! heightmap x y new-height)))

(defn ds-diamond [heightmap x y radius spread]
  (let [new-height (jitter
                     (safe-average
                       (heightmap-get-safe heightmap (- x radius) y)
                       (heightmap-get-safe heightmap (+ x radius) y)
                       (heightmap-get-safe heightmap x (- y radius))
                       (heightmap-get-safe heightmap x (+ y radius)))
                     spread)]
    (heightmap-set! heightmap x y new-height)))


(defn ds-squares [heightmap radius spread]
  (do-stride [x y] radius (heightmap-resolution heightmap) (* 2 radius)
    (ds-square heightmap x y radius spread)))

(defn ds-diamonds [heightmap radius spread]
  (let [size (heightmap-resolution heightmap)]
    (do-stride [y] 0 size radius
      (let [shift (if (even? (/ y radius)) radius 0)]
        (do-stride [x] shift size (* 2 radius)
          (ds-diamond heightmap x y radius spread))))))

(defn diamond-square [heightmap]
  (let [initial-spread (front/get-input-number "diamond-square-settings"
                                               "initial-spread")
        spread-reduction (front/get-input-number "diamond-square-settings"
                                                 "spread-reduction")
        center (heightmap-center-index heightmap)
        size (aget heightmap.shape 0)]
    (ds-init-corners heightmap)
    (loop [radius center
           spread initial-spread]
      (when (>= radius 1)
        (ds-squares heightmap radius spread)
        (ds-diamonds heightmap radius spread)
        (recur (/ radius 2)
               (* spread spread-reduction))))
    (sanitize heightmap)))


; Main ------------------------------------------------------------------------
; All code below here is hacky frontend garbage, please don't judge me.

(def algorithms
  {:midpoint-displacement midpoint-displacement
   :diamond-square diamond-square
   :random-noise random-noise})

(defn pick-algorithm []
  (get algorithms
       (front/get-input-string "algorithm-selector"
                               "generation-algorithm")))


(defn run []
  (def scene (new THREE.Scene))
  (scene.add (new THREE.AxisHelper 100))

  (def clock (new THREE.Clock))
  (def camera (rend/make-camera))
  (def renderer (rend/make-renderer))

  (def geometry)
  (def plane)

  (scene.add (rend/make-directional-light))
  (scene.add (new THREE.AmbientLight 0xffffff 0.05))

  (defn refresh []
    (l "\n")
    (let [exponent (front/get-input-number "main-settings" "exponent")
          heightmap (make-heightmap exponent)]
      (l "Generating terrain...")
      (time
        ((pick-algorithm) heightmap))

      ; Rebuild the geometry with the values from the heightmap.  Actually we
      ; need to use an entirely new Geometry because Three.js doesn't seem to
      ; let us change the resolution after we've made it.
      (l "Rebuilding geometry...")
      (time
        (set! geometry (rend/make-geometry heightmap))
        (rend/update-geometry geometry heightmap))

      ; Remove the old plane from the scene and add a new one for the newly
      ; built geometry.
      (l "Rebuilding plane...")
      (time
        (scene.remove plane)
        (set! plane (rend/make-plane geometry))
        (scene.add plane))))

  ; When the algorithm changes we want to update the settings panel.
  (front/show-algorithm-settings)
  (.change ($ "#generation-algorithm") front/show-algorithm-settings)

  (rend/attach-to-dom renderer refresh)
  (refresh)

  (def controls (rend/make-controls camera renderer))

  (defn render []
    (let [delta (clock.getDelta)]
      (requestAnimationFrame render)
      (.update controls delta)
      (renderer.render scene camera)))

  (render)
  nil)

(set! window.onload (fn [] (run)))

; vim: lw+=do-times lw+=do-ndarray lw+=do-ndarray-el lw+=do-stride :
