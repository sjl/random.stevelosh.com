(ns ymir.rendering
  (:require [ymir.frontend :as front]))


; Three.js related stuff goes in this namespace.
(def width (- 800 2))
(def height 500)
(def terrain-height 50)
(def terrain-size 100)

(defn make-directional-light []
  (let [light (new THREE.DirectionalLight 0xffffff 1)]
    (light.position.set 100 50 150)
    light))

(defn make-camera []
  (let [camera (new THREE.PerspectiveCamera
                    55,
                    (/ width height)
                    0.1,
                    1000)]
    (camera.position.set 0 -100 150)
    camera))

(defn make-renderer []
  (let [renderer (new THREE.WebGLRenderer {:antialias false})]
    (renderer.setClearColor 0xffffff)
    (renderer.setSize width height)
    (renderer.setPixelRatio 2)
    renderer))

(defn make-geometry [heightmap]
  (let [resolution (aget heightmap.shape 0)
        geometry (new THREE.PlaneGeometry
                      terrain-size
                      terrain-size
                      (- resolution 1)
                      (- resolution 1))]
    geometry))

(defn make-controls [camera renderer]
  (let [controls (new THREE.TrackballControls camera renderer.domElement)]
    (set! controls.rotateSpeed 1.4)
    (set! controls.zoomSpeed 0.5)
    (set! controls.staticMoving true)
    (set! controls.dynamicDampingFactor 0.3)
    controls))

(defn make-plane [geometry]
  (let [material (new THREE.MeshLambertMaterial
                      {:wireframe
                       (front/get-input-boolean "main-settings" "wireframe")

                       :wireframeLinewidth
                       (front/get-input-number "main-settings" "wireframe-width")

                       :color 0x00bb00})]
    (new THREE.Mesh geometry material)))


(defn attach-to-dom [renderer refresh-fn]
  (.append ($ "#render") renderer.domElement)
  (let [cancel-scroll (fn [e] (.preventDefault e))]
    (set! renderer.domElement.onmousewheel cancel-scroll)
    (renderer.domElement.addEventListener "MozMousePixelScroll" cancel-scroll false))
  (.click ($ "#regenerate") refresh-fn))


(defn update-geometry [geometry heightmap]
  (loop [i 0]
    (if (< i geometry.vertices.length)
      (do (set! (.-z (aget geometry.vertices i))
                (* terrain-height (aget (.-data heightmap) i)))
        (recur (+ i 1)))))
  (geometry.computeVertexNormals)
  geometry)

