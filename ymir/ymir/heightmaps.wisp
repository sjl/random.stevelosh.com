(ns ymir.heightmaps
  (:require [ndarray]))

(defn lol [a]
  (let [mat (ndarray (new Float64Array [1, 0, 1, 2])
                     [2, 2])]
    (console.log "Hello!")
    (console.log mat)))
